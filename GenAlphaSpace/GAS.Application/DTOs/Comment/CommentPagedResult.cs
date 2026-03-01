namespace GenAlphaSpace.GAS.Application.DTOs.Comment
{
    public class CommentPagedResult<T>
    {
        public List<T> Items { get; set; } = new();
        public bool HasNextPage { get; set; }
        public int? NextCursor { get; set; }
    }
}
