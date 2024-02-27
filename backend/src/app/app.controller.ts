import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { AccountDetails, AppService } from './app.service';
import { CreateAccountDto, DepositDto, WithdrawDto } from './DTO/dto';
import { account } from '@prisma/client';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/account-details/:accountNumber')
  getAccountDetails(
    @Param('accountNumber') accountNumber: string
  ): Promise<AccountDetails> {
    return this.appService.getAccountDetails(parseInt(accountNumber));
  }

  @Get('/balance/:accountNumber')
  getBalance(@Param('accountNumber') accountNumber: string): Promise<number> {
    return this.appService.getBalance(parseInt(accountNumber));
  }

  @Post('/withdraw/:accountNumber')
  withdraw(
    @Body() body: WithdrawDto,
    @Param('accountNumber') accountNumber: string
  ): Promise<account> {
    return this.appService.withdraw(parseInt(accountNumber), body.amount);
  }

  @Post('/deposit/:accountNumber')
  deposit(
    @Body() body: DepositDto,
    @Param('accountNumber') accountNumber: string
  ): Promise<account> {
    return this.appService.deposit(parseInt(accountNumber), body.amount);
  }

  @Post('/create-account')
  createAccount(@Body() body: CreateAccountDto): Promise<account> {
    return this.appService.createAccount(body);
  }
}
