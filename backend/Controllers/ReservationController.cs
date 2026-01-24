using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovieTown.Models;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReservationController : ControllerBase
{
    private readonly CinemaDbContext _db;

    public ReservationController(CinemaDbContext db) { _db = db; }

    [HttpGet("screening/{screeningId}")]
    public async Task<IActionResult> GetByScreening(int screeningId)
    {
        var occupied = await _db.Reservations
            .Where(r => r.ScreeningId == screeningId)
            .Select(r => new { r.Row, r.Seat })
            .ToListAsync();
        return Ok(occupied);
    }

    [HttpPost]
    public async Task<IActionResult> Book([FromBody] CreateReservationDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null) return Unauthorized();
        
        var userId = int.Parse(userIdClaim);

        bool alreadyTaken = await _db.Reservations.AnyAsync(r => 
            r.ScreeningId == dto.ScreeningId && r.Row == dto.Row && r.Seat == dto.Seat);

        if (alreadyTaken) return BadRequest("Seat is already occupied.");

        var reservation = new Reservation
        {
            ScreeningId = dto.ScreeningId,
            UserId = userId,
            Row = dto.Row,
            Seat = dto.Seat
        };

        try
        {
            _db.Reservations.Add(reservation);
            await _db.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {

            return Conflict(new { 
                message = "Collision detected. This seat was just taken by another user.",
                errorCode = "CONCURRENCY_ERROR"
            });
        }

        return Ok(new { message = "Reservation confirmed." });
    }
    [HttpDelete("{id}")]
    public async Task<IActionResult> Cancel(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        var reservation = await _db.Reservations.FindAsync(id);

        if (reservation == null) return NotFound();
        if (reservation.UserId != userId) return Forbid(); 

        _db.Reservations.Remove(reservation);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Reservation cancelled." });
    }
    
    [HttpGet("me")]
    public async Task<IActionResult> GetMyReservations()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        
        var myReservations = await _db.Reservations
            .Where(r => r.UserId == userId)
            .Select(r => new {
                r.Id,
                r.Row,
                r.Seat,
                Screening = new {
                    r.Screening.StartTime,
                    Movie = new {
                        r.Screening.Movie.Title,
                        r.Screening.Movie.PosterImg
                    },
                    Cinema = new {
                        r.Screening.Cinema.Name
                    }
                }
            })
            .ToListAsync();

        return Ok(myReservations);
    }
}

public record CreateReservationDto(int ScreeningId, int Row, int Seat);