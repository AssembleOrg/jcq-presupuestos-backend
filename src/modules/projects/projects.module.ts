import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { LocationService } from '~/common/utils';
import { DolarService } from '~/common/services/dolar.service';
import { StructuresModule } from '../structures/structures.module';
import { CollaboratorsModule } from '../collaborators';

@Module({
  imports: [StructuresModule,CollaboratorsModule],
  controllers: [ProjectsController],
  providers: [ProjectsService, LocationService, DolarService],
  exports: [ProjectsService],
})
export class ProjectsModule {}

