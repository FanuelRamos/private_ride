import Ride from "../../domain/Ride";
import RideRepository from "../repository/RideRepository";
import RepositoryFactory from "../factory/RepositoryFactory";
import AccountGateway from "../gateway/AccountGateway";

export default class RequesetRide {
  rideRepository: RideRepository;

  constructor (private readonly repositoryFactory: RepositoryFactory, private readonly accountGateway: AccountGateway) {
    this.rideRepository = repositoryFactory.createRideRepository();
  }

  async execute (input: Input) {
    const account = await this.accountGateway.getById(input.passengerId);
    if (!account?.isPassenger) throw new Error("Account is not from a passenger");
    const activeRides = await this.rideRepository.getActiveRidesByPassangerId(input.passengerId);
    if (activeRides.length > 0) throw new Error("This passenger already has an active ride");
    const ride = Ride.create(input.passengerId, input.from.lat, input.from.long, input.to.lat, input.to.long);
    await this.rideRepository.save(ride);
    return {
      rideId: ride.rideId
    }
  }
}

type Input = {
  passengerId: string
  from: {
    lat: number
    long: number
  }
  to: {
    lat: number
    long: number
  }
}