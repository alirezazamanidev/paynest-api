import { ApiProperty } from '@nestjs/swagger';
import { 
  IsEnum, 
  IsNotEmpty, 
  IsOptional, 
  IsString, 
  IsNumber, 
  Min, 
  MaxLength, 
  Matches 
} from 'class-validator';
import { WalletTypeEnum } from '../enums/type.enum';


export class CreateWalletDto {
  @ApiProperty({
    description: 'Type of wallet',
    enum: WalletTypeEnum,
    example: WalletTypeEnum.IRR,
  })
  @IsEnum(WalletTypeEnum, { message: 'Wallet type must be one of IRR, USD, EUR, BTC' })
  type: WalletTypeEnum;

  @ApiProperty({
    description: 'Initial balance of the wallet',
    example: 0,
    minimum: 0,
  })
  @IsNumber({}, { message: 'Balance must be a number' })
  @Min(0, { message: 'Balance cannot be negative' })
  @IsOptional()
  balance?: number = 0;

  @ApiProperty({
    description: 'Custom name or description for the wallet',
    example: 'Travel Wallet',
    maxLength: 50,
    required: false,
  })

  @ApiProperty({
    description: 'Daily transaction limit (optional)',
    example: 1000000,
    minimum: 0,
    required: false,
  })
  @IsNumber({}, { message: 'Daily limit must be a number' })
  @Min(0, { message: 'Daily limit cannot be negative' })
  @IsOptional()
  dailyLimit?: number;
}
