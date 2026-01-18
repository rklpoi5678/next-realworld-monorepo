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

## ALB Security Group (80 port 모든 사람에게 개방)
## 인터넷에 노출될 ALB는  ACM 인증서 기반 HTTPS + TLS 정책으로 전환해야한다.
resource  "aws_security_group"  "alb_sg" {
    name                            = "alb-sg"
    vpc_id                          = aws_vpc.lms_vpc.id

    ingress {
        from_port               = 80
        to_port                   = 80
        # from_port             = 443
        # to_port                  = 443
        protocol                  = "tcp"
        cidr_blocks             = ["0.0.0.0/0"] # 외부 전체 허용
    }

    egress {
        from_port               =  0
        to_port                   = 0
        protocol                 = "-1"
        cidr_blocks             = ["0.0.0.0/0"]
    }
}

# EC2 Security Group (ALB에서만 오는 요청만 가능)
resource "aws_security_group" "app_sg" {
    name                        = "app-sg"
    vpc_id                      =  aws_vpc.lms_vpc.id

    ingress {
        from_port            = 4000 #  백엔드 포트
        to_port                 = 4000
        protocol                = "tcp"
        security_groups  =  [aws_security_group.alb_sg.id] # ALB의 SG만 허용
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

    subnet_id                        = aws_subnet.private_subnet.id
    vpc_security_group_ids = [aws_security_group.app_sg.id]
    key_name                        = "lms-key" #미리 생성한 키 페어 이름

    # IMDSv2 설정 ( 토큰 기반 세션을 요구 )
    metadata_options {
        http_tokens                              = "required"
        http_endpoint                          = "enabled"
        http_put_response_hop_limit = 1
    }

    tags                                  = { Name = "lms-app-server"}
}

# ALB 생성
resource "aws_lb" "lms_alb" {
    name                            = "lms-alb"
    internal                        = false # 외부 노출용
    load_balancer_type    = "application"
    security_groups          = [aws_security_group.alb_sg.id]
    subnets                        = [aws_subnet.public_subnet.id, aws_subnet.public_subnet_2.id] # 최소 2개 AZ 필요 (public sn 2개가 정석)
}

# Target Group (ALB가 요청 보낼 목적지)
resource "aws_lb_target_group" "lms_tg" {
    name                            = "lms-tg"
    port                              = 4000
    protocol                       = "HTTP"
    vpc_id                          =  aws_vpc.lms_vpc.id
}

## app server 인스턴스를 타깃 그룹에 연결
resource "aws_lb_target_group_attachment" "app_server" {
    target_group_arn = aws_lb_target_group.lms_tg.arn
    target_id                = aws_instance.app_server.id
    port                        = 4000
}

# Listener (80port로 들어온 요청을 TG전달)
resource "aws_lb_listener" "lms_listener" {
    load_balancer_arn     = aws_lb.lms_alb.arn
    port                             = "80"
    protocol                      = "HTTP"
    # port                          = "443"
    # protocol                   = "HTTPS"
    # ssl_policy                 = "ELBSecurityPolicy-TLS13-1-2-2021-06"
    # certificate_arn         = var.acm_certificate_arn

    default_action {
        type                        = "forward"
        target_group_arn  = aws_lb_target_group.lms_tg.arn
    }
}

# sudo pacman -S terraform

# terraform init : AWS대화 준비 (플러그인 설치)
# terraform plan: 플랜대로 어떻게 될지 preview
# terraform apply: 실제로 구축을하라 (인프라  생성)
# terraform destroy : 구축한 인프라 철거

# terraform 은 aws인프라에 문서화 역활도 합니다.

# aws configure시 나온 유의의 정책에 EC2정책을 부여해줍니다.(VPC 생성은 EC2 서비스 범주에 들어감)
# lms-key 라는 키페어가 있어야 되며 없으면 생성 (추후 github actions나  터미널에서 서버에 들어갈때(SSH접속)사용 합니다.)