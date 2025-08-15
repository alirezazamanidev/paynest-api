import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CheckOtpDto, SignInDto, SignUpDto } from './dtos/auth.dto';
import { ContentTypeEnum } from 'src/common/enums/form.enum';
import { AuthGuard } from './guards/auth.guard';
import type { Request } from 'express';
import { Auth } from './decorators/auth.decurator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'signUp User' })
  @ApiConsumes(ContentTypeEnum.Form, ContentTypeEnum.Json)
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'sent otp successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }
  @ApiOperation({ summary: 'signIn User' })
  @ApiConsumes(ContentTypeEnum.Form, ContentTypeEnum.Json)
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'sent otp successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
   @ApiOperation({ summary: 'check Otp' })
  @ApiConsumes(ContentTypeEnum.Form, ContentTypeEnum.Json)
  @Post('check-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Otp verified successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async checkOtp(@Body() checkOtpDto: CheckOtpDto) {
    return this.authService.checkOtp(checkOtpDto);
  }

  @ApiOperation({summary:"get user profile"})
  @Auth()
  @Get('profile')
  getProfile(@Req() request:Request) {
    return request.user;
  }
}
