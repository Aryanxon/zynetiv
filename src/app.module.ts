import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IngestionModule } from './ingestion/ingestion.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
@Module({
  imports: [
    // 1. Initialize ConfigModule first so .env variables are loaded
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(), 
    // 2. Put your Database Configuration here
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DATABASE_HOST'),
        port: config.get<number>('DATABASE_PORT') || 5432,
        username: config.get<string>('DATABASE_USER'),
        password: config.get<string>('DATABASE_PASSWORD'),
        database: config.get<string>('DATABASE_NAME'),
        autoLoadEntities: true,
        synchronize: true, // Auto-creates tables based on your entities
        ssl: {
          rejectUnauthorized: false, // Essential for Neon cloud DB
        },
      }),
    }),

    // 3. Import your feature modules
    IngestionModule,
    AnalyticsModule,
  ],
})
export class AppModule {}