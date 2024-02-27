import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  PrismaClient,
  accountType,
  account,
  transactionType,
  transaction,
} from '@prisma/client';
import { CreateAccountDto } from './DTO/dto';

const prisma = new PrismaClient();

const MAX_AMOUNT_PER_DAY = 400;
const MAX_AMOUNT_PER_TRANSACTION = 200;
const MAX_DEPOSIT_AMOUNT = 10000;

export interface AccountDetails extends account {
  transactions: transaction[];
}

@Injectable()
export class AppService {
  private async getTodaysTransactions(accountNumber: number): Promise<number> {
    const todaysTransactions = await prisma.transaction.findMany({
      where: {
        accountNumber: accountNumber,
        type: transactionType.WITHDRAWAL,
        date: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });

    // SQL equivalent:
    // SELECT * FROM transaction WHERE accountNumber = ? AND type = 'WITHDRAWAL' AND date >= ?;

    return todaysTransactions.reduce(
      (acc, transaction) => acc + transaction.amount,
      0
    );
  }

  async getAccountDetails(accountNumber: number): Promise<AccountDetails> {
    const account = await prisma.account.findFirst({
      where: {
        accountNumber: accountNumber,
      },
      include: {
        transactions: true,
      },
    });

    // SQL equivalent:
    // SELECT * FROM account WHERE accountNumber = ?;

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }

  async getBalance(accountNumber: number): Promise<number> {
    const account = await prisma.account.findFirst({
      where: {
        accountNumber: accountNumber,
      },
    });

    // SQL equivalent:
    // SELECT balance FROM account WHERE accountNumber = ?;

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account.balance;
  }

  async withdraw(accountNumber: number, amount: number): Promise<account> {
    const account = await prisma.account.findFirst({
      where: {
        accountNumber: accountNumber,
      },
    });

    // SQL equivalent:
    // SELECT * FROM account WHERE accountNumber = ?;

    if (amount % 5 !== 0) {
      throw new BadRequestException('Amount must be a multiple of 5');
    }

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.type !== accountType.CREDIT && account.balance < amount) {
      throw new BadRequestException('Insufficient funds');
    }

    if (
      account.type === accountType.CREDIT &&
      account.balance + account.creditLimit < amount
    ) {
      throw new BadRequestException('Exceeded credit limit');
    }

    const todaysTransactions = await this.getTodaysTransactions(accountNumber);

    if (todaysTransactions + amount > MAX_AMOUNT_PER_DAY) {
      throw new BadRequestException(
        `Withdrawal limit reached, ${MAX_AMOUNT_PER_DAY} per day`
      );
    }

    if (amount > MAX_AMOUNT_PER_TRANSACTION) {
      throw new BadRequestException(
        `Exceeded maximum withdrawal amount, ${MAX_AMOUNT_PER_TRANSACTION} per transaction`
      );
    }

    await prisma.transaction.create({
      data: {
        accountNumber: accountNumber,
        amount: amount,
        type: transactionType.WITHDRAWAL,
      },
    });

    // SQL equivalent:
    // INSERT INTO transaction (accountNumber, amount, type) VALUES (?, ?, 'WITHDRAWAL');

    const updatedAccount = await prisma.account.update({
      where: {
        accountNumber: accountNumber,
      },
      data: {
        balance: account.balance - amount,
      },
    });

    // SQL equivalent:
    // UPDATE account SET balance = balance - ? WHERE accountNumber = ?;

    return updatedAccount;
  }

  async deposit(accountNumber: number, amount: number): Promise<account> {
    if (amount > MAX_DEPOSIT_AMOUNT) {
      throw new BadRequestException(
        `Exceeded maximum deposit amount, ${MAX_DEPOSIT_AMOUNT}`
      );
    }

    const account = await prisma.account.findFirst({
      where: {
        accountNumber: accountNumber,
      },
    });

    // SQL equivalent:
    // SELECT * FROM account WHERE accountNumber = ?;

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.type === accountType.CREDIT && account.balance + amount > 0) {
      const amountToDeposit = amount - account.balance;
      throw new BadRequestException(
        `Cannot deposit more than ${amountToDeposit} to pay off credit`
      );
    }

    await prisma.transaction.create({
      data: {
        accountNumber: accountNumber,
        amount: amount,
        type: transactionType.DEPOSIT,
      },
    });

    // SQL equivalent:
    // INSERT INTO transaction (accountNumber, amount, type) VALUES (?, ?, 'DEPOSIT');

    const updatedAccount = await prisma.account.update({
      where: {
        accountNumber: accountNumber,
      },
      data: {
        balance: account.balance + amount,
      },
    });

    // SQL equivalent:
    // UPDATE account SET balance = balance + ? WHERE accountNumber = ?;

    return updatedAccount;
  }

  async createAccount(data: CreateAccountDto): Promise<account> {
    const accountExists = await prisma.account.findFirst({
      where: {
        accountNumber: data.accountNumber,
      },
    });

    // SQL equivalent:
    // SELECT * FROM account WHERE accountNumber = ?;

    if (accountExists) {
      throw new BadRequestException('Account number already exists');
    }

    if (data.type === accountType.CREDIT && data.initialBalance < 0) {
      throw new BadRequestException('Initial balance cannot be negative');
    }

    if (data.type === accountType.CREDIT && !data.creditLimit) {
      throw new BadRequestException('Credit accounts must have a credit limit');
    }

    const account = await prisma.account.create({
      data: {
        accountNumber: data.accountNumber,
        balance: data.initialBalance,
        creditLimit: data.creditLimit,
        type: data.type,
        name: data.name,
      },
    });

    // SQL equivalent:
    // INSERT INTO account (accountNumber, balance, creditLimit, type, name) VALUES (?, ?, ?, ?, ?);

    return account;
  }
}
