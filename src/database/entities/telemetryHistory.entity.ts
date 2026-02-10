import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('telemetry_history')
@Index(['deviceId', 'timestamp']) 
export class TelemetryHistory {
  @PrimaryGeneratedColumn() 
  id: number;

  @Column()
  deviceId: string;

  @Column()
  type: string;

  @Column({ type: 'float' })
  value: number;

  @Column({ type: 'float', nullable: true })
  soc: number;

  @Column({ type: 'float', nullable: true })
  batteryTemp: number; 

  @Column()
  timestamp: Date;
}