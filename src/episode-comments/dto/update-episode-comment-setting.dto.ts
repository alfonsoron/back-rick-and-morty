import { IsBoolean } from 'class-validator';

export class UpdateEpisodeCommentSettingDto {
  @IsBoolean()
  commentsEnabled!: boolean;
}
