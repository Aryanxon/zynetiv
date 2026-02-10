# High-Scale Energy Ingestion Engine

## 1. Executive Summary
A high-performance NestJS ingestion layer designed to process telemetry from 10,000+ devices reporting every 60 seconds (14.4M records/day). The system calculates the "Power Loss Thesis" by correlating AC grid consumption with DC battery delivery.

## 2. Architectural Choices

### Event-Driven Ingestion
To handle high-velocity streams without blocking the API, I implemented an **Event-Driven Architecture** using `EventEmitter2`. 
- The Controller validates the payload and immediately returns a `202 Accepted` status.
- Background workers process the data asynchronously, ensuring the system can scale horizontally under heavy load.

### Hot vs. Cold Storage Strategy
I utilized a dual-persistence strategy to optimize both writes and reads:
- **Operational Store (Hot):** Uses **UPSERT** logic on the `device_status` table. This provides an atomic, real-time view of any device's "Current Status" without scanning millions of historical rows.
- **Historical Store (Cold):** Uses an **Append-Only (INSERT)** approach in the `telemetry_history` table to build a permanent audit trail for long-term analytics.

### Performance & Indexing
To satisfy the constraint of avoiding "Full Table Scans" on 14.4M+ records:
- A **Composite B-Tree Index** was implemented on `(device_id, timestamp)`. 
- This ensures that 24-hour analytical queries remain $O(\log n)$ performance, even as the database grows to billions of rows.



## 3. Data Correlation & Power Loss
The system correlates `meterId` and `vehicleId` through a shared identifier. By aggregating the last 24 hours of data, we calculate the **Efficiency Ratio**:
- **Formula:** `(Total DC Delivered / Total AC Consumed) * 100`
- **Logic:** An efficiency below 85% automatically flags a `FAULT_DETECTED` status, indicating energy leakage or hardware failure.

## 4. How to Run
1. Ensure you have Docker installed.
2. Run `docker-compose up --build`.
3. The API will be available at `http://localhost:3000`.