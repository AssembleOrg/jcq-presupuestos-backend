import { Module } from '@nestjs/common';
import { PaidsService } from './paids.service';
import { PaidsController } from './paids.controller';
import { LocationService } from '~/common/utils';

@Module({
  controllers: [PaidsController],
  providers: [PaidsService, LocationService],
  exports: [PaidsService],
})
export class PaidsModule {}

