using GenAlphaSpace.GAS.Application.DTOs.Post;
using GenAlphaSpace.GAS.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
namespace GenAlphaSpace.GAS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PostsController : ControllerBase
    {
        private readonly IPostService _postService;
        private readonly ILikeService _likeService;
        public PostsController(IPostService postService, ILikeService likeService)
        {
            _postService = postService;
            _likeService = likeService;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllPosts() 
        {
            var post = await _postService.GetAllPostsAsync();
            return Ok(post);
        }
        [HttpGet("{postId}/like-count")]
        public async Task<IActionResult> GetPostLikeCount(int postId)
        {
            var likeCount = await _likeService.GetPostLikeCountAsync(postId);
            return Ok(likeCount);
        }

        [HttpPost("{postId}/toggle-like")]
        public async Task<IActionResult> TogglePostLike(int postId, [FromBody] TogglePostLikeDto dto)
        {
            dto.PostId = postId;
            var result = await _likeService.TogglePostLikeAsync(dto);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreatePost([FromForm] CreatePostDto dto) 
        {
            var createdPost = await _postService.CreatePostAsync(dto);
            return CreatedAtAction(nameof(GetAllPosts), new { id = createdPost.Id }, createdPost);
        }

    }
}
