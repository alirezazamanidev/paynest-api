import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmDbConfig } from './configs/typeorm.config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv, Keyv } from '@keyv/redis';
const ExternalModule = [
  ConfigModule.forRoot({
    isGlobal: true,
  }),
  CacheModule.registerAsync({
    isGlobal:true,
    useFactory: async()=>({
      stores:[createKeyv(process.env.REDIS_URL)],
    }),
  }),
  TypeOrmModule.forRootAsync({
    useClass: TypeOrmDbConfig,
  }),
];
@Module({
  imports: [...ExternalModule, UserModule, AuthModule],
})
export class AppModule {}
