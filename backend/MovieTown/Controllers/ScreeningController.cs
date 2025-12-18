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
            .Select(s => new
            {
                s.Id,
                s.MovieTitle,
                s.StartTime,
                Cinema = new { s.Cinema.Id, s.Cinema.Name, s.Cinema.Rows, s.Cinema.SeatsPerRow }
            })
            .ToListAsync();

        return Ok(screenings);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create(CreateScreeningDto dto)
    {
        var cinema = await _db.Cinemas.FindAsync(dto.CinemaId);
        if (cinema == null) return BadRequest("Invalid cinema");

        var screening = new Screening
        {
            CinemaId = dto.CinemaId,
            MovieTitle = dto.MovieTitle,
            StartTime = dto.StartTime
        };

        _db.Screenings.Add(screening);
        await _db.SaveChangesAsync();

        return Ok(new
        {
            screening.Id,
            screening.MovieTitle,
            screening.StartTime,
            Cinema = new { cinema.Id, cinema.Name, cinema.Rows, cinema.SeatsPerRow }
        });
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var screening = await _db.Screenings
            .Include(s => s.Reservations)
            .Include(s => s.Cinema)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (screening == null) return NotFound();

        _db.Reservations.RemoveRange(screening.Reservations);
        _db.Screenings.Remove(screening);

        await _db.SaveChangesAsync();

        return Ok(new { message = "Screening deleted" });
    }
}

public record CreateScreeningDto(int CinemaId, string MovieTitle, DateTime StartTime);
