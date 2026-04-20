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

export function presentEpisodeComment(comment: CommentRow) {
  return {
    id: comment.id,
    episodeId: comment.episodeId,
    content: comment.content,
    createdAt: new Date(comment.createdAt).toISOString(),
    updatedAt: new Date(comment.updatedAt).toISOString(),
    user: {
      id: comment.userId,
      name: comment.userName,
      mail: comment.userMail,
      role: comment.userRole,
    },
  };
}
