using GenAlphaSpace.GAS.Application.DTOs.Comment;
using GenAlphaSpace.GAS.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
namespace GenAlphaSpace.GAS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommentsController : ControllerBase
    {

        private readonly ICommentService _commentService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CommentsController(ICommentService commentService, IHttpContextAccessor httpContextAccessor)
        {
            _commentService = commentService;
            _httpContextAccessor = httpContextAccessor;
        }

        // Helper method to get current user ID (from JWT or session)
        private int GetCurrentUserId()
        {
            // TODO: Implement actual user extraction from JWT token or session
            // For now, return hardcoded user ID
            return 1; // Replace with actual user retrieval
        }

        [HttpPost]
        public async Task<IActionResult> CreateComment([FromBody] CreateCommentDto dto)
        {
            var currentUserId = GetCurrentUserId();
            dto.UserId = currentUserId;

            var comment = await _commentService.CreateCommentAsync(dto);
            return CreatedAtAction(nameof(GetComment), new { id = comment.Id }, comment);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetComment(int id)
        {
            var currentUserId = GetCurrentUserId();
            var comment = await _commentService.GetCommentAsync(id, currentUserId);
            return Ok(comment);
        }

        [HttpGet("posts/{postId}/comments")]
        public async Task<IActionResult> GetPostComments(int postId, [FromQuery] int? cursor, [FromQuery] int limit = 10)
        {
            var currentUserId = GetCurrentUserId();
            var result = await _commentService.GetPostRootCommentsAsync(postId, cursor, limit, currentUserId);
            return Ok(result);
        }

        [HttpGet("{parentId}/replies")]
        public async Task<IActionResult> GetCommentReplies(int parentId, [FromQuery] int? cursor, [FromQuery] int limit = 5)
        {
            var currentUserId = GetCurrentUserId();
            var result = await _commentService.GetCommentRepliesAsync(parentId, cursor, limit, currentUserId);
            return Ok(result);
        }

        [HttpPost("{commentId}/like")]
        public async Task<IActionResult> ToggleCommentLike(int commentId)
        {
            var currentUserId = GetCurrentUserId();
            var result = await _commentService.ToggleCommentLikeAsync(commentId, currentUserId);
            return Ok(result);
        }

        [HttpGet("{commentId}/like-count")]
        public async Task<IActionResult> GetCommentLikeCount(int commentId)
        {
            var count = await _commentService.GetCommentLikeCountAsync(commentId);
            return Ok(count);
        }
    }
}
