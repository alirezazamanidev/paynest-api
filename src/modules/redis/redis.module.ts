import { DynamicModule, Global, Module } from '@nestjs/common';
import Redis from 'ioredis';
@Global()
@Module({})
export class RedisModule {
  static forRoot(options:{url:string}): DynamicModule {
    const redisProvider = {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        const redis = new Redis(options.url, {
          maxRetriesPerRequest: null,
          enableOfflineQueue: true,
        });

        redis.on('connect', () => console.log('Redis connected'));
        redis.on('error', (err) => console.error('Redis error:', err));

        return redis;
      },
    };

    return {
      module: RedisModule,
      providers: [redisProvider],
      exports: [redisProvider],
    };
  }
}
