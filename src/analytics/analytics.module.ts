import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { TelemetryHistory } from 'src/database/entities/telemetryHistory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TelemetryHistory])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}