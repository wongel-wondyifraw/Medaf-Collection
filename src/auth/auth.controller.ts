import { Controller, Post, Get, Body, Request, UseGuards } from '@nestjs/common';

// 2. AuthService has all our login/register logic
import { AuthService } from './auth.service';

// 3. DTOs for request body validation
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

// 4. AuthGuard protects routes — requires valid JWT token
import { AuthGuard } from '@nestjs/passport';

// 5. @Controller('auth') — all routes prefixed with /auth
@Controller('auth')
export class AuthController {

  constructor(
    // 6. Inject AuthService
    private authService: AuthService
  ) {}

  // ─── REGISTER ─────────────────────────────────────────────

  // 7. POST /auth/register — public route, no token needed
  @Post('register')
  async register(
    // 8. @Body() extracts and validates the request body
    //    using RegisterDto rules we defined
    @Body() dto: RegisterDto
  ) {
    // 9. Pass DTO to AuthService and return result
    return this.authService.register(dto);
  }

  // ─── LOGIN ────────────────────────────────────────────────

  // 10. POST /auth/login — public route, no token needed
  @Post('login')
  async login(
    // 11. @Body() extracts and validates using LoginDto
    @Body() dto: LoginDto
  ) {
    // 12. Pass DTO to AuthService and return result
    return this.authService.login(dto);
  }

  // ─── GET CURRENT USER ─────────────────────────────────────

  // 13. GET /auth/me — protected route, token required
  @Get('me')
  // 14. @UseGuards(AuthGuard('jwt')) triggers JwtStrategy
  //     rejects request if token is missing or invalid
  @UseGuards(AuthGuard('jwt'))
  async getMe(
    // 15. @Request() gives us access to the request object
    //     req.user is set by JwtStrategy.validate()
    @Request() req
  ) {
    // 16. Strip password before returning
    const { password: _, ...user } = req.user;
    return user;
  }
}