import { Table, Model, PrimaryKey, Column, Unique, Default, HasMany } from "sequelize-typescript";
import RoomMoviesModel from "../../room/repository/RoomMovies.model";

@Table({ tableName: "movies", timestamps: false })
class MovieModel extends Model {
  @PrimaryKey
  @Column
  declare id: string;

  @Column({ allowNull: false }) declare name:                string;
  @Column({ allowNull: false }) declare director:            string;
  @Column({ allowNull: false }) declare duration_in_seconds: number;

  @HasMany(() => RoomMoviesModel, 'fk_movie_id')
  declare movies?: RoomMoviesModel[];
}

export default MovieModel;
