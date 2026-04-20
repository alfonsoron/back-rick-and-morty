import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { FavoriteEpisodesController } from './favorite-episodes.controller';
import { FavoriteEpisodesService } from './favorite-episodes.service';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [FavoriteEpisodesController],
  providers: [FavoriteEpisodesService],
})
export class FavoriteEpisodesModule {}
