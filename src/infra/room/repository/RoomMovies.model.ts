import { Table, Model, PrimaryKey, Column, ForeignKey, BelongsTo, HasMany, Default, DataType } from "sequelize-typescript";
import MovieModel from "./Room.model";
import RoomModel from "./Room.model";

@Table({ tableName: "room_movies", timestamps: false })
class RoomMoviesModel extends Model {
  @PrimaryKey
  @ForeignKey(() => MovieModel)
  @Column({ allowNull: false })
  declare fk_movie_id: string;
  @BelongsTo(() => MovieModel)
  declare movie: MovieModel;

  @PrimaryKey
  @ForeignKey(() => RoomModel)
  @Column({ allowNull: false })
  declare fk_room_id: string;
  @BelongsTo(() => RoomModel)
  declare room: RoomModel;
}

export default RoomMoviesModel;
