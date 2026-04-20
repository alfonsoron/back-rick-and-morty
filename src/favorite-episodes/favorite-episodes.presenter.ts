import { FavoriteEpisode } from '@prisma/client';

export function presentFavoriteEpisode(favoriteEpisode: FavoriteEpisode) {
  return {
    id: favoriteEpisode.id,
    episodeId: favoriteEpisode.episodeId,
    name: favoriteEpisode.name,
    episodeCode: favoriteEpisode.episodeCode,
    airDate: favoriteEpisode.airDate,
    createdAt: favoriteEpisode.createdAt.toISOString(),
    userId: favoriteEpisode.userId,
  };
}
