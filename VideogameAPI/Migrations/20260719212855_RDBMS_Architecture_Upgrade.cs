using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace VideogameAPI.Migrations
{
    /// <inheritdoc />
    public partial class RDBMS_Architecture_Upgrade : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Developer",
                table: "VideoGames");

            migrationBuilder.DropColumn(
                name: "Platform",
                table: "VideoGames");

            migrationBuilder.DropColumn(
                name: "Publisher",
                table: "VideoGames");

            migrationBuilder.AddColumn<bool>(
                name: "IsReleased",
                table: "VideoGames",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "Price",
                table: "VideoGames",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "PublisherId",
                table: "VideoGames",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Developers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    BirthDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Developers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Platforms",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Platforms", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Publishers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Publishers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DeveloperVideoGame",
                columns: table => new
                {
                    DevelopersId = table.Column<int>(type: "integer", nullable: false),
                    VideoGamesId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DeveloperVideoGame", x => new { x.DevelopersId, x.VideoGamesId });
                    table.ForeignKey(
                        name: "FK_DeveloperVideoGame_Developers_DevelopersId",
                        column: x => x.DevelopersId,
                        principalTable: "Developers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DeveloperVideoGame_VideoGames_VideoGamesId",
                        column: x => x.VideoGamesId,
                        principalTable: "VideoGames",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PlatformVideoGame",
                columns: table => new
                {
                    PlatformsId = table.Column<int>(type: "integer", nullable: false),
                    VideoGamesId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlatformVideoGame", x => new { x.PlatformsId, x.VideoGamesId });
                    table.ForeignKey(
                        name: "FK_PlatformVideoGame_Platforms_PlatformsId",
                        column: x => x.PlatformsId,
                        principalTable: "Platforms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PlatformVideoGame_VideoGames_VideoGamesId",
                        column: x => x.VideoGamesId,
                        principalTable: "VideoGames",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_VideoGames_PublisherId",
                table: "VideoGames",
                column: "PublisherId");

            migrationBuilder.CreateIndex(
                name: "IX_DeveloperVideoGame_VideoGamesId",
                table: "DeveloperVideoGame",
                column: "VideoGamesId");

            migrationBuilder.CreateIndex(
                name: "IX_PlatformVideoGame_VideoGamesId",
                table: "PlatformVideoGame",
                column: "VideoGamesId");

            migrationBuilder.AddForeignKey(
                name: "FK_VideoGames_Publishers_PublisherId",
                table: "VideoGames",
                column: "PublisherId",
                principalTable: "Publishers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_VideoGames_Publishers_PublisherId",
                table: "VideoGames");

            migrationBuilder.DropTable(
                name: "DeveloperVideoGame");

            migrationBuilder.DropTable(
                name: "PlatformVideoGame");

            migrationBuilder.DropTable(
                name: "Publishers");

            migrationBuilder.DropTable(
                name: "Developers");

            migrationBuilder.DropTable(
                name: "Platforms");

            migrationBuilder.DropIndex(
                name: "IX_VideoGames_PublisherId",
                table: "VideoGames");

            migrationBuilder.DropColumn(
                name: "IsReleased",
                table: "VideoGames");

            migrationBuilder.DropColumn(
                name: "Price",
                table: "VideoGames");

            migrationBuilder.DropColumn(
                name: "PublisherId",
                table: "VideoGames");

            migrationBuilder.AddColumn<string>(
                name: "Developer",
                table: "VideoGames",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Platform",
                table: "VideoGames",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Publisher",
                table: "VideoGames",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
