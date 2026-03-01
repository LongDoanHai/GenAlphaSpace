using GenAlphaSpace.GAS.Application.DTOs.Comment;
using GenAlphaSpace.GAS.Application.Interfaces;
using GenAlphaSpace.GAS.Domain.Entities;
using GenAlphaSpace.GAS.Domain.Exceptions;
using GenAlphaSpace.GAS.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
namespace GenAlphaSpace.GAS.Application.Services
{
    public class CommentService : ICommentService
    {
        private readonly ICommentRepository _commentRepository;
        private readonly IPostRepository _postRepository;
        public CommentService(ICommentRepository commentRepository, IPostRepository postRepository)
        {
            _commentRepository = commentRepository;
            _postRepository = postRepository;
        }
        public async Task<CommentDto> CreateCommentAsync(CreateCommentDto dto)
        {
            var postExists = await _postRepository.PostExistsAsync(dto.PostId);
            if (!postExists)
            {
                throw new PostNotFoundException(dto.PostId);
            }

            var comment = new Comment
            {
                Content = dto.Content,
                PostId = dto.PostId,
                UserId = dto.UserId,
                ParentCommentId = dto.ParentCommentId,
                DateCreated = DateTime.Now,
                DateUpdated = DateTime.Now,
                LikeCount = 0,
                ReplyCount = 0
            };

            if (dto.ParentCommentId.HasValue)
            {
                var parentComment = await _commentRepository.GetCommentByIdAsync(dto.ParentCommentId.Value);
                if (parentComment == null)
                {
                    throw new CommentNotFoundException(dto.ParentCommentId.Value);
                }
                comment.RootCommentId = parentComment.RootCommentId ?? parentComment.Id;
            }


            var createdComment = await _commentRepository.CreateCommentAsync(comment);

            if (dto.ParentCommentId.HasValue)
            {
                await _commentRepository.IncrementReplyCountAsync(dto.ParentCommentId.Value);
            }

            // We know current user just created it, so no liked status needed yet (or false)
            return await MapToCommentDtoAsync(createdComment, dto.UserId);
        }

        public async Task<CommentDto> GetCommentAsync(int commentId, int currentUserId)
        {
            var comment = await _commentRepository.GetCommentByIdAsync(commentId);
            if (comment == null) throw new CommentNotFoundException(commentId);
            return await MapToCommentDtoAsync(comment, currentUserId);
        }

        public async Task<CommentPagedResult<CommentDto>> GetPostRootCommentsAsync(int postId, int? cursor, int limit, int currentUserId)
        {
            var commentsWithPlusOne = (await _commentRepository.GetRootCommentsAsync(postId, cursor, limit + 1)).ToList();
            
            var hasNextPage = commentsWithPlusOne.Count > limit;
            var items = hasNextPage ? commentsWithPlusOne.Take(limit).ToList() : commentsWithPlusOne;
            
            var lastItem = items.LastOrDefault();
            var nextCursor = hasNextPage ? lastItem?.Id : null;

            var dtoList = await MapToCommentDtoListAsync(items, currentUserId);

            return new CommentPagedResult<CommentDto>
            {
                Items = dtoList,
                HasNextPage = hasNextPage,
                NextCursor = nextCursor
            };
        }

        public async Task<CommentPagedResult<CommentDto>> GetCommentRepliesAsync(int parentId, int? cursor, int limit, int currentUserId)
        {
            // Fetch limit + 1 to check if there is a next page
            var repliesWithPlusOne = (await _commentRepository.GetRepliesAsync(parentId, cursor, limit + 1)).ToList();
            
            var hasNextPage = repliesWithPlusOne.Count > limit;
            var items = hasNextPage ? repliesWithPlusOne.Take(limit).ToList() : repliesWithPlusOne;
            
            var lastItem = items.LastOrDefault();
            var nextCursor = hasNextPage ? lastItem?.Id : null;

            var dtoList = await MapToCommentDtoListAsync(items, currentUserId);

            return new CommentPagedResult<CommentDto>
            {
                Items = dtoList,
                HasNextPage = hasNextPage,
                NextCursor = nextCursor
            };
        }

        public async Task<CommentLikeDto> ToggleCommentLikeAsync(int commentId, int userId)
        {
            var like = await _commentRepository.ToggleCommentLikeAsync(commentId, userId);
            if (like == null)
            {
                throw new CommentNotFoundException(commentId);
            }

            // Fetch updated comment to get accurate LikeCount
            var comment = await _commentRepository.GetCommentByIdAsync(commentId);

            return new CommentLikeDto
            {
                CommentId = commentId,
                UserId = userId,
                IsLiked = await _commentRepository.UserHasLikedCommentAsync(commentId, userId),
                LikeCount = comment?.LikeCount ?? 0
            };

        }

        public async Task<int> GetCommentLikeCountAsync(int commentId)
        {
            return await _commentRepository.GetCommentLikeCountAsync(commentId);
        }

        public async Task<bool> DeleteCommentAsync(int commentId, int currentUserId)
        {
            var comment = await _commentRepository.GetCommentByIdAsync(commentId);
            if (comment == null)
            {
                throw new CommentNotFoundException(commentId);
            }

            // Verify user owns the comment
            if (comment.UserId != currentUserId)
            {
                throw new UnauthorizedAccessException("You can only delete your own comments");
            }

            return await _commentRepository.SoftDeleteCommentAsync(commentId, currentUserId);
        }

        private async Task<CommentDto> MapToCommentDtoAsync(Comment comment, int currentUserId)
        {
            var userLiked = await _commentRepository.UserHasLikedCommentAsync(comment.Id, currentUserId);

            return new CommentDto
            {
                Id = comment.Id,
                Content = comment.Content,
                UserId = comment.UserId,
                UserName = comment.User?.Name ?? string.Empty,
                UserAvatarUrl = comment.User?.ProfilePictureUrl,
                DateCreated = comment.DateCreated,
                LikeCount = comment.LikeCount,
                ReplyCount = comment.ReplyCount,
                IsLikedByCurrentUser = userLiked
            };
        }

        private async Task<List<CommentDto>> MapToCommentDtoListAsync(IEnumerable<Comment> comments, int currentUserId)
        {
            var commentList = comments.ToList();
            var commentIds = commentList.Select(c => c.Id).ToList();
            
            // Optimized: Single query for all like statuses
            var likedCommentIds = (await _commentRepository.GetLikedCommentIdsAsync(commentIds, currentUserId)).ToHashSet();

            return commentList.Select(c => new CommentDto
            {
                Id = c.Id,
                Content = c.Content,
                UserId = c.UserId,
                UserName = c.User?.Name ?? string.Empty,
                UserAvatarUrl = c.User?.ProfilePictureUrl,
                DateCreated = c.DateCreated,
                LikeCount = c.LikeCount,
                ReplyCount = c.ReplyCount,
                IsLikedByCurrentUser = likedCommentIds.Contains(c.Id)
            }).ToList();
        }
    }
}

