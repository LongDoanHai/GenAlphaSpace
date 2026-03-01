using System.IO;
using GenAlphaSpace.GAS.Application.DTOs.Post;
using GenAlphaSpace.GAS.Application.Interfaces;
using GenAlphaSpace.GAS.Domain.Entities;
using GenAlphaSpace.GAS.Domain.Interfaces;
using Microsoft.AspNetCore.Hosting;

namespace GenAlphaSpace.GAS.Application.Services
{
    public class PostService : IPostService
    {
        private readonly IPostRepository _postRepository;
        private readonly ILikeRepository _likeRepository;
        private readonly IWebHostEnvironment _environment;
        private readonly ICommentRepository _commentRepository;
        public PostService(IPostRepository postRepository,
                           ILikeRepository likeRepository, 
                           IWebHostEnvironment environment,
                           ICommentRepository commentRepository)
        {
            _postRepository = postRepository;
            _likeRepository = likeRepository;
            _environment = environment;
            _commentRepository = commentRepository;
        }

        public async Task<PostDto> CreatePostAsync(CreatePostDto createPostDto)
        {
            string? fileUrl = null;
            if (createPostDto.ImageFile != null && createPostDto.ImageFile.Length > 0)
            {
                var webRoot = _environment.WebRootPath ?? Path.Combine(_environment.ContentRootPath, "wwwroot");
                var uploadDir = Path.Combine(webRoot, "uploads", "posts");
                
                if (!Directory.Exists(uploadDir))
                    Directory.CreateDirectory(uploadDir);

                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(createPostDto.ImageFile.FileName);
                var filePath = Path.Combine(uploadDir, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await createPostDto.ImageFile.CopyToAsync(stream);
                }

                fileUrl = $"/uploads/posts/{fileName}";
            }

            var post = new Post
            {
                Content = createPostDto.Content,
                ImageUrl = fileUrl,
                NumsOfReports = 0,
                DateCreated = DateTime.Now,
                DateUpdated = DateTime.Now,
                UserId = 1,
            };
            var createdPost = await _postRepository.CreateAsync(post);
            return new PostDto
            {
                Id = createdPost.Id,
                Content = createdPost.Content,
                ImageUrl = createdPost.ImageUrl,
                DateCreated = createdPost.DateCreated,
                UserName = createdPost.User?.Name ?? String.Empty,
                LikeCount = 0,
                IsLiked = false,
                CommentCount = 0
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
                UserName = p.User?.Name ?? String.Empty,
                LikeCount = p.Likes.Count,
                IsLiked = p.Likes.Any(l => l.Userid == 1),
                CommentCount = p.Comments.Count
            });
        }
        public async Task<PostDto> GetPostWithLikeCountAsync(int postId)
        {
            var post = await _postRepository.GetByPostId(postId);
            if (post == null)
            {
                return null!;
            }

            var likeCount = await _likeRepository.GetLikeCountAsync(postId);

            return new PostDto
            {
                Id = post.Id,
                Content = post.Content,
                ImageUrl = post.ImageUrl,
                DateCreated = post.DateCreated,
                UserName = post.User?.Name ?? String.Empty,
                LikeCount = likeCount,
                IsLiked = post.Likes.Any(l => l.Userid == 1),
                CommentCount = post.Comments.Count
            };
        }
        public async Task<int> GetPostCommentCountAsync(int postId)
        {
            return await _commentRepository.GetCommentCountAsync(postId);
        }

    }
}
