import { PartialType } from '@nestjs/mapped-types';
import { CreateCollaboratorDTO } from './create-collaborator.dto';

export class UpdateCollaboratorDto extends PartialType(CreateCollaboratorDTO) {}