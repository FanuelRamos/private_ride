import AcceptRide from "../../src/application/usecase/AcceptRide";
import Connection from "../../src/infra/database/Connection";
import GetRide from "../../src/application/usecase/GetRide";
import PgPromiseAdapter from "../../src/infra/database/PgPromiseAdapter";
import RequesetRide from "../../src/application/usecase/RequestRide";
import RideRepository from "../../src/application/repository/RideRepository";
import RideRepositoryDatabase from "../../src/infra/repository/RideRepositoryDatabase";
import StartRide from "../../src/application/usecase/StartRide";
import UpdatePosition from "../../src/application/usecase/UpdatePosition";
import PositionRepository from "../../src/application/repository/PositionRepository";
import PositionRepositoryDatabase from "../../src/infra/repository/PositionRepositoryDatabase";
import RepositoryFactory from "../../src/application/factory/RepositoryFactory";
import RepositoryDatabaseFactory from "../../src/infra/factory/RepositoryDatabaseFactory";
import AccountGateway from "../../src/application/gateway/AccountGateway";
import AccountGatewayHttp from "../../src/infra/gateway/AccountGatewayHttp";
import AxiosAdapter from "../../src/infra/http/AxiosAdapter";

let accountGateway: AccountGateway;
let requestRide: RequesetRide;
let acceptRide: AcceptRide;
let getRide: GetRide;
let startRide: StartRide;
let updatePosition: UpdatePosition;
let connection: Connection;
let rideRepository: RideRepository;
let repositoryFactory: RepositoryFactory;
let positionRepository: PositionRepository;

beforeEach(function () {
  connection = new PgPromiseAdapter();
  rideRepository = new RideRepositoryDatabase(connection);
  repositoryFactory = new RepositoryDatabaseFactory(connection);
  startRide = new StartRide(rideRepository);
  positionRepository = new PositionRepositoryDatabase(connection);
  accountGateway = new AccountGatewayHttp(new AxiosAdapter());
  requestRide = new RequesetRide(repositoryFactory, accountGateway);
  acceptRide = new AcceptRide(repositoryFactory, accountGateway);
  updatePosition = new UpdatePosition(rideRepository, positionRepository);
  getRide = new GetRide(rideRepository, accountGateway);
});

test("Deve solicitar, aceitar, iniciar e actualizar a posição de uma corrida", async function () {
  const inputSignupPassenger: any = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "95818705552",
    isPassenger: true,
  };
  const outputSignupPassenger = await accountGateway.signup(inputSignupPassenger);
  const inputRequestRide = {
    passengerId: outputSignupPassenger.accountId,
    from: {
      lat: -27.584905257808835,
      long: -48.545022195325124,
    },
    to: {
      lat: -27.496887588317275,
      long: -48.522234807851476,
    },
  };
  const outputRequestRide = await requestRide.execute(inputRequestRide);
  const inputSignupDriver: any = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "95818705552",
    carPlate: "AAA9999",
    isDriver: true,
  };
  const outputSignupDriver = await accountGateway.signup(inputSignupDriver);
  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
  };
  await acceptRide.execute(inputAcceptRide);
  const inputStartRide = {
    rideId: outputRequestRide.rideId,
  };
  await startRide.execute(inputStartRide);
  const inputUpdatePosition1 = {
    rideId: outputRequestRide.rideId,
    lat: -27.584905257808835,
    long: -48.545022195325124,
  }
  await updatePosition.execute(inputUpdatePosition1);
  const inputUpdatePosition2 = {
    rideId: outputRequestRide.rideId,
    lat: -27.496887588317275,
    long: -48.522234807851476,
  }
  await updatePosition.execute(inputUpdatePosition2);
  const outputGetRide = await getRide.execute(outputRequestRide.rideId);
  expect(outputGetRide.status).toBe("in_progress");
  // expect(outputGetRide.distance).toBe(10);
});

afterEach(async function () {
  await connection.close();
});
