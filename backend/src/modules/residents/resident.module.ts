import { Module } from '@nestjs/common';
import { ResidentService } from './application/services/resident.service';
import { ResidentController } from './infrastructure/controllers/resident.controller';
import { PrismaResidentRepository } from './infrastructure/repositories/resident.repository';
import { ResidentRepository } from './domain/interfaces/resident.interface';
import { PrismaService } from '../../shared/infrastructure/database/prisma.service';

@Module({
  controllers: [ResidentController],
  providers: [
    ResidentService,
    PrismaService,
    {
      provide: ResidentRepository,
      useClass: PrismaResidentRepository,
    },
  ],
  exports: [ResidentService, ResidentRepository],
})
export class ResidentModule {}
