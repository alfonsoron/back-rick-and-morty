import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateEpisodeCommentDto {
  @IsInt()
  @Min(1)
  episodeId!: number;

  @IsString()
  @IsNotEmpty()
  content!: string;
}
