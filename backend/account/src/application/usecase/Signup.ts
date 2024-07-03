import CpfValidator from "../../domain/CpfValidator";
import AccountRepository from "../repository/AccountRepository";
import MailerGateway from "../../infra/gateway/MailerGateway";
import AccountRepositoryDatabase from "../../infra/repository/AccountRepositoryDatabase";
import Account from "../../domain/Account";

export default class Signup {
	cpfValidator: CpfValidator;
	mailerGateway: MailerGateway;

	constructor (private readonly accountRepository: AccountRepository) {
		this.cpfValidator = new CpfValidator();
		this.mailerGateway = new MailerGateway();
	}


	async execute (input: Input) {
		const existingAccount = await this.accountRepository.getByEmail(input.email);
		if (existingAccount) throw new Error("Account already exists");
		const account = Account.create(input.name, input.email, input.cpf, input.isPassenger, input.isDriver, input.carPlate, input.password);
		await this.accountRepository.save(account);
		/*await this.mailerGateway.send(
      account.email.getValue(),
      "Verification",
      `Please verify your code at first login ${account.verificationCode}`
    );*/
		return {
      accountId: account.accountId,
    };
	}
}

type Input = {
	name: string,
	email: string,
	cpf: string,
	isPassenger: boolean,
	isDriver: boolean,
	carPlate: string,
	password?: string
}
