import AccountDAO from "../../src/application/repository/AccountDAO";
import AccountDAODatabase from "../../src/infra/repository/AccountDAODatabase";
import AccountDAOMemory from "../../src/infra/repository/AccountDAOMemory";
import Connection from "../../src/infra/database/Connection";
import GetAccount from "../../src/application/usecase/GetAccount";
import PgPromiseAdapter from "../../src/infra/database/PgPromiseAdapter";
import Signup from "../../src/application/usecase/Signup";


let connection: Connection;
let accountDAO: AccountDAO;
let signup: Signup;
let getAccount: GetAccount;

beforeEach(function () {
	connection = new PgPromiseAdapter();
	accountDAO = new AccountDAODatabase(connection);
	signup = new Signup(accountDAO);
	getAccount = new GetAccount(accountDAO);
});

test("Deve criar um passageiro", async function () {
	const input: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true
	}
	const output = await signup.execute(input);
	const account = await getAccount.execute(output.accountId);
	expect(account?.accountId).toBeDefined();
	expect(account?.name).toBe(input.name);
	expect(account?.email).toBe(input.email);
	expect(account?.cpf).toBe(input.cpf);
});

test("Não deve criar um passageiro com cpf inválido", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705500",
		isPassenger: true,
		isDriver: false,
		carPlate: ""
	}
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid cpf"));
});

test("Não deve criar um passageiro com nome inválido", async function () {
	const input = {
    name: "John",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "95818705552",
    isPassenger: true,
    isDriver: false,
    carPlate: "",
  };
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid name"));
});

test("Não deve criar um passageiro com email inválido", async function () {
	const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}`,
    cpf: "95818705552",
    isPassenger: true,
    isDriver: false,
    carPlate: "",
  };
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid email"));
});

test("Não deve criar um passageiro com conta existente", async function () {
	const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "95818705552",
    isPassenger: true,
    isDriver: false,
    carPlate: "",
  };
	await signup.execute(input);
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Account already exists"));
});

test("Deve criar um motorista", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: false,
		carPlate: "AAA9999",
		isDriver: true
	}
	const output = await signup.execute(input);
	expect(output.accountId).toBeDefined();
});

test("Não deve criar um motorista com place do carro inválida", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: false,
		carPlate: "AAA999",
		isDriver: true
	}
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid plate"));
});

test("Deve criar um passageiro com fake", async function () {
	const accountDAO = new AccountDAOMemory();
	const input: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true,
		isDriver: false,
		carPlate: ""
	}
	const signup = new Signup(accountDAO);
	const output = await signup.execute(input);
	const getAccount = new GetAccount(accountDAO);
	const account = await getAccount.execute(output.accountId);
	expect(account?.accountId).toBeDefined();
	expect(account?.name).toBe(input.name);
	expect(account?.email).toBe(input.email);
	expect(account?.cpf).toBe(input.cpf);
})

afterEach(async function () {
  await connection.close();
});