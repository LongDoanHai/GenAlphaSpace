namespace GenAlphaSpace.GAS.Domain.Entities
{
    public class Comment
    {
        public int Id { get; set; }

        public string Content { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateUpdated { get; set; }

        public int PostId { get; set; }
        public int UserId { get; set; }

        public Post Post { get; set; }
        public User User { get; set; }

        public int? ParentCommentId { get; set; }
        public Comment? ParentComment { get; set; }
        public ICollection<Comment> Replies { get; set; } = new List<Comment>();


        public int? RootCommentId { get; set; }


        public int LikeCount { get; set; }
        public int ReplyCount { get; set; }

        public ICollection<CommentLike> CommentLikes { get; set; } = new List<CommentLike>();

        // Soft delete fields
        public bool IsDeleted { get; set; } = false;
        public DateTime? DeletedAt { get; set; }
        public int? DeletedBy { get; set; }
    }
}
