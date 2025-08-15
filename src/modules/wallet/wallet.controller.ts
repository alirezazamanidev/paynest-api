import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateWalletDto } from './dtos/create-wallet.dto';
import { ContentTypeEnum } from 'src/common/enums/form.enum';
import { Auth } from '../auth/decorators/auth.decurator';
@ApiTags('Wallet')
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @ApiOperation({ summary: 'Create a new wallet' })
  @ApiConsumes(ContentTypeEnum.Form,ContentTypeEnum.Json)
  @HttpCode(HttpStatus.CREATED)
  @Auth()
  @Post('create')
  create(@Body() createWalletDto: CreateWalletDto) {
    return this.walletService.create(createWalletDto);
  }
}
