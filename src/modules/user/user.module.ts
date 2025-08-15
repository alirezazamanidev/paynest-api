import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { SessionEntity } from './entities/session.entity';

@Module({

    imports:[TypeOrmModule.forFeature([UserEntity,SessionEntity])],
    exports:[TypeOrmModule]
})
export class UserModule {
}
