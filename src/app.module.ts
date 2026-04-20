import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EpisodeCommentsModule } from './episode-comments/episode-comments.module';
import { FavoriteEpisodesModule } from './favorite-episodes/favorite-episodes.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UserModule,
    FavoriteEpisodesModule,
    EpisodeCommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
