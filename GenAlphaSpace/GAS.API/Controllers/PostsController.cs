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
        public PostsController(IPostService postService)
        {
            _postService = postService;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllPosts() 
        {
            var post = await _postService.GetAllPostsAsync();
            return Ok(post);
        }

        [HttpPost]
        public async Task<IActionResult> CreatePost([FromBody] CreatePostDto dto) 
        {
            var createdPost = await _postService.CreatePostAsync(dto);
            return CreatedAtAction(nameof(GetAllPosts), new { id = createdPost.Id }, createdPost);
        }
    }
}
