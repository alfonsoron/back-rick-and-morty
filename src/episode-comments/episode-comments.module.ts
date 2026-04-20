import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { EpisodeCommentsController } from './episode-comments.controller';
import { EpisodeCommentsService } from './episode-comments.service';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [EpisodeCommentsController],
  providers: [EpisodeCommentsService],
})
export class EpisodeCommentsModule {}
