import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as BetterSqlite3 from 'better-sqlite3';
import * as path from 'node:path';
import { randomUUID } from 'node:crypto';
import { CreateEpisodeCommentDto } from './dto/create-episode-comment.dto';
import { UpdateEpisodeCommentDto } from './dto/update-episode-comment.dto';

type AuthUser = {
  sub: string;
  role: string;
};

type CommentRow = {
  id: string;
  episodeId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  userName: string;
  userMail: string;
  userRole: string;
};

@Injectable()
export class EpisodeCommentsService {
  private readonly db = new BetterSqlite3(path.join(process.cwd(), 'dev.db'));

  constructor() {
    this.db.pragma('foreign_keys = ON');
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS "EpisodeComment" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "episodeId" INTEGER NOT NULL,
        "content" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "userId" TEXT NOT NULL,
        FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
      CREATE TABLE IF NOT EXISTS "EpisodeCommentSetting" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "episodeId" INTEGER NOT NULL UNIQUE,
        "commentsEnabled" INTEGER NOT NULL DEFAULT 1,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  create(user: AuthUser, payload: CreateEpisodeCommentDto) {
    const commentsEnabled = this.areCommentsEnabled(payload.episodeId);

    if (!commentsEnabled && user.role !== 'admin') {
      throw new ForbiddenException('New comments are disabled for this episode');
    }

    const id = randomUUID();
    this.db
      .prepare(
        `
          INSERT INTO "EpisodeComment" ("id", "episodeId", "content", "userId")
          VALUES (@id, @episodeId, @content, @userId)
        `,
      )
      .run({
        id,
        episodeId: payload.episodeId,
        content: payload.content,
        userId: user.sub,
      });

    return this.findById(id);
  }

  findAllByEpisode(episodeId: number) {
    const statement = this.db.prepare(
      `
        SELECT
          c.id,
          c.episodeId,
          c.content,
          c.createdAt,
          c.updatedAt,
          u.id as userId,
          u.name as userName,
          u.mail as userMail,
          u.role as userRole
        FROM "EpisodeComment" c
        INNER JOIN "User" u ON u.id = c.userId
        WHERE c.episodeId = ?
        ORDER BY c.createdAt DESC
      `,
    );

    return statement.all(episodeId) as CommentRow[];
  }

  findById(commentId: string) {
    const statement = this.db.prepare(
      `
        SELECT
          c.id,
          c.episodeId,
          c.content,
          c.createdAt,
          c.updatedAt,
          u.id as userId,
          u.name as userName,
          u.mail as userMail,
          u.role as userRole
        FROM "EpisodeComment" c
        INNER JOIN "User" u ON u.id = c.userId
        WHERE c.id = ?
      `,
    );

    const comment = statement.get(commentId) as CommentRow | undefined;

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  update(commentId: string, user: AuthUser, payload: UpdateEpisodeCommentDto) {
    const comment = this.findById(commentId);
    this.assertCanManageComment(comment, user, false);

    this.db
      .prepare(
        `
          UPDATE "EpisodeComment"
          SET "content" = @content,
              "updatedAt" = CURRENT_TIMESTAMP
          WHERE "id" = @id
        `,
      )
      .run({
        id: commentId,
        content: payload.content,
      });

    return this.findById(commentId);
  }

  remove(commentId: string, user: AuthUser) {
    const comment = this.findById(commentId);
    this.assertCanManageComment(comment, user, true);

    this.db.prepare(`DELETE FROM "EpisodeComment" WHERE "id" = ?`).run(commentId);
  }

  updateSettings(episodeId: number, user: AuthUser, commentsEnabled: boolean) {
    if (user.role !== 'admin') {
      throw new ForbiddenException('Only admins can change comment settings');
    }

    const existing = this.db
      .prepare(`SELECT "id" FROM "EpisodeCommentSetting" WHERE "episodeId" = ?`)
      .get(episodeId) as { id: string } | undefined;

    if (existing) {
      this.db
        .prepare(
          `
            UPDATE "EpisodeCommentSetting"
            SET "commentsEnabled" = @commentsEnabled,
                "updatedAt" = CURRENT_TIMESTAMP
            WHERE "episodeId" = @episodeId
          `,
        )
        .run({
          episodeId,
          commentsEnabled: commentsEnabled ? 1 : 0,
        });
    } else {
      this.db
        .prepare(
          `
            INSERT INTO "EpisodeCommentSetting" ("id", "episodeId", "commentsEnabled")
            VALUES (@id, @episodeId, @commentsEnabled)
          `,
        )
        .run({
          id: randomUUID(),
          episodeId,
          commentsEnabled: commentsEnabled ? 1 : 0,
        });
    }

    return this.getSettings(episodeId);
  }

  getSettings(episodeId: number) {
    const row = this.db
      .prepare(
        `
          SELECT "episodeId", "commentsEnabled"
          FROM "EpisodeCommentSetting"
          WHERE "episodeId" = ?
        `,
      )
      .get(episodeId) as { episodeId: number; commentsEnabled: number } | undefined;

    return {
      episodeId,
      commentsEnabled: row ? Boolean(row.commentsEnabled) : true,
    };
  }

  private areCommentsEnabled(episodeId: number) {
    return this.getSettings(episodeId).commentsEnabled;
  }

  private assertCanManageComment(
    comment: CommentRow,
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
