import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmDbConfig } from './configs/typeorm.config';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }),
  TypeOrmModule.forRootAsync({
    useClass:TypeOrmDbConfig
  }),
  UserModule
],

})
export class AppModule {}
