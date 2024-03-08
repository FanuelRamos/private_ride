import Ride from "../../domain/Ride";

export default interface RideDAO {
  save(ride: Ride): Promise<void>;
  update(ride: Ride): Promise<void>;
  getById(rideId: string): Promise<Ride>;
  getActiveRidesByPassangerId(passengerId: string): Promise<any>;
  getActiveRidesByDriverId(driverId: string): Promise<any>;
}