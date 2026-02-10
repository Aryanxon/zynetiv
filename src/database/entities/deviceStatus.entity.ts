import { Entity, Column, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('device_status')
export class DeviceStatus {
  @PrimaryColumn()
  deviceId: string;

  @Column()
  type: string; // 'METER' or 'VEHICLE'

  @Column({ type: 'float', nullable: true })
  soc: number;

  @Column({ type: 'float' })
  lastKwh: number;

  @UpdateDateColumn()
  lastUpdated: Date;
}