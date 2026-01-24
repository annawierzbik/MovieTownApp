using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace MovieTown.Migrations
{
    /// <inheritdoc />
    public partial class InitialWithMovies : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Cinemas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Rows = table.Column<int>(type: "integer", nullable: false),
                    SeatsPerRow = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cinemas", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Movies",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Genre = table.Column<string>(type: "text", nullable: false),
                    Duration = table.Column<string>(type: "text", nullable: false),
                    Rating = table.Column<string>(type: "text", nullable: false),
                    ReleaseDate = table.Column<string>(type: "text", nullable: false),
                    PosterImg = table.Column<string>(type: "text", nullable: false),
                    BackdropImg = table.Column<string>(type: "text", nullable: false),
                    Director = table.Column<string>(type: "text", nullable: false),
                    Cast = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Movies", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Email = table.Column<string>(type: "text", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: false),
                    FullName = table.Column<string>(type: "text", nullable: false),
                    PhoneNumber = table.Column<string>(type: "text", nullable: false),
                    Role = table.Column<string>(type: "text", nullable: false),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Screenings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CinemaId = table.Column<int>(type: "integer", nullable: false),
                    MovieId = table.Column<int>(type: "integer", nullable: false),
                    StartTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Screenings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Screenings_Cinemas_CinemaId",
                        column: x => x.CinemaId,
                        principalTable: "Cinemas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Screenings_Movies_MovieId",
                        column: x => x.MovieId,
                        principalTable: "Movies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Reservations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ScreeningId = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    Row = table.Column<int>(type: "integer", nullable: false),
                    Seat = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reservations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Reservations_Screenings_ScreeningId",
                        column: x => x.ScreeningId,
                        principalTable: "Screenings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Reservations_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Cinemas",
                columns: new[] { "Id", "Name", "Rows", "SeatsPerRow" },
                values: new object[,]
                {
                    { 1, "Cinema Warszawa", 8, 10 },
                    { 2, "Cinema Lublin", 12, 14 }
                });

            migrationBuilder.InsertData(
                table: "Movies",
                columns: new[] { "Id", "BackdropImg", "Cast", "Description", "Director", "Duration", "Genre", "PosterImg", "Rating", "ReleaseDate", "Title" },
                values: new object[,]
                {
                    { 1, "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1800", "M. McConaughey, Anne Hathaway, Jessica Chastain", "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.", "Christopher Nolan", "2h 49m", "Sci-Fi • Adventure", "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=800", "4.9", "2014", "Interstellar" },
                    { 2, "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1800", "Robert Pattinson, Zoë Kravitz, Paul Dano", "Batman ventures into Gotham City's underworld when a sadistic killer leaves behind a trail of cryptic clues.", "Matt Reeves", "2h 56m", "Action • Crime", "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=800", "4.7", "2022", "The Batman" },
                    { 3, "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1800", "Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page", "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.", "Christopher Nolan", "2h 28m", "Sci-Fi • Action", "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800", "4.8", "2010", "Inception" },
                    { 4, "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1800", "Ryan Gosling, Harrison Ford, Ana de Armas", "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard.", "Denis Villeneuve", "2h 44m", "Sci-Fi • Drama", "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=800", "4.5", "2017", "Blade Runner 2049" },
                    { 5, "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&w=1800", "Joaquin Phoenix, Robert De Niro, Zazie Beetz", "A mentally troubled stand-up comedian embarks on a downward spiral that leads to the creation of an iconic villain.", "Todd Phillips", "2h 02m", "Crime • Drama", "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&w=800", "4.6", "2019", "The Joker" },
                    { 6, "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=1800", "Timothée Chalamet, Zendaya, Rebecca Ferguson", "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.", "Denis Villeneuve", "2h 46m", "Sci-Fi • Adventure", "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=800", "4.9", "2024", "Dune: Part Two" },
                    { 7, "https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=1800", "Shameik Moore, Hailee Steinfeld, Oscar Isaac", "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its existence.", "Joaquim Dos Santos", "2h 20m", "Animation • Action", "https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=800", "4.9", "2023", "Spider-Man: Across Verse" },
                    { 8, "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1800", "Cillian Murphy, Emily Blunt, Matt Damon", "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.", "Christopher Nolan", "3h 00m", "Biography • Drama", "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800", "4.8", "2023", "Oppenheimer" },
                    { 9, "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1800", "Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss", "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.", "Lana Wachowski", "2h 16m", "Sci-Fi • Action", "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=800", "4.7", "1999", "The Matrix" },
                    { 10, "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&w=1800", "Song Kang-ho, Lee Sun-kyun, Cho Yeo-jeong", "Greed and class discrimination threaten the symbiotic relationship between the wealthy Park family and the destitute Kim clan.", "Bong Joon Ho", "2h 12m", "Drama • Thriller", "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&w=800", "4.6", "2019", "Parasite" }
                });

            migrationBuilder.InsertData(
                table: "Screenings",
                columns: new[] { "Id", "CinemaId", "MovieId", "StartTime" },
                values: new object[,]
                {
                    { 1, 1, 1, new DateTime(2026, 1, 24, 15, 22, 45, 950, DateTimeKind.Utc).AddTicks(3337) },
                    { 2, 1, 2, new DateTime(2026, 1, 24, 18, 22, 45, 950, DateTimeKind.Utc).AddTicks(3489) },
                    { 3, 2, 3, new DateTime(2026, 1, 25, 9, 22, 45, 950, DateTimeKind.Utc).AddTicks(3491) },
                    { 4, 2, 4, new DateTime(2026, 1, 29, 3, 22, 45, 950, DateTimeKind.Utc).AddTicks(3492) },
                    { 5, 1, 5, new DateTime(2026, 1, 27, 21, 22, 45, 950, DateTimeKind.Utc).AddTicks(3494) },
                    { 6, 2, 6, new DateTime(2026, 1, 25, 5, 22, 45, 950, DateTimeKind.Utc).AddTicks(3494) },
                    { 7, 1, 7, new DateTime(2026, 1, 27, 1, 22, 45, 950, DateTimeKind.Utc).AddTicks(3495) },
                    { 8, 2, 8, new DateTime(2026, 1, 29, 5, 22, 45, 950, DateTimeKind.Utc).AddTicks(3496) }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_ScreeningId_Row_Seat",
                table: "Reservations",
                columns: new[] { "ScreeningId", "Row", "Seat" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_UserId",
                table: "Reservations",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Screenings_CinemaId",
                table: "Screenings",
                column: "CinemaId");

            migrationBuilder.CreateIndex(
                name: "IX_Screenings_MovieId",
                table: "Screenings",
                column: "MovieId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Reservations");

            migrationBuilder.DropTable(
                name: "Screenings");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Cinemas");

            migrationBuilder.DropTable(
                name: "Movies");
        }
    }
}
