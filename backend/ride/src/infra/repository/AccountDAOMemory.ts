import AccountRepository from "../../application/repository/AccountRepository";

export default class AccountRepositoryMemory implements AccountRepository {
  accounts: any[] = [];

  async save(account: any): Promise<void> {
    this.accounts.push(account);
  }
  async getByEmail(email: string): Promise<any> {
    const findedAccount = this.accounts.find(
      (account) => account.email === email
    );
    if (!findedAccount) return;
    findedAccount.account_id = findedAccount.accountId;
    return findedAccount;
  }
  getById(accountId: string): Promise<any> {
    const findedAccount = this.accounts.find(
      (account) => account.accountId === accountId
    );
    findedAccount.account_id = findedAccount.accountId;
    return findedAccount;
  }
}