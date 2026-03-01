using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GenAlphaSpace.Migrations
{
    /// <inheritdoc />
    public partial class AddCommentIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Comments_PostId",
                table: "Comments");

            migrationBuilder.DropIndex(
                name: "IX_CommentLikes_UserId",
                table: "CommentLikes");

            migrationBuilder.CreateIndex(
                name: "IX_Comments_PostId_ParentCommentId_Id",
                table: "Comments",
                columns: new[] { "PostId", "ParentCommentId", "Id" });

            migrationBuilder.CreateIndex(
                name: "IX_CommentLikes_UserId_CommentId",
                table: "CommentLikes",
                columns: new[] { "UserId", "CommentId" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Comments_PostId_ParentCommentId_Id",
                table: "Comments");

            migrationBuilder.DropIndex(
                name: "IX_CommentLikes_UserId_CommentId",
                table: "CommentLikes");

            migrationBuilder.CreateIndex(
                name: "IX_Comments_PostId",
                table: "Comments",
                column: "PostId");

            migrationBuilder.CreateIndex(
                name: "IX_CommentLikes_UserId",
                table: "CommentLikes",
                column: "UserId");
        }
    }
}
