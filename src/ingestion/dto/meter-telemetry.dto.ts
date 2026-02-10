import { IsString, IsNumber, IsISO8601 } from 'class-validator';

export class MeterTelemetryDto {
  @IsString()
  meterId: string;

  @IsNumber()
  kwhConsumedAc: number;

  @IsNumber()
  voltage: number;

  @IsISO8601()
  timestamp: string;
}