namespace GenAlphaSpace.GAS.Domain.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }   
        public string? ProfilePictureUrl { get; set; }

        // Navigation Properties
        public ICollection<Post> Posts { get; set; } = new List<Post>();
    }
}
