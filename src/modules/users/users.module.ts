import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { LocationService } from '~/common/utils';

@Module({
  controllers: [UsersController],
  providers: [UsersService, LocationService],
  exports: [UsersService],
})
export class UsersModule {}

