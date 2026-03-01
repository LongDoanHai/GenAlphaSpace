using GenAlphaSpace.GAS.Domain.Entities;
using GenAlphaSpace.GAS.Domain.Interfaces;
using GenAlphaSpace.GAS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
namespace GenAlphaSpace.GAS.Infrastructure.Repositories
{
    public class CommentRepository : ICommentRepository
    {
        private readonly AppDbContext _context;

        public CommentRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Comment>> GetRootCommentsAsync(int postId, int? cursor, int limit)
        {
            var query = _context.Comments
                .Where(c => c.PostId == postId && c.ParentCommentId == null)
                .Include(c => c.User)
                .AsQueryable();

            if (cursor.HasValue)
            {
                // Descending sort: fetch items where ID is LESS than current cursor
                query = query.Where(c => c.Id < cursor.Value);
            }

            return await query
                .OrderByDescending(c => c.DateCreated)
                .Take(limit)
                .ToListAsync();
        }
        public async Task<IEnumerable<Comment>> GetRepliesAsync(int parentCommentId, int? cursor, int limit)
        {
            var query = _context.Comments
                .Where(c => c.ParentCommentId == parentCommentId)
                .Include(c => c.User)
                .AsQueryable();

            if (cursor.HasValue)
            {
                query = query.Where(c => c.Id < cursor.Value);
            }

            return await query
                .OrderByDescending(c => c.DateCreated)
                .Take(limit)
                .ToListAsync();
        }
        public async Task<Comment> CreateCommentAsync(Comment comment)
        {
            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();
            return comment;
        }
        public async Task<IEnumerable<int>> GetLikedCommentIdsAsync(IEnumerable<int> commentIds, int userId)
        {
            return await _context.CommentLikes
                .Where(cl => cl.UserId == userId && commentIds.Contains(cl.CommentId))
                .Select(cl => cl.CommentId)
                .ToListAsync();
        }

        public async Task<CommentLike?> ToggleCommentLikeAsync(int commentId, int userId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var existingLike = await _context.CommentLikes
                    .FirstOrDefaultAsync(cl => cl.CommentId == commentId && cl.UserId == userId);

                var comment = await _context.Comments.FindAsync(commentId);
                if (comment == null) return null;

                if (existingLike != null)
                {
                    _context.CommentLikes.Remove(existingLike);
                    comment.LikeCount = Math.Max(0, comment.LikeCount - 1);
                }
                else
                {
                    existingLike = new CommentLike
                    {
                        CommentId = commentId,
                        UserId = userId,
                        DateLiked = DateTime.Now
                    };
                    _context.CommentLikes.Add(existingLike);
                    comment.LikeCount++;
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return existingLike;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
        public async Task<int> GetCommentLikeCountAsync(int commentId)
        {
            return await _context.CommentLikes
                .CountAsync(cl => cl.CommentId == commentId);
        }
        public async Task<int> GetReplyCountAsync(int parentCommentId)
        {
            return await _context.Comments
                .CountAsync(c => c.ParentCommentId == parentCommentId);
        }
        public async Task<bool> UserHasLikedCommentAsync(int commentId, int userId)
        {
            return await _context.CommentLikes
                .AnyAsync(cl => cl.CommentId == commentId && cl.UserId == userId);
        }
        public async Task<int> IncrementReplyCountAsync(int commentId)
        {
            var comment = await _context.Comments.FindAsync(commentId);
            if (comment != null)
            {
                comment.ReplyCount++;
                await _context.SaveChangesAsync();
                return comment.ReplyCount;
            }
            return 0;
        }
        public async Task<int> DecrementReplyCountAsync(int commentId)
        {
            var comment = await _context.Comments.FindAsync(commentId);
            if (comment != null && comment.ReplyCount > 0)
            {
                comment.ReplyCount--;
                await _context.SaveChangesAsync();
                return comment.ReplyCount;
            }
            return 0;
        }
        public async Task<Comment?> GetCommentByIdAsync(int commentId)
        {
            return await _context.Comments
                .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.Id == commentId);
        }
        public async Task<int> GetCommentCountAsync(int postId)
        {
            return await _context.Comments
                .CountAsync(c => c.PostId == postId);
        }
        public async Task<CommentLike?> GetUserLikeAsync(int commentId, int userId)
        {
            return await _context.CommentLikes
                .FirstOrDefaultAsync(cl => cl.CommentId == commentId && cl.UserId == userId);
        }
        public async Task RemoveCommentLikeAsync(int commentId, int userId)
        {
            var like = await GetUserLikeAsync(commentId, userId);
            if (like != null)
            {
                _context.CommentLikes.Remove(like);
                await _context.SaveChangesAsync();
            }
        }
        public async Task AddCommentLikeAsync(int commentId, int userId)
        {
            var like = new CommentLike
            {
                CommentId = commentId,
                UserId = userId,
                DateLiked = DateTime.Now
            };
            _context.CommentLikes.Add(like);
            await _context.SaveChangesAsync();
        }
        public async Task UpdateCommentAsync(Comment comment)
        {
            _context.Comments.Update(comment);
            await _context.SaveChangesAsync();
        }
    }
}
