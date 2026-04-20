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
  findOne(@Param('commentId') commentId: string) {
    const comment = this.episodeCommentsService.findById(commentId);

    return successResponse('Episode comment fetched successfully', {
      comment: presentEpisodeComment(comment),
    });
  }

  @Get('episode/:episodeId')
  findAllByEpisode(@Param('episodeId', ParseIntPipe) episodeId: number) {
    const comments = this.episodeCommentsService.findAllByEpisode(episodeId);
    const settings = this.episodeCommentsService.getSettings(episodeId);

    return successResponse('Episode comments fetched successfully', {
      episodeId,
      commentsEnabled: settings.commentsEnabled,
      comments: comments.map(presentEpisodeComment),
    });
  }

  @Post()
  @UseGuards(AuthTokenGuard)
  create(
    @Req() request: AuthenticatedRequest,
    @Body() payload: CreateEpisodeCommentDto,
  ) {
    const comment = this.episodeCommentsService.create(request.user, payload);

    return successResponse('Episode comment created successfully', {
      comment: presentEpisodeComment(comment),
    });
  }

  @Put(':commentId')
  @UseGuards(AuthTokenGuard)
  update(
    @Param('commentId') commentId: string,
    @Req() request: AuthenticatedRequest,
    @Body() payload: UpdateEpisodeCommentDto,
  ) {
    const comment = this.episodeCommentsService.update(commentId, request.user, payload);

    return successResponse('Episode comment updated successfully', {
      comment: presentEpisodeComment(comment),
    });
  }

  @Delete(':commentId')
  @UseGuards(AuthTokenGuard)
  @HttpCode(200)
  remove(@Param('commentId') commentId: string, @Req() request: AuthenticatedRequest) {
    this.episodeCommentsService.remove(commentId, request.user);

    return successResponse('Episode comment removed successfully', {
      commentId,
    });
  }

  @Patch('settings/:episodeId')
  @UseGuards(AuthTokenGuard)
  updateSettings(
    @Param('episodeId', ParseIntPipe) episodeId: number,
    @Req() request: AuthenticatedRequest,
    @Body() payload: UpdateEpisodeCommentSettingDto,
  ) {
    const settings = this.episodeCommentsService.updateSettings(
      episodeId,
      request.user,
      payload.commentsEnabled,
    );

    return successResponse('Episode comment settings updated successfully', {
      settings,
    });
  }
}
