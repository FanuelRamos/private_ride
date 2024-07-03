import HttpServer from "../http/HttpServer";
import RequesetRide from "../../application/usecase/RequestRide";
import GetRide from "../../application/usecase/GetRide";
import Registry from "../di/Registry";
import inject from "../di/Inject";
import Queue from "../queue/Queue";

export default class MainController {
	@inject("requestRide")
	requestRide?: RequesetRide;
	@inject("getRide")
	getRide?: GetRide;
	@inject("queue")
	queue?: Queue;

	constructor (readonly httpServer: HttpServer) {
		httpServer.on("post", "/request_ride", async function (params: any, body: any) {
			const output = await Registry.getInstance().inject("requestRide").execute(body);
			return output;
		});

		//Command handler - tempo de processamento (SLA), resiliente
		httpServer.on("post", "/request_ride_async", async (params: any, body: any) => {
			await this.queue?.publish("requestRide", body);
		});

		httpServer.on("get", "/rides/:rideId", async function (params: any, body: any) {
			const output = await Registry.getInstance().inject("getRide").execute(params.rideId);
			return output;
		});
	}
}