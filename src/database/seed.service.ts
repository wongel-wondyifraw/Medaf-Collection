import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User, UserRole } from '../users/user.entity';


@Injectable()
export class SeedService implements OnModuleInit {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}


  async onModuleInit() {

    const email = process.env.SEED_USER_EMAIL;
    const password = process.env.SEED_USER_PASSWORD;
    const name = process.env.SEED_USER_NAME;


    if (!email || !password) {
      console.log('⚠️ Seed user credentials are missing');
      return;
    }


    const existingUser = await this.userRepository.findOne({
      where: {
        email,
      },
    });


    if (existingUser) {

      console.log(`✅ Seed user already exists: ${email}`);

      return;
    }


    const hashedPassword = await bcrypt.hash(
      password,
      10,
    );


    const user = this.userRepository.create({

      email,

      name,

      password: hashedPassword,

      role: UserRole.ADMIN,

      isActive: true,

    });


    await this.userRepository.save(user);


    console.log(`✅ Seed user created: ${email}`);

  }
}