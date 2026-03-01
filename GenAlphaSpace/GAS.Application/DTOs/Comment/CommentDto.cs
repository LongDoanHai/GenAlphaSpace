namespace GenAlphaSpace.GAS.Application.DTOs.Comment
{
    public class CommentDto
    {
        public int Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string? UserAvatarUrl { get; set; }
        public DateTime DateCreated { get; set; }
        public int LikeCount { get; set; }
        public int ReplyCount { get; set; }
        public bool IsLikedByCurrentUser { get; set; }
    }
}
