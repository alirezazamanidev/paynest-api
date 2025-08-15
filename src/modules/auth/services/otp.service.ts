import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

import { randomInt } from 'crypto';
import Redis from 'ioredis';

@Injectable()
export class OtpService {
  private readonly Otp_expiration_minutes =
    process.env.OTP_EXPIRATION_MINUTES || 5
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
  ) {}

  private generateOtp() {
    return randomInt(100_000, 999_999).toString();
  }
  async createAndSaveOtp(value: string) {
    const otpCatched = await this.redisClient.get(`otp:${value}`);
    if (otpCatched) throw new UnauthorizedException('Otp Not Expired!');
    const code = this.generateOtp();

    await this.redisClient.setex(
      `otp:${value}`,
      this.Otp_expiration_minutes * 60,
      code
    );
    return code;
  }
  async verifyOtp(value: string, code: string) {
    const otpCatched = await this.redisClient.get(`otp:${value}`);
    if (!otpCatched) throw new UnauthorizedException('Otp Expired!');
    if (otpCatched !== code) throw new UnauthorizedException('Invalid Otp!');
    await this.redisClient.del(`otp:${value}`);
    return true;
  }
}
