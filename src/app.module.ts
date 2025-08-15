import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmDbConfig } from './configs/typeorm.config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { RedisModule } from './modules/redis/redis.module';
const ExternalModule = [
  ConfigModule.forRoot({
    isGlobal: true,
  }),

  TypeOrmModule.forRootAsync({
    useClass: TypeOrmDbConfig,
  }),
];
@Module({
  imports: [
    ...ExternalModule,
     RedisModule.forRoot({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    }),
    UserModule,
    AuthModule,
   
  ],
})
export class AppModule {}
