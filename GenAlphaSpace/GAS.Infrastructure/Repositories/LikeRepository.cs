using GenAlphaSpace.GAS.Domain.Entities;
using GenAlphaSpace.GAS.Domain.Interfaces;
using GenAlphaSpace.GAS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
namespace GenAlphaSpace.GAS.Infrastructure.Repositories
{
    public class LikeRepository : ILikeRepository
    {
        private readonly AppDbContext _context;

        public LikeRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<bool> LikeExistsAsync(int postId, int userId)
        {
            return await _context.Likes
                .AnyAsync(l => l.PostId == postId && l.Userid == userId);
        }
        public async Task<Like> LikeAsync(Like like)
        {
            _context.Likes.Add(like);
            await _context.SaveChangesAsync();
            return like;
        }
        public async Task UnlikeAsync(Like like)
        {
            _context.Likes.Remove(like);
            await _context.SaveChangesAsync();
        }
        public async Task<int> GetLikeCountAsync(int postId)
        {
            return await _context.Likes
                .CountAsync(l => l.PostId == postId);
        }
    }
}
