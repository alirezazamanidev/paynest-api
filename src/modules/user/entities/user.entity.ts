import { BaseEntity } from 'src/common/abstracts/baseEntity';
import { RoleEnum } from 'src/common/enums/role.enum';
import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

@Entity('user')
export class UserEntity extends BaseEntity {
  @Column()
  fullname: string;
  @Column({ unique: true })
  email: string;
  @Column()
  hashedPassword: string;
  @Column({ unique: true, nullable: true })
  phone: string;
  @Column({ default: false })
  isEmailVerified: boolean;
  @Column({type:'enum',enum:RoleEnum,default:RoleEnum.User})
  role:string
  @Column({ default: false })
  isPhoneVerified: boolean;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
