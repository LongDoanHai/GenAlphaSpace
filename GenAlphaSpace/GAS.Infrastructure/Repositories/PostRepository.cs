using GenAlphaSpace.GAS.Domain.Entities;
using GenAlphaSpace.GAS.Domain.Interfaces;
using GenAlphaSpace.GAS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
namespace GenAlphaSpace.GAS.Infrastructure.Repositories
{
    public class PostRepository : IPostRepository
    {
        private readonly AppDbContext _context;
        public PostRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Post> CreateAsync(Post post)
        {
            _context.Posts.Add(post);
            await _context.SaveChangesAsync();
            return post;
        }

        public async Task<IEnumerable<Post>> GetAllAsync()
        {
            return await _context.Posts
                .Include(p => p.User)
                .Include(p => p.Likes)
                .OrderByDescending(p => p.DateCreated)
                .ToListAsync();
        }

        public async Task<Post?> GetByPostId(int postId)
        {
            return await _context.Posts
                .Include(p => p.User)
                .Include(p => p.Likes)
                .FirstOrDefaultAsync(p => p.Id == postId);
        }

        public async Task<bool> PostExistsAsync(int postId)
        {
            return await _context.Posts.AnyAsync(p => p.Id == postId);
        }
    }
}
