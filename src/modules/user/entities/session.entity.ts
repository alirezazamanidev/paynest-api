import { BaseEntity } from 'src/common/abstracts/baseEntity';
import { Column, CreateDateColumn, Entity, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('user-session')
export class SessionEntity extends BaseEntity {
  @Column()
  userId: string;
  @Column()
  ipAddress: string;
  @Column()
  userAgent: string;
  @Column({unique:true})
  hashedSecret:string
  @Column()
  isActive: boolean;
  @CreateDateColumn()
  created_at: Date;
  @Column()
  last_used_at:Date
  @Column()
  expires_at: Date;
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  user: UserEntity;
}
