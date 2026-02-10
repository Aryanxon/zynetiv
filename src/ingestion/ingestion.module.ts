import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { DeviceStatus } from 'src/database/entities/deviceStatus.entity';
import { TelemetryHistory } from 'src/database/entities/telemetryHistory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceStatus, TelemetryHistory])],
  controllers: [IngestionController],
  providers: [IngestionService],
})
export class IngestionModule {}