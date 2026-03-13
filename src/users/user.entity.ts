import { Entity, PrimaryColumn, Column , CreateDateColumn , UpdateDateColumn, OneToOne, PrimaryGeneratedColumn, Index } from "typeorm";
import {Customer} from "../customers/customer.entity";

export enum UserRole {
    ADMIN = 'admin',
    CUSTOMER = 'customer',}

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @Column({ unique: true })
    email: string;

    @Column({nullable: true})
    name: string;

    @Column({nullable: true})
    imageUrl: string;

    @Column()
    password: string;   

    @Column({type : 'enum', enum: UserRole , default : UserRole.CUSTOMER   })
    role : UserRole;

    @Column({default: true})
    isActive: boolean;

    @OneToOne(() => Customer, customer => customer.user, { nullable: true, eager: true })
    customer: Customer;
    
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}