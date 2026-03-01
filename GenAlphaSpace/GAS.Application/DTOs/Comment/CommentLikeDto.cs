namespace GenAlphaSpace.GAS.Application.DTOs.Comment
{
    public class CommentLikeDto
    {
        public int CommentId { get; set; }
        public int UserId { get; set; }
        public bool IsLiked { get; set; }
        public int LikeCount { get; set; }
    }
}
