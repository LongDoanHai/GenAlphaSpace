using Microsoft.AspNetCore.Http;
namespace GenAlphaSpace.GAS.Application.DTOs.Post
{
    public class CreatePostDto
    {
        public string Content { get; set; } = string.Empty;
        public IFormFile? ImageFile { get; set; }
        public int UserId { get; set; }
    }
}
