import AccountDAO from "../repository/AccountDAO";
import AccountDAODatabase from "../../infra/repository/AccountDAODatabase";

export default class GetAccount {
  constructor(
    private readonly accountDAO: AccountDAO
  ) {}

  async execute(accountId: string) {
    const account = this.accountDAO.getById(accountId);
    return account;
  }
}
