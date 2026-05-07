import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn , OneToOne } from "typeorm";
import { User } from "../users/user.entity";

@Entity('customers')
export class Customer {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    firstName: string;

    @Column()
    middleName: string;

    @Column({ nullable: true })
    lastName: string;

    @Column()
    phone: string;

    @Column()
    address: string;

    @Column()
    city: string;

    @Column()
    region: string;

    @Column({ nullable: true })
    imageUrl: string;

    // Inverse side of the relation.
    // The foreign key lives on the users table as users.customerId
    @OneToOne(() => User, user => user.customer)
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}