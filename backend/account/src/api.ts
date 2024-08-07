import Signup from "./application/usecase/Signup";
import GetAccount from "./application/usecase/GetAccount";
import PgPromiseAdapter from "./infra/database/PgPromiseAdapter";
import AccountRepositoryDatabase from "./infra/repository/AccountRepositoryDatabase";
import ExpressAdapter from "./infra/http/ExpressAdapter";
import MainController from "./infra/controller/MainController";
import RepositoryDatabaseFactory from "./infra/factory/RepositoryDatabaseFactory";
import Registry from "./infra/di/Registry";


const connection = new PgPromiseAdapter();
const accountRepository = new AccountRepositoryDatabase(connection);
const repositoryFactory = new RepositoryDatabaseFactory(connection);
const signup = new Signup(accountRepository);
const getAccount = new GetAccount(accountRepository);
const httpServer = new ExpressAdapter();
Registry.getInstance().provide("signup", signup);
Registry.getInstance().provide("getAccount", getAccount);
new MainController(httpServer);
httpServer.listen(3300);