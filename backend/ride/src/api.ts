import Signup from "./application/usecase/Signup";
import GetAccount from "./application/usecase/GetAccount";
import PgPromiseAdapter from "./infra/database/PgPromiseAdapter";
import AccountRepositoryDatabase from "./infra/repository/AccountRepositoryDatabase";
import ExpressAdapter from "./infra/http/ExpressAdapter";
import MainController from "./infra/controller/MainController";


const connection = new PgPromiseAdapter();
const accountRepository = new AccountRepositoryDatabase(connection);
const signup = new Signup(accountRepository);
const getAccount = new GetAccount(accountRepository);
const httpServer = new ExpressAdapter();
new MainController(httpServer, signup, getAccount);
httpServer.listen(3000);