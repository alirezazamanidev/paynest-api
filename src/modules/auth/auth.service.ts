import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from './dtos/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const {fullname,password,email}=signUpDto;
    const user=await this.userRepository.findOne({where:{email}});
    if(user) throw new UnauthorizedException('User already exists');
    
  }
}
