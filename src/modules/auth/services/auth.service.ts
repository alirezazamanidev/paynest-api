import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { Repository } from 'typeorm';
import { CheckOtpDto, SignInDto, SignUpDto } from '../dtos/auth.dto';

import { randomInt } from 'crypto';
import { comparePassword, hashPassword } from 'src/common/utils/hash.util';
import { OtpService } from './otp.service';
import { SessionService } from './session.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private otpService: OtpService,
    private sessionService: SessionService,
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
    const otp = await this.otpService.createAndSaveOtp(newUser.email);
    return {
      message: 'otp Code sent successfully!',
      otp_code: otp,
    };
  }
  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || !comparePassword(password, user.hashedPassword))
      throw new UnauthorizedException('Invalid credentials');
    // send and create otp
    const otpCode = await this.otpService.createAndSaveOtp(user.email);
    return {
      message: 'otp code sent successFully!',
      otp_code: otpCode,
    };
  }

  async checkOtp(dto: CheckOtpDto) {
    const { email, otp_code } = dto;
    // verify Otp
    await this.otpService.verifyOtp(email, otp_code);
    // get user
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'isEmailVerified'],
    });
    if (!user) throw new UnauthorizedException('login again!');
    user.isEmailVerified = true;
    await this.userRepository.save(user);
    // create session
    const sessionToken = await this.sessionService.create(user.id);
    return {
      message: 'Otp verified successfully!',
      session_token: sessionToken,
    };
  }
}
