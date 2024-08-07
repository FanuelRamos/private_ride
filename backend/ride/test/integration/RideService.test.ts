import AcceptRide from "../../src/application/usecase/AcceptRide";
import Connection from "../../src/infra/database/Connection";
import GetRide from "../../src/application/usecase/GetRide";
import PgPromiseAdapter from "../../src/infra/database/PgPromiseAdapter";
import RequesetRide from "../../src/application/usecase/RequestRide";
import RideRepository from "../../src/application/repository/RideRepository";
import RideRepositoryDatabase from "../../src/infra/repository/RideRepositoryDatabase";
import StartRide from "../../src/application/usecase/StartRide";
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
let connection: Connection;
let rideRepository: RideRepository;
let repositoryFactory: RepositoryFactory;

beforeEach(function () {
  connection = new PgPromiseAdapter();
  rideRepository = new RideRepositoryDatabase(connection);
  repositoryFactory = new RepositoryDatabaseFactory(connection);
  startRide = new StartRide(rideRepository);
  accountGateway = new AccountGatewayHttp(new AxiosAdapter());
  requestRide = new RequesetRide(repositoryFactory, accountGateway);
  acceptRide = new AcceptRide(repositoryFactory, accountGateway);
  getRide = new GetRide(rideRepository, accountGateway);
})

test("Deve solicitar e consutar uma corrida", async function () {
  const inputSignup: any = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "95818705552",
    isPassenger: true,
  };

  const outputSignup = await accountGateway.signup(inputSignup);
  const inputRequestRide: any = {
    passengerId: outputSignup.accountId,
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
  const outputGetRide = await getRide.execute(outputRequestRide.rideId);
  expect(outputGetRide.status).toBe("requested");
  expect(outputGetRide.passengerId).toBe(outputSignup.accountId);
  expect(outputGetRide.fromLat).toBe(inputRequestRide.from.lat);
  expect(outputGetRide.fromLong).toBe(inputRequestRide.from.long);
  expect(outputGetRide.toLat).toBe(inputRequestRide.to.lat);
  expect(outputGetRide.toLong).toBe(inputRequestRide.to.long);
  expect(outputGetRide.date).toBeDefined();
});

test("Deve solicitar e aceitar uma corrida", async function () {
  const inputSignupPassenger: any = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "95818705552",
    isPassenger: true,
  };
  const outputSignupPassenger = await accountGateway.signup(inputSignupPassenger);
  const inputRequestRide: any = {
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
  const inputAcceptRide: any = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId
  };
  await acceptRide.execute(inputAcceptRide);
  const outputGetRide = await getRide.execute(outputRequestRide.rideId);
  expect(outputGetRide.status).toBe("accepted");
  expect(outputGetRide.driverId).toBe(outputSignupDriver.accountId);
});

test("Caso uma corrida seja solicitada por uma conta que não seja de passageiro deve lançar um erro", async function () {
  const inputSignup: any = {
  name: "John Doe",
  email: `john.doe${Math.random()}@gmail.com`,
  cpf: "95818705552",
    carPlate: "AAA9999",
    isDriver: true,
  };
  const outputSignup = await accountGateway.signup(inputSignup);
  const inputRequestRide: any = {
    passengerId: outputSignup.accountId,
    from: {
      lat: -27.584905257808835,
      long: -48.545022195325124,
    },
    to: {
      lat: -27.496887588317275,
      long: -48.522234807851476,
    },
  };

  await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(
    new Error("Account is not from a passenger")
  );
});

test("Caso uma corrida seja solicitada por um passageiro e ele já tenha outra corrida em andamento deve lançar um erro", async function () {
  const inputSignup: any = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "95818705552",
    isPassenger: true,
  };
  const outputSignup = await accountGateway.signup(inputSignup);
  const inputRequestRide: any = {
    passengerId: outputSignup.accountId,
    from: {
      lat: -27.584905257808835,
      long: -48.545022195325124,
    },
    to: {
      lat: -27.496887588317275,
      long: -48.522234807851476,
    },
  };
  await requestRide.execute(inputRequestRide);
  await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(
    new Error("This passenger already has an active ride")
  );
});

test("Caso uma corrida seja aceite por uma conta que não seja de driver deve lançar um erro", async function () {
  const inputSignupPassenger: any = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "95818705552",
    isPassenger: true,
  };
  const outputSignupPassenger = await accountGateway.signup(
    inputSignupPassenger
  );
  const inputRequestRide: any = {
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
    isPassenger: true,
  };
  const outputSignupDriver = await accountGateway.signup(inputSignupDriver);
  const inputAcceptRide: any = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
  };
  await expect(() => acceptRide.execute(inputAcceptRide)).rejects.toThrow(new Error("Account is not from a driver"));
});

test("Não deve aceitar uma corrida se o status da corrida for requested", async function () {
  const inputSignupPassenger: any = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "95818705552",
    isPassenger: true,
  };
  const outputSignupPassenger = await accountGateway.signup(
    inputSignupPassenger
  );
  const inputRequestRide: any = {
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
  const inputAcceptRide: any = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
  };
  await acceptRide.execute(inputAcceptRide);
  await expect(() => acceptRide.execute(inputAcceptRide)).rejects.toThrow(
    new Error("Invalid status")
  );
});

test("Não deve aceitar uma corrida se o motorista já tiver outra corrida em andamento", async function () {
  const inputSignupPassenger1: any = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "95818705552",
    isPassenger: true,
  };
  const outputSignupPassenger1 = await accountGateway.signup(
    inputSignupPassenger1
  );
  const inputRequestRide1 = {
    passengerId: outputSignupPassenger1.accountId,
    from: {
      lat: -27.584905257808835,
      long: -48.545022195325124,
    },
    to: {
      lat: -27.496887588317275,
      long: -48.522234807851476,
    },
  };
  const inputSignupPassenger2: any = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "95818705552",
    isPassenger: true,
  };
  const outputSignupPassenger2 = await accountGateway.signup(
    inputSignupPassenger2
  );
  const inputRequestRide2 = {
    passengerId: outputSignupPassenger2.accountId,
    from: {
      lat: -27.584905257808835,
      long: -48.545022195325124,
    },
    to: {
      lat: -27.496887588317275,
      long: -48.522234807851476,
    },
  };
  const outputRequestRide1 = await requestRide.execute(inputRequestRide1);
  const outputRequestRide2 = await requestRide.execute(inputRequestRide2);

  const inputSignupDriver: any = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "95818705552",
    carPlate: "AAA9999",
    isDriver: true,
  };
  const outputSignupDriver = await accountGateway.signup(inputSignupDriver);
  const inputAcceptRide1 = {
    rideId: outputRequestRide1.rideId,
    driverId: outputSignupDriver.accountId,
  };
  const inputAcceptRide2 = {
    rideId: outputRequestRide2.rideId,
    driverId: outputSignupDriver.accountId,
  };
  await acceptRide.execute(inputAcceptRide1);
  await expect(() => acceptRide.execute(inputAcceptRide2)).rejects.toThrow(
    "Driver is already in another ride"
  );
});

test("Deve solicitar, aceitar e iniciar uma corrida", async function () {
	const inputSignupPassenger: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true
	}
	const outputSignupPassenger = await accountGateway.signup(inputSignupPassenger);
	const inputRequestRide = {
		passengerId: outputSignupPassenger.accountId,
		from: {
			lat: -27.584905257808835,
			long: -48.545022195325124
		},
		to: {
			lat: -27.496887588317275,
			long: -48.522234807851476
		}
	}
	const outputRequestRide = await requestRide.execute(inputRequestRide);
	const inputSignupDriver: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		carPlate: "AAA9999",
		isDriver: true
	}
	const outputSignupDriver = await accountGateway.signup(inputSignupDriver);
	const inputAcceptRide = {
		rideId: outputRequestRide.rideId,
		driverId: outputSignupDriver.accountId
	}
	await acceptRide.execute(inputAcceptRide);
	const inputStartRide = {
		rideId: outputRequestRide.rideId,
	};
	await startRide.execute(inputStartRide);
	const outputGetRide = await getRide.execute(outputRequestRide.rideId);
	expect(outputGetRide.status).toBe("in_progress");
	expect(outputGetRide.driverId).toBe(outputSignupDriver.accountId);
});

afterEach(async function () {
  await connection.close();
});