import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from './dtos/auth.dto';
import type { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { randomInt } from 'crypto';
import { hashPassword } from 'src/common/utils/hash.util';

@Injectable()
export class AuthService {
  private readonly Otp_expiration_minutes =
    process.env.OTP_EXPIRATION_MINUTES || '5';
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { fullname, password, email } = signUpDto;
    const userExist = await this.userRepository.exists({ where: { email } });
    if (userExist) throw new UnauthorizedException('User already exists');
    // save user
    let newUser = this.userRepository.create({
      fullname,
      email,
      hashedPassword: hashPassword(password),
    });
    newUser = await this.userRepository.save(newUser);
    // create otp
    const otp=await this.createAndSaveOtp(newUser.email);
    return {
      message: 'otp Code sent successfully!',
      otp_code:otp
    };
  }
  private async createAndSaveOtp(email: string) {
    const otpCatched = await this.cacheManager.get(`otp:${email}`);
    if (otpCatched) throw new UnauthorizedException('Otp Not Expired!');
    const code = randomInt(100_000, 999_999).toString();
    await this.cacheManager.set(
      `otp:${email}`,
      code,
      parseInt(this.Otp_expiration_minutes) * 60,
    );
    return code;
  }
}
