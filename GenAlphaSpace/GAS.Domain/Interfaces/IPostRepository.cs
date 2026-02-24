using GenAlphaSpace.GAS.Domain.Entities;
namespace GenAlphaSpace.GAS.Domain.Interfaces
{
    public interface IPostRepository
    {
        Task<IEnumerable<Post>> GetAllAsync();
        Task<Post> CreateAsync(Post post);
    }
}
