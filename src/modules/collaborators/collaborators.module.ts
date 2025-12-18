import { Module } from '@nestjs/common';
import { CollaboratorService } from './collaborators.service';
import { CollaboratorController } from './collaborators.controller';
import { LocationService } from '~/common/utils';

@Module({
  controllers: [CollaboratorController],
  providers: [CollaboratorService, LocationService],
  exports: [CollaboratorService],
})
export class CollaboratorsModule {}