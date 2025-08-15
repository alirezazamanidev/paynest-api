import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import type { Request } from 'express';
import Redis from 'ioredis';
import { hashSecret } from 'src/common/utils/hash.util';
import { SessionEntity } from 'src/modules/user/entities/session.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SessionService {
      private readonly CACHE_EXPIRE_SECONDS = 60 * 5;
      private readonly SESSION_EXPIRE_DAYS = 7;
  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectRepository(SessionEntity)
    private sessionRepository: Repository<SessionEntity>,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
  ) {}

  async create(userId: string): Promise<string> {
    const secret = randomBytes(32).toString('hex');
    const newSession = this.sessionRepository.create({
      userId,
      hashedSecret: hashSecret(secret),
      isActive: true,
      ipAddress:
        (this.request.headers['x-forwarded-for'] as string)
          ?.split(',')[0]
          ?.trim() ||
        this.request.ip ||
        'unknown',
      userAgent: this.request.headers['user-agent'] || 'unknown',
      last_used_at: new Date(),
      expires_at: new Date(Date.now() + 60 * 60 * 1000 * 24),
    });
    await this.sessionRepository.save(newSession);
    return `${newSession.id}.${secret}`;
  }
  async verify(compoundToken: string) {
    // catched data
    const [sessionId, secret] = compoundToken.split('.');
    const cached=await this.redisClient.get(`session:${sessionId}`);
    if(cached) return JSON.parse(cached);

    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
      relations: ['user'],
      select: {
        id: true,
        hashedSecret: true,
        isActive: true,
        expires_at: true,
        user: {
          id: true,
          email: true,
          phone: true,
          isEmailVerified: true,
          isPhoneVerified: true,
          fullname: true,
        },
      },
    });
    if (!session || !session.isActive)
      throw new UnauthorizedException('login again!');
    if (session.expires_at <= new Date()) {
      await this.sessionRepository.update(
        { id: session.id },
        { isActive: false },
      );
      throw new UnauthorizedException('session expired');
    }
    if (session.hashedSecret !== hashSecret(secret)) {
      throw new UnauthorizedException('login again!');
    }
    await this.sessionRepository.update(
      { id: session.id },
      { last_used_at: new Date() },
    );

        // ذخیره در Redis
    await this.redisClient.set(
      `session:${compoundToken}`,
      JSON.stringify(session.user),
      'EX',
      this.CACHE_EXPIRE_SECONDS,
    );

    return session.user;
  }
}
