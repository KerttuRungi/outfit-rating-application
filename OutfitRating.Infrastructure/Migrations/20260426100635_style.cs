using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace OutfitRating.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class style : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "StyleId",
                table: "OutfitRating",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "StyleFilters",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StyleFilters", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "StyleFilters",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Casual" },
                    { 2, "Formal" },
                    { 3, "Streetwear" },
                    { 4, "Vintage" },
                    { 5, "Chic" },
                    { 6, "Athleisure" },
                    { 7, "Y2k" },
                    { 8, "Alternative" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_OutfitRating_StyleId",
                table: "OutfitRating",
                column: "StyleId");

            migrationBuilder.AddForeignKey(
                name: "FK_OutfitRating_StyleFilters_StyleId",
                table: "OutfitRating",
                column: "StyleId",
                principalTable: "StyleFilters",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OutfitRating_StyleFilters_StyleId",
                table: "OutfitRating");

            migrationBuilder.DropTable(
                name: "StyleFilters");

            migrationBuilder.DropIndex(
                name: "IX_OutfitRating_StyleId",
                table: "OutfitRating");

            migrationBuilder.DropColumn(
                name: "StyleId",
                table: "OutfitRating");
        }
    }
}
