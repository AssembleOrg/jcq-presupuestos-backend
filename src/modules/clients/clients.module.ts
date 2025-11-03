import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { LocationService } from '~/common/utils';

@Module({
  controllers: [ClientsController],
  providers: [ClientsService, LocationService],
  exports: [ClientsService],
})
export class ClientsModule {}

