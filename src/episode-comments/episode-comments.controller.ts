import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { successResponse } from '../common/formatters/api-response';
import { AuthTokenGuard } from '../auth/guards/auth-token.guard';
import { AuthenticatedRequest } from '../user/interfaces/authenticated-request.interface';
import { CreateEpisodeCommentDto } from './dto/create-episode-comment.dto';
import { UpdateEpisodeCommentSettingDto } from './dto/update-episode-comment-setting.dto';
import { UpdateEpisodeCommentDto } from './dto/update-episode-comment.dto';
import { presentEpisodeComment } from './episode-comments.presenter';
import { EpisodeCommentsService } from './episode-comments.service';

@Controller('episode-comments')
export class EpisodeCommentsController {
  constructor(private readonly episodeCommentsService: EpisodeCommentsService) {}

  @Get('detail/:commentId')
  @UseGuards(AuthTokenGuard)
  async findOne(@Param('commentId') commentId: string) {
    const comment = await this.episodeCommentsService.findById(commentId);

    return successResponse('Episode comment fetched successfully', {
      comment: presentEpisodeComment(comment),
    });
  }

  @Get('episode/:episodeId')
  async findAllByEpisode(@Param('episodeId', ParseIntPipe) episodeId: number) {
    const [comments, settings] = await Promise.all([
      this.episodeCommentsService.findAllByEpisode(episodeId),
      this.episodeCommentsService.getSettings(episodeId),
    ]);

    return successResponse('Episode comments fetched successfully', {
      episodeId,
      commentsEnabled: settings.commentsEnabled,
      comments: comments.map(presentEpisodeComment),
    });
  }

  @Post()
  @UseGuards(AuthTokenGuard)
  async create(
    @Req() request: AuthenticatedRequest,
    @Body() payload: CreateEpisodeCommentDto,
  ) {
    const comment = await this.episodeCommentsService.create(request.user, payload);

    return successResponse('Episode comment created successfully', {
      comment: presentEpisodeComment(comment),
    });
  }

  @Put(':commentId')
  @UseGuards(AuthTokenGuard)
  async update(
    @Param('commentId') commentId: string,
    @Req() request: AuthenticatedRequest,
    @Body() payload: UpdateEpisodeCommentDto,
  ) {
    const comment = await this.episodeCommentsService.update(commentId, request.user, payload);

    return successResponse('Episode comment updated successfully', {
      comment: presentEpisodeComment(comment),
    });
  }

  @Delete(':commentId')
  @UseGuards(AuthTokenGuard)
  @HttpCode(200)
  async remove(@Param('commentId') commentId: string, @Req() request: AuthenticatedRequest) {
    await this.episodeCommentsService.remove(commentId, request.user);

    return successResponse('Episode comment removed successfully', {
      commentId,
    });
  }

  @Patch('settings/:episodeId')
  @UseGuards(AuthTokenGuard)
  async updateSettings(
    @Param('episodeId', ParseIntPipe) episodeId: number,
    @Req() request: AuthenticatedRequest,
    @Body() payload: UpdateEpisodeCommentSettingDto,
  ) {
    const settings = await this.episodeCommentsService.updateSettings(
      episodeId,
      request.user,
      payload.commentsEnabled,
    );

    return successResponse('Episode comment settings updated successfully', {
      settings,
    });
  }
}
