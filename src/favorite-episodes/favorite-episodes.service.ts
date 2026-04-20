import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFavoriteEpisodeDto } from './dto/create-favorite-episode.dto';

@Injectable()
export class FavoriteEpisodesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, payload: CreateFavoriteEpisodeDto) {
    const existingFavorite = await this.prisma.favoriteEpisode.findUnique({
      where: {
        userId_episodeId: {
          userId,
          episodeId: payload.episodeId,
        },
      },
    });

    if (existingFavorite) {
      throw new ConflictException('Episode already added to favorites');
    }

    return this.prisma.favoriteEpisode.create({
      data: {
        userId,
        episodeId: payload.episodeId,
        name: payload.name,
        episodeCode: payload.episodeCode,
        airDate: payload.airDate,
      },
    });
  }

  async findAllByUser(userId: string) {
    return this.prisma.favoriteEpisode.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(userId: string, episodeId: number) {
    const favorite = await this.prisma.favoriteEpisode.findUnique({
      where: {
        userId_episodeId: {
          userId,
          episodeId,
        },
      },
    });

    if (!favorite) {
      throw new NotFoundException('Favorite episode not found');
    }

    await this.prisma.favoriteEpisode.delete({
      where: { id: favorite.id },
    });
  }
}
