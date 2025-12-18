using Microsoft.EntityFrameworkCore;
using MovieTown.Models;

public class CinemaDbContext : DbContext
{
    public CinemaDbContext(DbContextOptions<CinemaDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Cinema> Cinemas => Set<Cinema>();
    public DbSet<Screening> Screenings => Set<Screening>();
    public DbSet<Reservation> Reservations => Set<Reservation>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Reservation>()
            .HasIndex(r => new { r.ScreeningId, r.Row, r.Seat })
            .IsUnique();

        modelBuilder.Entity<User>()
            .Property(u => u.xmin)
            .HasColumnType("xid")
            .IsConcurrencyToken()
            .ValueGeneratedOnAddOrUpdate();

        modelBuilder.Entity<Cinema>().HasData(
            new Cinema { Id = 1, Name = "Cinema Warszawa", Rows = 8, SeatsPerRow = 10 },
            new Cinema { Id = 2, Name = "Cinema Lublin", Rows = 12, SeatsPerRow = 14 }
        );
    }
}
