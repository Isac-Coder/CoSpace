import { NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

export abstract class BaseService<T, CreateDTO, UpdateDTO> {
  constructor(
    protected readonly prisma: PrismaClient,
    protected readonly modelName: string,
  ) {}

  // Acceso dinámico al modelo de Prisma
  protected get model() {
    return (this.prisma as any)[this.modelName];
  }

  async findAll(): Promise<T[]> {
    return this.model.findMany();
  }

  async findOne(id: string): Promise<T> {
    const item = await this.model.findUnique({
      where: { id },
    });
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found in ${this.modelName}`);
    }
    return item;
  }

  async create(data: CreateDTO): Promise<T> {
    return this.model.create({
      data,
    });
  }

  async update(id: string, data: UpdateDTO): Promise<T> {
    try {
      return await this.model.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new NotFoundException(`Item with ID ${id} not found to update`);
    }
  }

  async remove(id: string): Promise<T> {
    try {
      return await this.model.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Item with ID ${id} not found to delete`);
    }
  }
}
