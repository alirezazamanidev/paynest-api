import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateWalletDto } from './dtos/create-wallet.dto';
import type { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { WalletEntity } from './entities/wallet.entity';

@Injectable({ scope: Scope.REQUEST })
export class WalletService {
  constructor(
    private dataSource: DataSource,
    @Inject(REQUEST) private request: Request,
  ) {}

  async create(dto: CreateWalletDto) {
    const { type, balance, dailyLimit } = dto;
    return await this.dataSource.transaction(async (manager) => {
      const wallet = manager.create(WalletEntity, {
        userId: this.request.user.id,
        type,
        balance,
        dailyLimit,
      });
      await manager.save(wallet);
      return {
        message: 'Wallet created successfully',
        wallet,
      };
    });
  }
}
