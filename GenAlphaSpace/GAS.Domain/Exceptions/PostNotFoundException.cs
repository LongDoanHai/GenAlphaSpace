namespace GenAlphaSpace.GAS.Domain.Exceptions
{
    public class PostNotFoundException : Exception
    {
        public PostNotFoundException(int postId) : base($"Post with ID {postId} was not found.")
        { }
    }
}
