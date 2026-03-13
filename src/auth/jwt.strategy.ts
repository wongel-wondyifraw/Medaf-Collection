// src/auth/jwt.strategy.ts

// 1. PassportStrategy is the base class for all passport strategies
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

// 2. Strategy and ExtractJwt come from passport-jwt
//    Strategy  — the JWT validation logic
//    ExtractJwt — how to extract token from request
import { ExtractJwt, Strategy } from 'passport-jwt';

// 3. UsersService to look up the user from the token
import { UsersService } from '../users/users.service';

@Injectable()
// 4. Extending PassportStrategy(Strategy) registers
//    this as the 'jwt' strategy — used in AuthGuard('jwt')
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(private usersService: UsersService) {
    super({
      // 5. Extract JWT from Authorization: Bearer <token> header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // 6. Reject token if it has expired
      ignoreExpiration: false,

      // 7. Secret key used to verify the token signature
      //    must match the secret used to SIGN the token in AuthService
      secretOrKey: process.env.JWT_SECRET || 'secret',
    });
  }

  // 8. This runs AFTER the token signature is verified
  //    payload is the decoded token data we put in during login
  //    { sub: user.id, email: user.email }
  async validate(payload: { sub: string; email: string }) {

    // 9. Look up the user from the ID inside the token
    const user = await this.usersService.findById(payload.sub);

    // 10. If user not found — token is invalid
    if (!user) throw new UnauthorizedException();

    // 11. Whatever we return here gets attached to req.user
    //     so in any controller we can do req.user.email etc.
    return user;
  }
}
