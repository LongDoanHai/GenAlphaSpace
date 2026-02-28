using GenAlphaSpace.GAS.Domain.Entities;

namespace GenAlphaSpace.GAS.Domain.Interfaces
{
    public interface ILikeRepository
    {
        Task<bool> LikeExistsAsync(int postId, int userId);
        Task<Like> LikeAsync(Like like);
        Task UnlikeAsync(Like like);
        Task<int> GetLikeCountAsync(int postId);
    }
}
