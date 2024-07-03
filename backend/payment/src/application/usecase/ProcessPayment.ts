import Queue from "../../infra/queue/Queue";

export default class ProcessPayment {
  constructor (private readonly queue: Queue) {}

  async execute(input: any): Promise<void> {
    console.log("processPayment", input);
    await this.queue.publish('paymentApproved', { paymentId: crypto.randomUUID() });
  }
}