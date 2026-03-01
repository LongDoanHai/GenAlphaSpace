namespace GenAlphaSpace.GAS.Domain.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }   
        public string? ProfilePictureUrl { get; set; }

        // Navigation Properties
        public ICollection<Post> Posts { get; set; } = new List<Post>();
        public ICollection<Like> Likes { get; set; } = new List<Like>();
        public ICollection<CommentLike> CommentLikes { get; set; } = new List<CommentLike>();
    }

}
