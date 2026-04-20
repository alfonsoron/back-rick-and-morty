import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateFavoriteEpisodeDto {
  @IsInt()
  @Min(1)
  episodeId!: number;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  episodeCode!: string;

  @IsString()
  @IsNotEmpty()
  airDate!: string;
}
