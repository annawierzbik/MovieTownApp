using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovieTown.Models;

[ApiController]
[Route("api/[controller]")]
[Authorize] 
public class ScreeningController : ControllerBase
{
    private readonly CinemaDbContext _db;

    public ScreeningController(CinemaDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var screenings = await _db.Screenings
            .Include(s => s.Cinema)
            .Include(s => s.Movie) 
            .Select(s => new
            {
                s.Id,
                s.StartTime,
                Movie = new { 
                    s.Movie.Id, 
                    s.Movie.Title, 
                    s.Movie.PosterImg, 
                    s.Movie.Genre, 
                    s.Movie.Duration,
                    s.Movie.Rating
                },
                Cinema = new { s.Cinema.Id, s.Cinema.Name, s.Cinema.Rows, s.Cinema.SeatsPerRow }
            })
            .ToListAsync();

        return Ok(screenings);
    }
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var screening = await _db.Screenings
            .Include(s => s.Cinema)
            .Include(s => s.Movie)
            .Select(s => new
            {
                s.Id,
                s.StartTime,
                Movie = new { s.Movie.Title, s.Movie.PosterImg },
                Cinema = new { s.Cinema.Id, s.Cinema.Name, s.Cinema.Rows, s.Cinema.SeatsPerRow }
            })
            .FirstOrDefaultAsync(s => s.Id == id);

        if (screening == null) return NotFound();

        return Ok(screening);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create(CreateScreeningDto dto)
    {
        var cinema = await _db.Cinemas.FindAsync(dto.CinemaId);
        if (cinema == null) return BadRequest("Invalid cinema");

        var movie = await _db.Movies.FindAsync(dto.MovieId);
        if (movie == null) return BadRequest("Invalid movie ID");

        var screening = new Screening
        {
            CinemaId = dto.CinemaId,
            MovieId = dto.MovieId, 
            StartTime = dto.StartTime
        };

        _db.Screenings.Add(screening);
        await _db.SaveChangesAsync();

        return Ok(new
        {
            screening.Id,
            screening.StartTime,
            Movie = new { movie.Id, movie.Title, movie.PosterImg },
            Cinema = new { cinema.Id, cinema.Name, cinema.Rows, cinema.SeatsPerRow }
        });
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var screening = await _db.Screenings
            .Include(s => s.Reservations)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (screening == null) return NotFound();

        _db.Reservations.RemoveRange(screening.Reservations);
        _db.Screenings.Remove(screening);

        await _db.SaveChangesAsync();

        return Ok(new { message = "Screening deleted successfully" });
    }
}

public record CreateScreeningDto(int CinemaId, int MovieId, DateTime StartTime);