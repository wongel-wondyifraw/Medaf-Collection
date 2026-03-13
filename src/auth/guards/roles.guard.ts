import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/user.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {

    // 1. Read required roles from @Roles() decorator
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [
        context.getHandler(), // ← method level @Roles()
        context.getClass(),   // ← controller level @Roles()
      ]
    );

    // 2. If no @Roles() decorator — route is open to all
    //    authenticated users
    if (!requiredRoles) return true;

    // 3. Get user from request — attached by JwtStrategy
    const { user } = context.switchToHttp().getRequest();

    // 4. Check if user has required role
    const hasRole = requiredRoles.includes(user.role);

    // 5. If user doesn't have required role — throw error
    if (!hasRole) throw new ForbiddenException(
      'You do not have permission to access this resource'
    );

    return true;
  }
}
