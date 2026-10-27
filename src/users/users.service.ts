import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { BaseService } from '../common/base.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UsersService extends BaseService<User, Prisma.UserCreateInput, Prisma.UserUpdateInput> {
  constructor(prisma: PrismaClient) {
    super(prisma, 'user'); // 'user' debe coincidir con el nombre del modelo en schema.prisma
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
