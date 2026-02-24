using GenAlphaSpace.GAS.Application.DTOs.Post;
using GenAlphaSpace.GAS.Application.Interfaces;
using GenAlphaSpace.GAS.Domain.Entities;
using GenAlphaSpace.GAS.Domain.Interfaces;

namespace GenAlphaSpace.GAS.Application.Services
{
    public class PostService : IPostService
    {
        private readonly IPostRepository _postRepository;
        public PostService(IPostRepository postRepository)
        {
               _postRepository = postRepository;
        }

        public async Task<PostDto> CreatePostAsync(CreatePostDto createPostDto)
        {
            var post = new Post
            {
                Content = createPostDto.Content,
                ImageUrl = createPostDto.ImageUrl,
                NumsOfReports = 0,
                DateCreated = DateTime.Now,
                DateUpdated = DateTime.Now,
                UserId = 1,
            };
            var createdPost = await _postRepository.CreateAsync(post);
            return new PostDto
            {
                Content = createdPost.Content,
                ImageUrl = createdPost.ImageUrl,
                DateCreated = createdPost.DateCreated,
                UserName = createdPost.User?.Name ?? String.Empty,
            };
        }

        public async Task<IEnumerable<PostDto>> GetAllPostsAsync() 
        {
            var posts = await _postRepository.GetAllAsync();
            return posts.Select(p => new PostDto
            {
                Id = p.Id,
                Content = p.Content,
                ImageUrl = p.ImageUrl,
                DateCreated = p.DateCreated,
                UserName = p.User?.Name ?? String.Empty
            });
        }

    }
}
