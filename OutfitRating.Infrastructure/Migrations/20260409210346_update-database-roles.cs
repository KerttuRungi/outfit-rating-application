using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OutfitRating.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class updatedatabaseroles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "Ratings",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AddColumn<string>(
                name: "CreatorId",
                table: "OutfitRating",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatorId",
                table: "OutfitRating");

            migrationBuilder.AlterColumn<Guid>(
                name: "UserId",
                table: "Ratings",
                type: "uniqueidentifier",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");
        }
    }
}
