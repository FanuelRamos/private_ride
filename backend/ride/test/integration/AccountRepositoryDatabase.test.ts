import crypto from "crypto";
import AccountRepository from "../../src/application/repository/AccountRepository";
import AccountRepositoryDatabase from "../../src/infra/repository/AccountRepositoryDatabase";
import Account from "../../src/domain/Account";
import Connection from "../../src/infra/database/Connection";
import PgPromiseAdapter from "../../src/infra/database/PgPromiseAdapter";

let connection: Connection;
let accountRepository: AccountRepository;

beforeEach(function () {
  connection = new PgPromiseAdapter();
  accountRepository = new AccountRepositoryDatabase(connection);
});

test("Deve criar um registro na tabela account e consultar por email", async function () {
  const account = Account.create("John Doe", `john.doe${Math.random()}@gmail.com`, "95818705552", true, false, "");
  await accountRepository.save(account);
  const savedAccount = await accountRepository.getByEmail(account.email.getValue());
  expect(savedAccount?.accountId).toBeDefined();
  expect(savedAccount?.name.getValue()).toBe(account.name.getValue());
  expect(savedAccount?.email).toEqual(account.email);
  expect(savedAccount?.cpf.getValue()).toBe(account.cpf.getValue());
  expect(savedAccount?.isPassenger).toBe(account.isPassenger);
  expect(savedAccount?.date).toBeDefined();
  expect(savedAccount?.verificationCode).toBe(account.verificationCode);
})

test("Deve criar um registro na tabela account e consultar por account_id", async function () {
  const account = Account.create("John Doe", `john.doe${Math.random()}@gmail.com`, "95818705552", true, false, "");
  await accountRepository.save(account);
  const savedAccount = await accountRepository.getById(account.accountId);
  expect(savedAccount?.accountId).toBeDefined();
  expect(savedAccount?.name.getValue()).toBe(account.name.getValue());
  expect(savedAccount?.email).toEqual(account.email);
  expect(savedAccount?.cpf.getValue()).toBe(account.cpf.getValue());
  expect(savedAccount?.isPassenger).toBe(account.isPassenger);
  expect(savedAccount?.date).toBeDefined();
  expect(savedAccount?.verificationCode).toBe(account.verificationCode);
});

afterEach(async function () {
  await connection.close();
})