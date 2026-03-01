using GenAlphaSpace.GAS.Application.DTOs.Comment;

namespace GenAlphaSpace.GAS.Application.Interfaces
{
    public interface ICommentService
    {
        Task<CommentDto> CreateCommentAsync(CreateCommentDto dto);
        Task<CommentDto> GetCommentAsync(int commentId, int currentUserId);
        Task<CommentPagedResult<CommentDto>> GetPostRootCommentsAsync(int postId, int? cursor, int limit, int currentUserId);
        Task<CommentPagedResult<CommentDto>> GetCommentRepliesAsync(int parentId, int? cursor, int limit, int currentUserId);
        Task<CommentLikeDto> ToggleCommentLikeAsync(int commentId, int userId);
        Task<int> GetCommentLikeCountAsync(int commentId);
        Task<bool> DeleteCommentAsync(int commentId, int currentUserId);
    }
}

