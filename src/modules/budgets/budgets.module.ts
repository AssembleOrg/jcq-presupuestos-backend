import { Module } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { BudgetsController } from './budgets.controller';
import { LocationService } from '~/common/utils';
import { ClientsModule } from '../clients/clients.module';
import { StructuresModule } from '../structures/structures.module';

@Module({
  imports: [
  ClientsModule,
  StructuresModule,],
  controllers: [BudgetsController],
  providers: [BudgetsService,LocationService],
  exports: [BudgetsService],
})
export class BudgetsModule {}