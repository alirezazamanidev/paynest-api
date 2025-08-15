import { BaseEntity } from "src/common/abstracts/baseEntity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, UpdateDateColumn } from "typeorm";
import { WalletTypeEnum } from "../enums/type.enum";
import { WalletStatusEnum } from "../enums/status.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";

@Entity('wallet')
export class WalletEntity extends BaseEntity {

    @Column()
    userId:string
    @Column({type:'enum',enum:WalletTypeEnum})
    type:string
    @Column({type:'enum',enum:WalletStatusEnum,default:WalletStatusEnum.Active})
    status:string
    @Column({})
    balance:number
    @Column({nullable:true})
    dailyLimit:number
    @Column({default:null})
    lastTransaction_at:Date
    @CreateDateColumn()
    created_at:Date
    @UpdateDateColumn()
    updated_at:Date
    @OneToOne(()=>UserEntity,{onDelete:'CASCADE'})
    @JoinColumn({name:'userId'})
    user:UserEntity
}