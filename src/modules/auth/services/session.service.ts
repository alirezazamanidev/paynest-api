import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import type { Request } from 'express';
import { SessionEntity } from 'src/modules/user/entities/session.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SessionService {
  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectRepository(SessionEntity)
    private sessionRepository: Repository<SessionEntity>,
  ) {}

  async create(userId: string):Promise<string> {
    const token = randomBytes(32).toString('hex');
    const newSession = this.sessionRepository.create({
      userId,
      token,
      isActive:true,
      ipAddress: this.request.ip,
      userAgent: this.request.headers['user-agent'],
      expires_at: new Date(Date.now() + 60 * 60 * 1000 * 24),
    });
    await this.sessionRepository.save(newSession);
    return token
  }
}
