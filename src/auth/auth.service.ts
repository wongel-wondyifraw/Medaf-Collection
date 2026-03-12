// 1. Injectable marks this as a NestJS provider
import { Injectable, UnauthorizedException } from '@nestjs/common';

// 2. JwtService lets us sign and verify JWT tokens
import { JwtService } from '@nestjs/jwt';

// 3. UsersService has all the DB logic we already built
import { UsersService } from '../users/users.service';

// 4. DTOs define the shape of incoming request data
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

// 5. bcrypt to compare password on login
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {

  constructor(
    // 6. Inject UsersService — handles all DB operations
    private usersService: UsersService,

    // 7. Inject JwtService — handles token generation
    private jwtService: JwtService,
  ) {}

  // ─── REGISTER ─────────────────────────────────────────────

  async register(dto: RegisterDto) {
    // 8. Call UsersService to create user + customer records
    //    all validation and hashing happens there
    const user = await this.usersService.createCustomer(
      dto.email,
      dto.password,
      dto.firstName,
      dto.middleName,
      dto.phone,
      dto.address,
      dto.city,
      dto.region,
      dto.lastName,    // optional
      dto.imageUrl,    // optional
    );

    // 9. Generate JWT token for the new user
    //    so they are logged in immediately after signup
    const token = this.generateToken(user.id, user.email);

    return { 
      user,   // user data without password
      token   // JWT token
    };
  }

  // ─── LOGIN ────────────────────────────────────────────────

  async login(dto: LoginDto) {
    // 10. Find user by email — returns null if not found
    const user = await this.usersService.findByEmail(dto.email);

    // 11. If no user found with that email — throw error
    //     we say 'Invalid credentials' not 'Email not found'
    //     so we don't reveal which emails exist in our system
    if (!user) throw new UnauthorizedException('Invalid credentials');

    // 12. Compare provided password with stored hash
    //     bcrypt.compare returns true if they match
    const passwordMatch = await bcrypt.compare(dto.password, user.password);

    // 13. If password wrong — throw same vague error
    if (!passwordMatch) throw new UnauthorizedException('Invalid credentials');

    // 14. Generate JWT token for the logged in user
    const token = this.generateToken(user.id, user.email);

    // 15. Strip password before returning user data
    const { password: _, ...result } = user;

    return {
      user: result,  // user data without password
      token          // JWT token
    };
  }

  // ─── GENERATE TOKEN ───────────────────────────────────────

  private generateToken(userId: string, email: string) {
    // 16. Sign the token with user data as payload
    //     sub = subject = user ID (JWT standard)
    //     this payload is what JwtStrategy.validate() receives
    return this.jwtService.sign({ 
      sub: userId,   // ← JwtStrategy reads this as payload.sub
      email          // ← JwtStrategy reads this as payload.email
    });
  }
}