import PositionRepository from "../../application/repository/PositionRepository";
import Coord from "../../domain/Coord";
import Position from "../../domain/Position";
import Connection from "../database/Connection";

export default class PositionRepositoryDatabase implements PositionRepository {

  constructor(private readonly connection: Connection) {}

  async save(position: Position): Promise<void> {
    await this.connection.query("insert into position (position_id, ride_id, lat, long, date) values ($1, $2, $3, $4, $5) on conflict do nothing",
        [
          position.positionId,
          position.rideId,
          position.coord.getLat(),
          position.coord.getLong(),
          position.date,
        ]
      );
  }

  async getByRideId(rideId: string): Promise<Position[]> {
    const positionsData = await this.connection.query("select * from position where ride_id = $1", [rideId]);
    const positions: Position[] = [];
    for (const positionData of positionsData) {
      positions.push(new Position(positionData.position_id, positionData.ride_id, new Coord(parseFloat(positionData.lat),
        parseFloat(positionData.long)), positionData.date));
    }
    return positions;
  }
}