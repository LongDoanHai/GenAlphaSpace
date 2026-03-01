using GenAlphaSpace.GAS.Application.DTOs.Post;
namespace GenAlphaSpace.GAS.Application.Interfaces
{
    public interface IPostService
    {
        Task<IEnumerable<PostDto>> GetAllPostsAsync();
        Task<PostDto> CreatePostAsync(CreatePostDto createPostDto);
        Task<PostDto> GetPostWithLikeCountAsync(int postId);
        Task<int> GetPostCommentCountAsync(int postId);
    }
}
