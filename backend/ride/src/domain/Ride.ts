import crypto from "crypto";
import Coord from "./Coord";

export default class Ride {
  driverId?: string;
  private constructor(
    readonly rideId: string,
    readonly passengerId: string,
    private status: string,
    readonly from: Coord,
    readonly to: Coord,
    readonly date: Date
  ) {}

  static create(passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number) {
    const rideId = crypto.randomUUID();
    const status = "requested";
    const date = new Date();
    return new Ride(rideId, passengerId, status, new Coord(fromLat, fromLong), new Coord(toLat, toLong), date);
  }

  static restore(rideId: string, passengerId: string, driverId: string, status: string, fromLat: number, fromLong: number, toLat: number, toLong: number, date: Date) {
    const ride = new Ride(
      rideId,
      passengerId,
      status,
      new Coord(fromLat, fromLong),
      new Coord(toLat, toLong),
      date
    );
    ride.driverId = driverId;
    return ride;
  }

  accept(driverId: string) {
    if (this.status !== "requested") throw new Error("The ride is not requested");
    this.driverId = driverId;
    this.status = "accepted";
  }

  start() {
    this.status = "in_progress";
  }

  getStatus() {
    return this.status;
  }
}