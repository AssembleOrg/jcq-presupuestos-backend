import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '~/prisma';
import { CreateStaffDto, CreateWorkRecordDto, StaffResponseDto, UpdateStaffDto, UpdateWorkRecordDto, WorkRecordResponseDto } from './dto';
import { plainToInstance } from 'class-transformer';
import { FilterStaffDto } from './dto/filter-staff.dto';
import { DateTime } from 'luxon';


@Injectable()
export class StaffService {
  constructor(private readonly prisma: PrismaService) {}

  private buildWhereClause(filters: FilterStaffDto) {
      const where: any = { deletedAt: null };
  
      if (filters.firstName) {
        where.firstName = { contains: filters.firstName, mode: 'insensitive' };
      }
  
      if (filters.lastName) {
        where.lastName = { contains: filters.lastName, mode: 'insensitive' };
      }
  
      if (filters.cuit) {
        where.cuit = { contains: filters.cuit, mode: 'insensitive' };
      }
  
      if (filters.dni) {
        where.dni = { contains: filters.dni, mode: 'insensitive' };
      }
  
      return where;
    }

  // Creacion de un nuevo empleado
  async createStaff(createStaffDto: CreateStaffDto) {
    if (!createStaffDto.cuit && !createStaffDto.dni) {
          throw new BadRequestException('Debe proporcionar CUIT o DNI del empleado');
        }
    const staff = await this.prisma.staff.create({
          data: createStaffDto
        });
    return plainToInstance(StaffResponseDto, staff, { excludeExtraneousValues: true });
  }

  // Obtencion de todos los empleados
  async getAllStaff(filters: FilterStaffDto = {}): Promise<StaffResponseDto[]> {
      const where = this.buildWhereClause(filters);
  
      const workers = await this.prisma.staff.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });
  
      return plainToInstance(StaffResponseDto, workers, { excludeExtraneousValues: true });
    }

  // 1. planilla de horas (Boton "Cargar Horas")
 async createWorkRecord(data: CreateWorkRecordDto) {
    const totalHours =
      data.hoursMonday +
      data.hoursTuesday +
      data.hoursWednesday +
      data.hoursThursday +
      data.hoursFriday;

    const totalCalculation = (totalHours * data.valuePerHour) - data.advance;

    const start = new Date(data.startDate);
    const end = new Date(start); 
    end.setDate(start.getDate() + 4); 

    const record = await this.prisma.workRecord.create({
      data: {
        ...data,
        total: totalCalculation,
        startDate: start,
        endDate: end, 
      },
    });

    return plainToInstance(WorkRecordResponseDto, record, { excludeExtraneousValues: true });
}

  // 2. MODIFICAR PLANILLA (Boton Modificar)
  async updateWorkRecord(id: string, changes: UpdateWorkRecordDto) {
    const record = await this.prisma.workRecord.findUnique({ where: { id } });
    if (!record) {
      throw new NotFoundException(`Planilla con ID ${id} no encontrada`);
    }

    const hoursMonday = changes.hoursMonday ?? record.hoursMonday;
    const hoursTuesday = changes.hoursTuesday ?? record.hoursTuesday;
    const hoursWednesday = changes.hoursWednesday ?? record.hoursWednesday;
    const hoursThursday = changes.hoursThursday ?? record.hoursThursday;
    const hoursFriday = changes.hoursFriday ?? record.hoursFriday;
    
    const valuePerHour = changes.valuePerHour ?? record.valuePerHour;
    const advance = changes.advance ?? record.advance;

    const totalHours = hoursMonday + hoursTuesday + hoursWednesday + hoursThursday + hoursFriday;
    const newTotal = (totalHours * valuePerHour) - advance;

    return this.prisma.workRecord.update({
      where: { id },
      data: {
        ...changes,       
        total: newTotal,  
      },
    });
  }

  async updateStaff(id: string, data: UpdateStaffDto) {
  const staff = await this.prisma.staff.findUnique({ where: { id } });
  if (!staff) throw new NotFoundException(`Empleado con ID ${id} no encontrado`);

  // Actualizacion
  const updated = await this.prisma.staff.update({
    where: { id },
    data: data, // Prisma solo actualiza los campos que vengan en data
  });

  return plainToInstance(StaffResponseDto, updated, { excludeExtraneousValues: true });
}
 
  async getWorkRecordsByStaff(staffId: string) {
  return this.prisma.workRecord.findMany({
    where: { staffId },
    orderBy: [
      { startDate: 'desc' }, 
      { createdAt: 'desc' }  
    ],
    take: 20,
  });
}

async deleteWorkRecord(staffId: string) //SOFT DELETE
{
await this.prisma.workRecord.updateMany({
  where: {staffId},
    data:{
      deletedAt: DateTime.now().setZone('America/Argentina/Buenos_Aires').toJSDate(),
    },
})
return {message:'Registros de horas eliminado exitosamente'};
}

async removeStaff(id:string):Promise<{ message: string }> //elimina tambien los WorkRecords
 {
  const staff = await this.prisma.staff.findFirst({
    where:{
      id,
      deletedAt: null
    },
   });

  if(!staff){
      throw new NotFoundException('Empleado no encontrado');
    }
  await this.deleteWorkRecord(id)
  await this.prisma.staff.update({
    where: { id },
      data: {
        deletedAt: DateTime.now().setZone('America/Argentina/Buenos_Aires').toJSDate(),
      },
    });
    return {message:'Empleado eliminado exitosamente'};
  }
}