namespace GenAlphaSpace.GAS.Application.DTOs.Comment
{
    public class CreateCommentDto
    {
        public int PostId { get; set; }
        public int UserId { get; set; }
        public string Content { get; set; } = string.Empty;
        public int? ParentCommentId { get; set; }
    }
}
