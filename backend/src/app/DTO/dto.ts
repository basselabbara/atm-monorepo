import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from '@nestjs/class-validator';
import { accountType } from '@prisma/client';

class AmountDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01, { message: 'Amount must be greater than 0' })
  @Max(1000, { message: 'Amount must be less than 1000' })
  amount: number;
}

export class WithdrawDto extends AmountDto {}

export class DepositDto extends AmountDto {}

export class CreateAccountDto {
  @IsNumber()
  @Min(1, { message: 'Account number must be greater than 1' })
  @Max(999999, { message: 'Account number must be less than 999999' })
  accountNumber: number;

  @IsNumber()
  @Min(0, { message: 'Initial balance must be greater than 0' })
  @Max(100000, { message: 'Initial balance must be less than 100000' })
  initialBalance: number;

  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'Credit limit must be greater than 0' })
  @Max(10000, { message: 'Credit limit must be less than 10000' })
  creditLimit: number;

  @IsEnum(Object.keys(accountType))
  type: accountType;

  @IsString()
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  @MaxLength(50, { message: 'Name must be at most 50 characters long' })
  name: string;
}
