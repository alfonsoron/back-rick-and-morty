import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEpisodeCommentDto } from './dto/create-episode-comment.dto';
import { UpdateEpisodeCommentDto } from './dto/update-episode-comment.dto';

type AuthUser = {
  sub: string;
  role: string;
};

@Injectable()
export class EpisodeCommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: AuthUser, payload: CreateEpisodeCommentDto) {
    const commentsEnabled = await this.areCommentsEnabled(payload.episodeId);

    if (!commentsEnabled && user.role !== 'admin') {
      throw new ForbiddenException('New comments are disabled for this episode');
    }

    return this.prisma.episodeComment.create({
      data: {
        episodeId: payload.episodeId,
        content: payload.content,
        userId: user.sub,
      },
      include: {
        user: true,
      },
    });
  }

  async findAllByEpisode(episodeId: number) {
    return this.prisma.episodeComment.findMany({
      where: { episodeId },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(commentId: string) {
    const comment = await this.prisma.episodeComment.findUnique({
      where: { id: commentId },
      include: {
        user: true,
      },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  async update(commentId: string, user: AuthUser, payload: UpdateEpisodeCommentDto) {
    const comment = await this.findById(commentId);
    this.assertCanManageComment(comment, user, false);

    return this.prisma.episodeComment.update({
      where: { id: commentId },
      data: {
        content: payload.content,
      },
      include: {
        user: true,
      },
    });
  }

  async remove(commentId: string, user: AuthUser) {
    const comment = await this.findById(commentId);
    this.assertCanManageComment(comment, user, true);

    await this.prisma.episodeComment.delete({
      where: { id: commentId },
    });
  }

  async updateSettings(episodeId: number, user: AuthUser, commentsEnabled: boolean) {
    if (user.role !== 'admin') {
      throw new ForbiddenException('Only admins can change comment settings');
    }

    return this.prisma.episodeCommentSetting.upsert({
      where: { episodeId },
      update: {
        commentsEnabled,
      },
      create: {
        episodeId,
        commentsEnabled,
      },
    });
  }

  async getSettings(episodeId: number) {
    const settings = await this.prisma.episodeCommentSetting.findUnique({
      where: { episodeId },
    });

    return {
      episodeId,
      commentsEnabled: settings?.commentsEnabled ?? true,
    };
  }

  private async areCommentsEnabled(episodeId: number) {
    const settings = await this.getSettings(episodeId);
    return settings.commentsEnabled;
  }

  private assertCanManageComment(
    comment: any,
    user: AuthUser,
    allowAdminDelete: boolean,
  ) {
    const isOwner = comment.userId === user.sub;
    const isAdmin = user.role === 'admin';

    if (isOwner) {
      return;
    }

    if (allowAdminDelete && isAdmin) {
      return;
    }

    throw new ForbiddenException('You cannot manage comments from other users');
  }
}
