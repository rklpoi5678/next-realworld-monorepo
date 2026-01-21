provider "aws" {
    region = "ap-northeast-2"
}

# VPC
resource "aws_vpc" "lms_vpc" {
    cidr_block                       = "10.0.0.0/16"
    enable_dns_hostnames = true
    tags = { Name = "lms-vpc"}
}

# IGW(VPC대문)
resource "aws_internet_gateway" "lms_igw" {
    vpc_id                              = aws_vpc.lms_vpc.id
    tags = { Name = "lms-igw"}
}

#  RoutingTable (internet으로 길안내)
resource "aws_route_table" "public_rt" {
    vpc_id                              = aws_vpc.lms_vpc.id

    route {
        cidr_block  = "0.0.0.0/0"
        gateway_id = aws_internet_gateway.lms_igw.id
    }
    tags = { Name = "lms-public-rt"}
}

# RoutingTable - Public Subnet Connect (1,2 모두)
resource "aws_route_table_association" "public_1_assoc" {
    subnet_id                       = aws_subnet.public_subnet.id
    route_table_id               = aws_route_table.public_rt.id
}

resource "aws_route_table_association" "public_2_assoc" {
    subnet_id                       = aws_subnet.public_subnet_2.id
    route_table_id               = aws_route_table.public_rt.id
}

# ALB Public Subnet
# 가용성으로 2a에 불이나도 ALB접점이 살아있게 2개 만들어놓는다.
resource "aws_subnet" "public_subnet" {
    vpc_id                              = aws_vpc.lms_vpc.id
    cidr_block                        = "10.0.1.0/24"
    map_public_ip_on_launch = true # 공인 IP 자동 할당
    availability_zone            =  "ap-northeast-2a"
    tags =  { Name = "lms-public-sn"}
}

resource "aws_subnet" "public_subnet_2" {
    vpc_id                              = aws_vpc.lms_vpc.id
    cidr_block                       = "10.0.3.0/24"
    map_public_ip_on_launch = true
    availability_zone           = "ap-northeast-2c" # 다른 AZ
    tags = {Name = "lms-public-sn-2"}
}

# EC2 Private Subnet
resource "aws_subnet" "private_subnet" {
    vpc_id                              = aws_vpc.lms_vpc.id
    cidr_block                       = "10.0.2.0/24"
    availability_zone             = "ap-northeast-2a"
    tags  =   { Name = "lms-private-sn"}
}

# Security Group - 0.0.0.0/0 금지
# EC2 Security Group (ALB에서만 오는 요청만 가능)
resource "aws_security_group" "app_sg" {
    name                        = "app-sg"
    vpc_id                      =  aws_vpc.lms_vpc.id

    # 웹 서비스용 (누구나 접속 가능)
    ingress {
        from_port           = 80
        to_port               = 80
        protocol              = "tcp"
        cidr_blocks         =  ["0.0.0.0/0"]
    }

    # HTTPS: 나중에 인증서를 붙인다면 443도 필요함
    ingress {
        from_port            = 443 #  백엔드 포트
        to_port                 = 443
        protocol                = "tcp"
        cidr_blocks           = ["0.0.0.0/0"]
    }

    ## 배포용 (SSH 22번 포트)
    ## 연습으로 0.0.0.0/0으로 열지만, 실제론 본인 IP만 여는 것이 좋다
    ## 그래서 자기의 IP만 허용하게 한다 (아래 데이터 소스 체크)
    ingress {
        from_port             = 22
        to_port                 = 22
        protocol                = "tcp"
        cidr_blocks           =  ["${chomp(data.http.myip.body)}/32"]
    }

    egress {
        from_port           = 0
        to_port                = 0
        protocol              = "-1"
        cidr_blocks         =  ["0.0.0.0/0"]
    }
}

# Amazon Linux 2023 AMI ID 가져오기
data "aws_ami" "amazon_linux_2023" {
    most_recent = true
    owners          = ["amazon"]
    filter {
        name    = "name"
        values   = ["al2023-ami-*-x86_64"]
    }
}

resource "aws_instance" "app_server" {
    ami                                  = data.aws_ami.amazon_linux_2023.id
    instance_type                 = "t3.micro"

    ## Bastion Host (중간 다리 컴퓨터 jump-server) 아니면 AWS SSM(시스템 매니저) 사용 지금은 public으로 개발자가 접속 가능하게
    subnet_id                        = aws_subnet.public_subnet.id
    vpc_security_group_ids = [aws_security_group.app_sg.id]
    key_name                        = "lms-key" #미리 생성한 키 페어 이름

    ## 공인 IP 강제 할당
    associate_public_ip_address = true

    ## IMDSv2 설정 ( 토큰 기반 세션을 요구 )
    metadata_options {
        http_tokens                              = "required"
        http_endpoint                          = "enabled"
        http_put_response_hop_limit = 1
    }
    # EC2  생성 시 자동으로 실행될 스크립트
        user_data = <<-EOF
                #!/bin/bash
                # 1. Swap 메모리 설정 (2GB)
                fallocate -l 2G /swapfile
                chmod 600 /swapfile
                mkswap /swapfile
                swapon /swapfile
                echo '/swapfile none swap sw 0 0' >> /etc/fstab

                # 2. 기초 패키지 설치 (Docker 등)
                dnf update -y
                dnf install -y docker
                systemctl start docker
                systemctl enable docker
                
                # 유저를 docker 그룹에 추가 (sudo 없이 사용 위함)
                usermod -aG docker ec2-user
                EOF

    tags                                  = { Name = "lms-app-server"}
}

# 내 현재 IP를 자동으로 가져오는 데이터 소스
data "http" "myip" {
    url = "http://ipv4.icanhazip.com"
}

# sudo pacman -S terraform

# terraform init : AWS대화 준비 (플러그인 설치)
# terraform plan: 플랜대로 어떻게 될지 preview
# terraform apply: 실제로 구축을하라 (인프라  생성)
# terraform destroy : 구축한 인프라 철거

# terraform 은 aws인프라에 문서화 역활도 합니다.

# aws configure시 나온 유의의 정책에 EC2정책을 부여해줍니다.(VPC 생성은 EC2 서비스 범주에 들어감)
# lms-key 라는 키페어가 있어야 되며 없으면 생성 (추후 github actions나  터미널에서 서버에 들어갈때(SSH접속)사용 합니다.)