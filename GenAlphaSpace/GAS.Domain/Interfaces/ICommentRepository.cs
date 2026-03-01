using GenAlphaSpace.GAS.Domain.Entities;
namespace GenAlphaSpace.GAS.Domain.Interfaces
{
    public interface ICommentRepository
    {
        Task<IEnumerable<Comment>> GetRootCommentsAsync(int postId, int? cursor, int limit);
        Task<IEnumerable<Comment>> GetRepliesAsync(int parentCommentId, int? cursor, int limit);
        Task<Comment> CreateCommentAsync(Comment comment);
        Task<IEnumerable<int>> GetLikedCommentIdsAsync(IEnumerable<int> commentIds, int userId);
        Task<CommentLike?> ToggleCommentLikeAsync(int commentId, int userId);
        Task<int> GetCommentLikeCountAsync(int commentId);
        Task<int> GetReplyCountAsync(int parentCommentId);
        Task<bool> UserHasLikedCommentAsync(int commentId, int userId);
        Task<int> IncrementReplyCountAsync(int commentId);
        Task<int> DecrementReplyCountAsync(int commentId);
        Task<Comment?> GetCommentByIdAsync(int commentId);
        Task<int> GetCommentCountAsync(int postId);
        Task<CommentLike?> GetUserLikeAsync(int commentId, int userId);
        Task RemoveCommentLikeAsync(int commentId, int userId);
        Task AddCommentLikeAsync(int commentId, int userId);
        Task UpdateCommentAsync(Comment comment);
    }
}

