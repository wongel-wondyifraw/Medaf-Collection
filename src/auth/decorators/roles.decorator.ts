import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../users/user.entity';

// 1. 'roles' is the metadata key
//    we use it in RolesGuard to read the required roles
export const ROLES_KEY = 'roles';

// 2. @Roles('admin') decorator
//    used on controller methods to specify required role
//    e.g. @Roles(UserRole.ADMIN)
export const Roles = (...roles: UserRole[]) => 
  SetMetadata(ROLES_KEY, roles);