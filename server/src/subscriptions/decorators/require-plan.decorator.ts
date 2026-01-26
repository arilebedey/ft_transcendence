import { SetMetadata } from '@nestjs/common';
import type { Plan } from '../plan.types';

export const RequirePlan = (...plans: Plan[]) =>
  SetMetadata('required-plans', plans);
