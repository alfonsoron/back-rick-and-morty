import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { successResponse } from '../common/formatters/api-response';
import { AuthTokenGuard } from '../auth/guards/auth-token.guard';
import { AuthenticatedRequest } from '../user/interfaces/authenticated-request.interface';
import { CreateFavoriteEpisodeDto } from './dto/create-favorite-episode.dto';
import { presentFavoriteEpisode } from './favorite-episodes.presenter';
import { FavoriteEpisodesService } from './favorite-episodes.service';

@Controller('favorite-episodes')
@UseGuards(AuthTokenGuard)
export class FavoriteEpisodesController {
  constructor(private readonly favoriteEpisodesService: FavoriteEpisodesService) {}

  @Post()
  async create(
    @Req() request: AuthenticatedRequest,
    @Body() payload: CreateFavoriteEpisodeDto,
  ) {
    const favoriteEpisode = await this.favoriteEpisodesService.create(
      request.user.sub,
      payload,
    );

    return successResponse('Favorite episode saved successfully', {
      favoriteEpisode: presentFavoriteEpisode(favoriteEpisode),
    });
  }

  @Get()
  async findAll(@Req() request: AuthenticatedRequest) {
    const favoriteEpisodes = await this.favoriteEpisodesService.findAllByUser(
      request.user.sub,
    );

    return successResponse('Favorite episodes fetched successfully', {
      favoriteEpisodes: favoriteEpisodes.map(presentFavoriteEpisode),
    });
  }

  @Delete(':episodeId')
  @HttpCode(200)
  async remove(
    @Req() request: AuthenticatedRequest,
    @Param('episodeId', ParseIntPipe) episodeId: number,
  ) {
    await this.favoriteEpisodesService.remove(request.user.sub, episodeId);

    return successResponse('Favorite episode removed successfully', {
      episodeId,
    });
  }
}
