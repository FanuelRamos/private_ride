import RequesetRide from "../../application/usecase/RequestRide";
import inject from "../di/Inject";
import Queue from "../queue/Queue";

export default class QueueController {
  @inject("queue")
  queue?: Queue;
  @inject("requestRide")
  requestRide?: RequesetRide;

  constructor () {
    this.queue?.consume('requestRide', async (message: any) => {
      await this.requestRide?.execute(message);
    });
  }
}