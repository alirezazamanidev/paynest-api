import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiConsumes, ApiCreatedResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { SignUpDto } from './dtos/auth.dto';
import { ContentTypeEnum } from 'src/common/enums/form.enum';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({summary:"signUp User"})
  @ApiConsumes(ContentTypeEnum.Form,ContentTypeEnum.Json)
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({description:"sent otp successfully"})
  @ApiUnauthorizedResponse({description:"Unauthorized"})
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }
}
