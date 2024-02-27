-- CreateEnum
CREATE TYPE "accountType" AS ENUM ('SAVINGS', 'CHECKING', 'CREDIT');

-- CreateEnum
CREATE TYPE "transactionType" AS ENUM ('DEPOSIT', 'WITHDRAWAL');

-- CreateTable
CREATE TABLE "account" (
    "accountNumber" INTEGER NOT NULL,
    "type" "accountType" NOT NULL,
    "name" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "creditLimit" DOUBLE PRECISION
);

-- CreateTable
CREATE TABLE "transaction" (
    "id" TEXT NOT NULL,
    "accountNumber" INTEGER NOT NULL,
    "type" "transactionType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "account_accountNumber_key" ON "account"("accountNumber");

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_accountNumber_fkey" FOREIGN KEY ("accountNumber") REFERENCES "account"("accountNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
