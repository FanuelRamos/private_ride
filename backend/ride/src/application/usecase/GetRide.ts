import RideRepository from "../repository/RideRepository";
import AccountRepository from "../repository/AccountRepository";

export default class GetRide {
  constructor(
    private readonly rideRepository: RideRepository,
    private readonly accountRepository: AccountRepository
  ) {}

  async execute(rideId: string): Promise<Output> {
    const ride = await this.rideRepository.getById(rideId);
    const account = await this.accountRepository.getById(ride.passengerId);
    if (!ride || !account) throw new Error();
    return {
      rideId: ride.rideId,
      passengerId: ride.passengerId,
      driverId: ride.driverId!,
      fromLat: ride.from.getLat(),
      fromLong: ride.from.getLong(),
      toLat: ride.to.getLat(),
      toLong: ride.to.getLong(),
      date: ride.date,
      status: ride.getStatus(),
      distance: ride.getDistance(),
      fare: ride.getFare(),
      passenger: {
        accountId: account.accountId,
        name: account.name.getValue(),
        email: account.email.getValue(),
        cpf: account.cpf.getValue(),
        carPlate: account.carPlate.getValue(),
        isPassenger: account.isPassenger,
        isDriver: account.isDriver,
      },
    };
  }
}

type Output = {
  rideId: string,
  passengerId: string,
  driverId: string,
  fromLat: number,
  fromLong: number,
  toLat: number,
  toLong: number,
  date: Date,
  status: string,
  distance: number,
  fare: number,
  passenger: {
    accountId: string,
    name: string,
    email: string,
    cpf: string,
    carPlate: string,
    isPassenger: boolean,
    isDriver: boolean
  }
}