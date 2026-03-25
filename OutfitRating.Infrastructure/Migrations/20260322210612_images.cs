using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OutfitRating.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class images : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "OutfitImages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FilePath = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OutfitId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OutfitImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OutfitImages_OutfitRating_OutfitId",
                        column: x => x.OutfitId,
                        principalTable: "OutfitRating",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OutfitImages_OutfitId",
                table: "OutfitImages",
                column: "OutfitId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OutfitImages");
        }
    }
}
