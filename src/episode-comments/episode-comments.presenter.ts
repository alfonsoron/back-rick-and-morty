type CommentWithUser = {
  id: string;
  episodeId: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: {
    name: string;
    mail: string;
    role: string;
  };
};

export function presentEpisodeComment(comment: CommentWithUser) {
  return {
    id: comment.id,
    episodeId: comment.episodeId,
    userId: comment.userId,
    content: comment.content,
    createdAt: new Date(comment.createdAt).toISOString(),
    updatedAt: new Date(comment.updatedAt).toISOString(),
    user: {
      name: comment.user.name,
    },
  };
}
