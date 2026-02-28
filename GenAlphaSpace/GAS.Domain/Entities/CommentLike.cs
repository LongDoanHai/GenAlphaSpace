using System;

namespace GenAlphaSpace.GAS.Domain.Entities
{
    public class CommentLike
    {
        public int CommentId { get; set; }
        public Comment Comment { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }

        public DateTime DateLiked { get; set; } = DateTime.UtcNow;
    }
}
