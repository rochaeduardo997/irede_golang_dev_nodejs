import { Table, Model, PrimaryKey, Column, Unique, Default, BelongsTo, ForeignKey, HasMany } from "sequelize-typescript";
import RoomMoviesModel from "./RoomMovies.model";

@Table({ tableName: "rooms", timestamps: false })
class RoomModel extends Model {
  @PrimaryKey
  @Column
  declare id: string;

  @Column({ allowNull: false })
  declare room_number: number;

  @Column({ allowNull: false })
  declare description: string;

  @HasMany(() => RoomMoviesModel, 'fk_room_id')
  declare movies?: RoomMoviesModel[];
}

export default RoomModel;
