import AccountDAO from "./AccountDAO";
import AccountDAODatabase from "./AccountDAODatabase";
import Ride from "./Ride";
import RideDAO from "./RideDAO";
import RideDAODatabase from "./RideDAODatabase";

export default class RideService {
  
  constructor (
    private readonly rideDAO: RideDAO = new RideDAODatabase(),
    private readonly accountDAO: AccountDAO = new AccountDAODatabase()  
  ) {}

  async requestRide (input: any) {
    const account = await this.accountDAO.getById(input.passengerId);
    if (!account?.isPassenger) throw new Error("Account is not from a passenger");
    const activeRides = await this.rideDAO.getActiveRidesByPassangerId(input.passengerId);
    if (activeRides.length > 0) throw new Error("This passenger already has an active ride");
    const ride = Ride.create(input.passengerId, input.from.lat, input.from.long, input.to.lat, input.to.long);
    await this.rideDAO.save(ride);
    return {
      rideId: ride.rideId
    }
  }
}