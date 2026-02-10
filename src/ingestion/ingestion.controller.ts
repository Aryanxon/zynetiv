import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { VehicleTelemetryDto } from './dto/vehicle-telemetry.dto';
import { MeterTelemetryDto } from './dto/meter-telemetry.dto';

@Controller('v1/ingest')
export class IngestionController {
  constructor(private eventEmitter: EventEmitter2) {}

  @Post('vehicle')
  @HttpCode(HttpStatus.ACCEPTED) // Returns 202: "I've accepted it, processing later"
  handleVehicleData(@Body() data: VehicleTelemetryDto) {
    // This is the Async "Emit & Forget" part
    this.eventEmitter.emit('telemetry.vehicle', data);
    return { status: 'accepted', timestamp: new Date() };
  }

  @Post('meter')
  @HttpCode(HttpStatus.ACCEPTED)
  handleMeterData(@Body() data: MeterTelemetryDto) {
    this.eventEmitter.emit('telemetry.meter', data);
    return { status: 'accepted', timestamp: new Date() };
  }
}