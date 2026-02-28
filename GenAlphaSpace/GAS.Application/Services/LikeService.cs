using GenAlphaSpace.GAS.Application.DTOs.Post;
using GenAlphaSpace.GAS.Application.Interfaces;
using GenAlphaSpace.GAS.Domain.Entities;
using GenAlphaSpace.GAS.Domain.Exceptions;
using GenAlphaSpace.GAS.Domain.Interfaces;

namespace GenAlphaSpace.GAS.Application.Services
{
    public class LikeService : ILikeService
    {
        private readonly IPostRepository _postRepository;
        private readonly ILikeRepository _likeRepository;

        public LikeService(IPostRepository postRepository, ILikeRepository likeRepository)
        {
            _postRepository = postRepository;
            _likeRepository = likeRepository;
        }

        public async Task<LikeCountDto> GetPostLikeCountAsync(int postId)
        {
            var likeCount = await _likeRepository.GetLikeCountAsync(postId);
            return new LikeCountDto { PostId = postId, LikeCount = likeCount };
        }

        public async Task<TogglePostLikeDto> TogglePostLikeAsync(TogglePostLikeDto dto)
        {
            var postExists = await _postRepository.PostExistsAsync(dto.PostId);
            if (!postExists)
            {
                throw new PostNotFoundException(dto.PostId);
            }

            var likeExists = await _likeRepository.LikeExistsAsync(dto.PostId, dto.UserId);

            if (likeExists)
            {
                var like = new Like { PostId = dto.PostId, Userid = dto.UserId };
                await _likeRepository.UnlikeAsync(like);
            }
            else
            {
                var like = new Like { PostId = dto.PostId, Userid = dto.UserId };
                await _likeRepository.LikeAsync(like);
            }

            return dto;
        }
    }
}
