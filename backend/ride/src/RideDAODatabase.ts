import pgp from "pg-promise";
import RideDAO from "./RideDAO";

export default class RideDAODatabase implements RideDAO {
  async save(ride: any): Promise<void> {
    const connection = pgp()("postgres://postgres:@localhost:5432/cccat13");
    await connection.query(
      "insert into ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date) values ($1, $2, $3, $4, $5, $6, $7, $8)",
      [
        ride.rideId,
        ride.passengerId,
        ride.from.lat,
        ride.from.long,
        ride.to.lat,
        ride.to.long,
        ride.status,
        ride.date,
      ]
    );
    await connection.$pool.end();
  }
  async update(ride: any): Promise<void> {
    const connection = pgp()("postgres://postgres:@localhost:5432/cccat13");
    await connection.query(
      "update ride set driver_id = $1, status = $2 where ride_id = $3",
      [ride.driverId, ride.status, ride.rideId]
    );
    await connection.$pool.end();
  }
  async getRideById(rideId: string): Promise<any> {
    const connection = pgp()("postgres://postgres:@localhost:5432/cccat13");
    const [rideData] = await connection.query(
      "select * from ride where ride_id = $1",
      [rideId]
    );
    await connection.$pool.end();
    return rideData;
  }

  async getActiveRidesByPassangerId(passengerId: string): Promise<any> {
    const connection = pgp()("postgres://postgres:@localhost:5432/cccat13");
    const ridesData = await connection.query(
      "select * from ride where passenger_id = $1 and status in ('requested', 'accepted', 'in_progress')",
      [passengerId]
    );
    await connection.$pool.end();
    return ridesData;
  }

  async getActiveRidesByDriverId(driverId: string): Promise<any> {
    const connection = pgp()("postgres://postgres:@localhost:5432/cccat13");
    const ridesData = await connection.query(
      "select * from ride where driver_id = $1 and status in ('accepted', 'in_progress')",
      [driverId]
    );
    await connection.$pool.end();
    return ridesData;
  }
}
