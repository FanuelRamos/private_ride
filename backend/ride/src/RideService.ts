import AccountDAO from "./AccountDAO";
import AccountDAODatabase from "./AccountDAODatabase";
import RideDAO from "./RideDAO";
import RideDAODatabase from "./RideDAODatabase";

export default class RideService {
  
  constructor (
    private readonly rideDAO: RideDAO = new RideDAODatabase(),
    private readonly accountDAO: AccountDAO = new AccountDAODatabase()  
  ) {}

  async requestRide (input: any) {
    const account = await this.accountDAO.getById(input.passengerId);
    if (!account.is_passenger) throw new Error("Account is not from a passenger");
    const activeRides = await this.rideDAO.getActiveRidesByPassangerId(input.passengerId);
    if (activeRides.length > 0) throw new Error("This passenger already has an active ride");
    const rideId = crypto.randomUUID();
    const ride = {
      rideId,
      passengerId: input.passengerId,
      from: {
        lat: input.from.lat,
        long: input.from.long
      },
      to: {
        lat: input.to.lat,
        long: input.to.long
      },
      status: "requested",
      date: new Date()
    };
    await this.rideDAO.save(ride);
    return {
      rideId
    }
  }

  async acceptRide (input: any) {
    const account = await this.accountDAO.getById(input.driverId);
    if (!account.is_driver) throw new Error("Account is not from a driver");
    const ride = await this.rideDAO.getRideById(input.rideId);
    if (ride.status !== "requested") throw new Error("The ride is not requested");
    const activeRides = await this.rideDAO.getActiveRidesByDriverId(input.driverId);
    if (activeRides.length > 0) throw new Error("Driver is already in another ride");
    ride.rideId = input.rideId;
    ride.status = "accepted";
    ride.driverId = input.driverId;
    await this.rideDAO.update(ride);
  }

  async getRide (rideId: string) {
    const ride = await this.rideDAO.getRideById(rideId);
    return ride;
  }
}