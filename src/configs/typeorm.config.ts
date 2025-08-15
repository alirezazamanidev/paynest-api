import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { join } from 'path';

export class TypeOrmDbConfig implements TypeOrmOptionsFactory {
  createTypeOrmOptions(
    connectionName?: string,
  ): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [join(__dirname, '../modules/**/*.entity.{ts,js}')],
      synchronize: true,
    };
  }
}
