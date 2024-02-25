export default interface RideDAO {
  save(ride: any): Promise<void>;
  update(ride: any): Promise<void>;
  getRideById(rideId: string): Promise<any>;
  getActiveRidesByPassangerId(passengerId: string): Promise<any>;
  getActiveRidesByDriverId(driverId: string): Promise<any>;
}