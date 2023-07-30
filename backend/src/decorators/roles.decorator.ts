import { SetMetadata } from '@nestjs/common';
import { USER_ROLE } from '../data-access-layer/user-entity/entities/user.roles';

export const Roles = (...roles: USER_ROLE[]) => SetMetadata('roles', roles);
