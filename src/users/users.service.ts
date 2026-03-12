import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole} from './user.entity';
import { Customer } from '../customers/customer.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,

        @InjectRepository(Customer)
        private customersRepository: Repository<Customer>,
    ){}

    // Create a new customer along with a user account

    async createCustomer(
        email: string,
        password: string,
        name: string,
        phone: string,
        address: string,
        city: string,
        region: string,
        imageUrl?: string
    ){
        const exisiting = await this.usersRepository.findOne({ where: { email } });
        if(exisiting) throw new ConflictException('Email already in Use');
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create the user and customer records in a transaction
        const user = this.usersRepository.create({ email, password: hashedPassword, role: UserRole.CUSTOMER });
        const savedUser = await this.usersRepository.save(user);
        const customer = this.customersRepository.create({ name, phone, address, city, region, imageUrl, user: savedUser });
        await this.customersRepository.save(customer);
        const { password: _, ...result } = savedUser;
        // Exclude the password from the returned result
        return result;
        // return savedUser;
    }

    // Find a user by email
    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { email } });
    }

    // Find a user by ID
    async findById(id: string): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    // Create Admin
    async createAdmin(email: string, password: string, name: string , imageUrl?: string) {
        const existing = await this.usersRepository.findOne({ where: { email } });
        if (existing) {
            throw new ConflictException('Email already in Use');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.usersRepository.create({ email, password: hashedPassword, role: UserRole.ADMIN, name, imageUrl });
        const savedUser = await this.usersRepository.save(user);
        const { password: _, ...result } = savedUser;
        return result;
    }
}