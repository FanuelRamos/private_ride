export default interface Queue {
  publish (queue: string, message: any): Promise<any>;
  consume (queue: string, callback: Function): Promise<any>;
}