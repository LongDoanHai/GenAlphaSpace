namespace GenAlphaSpace.GAS.Application.DTOs.Post
{
    public class PostDto
    {
        public int Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public DateTime DateCreated { get; set; }
        public string UserName { get; set; } = string.Empty;

    }
}
