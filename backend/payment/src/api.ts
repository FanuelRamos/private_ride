import ExpressAdapter from "./infra/http/ExpressAdapter";
import MainController from "./infra/controller/MainController";
import Registry from "./infra/di/Registry";
import ProcessPayment from "./application/usecase/ProcessPayment";
import RabbitMQAdapter from "./infra/queue/RabbitMQAdapter";
import QueueController from "./infra/controller/QueueController";

const httpServer = new ExpressAdapter();
const queue = new RabbitMQAdapter();
const processPayment = new ProcessPayment(queue);
Registry.getInstance().provide('queue', queue);
Registry.getInstance().provide('processPayment', processPayment);
new MainController(httpServer);
new QueueController();
httpServer.listen(3302);