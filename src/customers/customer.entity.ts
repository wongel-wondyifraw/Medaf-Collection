import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn , OneToOne, JoinColumn } from "typeorm";
import { User } from "../users/user.entity";

@Entity('customers')
export class Customer {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    phone: string;

    @Column()
    address: string;

    @Column()
    city: string;

    @Column()
    region: string;

    @OneToOne(() => User, user => user.customer)
    @JoinColumn()
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}