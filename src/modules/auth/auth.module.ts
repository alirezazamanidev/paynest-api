import { Global, Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { OtpService } from './services/otp.service';
import { SessionService } from './services/session.service';

@Global()
@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService,OtpService,SessionService],
  exports:[SessionService]
})
export class AuthModule {}
