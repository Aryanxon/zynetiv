import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TelemetryHistory } from 'src/database/entities/telemetryHistory.entity';
import { Repository, Between } from 'typeorm';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(TelemetryHistory)
    private readonly coldRepo: Repository<TelemetryHistory>,
  ) {}

  async getVehiclePerformance(vehicleId: string) {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // This query uses the INDEX we created! 
    // It only looks at the last 24 hours for this specific ID.
    const logs = await this.coldRepo.find({
      where: {
        deviceId: vehicleId,
        timestamp: Between(twentyFourHoursAgo, new Date()),
      },
      order: { timestamp: 'ASC' },
    });

    if (logs.length === 0) {
      throw new NotFoundException('No data found for this vehicle in the last 24 hours');
    }

    // Math Logic: Calculate total energy and average temperature
    let totalDc = 0;
    let totalTemp = 0;
    let tempCount = 0;

    logs.forEach(log => {
        totalDc += log.value;
        if(log.batteryTemp) {
            totalTemp += log.batteryTemp;
            tempCount++;
        }
    });

    // For the assignment, you'd ideally correlate this with Meter data.
    // Here we assume a simplified efficiency calculation for the demo:
    const avgTemp = tempCount > 0 ? totalTemp / tempCount : 0;
    
    return {
      vehicleId,
      totalEnergyDeliveredDc: totalDc,
      averageBatteryTemp: avgTemp,
      period: 'last 24 hours'
    };
  }
}