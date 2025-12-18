import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkRecordDto } from './create-work-record.dto';

export class UpdateWorkRecordDto extends PartialType(CreateWorkRecordDto) {}