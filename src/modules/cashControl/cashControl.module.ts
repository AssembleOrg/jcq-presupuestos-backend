import { Module } from '@nestjs/common';
import { CashControlService } from './cashControl.service';
import { cashControlController } from './cashControl.controller';
import { LocationService } from '~/common/utils';

@Module({
  controllers: [cashControlController],
  providers: [CashControlService,LocationService],
  exports: [CashControlService],
})
export class CashControlModule {}