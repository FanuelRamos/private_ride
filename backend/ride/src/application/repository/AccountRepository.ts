import Account from "../../domain/Account";

export default interface AccountRepository {
  save(account: Account): Promise<void>;
  getByEmail(email: string): Promise<Account | undefined>;
  getById(accountId: string): Promise<Account | undefined>;
}