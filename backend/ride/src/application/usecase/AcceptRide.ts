import AccountRepository from "../repository/AccountRepository";
import RideRepository from "../repository/RideRepository";

export default class AcceptRide {
  constructor(
    private readonly rideRepository: RideRepository,
    private readonly accountRepository: AccountRepository
  ) {}

  async execute(input: Input) {
    const account = await this.accountRepository.getById(input.driverId);
    if (!account?.isDriver) throw new Error("Account is not from a driver");
    const ride = await this.rideRepository.getById(input.rideId);
    ride.accept(input.driverId);
    const activeRides = await this.rideRepository.getActiveRidesByDriverId(
      input.driverId
    );
    if (activeRides.length > 0)
      throw new Error("Driver is already in another ride");
    await this.rideRepository.update(ride);
  }
}

type Input = {
  driverId: string,
  rideId: string
}
