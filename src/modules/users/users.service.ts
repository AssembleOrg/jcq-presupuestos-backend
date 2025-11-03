import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '~/prisma';
import { CreateUserDto, UpdateUserDto, UserResponseDto, PaginationQueryDto, FilterUserDto } from './dto';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { createPaginationMeta, PaginatedResponseDto } from '~/common/interfaces';
import { DateTime } from 'luxon';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private buildWhereClause(filters: FilterUserDto) {
    const where: any = { deletedAt: null };

    if (filters.email) {
      where.email = { contains: filters.email, mode: 'insensitive' };
    }

    if (filters.firstName) {
      where.firstName = { contains: filters.firstName, mode: 'insensitive' };
    }

    if (filters.lastName) {
      where.lastName = { contains: filters.lastName, mode: 'insensitive' };
    }

    if (filters.role) {
      where.role = filters.role;
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    return where;
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });

    return plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true });
  }

  async findAll(filters: FilterUserDto = {}): Promise<UserResponseDto[]> {
    const where = this.buildWhereClause(filters);

    const users = await this.prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return plainToInstance(UserResponseDto, users, { excludeExtraneousValues: true });
  }

  async findAllPaginated(
    paginationQuery: PaginationQueryDto, 
    filters: FilterUserDto = {}
  ): Promise<PaginatedResponseDto<UserResponseDto>> {
    const { page = 1, limit = 10 } = paginationQuery;
    const skip = (page - 1) * limit;
    const where = this.buildWhereClause(filters);

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    const data = plainToInstance(UserResponseDto, users, { excludeExtraneousValues: true });
    const meta = createPaginationMeta(page, limit, total);

    return { data, meta };
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findFirst({
      where: { 
        id,
        deletedAt: null 
      },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.prisma.user.findFirst({
      where: { 
        id,
        deletedAt: null 
      },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Check if email is being updated and if it's already taken
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('El email ya está registrado');
      }
    }

    // Hash password if provided
    const data: any = { ...updateUserDto };
    if (updateUserDto.password) {
      data.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data,
    });

    return plainToInstance(UserResponseDto, updatedUser, { excludeExtraneousValues: true });
  }

  async remove(id: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findFirst({
      where: { 
        id,
        deletedAt: null 
      },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Soft delete
    await this.prisma.user.update({
      where: { id },
      data: {
        deletedAt: DateTime.now().setZone('America/Argentina/Buenos_Aires').toJSDate(),
      },
    });

    return { message: 'Usuario eliminado exitosamente' };
  }
}

