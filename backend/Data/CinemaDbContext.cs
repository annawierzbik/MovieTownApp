using Microsoft.EntityFrameworkCore;
using MovieTown.Models;
using Microsoft.EntityFrameworkCore.Diagnostics;
public class CinemaDbContext : DbContext
{
    public CinemaDbContext(DbContextOptions<CinemaDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Movie> Movies => Set<Movie>();
    public DbSet<Cinema> Cinemas => Set<Cinema>();
    public DbSet<Screening> Screenings => Set<Screening>();
    public DbSet<Reservation> Reservations => Set<Reservation>();

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.ConfigureWarnings(w => w.Ignore(RelationalEventId.PendingModelChangesWarning));
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Reservation>()
            .HasIndex(r => new { r.ScreeningId, r.Row, r.Seat })
            .IsUnique();
        
        modelBuilder.Entity<Reservation>()
        .HasOne(r => r.Screening)
        .WithMany(s => s.Reservations)
        .HasForeignKey(r => r.ScreeningId)
        .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Reservation>()
    .HasOne(r => r.User)
    .WithMany(u => u.Reservations)
    .HasForeignKey(r => r.UserId);

        modelBuilder.Entity<User>()
            .Property(u => u.xmin)
            .HasColumnType("xid")
            .IsConcurrencyToken()
            .ValueGeneratedOnAddOrUpdate();

        modelBuilder.Entity<Cinema>().HasData(
            new Cinema { Id = 1, Name = "Cinema Warszawa", Rows = 8, SeatsPerRow = 10 },
            new Cinema { Id = 2, Name = "Cinema Lublin", Rows = 12, SeatsPerRow = 14 }
        );

        modelBuilder.Entity<Movie>().HasData(
            new Movie
            {
                Id = 1,
                Title = "Interstellar",
                Genre = "Sci-Fi • Adventure",
                Rating = "4.9",
                Duration = "2h 49m",
                ReleaseDate = "2014",
                Director = "Christopher Nolan",
                Cast = "M. McConaughey, Anne Hathaway, Jessica Chastain",
                PosterImg = "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=800",
                BackdropImg = "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1800",
                Description = "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival."
            },
            new Movie
            {
                Id = 2,
                Title = "The Batman",
                Genre = "Action • Crime",
                Rating = "4.7",
                Duration = "2h 56m",
                ReleaseDate = "2022",
                Director = "Matt Reeves",
                Cast = "Robert Pattinson, Zoë Kravitz, Paul Dano",
                PosterImg = "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=800",
                BackdropImg = "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1800",
                Description = "Batman ventures into Gotham City's underworld when a sadistic killer leaves behind a trail of cryptic clues."
            },
            new Movie
            {
                Id = 3,
                Title = "Inception",
                Genre = "Sci-Fi • Action",
                Rating = "4.8",
                Duration = "2h 28m",
                ReleaseDate = "2010",
                Director = "Christopher Nolan",
                Cast = "Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page",
                PosterImg = "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800",
                BackdropImg = "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1800",
                Description = "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea."
            },
            new Movie
            {
                Id = 4,
                Title = "Blade Runner 2049",
                Genre = "Sci-Fi • Drama",
                Rating = "4.5",
                Duration = "2h 44m",
                ReleaseDate = "2017",
                Director = "Denis Villeneuve",
                Cast = "Ryan Gosling, Harrison Ford, Ana de Armas",
                PosterImg = "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=800",
                BackdropImg = "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1800",
                Description = "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard."
            },
            new Movie
            {
                Id = 5,
                Title = "The Joker",
                Genre = "Crime • Drama",
                Rating = "4.6",
                Duration = "2h 02m",
                ReleaseDate = "2019",
                Director = "Todd Phillips",
                Cast = "Joaquin Phoenix, Robert De Niro, Zazie Beetz",
                PosterImg = "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&w=800",
                BackdropImg = "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&w=1800",
                Description = "A mentally troubled stand-up comedian embarks on a downward spiral that leads to the creation of an iconic villain."
            },
            new Movie
            {
                Id = 6,
                Title = "Dune: Part Two",
                Genre = "Sci-Fi • Adventure",
                Rating = "4.9",
                Duration = "2h 46m",
                ReleaseDate = "2024",
                Director = "Denis Villeneuve",
                Cast = "Timothée Chalamet, Zendaya, Rebecca Ferguson",
                PosterImg = "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=800",
                BackdropImg = "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=1800",
                Description = "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family."
            },
            new Movie
            {
                Id = 7,
                Title = "Spider-Man: Across Verse",
                Genre = "Animation • Action",
                Rating = "4.9",
                Duration = "2h 20m",
                ReleaseDate = "2023",
                Director = "Joaquim Dos Santos",
                Cast = "Shameik Moore, Hailee Steinfeld, Oscar Isaac",
                PosterImg = "https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=800",
                BackdropImg = "https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=1800",
                Description = "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its existence."
            },
            new Movie
            {
                Id = 8,
                Title = "Oppenheimer",
                Genre = "Biography • Drama",
                Rating = "4.8",
                Duration = "3h 00m",
                ReleaseDate = "2023",
                Director = "Christopher Nolan",
                Cast = "Cillian Murphy, Emily Blunt, Matt Damon",
                PosterImg = "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800",
                BackdropImg = "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1800",
                Description = "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb."
            },
            new Movie
            {
                Id = 9,
                Title = "The Matrix",
                Genre = "Sci-Fi • Action",
                Rating = "4.7",
                Duration = "2h 16m",
                ReleaseDate = "1999",
                Director = "Lana Wachowski",
                Cast = "Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss",
                PosterImg = "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=800",
                BackdropImg = "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1800",
                Description = "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers."
            },
            new Movie
            {
                Id = 10,
                Title = "Parasite",
                Genre = "Drama • Thriller",
                Rating = "4.6",
                Duration = "2h 12m",
                ReleaseDate = "2019",
                Director = "Bong Joon Ho",
                Cast = "Song Kang-ho, Lee Sun-kyun, Cho Yeo-jeong",
                PosterImg = "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&w=800",
                BackdropImg = "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&w=1800",
                Description = "Greed and class discrimination threaten the symbiotic relationship between the wealthy Park family and the destitute Kim clan."
            }
        );


        modelBuilder.Entity<Screening>().HasData(
            new Screening { Id = 1, CinemaId = 1, MovieId = 1, StartTime = DateTime.UtcNow.AddHours(2) },
            new Screening { Id = 2, CinemaId = 1, MovieId = 2, StartTime = DateTime.UtcNow.AddHours(5) },
            new Screening { Id = 3, CinemaId = 2, MovieId = 3, StartTime = DateTime.UtcNow.AddHours(20) },
            new Screening { Id = 4, CinemaId = 2, MovieId = 4, StartTime = DateTime.UtcNow.AddHours(110) },
            new Screening { Id = 5, CinemaId = 1, MovieId = 5, StartTime = DateTime.UtcNow.AddHours(80) },
            new Screening { Id = 6, CinemaId = 2, MovieId = 6, StartTime = DateTime.UtcNow.AddHours(16) },
            new Screening { Id = 7, CinemaId = 1, MovieId = 7, StartTime = DateTime.UtcNow.AddHours(60) },
            new Screening { Id = 8, CinemaId = 2, MovieId = 8, StartTime = DateTime.UtcNow.AddHours(112) }
        );
    }
}