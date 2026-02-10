import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { VehicleTelemetryDto } from './dto/vehicle-telemetry.dto';
import { MeterTelemetryDto } from './dto/meter-telemetry.dto';
import { DeviceStatus } from 'src/database/entities/deviceStatus.entity';
import { TelemetryHistory } from 'src/database/entities/telemetryHistory.entity';

@Injectable()
export class IngestionService {
  constructor(
    @InjectRepository(DeviceStatus)
    private hotRepo: Repository<DeviceStatus>,
    @InjectRepository(TelemetryHistory)
    private coldRepo: Repository<TelemetryHistory>,
  ) {}

  @OnEvent('telemetry.vehicle')
  async handleVehicleTelemetry(data: VehicleTelemetryDto) {
    const { vehicleId, soc, kwhDeliveredDc, timestamp } = data;

    // We run both saves at the same time for maximum speed
    await Promise.all([
      // 1. THE HOT PATH (UPSERT)
      // "On conflict of deviceId, just update the values"
      this.hotRepo.upsert(
        {
          deviceId: vehicleId,
          type: 'VEHICLE',
          soc: soc,
          lastKwh: kwhDeliveredDc,
          lastUpdated: new Date(timestamp),
        },
        ['deviceId'], 
      ),

      // 2. THE COLD PATH (INSERT)
      // Just append a new row to the giant history log
      this.coldRepo.save({
        deviceId: vehicleId,
        type: 'VEHICLE',
        value: kwhDeliveredDc,
        soc: soc,
        timestamp: new Date(timestamp),
      }),
    ]);
  }

  @OnEvent('telemetry.meter')
  async handleMeterTelemetry(data: MeterTelemetryDto) {
    const { meterId, kwhConsumedAc, timestamp } = data;

    await Promise.all([
      // HOT PATH
      this.hotRepo.upsert(
        {
          deviceId: meterId,
          type: 'METER',
          lastKwh: kwhConsumedAc,
          lastUpdated: new Date(timestamp),
        },
        ['deviceId'],
      ),

      // COLD PATH
      this.coldRepo.save({
        deviceId: meterId,
        type: 'METER',
        value: kwhConsumedAc,
        timestamp: new Date(timestamp),
      }),
    ]);
  }
}