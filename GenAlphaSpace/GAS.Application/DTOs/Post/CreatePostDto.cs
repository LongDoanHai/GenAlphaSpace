namespace GenAlphaSpace.GAS.Application.DTOs.Post
{
    public class CreatePostDto
    {
        public string Content { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public int UserId { get; set; }
    }
}
