using GenAlphaSpace.GAS.Application.DTOs.Post;

namespace GenAlphaSpace.GAS.Application.Interfaces
{
    public interface ILikeService
    {
        Task<TogglePostLikeDto> TogglePostLikeAsync(TogglePostLikeDto dto);
        Task<LikeCountDto> GetPostLikeCountAsync(int postId);
    }
}
