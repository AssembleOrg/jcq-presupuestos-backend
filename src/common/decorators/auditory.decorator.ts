import { SetMetadata } from '@nestjs/common';

export const AUDITORY_KEY = 'auditory';

export interface AuditoryOptions {
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'READ';
  entity: string;
}

export const Auditory = (options: AuditoryOptions) => SetMetadata(AUDITORY_KEY, options);

