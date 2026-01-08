import { Prisma, PrismaClient  } from "../generated/client";
import { exit } from "node:process";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const getPrismaLogLevel = ():Prisma.LogLevel[] => {
    if (process.env.NODE_ENV === "production") {
        return ["warn", "error"];
    }
    return ["query", "info", "warn", "error"];
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL 환경 변수가 설정되지 않았습니다.")
}

// Prisma용 MySQL 어댑터 적용
const adapter = new PrismaMariaDb(connectionString)

export const prisma = new PrismaClient({
    adapter,
    log: getPrismaLogLevel()
})

export const connectDB = async (): Promise<void> => {
    try {
        await prisma.$connect() 
        console.log("MariaDB가 성공적으로 연결되었습니다.")
    } catch (error) {
        console.error("MariaDB 연결 종료", error)  
        exit(1)
    }
};

export const disconnectDB =  async ():Promise<void> => {
    await prisma.$disconnect();
    console.log("MariaDB Disconnected")
}