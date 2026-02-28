using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GenAlphaSpace.Migrations
{
    /// <inheritdoc />
    public partial class RemoveLikeId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Id",
                table: "Likes");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "Likes",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
