import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateEpisodeCommentDto {
  @IsString()
  @IsNotEmpty()
  content!: string;
}
