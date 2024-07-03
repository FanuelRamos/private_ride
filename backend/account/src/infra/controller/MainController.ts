import GetAccount from "../../application/usecase/GetAccount";
import HttpServer from "../http/HttpServer";
import Signup from "../../application/usecase/Signup";
import Registry from "../di/Registry";
import inject from "../di/Inject";

export default class MainController {
	@inject("signup")
	signup?: Signup;
	@inject("getAccount")
	getAccount?: GetAccount;

	constructor (readonly httpServer: HttpServer) {
		httpServer.on("post", "/signup", async (params: any, body: any) => {
			console.log(body);
			const output = await this.signup?.execute(body);
			return output;
		});

		httpServer.on("get", "/accounts/:accountId", async function (params: any, body: any) {
			const output = await Registry.getInstance().inject("getAccount").execute(params.accountId);
			return output;
		});
	}
}