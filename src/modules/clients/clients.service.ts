import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '~/prisma';
import { CreateClientDto, UpdateClientDto, ClientResponseDto, FilterClientDto } from './dto';
import { PaginationQueryDto } from '~/modules/users/dto';
import { plainToInstance } from 'class-transformer';
import { createPaginationMeta, PaginatedResponseDto } from '~/common/interfaces';
import { DateTime } from 'luxon';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  private buildWhereClause(filters: FilterClientDto) {
    const where: any = { deletedAt: null };

    if (filters.fullname) {
      where.fullname = { contains: filters.fullname, mode: 'insensitive' };
    }

    if (filters.phone) {
      where.phone = { contains: filters.phone, mode: 'insensitive' };
    }

    if (filters.cuit) {
      where.cuit = { contains: filters.cuit, mode: 'insensitive' };
    }

    if (filters.dni) {
      where.dni = { contains: filters.dni, mode: 'insensitive' };
    }

    return where;
  }

  async create(createClientDto: CreateClientDto): Promise<ClientResponseDto> {
    // Validar que al menos uno (CUIT o DNI) esté presente
    if (!createClientDto.cuit && !createClientDto.dni) {
      throw new BadRequestException('Debe proporcionar CUIT o DNI del cliente');
    }

    const client = await this.prisma.client.create({
      data: createClientDto,
    });

    return plainToInstance(ClientResponseDto, client, { excludeExtraneousValues: true });
  }

  async findAll(filters: FilterClientDto = {}): Promise<ClientResponseDto[]> {
    const where = this.buildWhereClause(filters);

    const clients = await this.prisma.client.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return plainToInstance(ClientResponseDto, clients, { excludeExtraneousValues: true });
  }

  async findAllPaginated(
    paginationQuery: PaginationQueryDto,
    filters: FilterClientDto = {}
  ): Promise<PaginatedResponseDto<ClientResponseDto>> {
    const { page = 1, limit = 10 } = paginationQuery;
    const skip = (page - 1) * limit;
    const where = this.buildWhereClause(filters);

    const [clients, total] = await Promise.all([
      this.prisma.client.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.client.count({ where }),
    ]);

    const data = plainToInstance(ClientResponseDto, clients, { excludeExtraneousValues: true });
    const meta = createPaginationMeta(page, limit, total);

    return { data, meta };
  }

  async findOne(id: string): Promise<ClientResponseDto> {
    const client = await this.prisma.client.findFirst({
      where: { 
        id,
        deletedAt: null 
      },
    });

    if (!client) {
      throw new NotFoundException('Cliente no encontrado');
    }

    return plainToInstance(ClientResponseDto, client, { excludeExtraneousValues: true });
  }

  async update(id: string, updateClientDto: UpdateClientDto): Promise<ClientResponseDto> {
    const client = await this.prisma.client.findFirst({
      where: { 
        id,
        deletedAt: null 
      },
    });

    if (!client) {
      throw new NotFoundException('Cliente no encontrado');
    }

    // Si se está actualizando CUIT o DNI, validar que al menos uno permanezca
    const willHaveCuit = updateClientDto.cuit !== undefined ? updateClientDto.cuit : client.cuit;
    const willHaveDni = updateClientDto.dni !== undefined ? updateClientDto.dni : client.dni;

    if (!willHaveCuit && !willHaveDni) {
      throw new BadRequestException('El cliente debe tener CUIT o DNI');
    }

    const updatedClient = await this.prisma.client.update({
      where: { id },
      data: updateClientDto,
    });

    return plainToInstance(ClientResponseDto, updatedClient, { excludeExtraneousValues: true });
  }

  async remove(id: string): Promise<{ message: string }> {
    const client = await this.prisma.client.findFirst({
      where: { 
        id,
        deletedAt: null 
      },
    });

    if (!client) {
      throw new NotFoundException('Cliente no encontrado');
    }

    // Soft delete
    await this.prisma.client.update({
      where: { id },
      data: {
        deletedAt: DateTime.now().setZone('America/Argentina/Buenos_Aires').toJSDate(),
      },
    });

    return { message: 'Cliente eliminado exitosamente' };
  }
}

