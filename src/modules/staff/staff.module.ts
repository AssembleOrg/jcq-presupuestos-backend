import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { LocationService } from '~/common/utils';

@Module({
  controllers: [StaffController],
  providers: [StaffService,LocationService],
  exports: [StaffService],
})
export class StaffModule {}