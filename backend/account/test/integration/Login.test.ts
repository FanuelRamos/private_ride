import AccountRepository from "../../src/application/repository/AccountRepository";
import Login from "../../src/application/usecase/Login";
import Signup from "../../src/application/usecase/Signup";
import Connection from "../../src/infra/database/Connection";
import PgPromiseAdapter from "../../src/infra/database/PgPromiseAdapter";
import AccountRepositoryDatabase from "../../src/infra/repository/AccountRepositoryDatabase";

let connection: Connection;
let accountRepository: AccountRepository;
let signup: Signup;
let login: Login;

beforeEach(function () {
  connection = new PgPromiseAdapter();
  accountRepository = new AccountRepositoryDatabase(connection);
  signup = new Signup(accountRepository);
  login = new Login(accountRepository);
});

test("Deve fazer um login", async () => {
  const inputSingnup: any = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "95818705552",
    isPassenger: true,
    password: "123456",
  };
  await signup.execute(inputSingnup);
  const inputLogin = {
    email: inputSingnup.email,
    password: inputSingnup.password,
    date: new Date("2022-02-02T10:00:00")
  }
  const outputLogin = await login.execute(inputLogin);
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcGYiOiI5NTgxODcwNTU1MiIsImlhdCI6MTY0Mzc5MjQwMDAwMCwiZXhwaXJlc0luIjoiMWQifQ.4u18CRTDMfmMPFF0LMl00euIUPJoPLD59I15ge5EonU";
  expect(outputLogin.token).toBe(token);
});

afterEach(async function () {
  await connection.close();
});

