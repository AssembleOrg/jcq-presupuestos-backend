import { Module } from '@nestjs/common';
import { StructuresService } from './structures.service';
import { StructuresController } from './structures.controller';
import { LocationService } from '~/common/utils';

@Module({
  controllers: [StructuresController],
  providers: [StructuresService,LocationService],
  exports: [StructuresService],
})
export class StructuresModule {}