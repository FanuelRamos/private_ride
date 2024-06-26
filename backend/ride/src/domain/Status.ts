import Ride from "./Ride";

export default abstract class Status {
  abstract value: string;

  constructor (readonly ride: Ride) {}

  abstract request (): void;
  abstract accept (): void;
  abstract start (): void;
  abstract finish (): void;
  abstract cancel (): void;
}

export class RequestedStatus extends Status {
  value: string;

  constructor (ride: Ride) {
    super(ride);
    this.value = "requested";
  }
  request(): void {
    throw new Error("Invalid status");
  }
  accept(): void {
    this.ride.status = new AcceptedStatus(this.ride);
  }
  start(): void {
    throw new Error("Invalid status");
  }
  finish(): void {
    throw new Error("Invalid status");
  }
  cancel(): void {
    this.ride.status = new CanceledStatus(this.ride);
  }
}

export class AcceptedStatus extends Status {
  value: string;
  constructor(ride: Ride) {
    super(ride);
    this.value = "accepted";
  }
  request(): void {
    throw new Error("Invalid status");
  }
  accept(): void {
    throw new Error("Invalid status");
  }
  start(): void {
    this.ride.status = new InProgessStatus(this.ride);
  }
  finish(): void {
    throw new Error("Invalid status");
  }
  cancel(): void {
    this.ride.status = new CanceledStatus(this.ride);
  }
}

export class InProgessStatus extends Status {
  value: string;
  constructor(ride: Ride) {
    super(ride);
    this.value = "in_progress";
  }
  request(): void {
    throw new Error("Invalid status");
  }
  accept(): void {
    throw new Error("Invalid status");
  }
  start(): void {
    throw new Error("Invalid status");
  }
  finish(): void {
    this.ride.status = new CompletedStatus(this.ride);
  }
  cancel(): void {
    throw new Error("Invalid status");
  }
}

export class CompletedStatus extends Status {
  value: string;
  constructor(ride: Ride) {
    super(ride);
    this.value = "completed";
  }
  request(): void {
    throw new Error("Invalid status");
  }
  accept(): void {
    throw new Error("Invalid status");
  }
  start(): void {
    throw new Error("Invalid status");
  }
  finish(): void {
    throw new Error("Invalid status");
  }
  cancel(): void {
    throw new Error("Invalid status");
  }
}

export class CanceledStatus extends Status {
  value: string;
  constructor(ride: Ride) {
    super(ride);
    this.value = "canceled";
  }
  request(): void {
    throw new Error("Invalid status");
  }
  accept(): void {
    throw new Error("Invalid status");
  }
  start(): void {
    throw new Error("Invalid status");
  }
  finish(): void {
    throw new Error("Invalid status");
  }
  cancel(): void {
    throw new Error("Invalid status");
  }
}

export class StatusFactory {
  static create (ride: Ride, status: string) {
    if (status === "requested") return new RequestedStatus(ride);
    if (status === "accepted") return new AcceptedStatus(ride);
    if (status === "in_progress") return new InProgessStatus(ride);
    if (status === "completed") return new CompletedStatus(ride);
    if (status === "canceled") return new CanceledStatus(ride);
    throw new Error("Invalid status");
  }
}