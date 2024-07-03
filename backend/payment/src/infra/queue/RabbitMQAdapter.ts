import Queue from "./Queue";
import amqp from 'amqplib';

export default class RabbitMQAdapter implements Queue {
  async publish(queue: string, message: any): Promise<any> {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue(queue);
    await channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  }

  async consume(queue: string, callback: Function): Promise<any> {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue(queue);
    await channel.consume(queue, async (message) => {
      if (message !== null) {
        await callback(message.content.toString());
        channel.ack(message);
      }
    })
  }
}