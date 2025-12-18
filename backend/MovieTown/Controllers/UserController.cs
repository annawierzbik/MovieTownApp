using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserController : ControllerBase
{
    private readonly CinemaDbContext _db;

    public UserController(CinemaDbContext db)
    {
        _db = db;
    }

    private int? GetUserIdFromClaims()
    {
        if (!User.Identity.IsAuthenticated)
        {
             return null;
        }

        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier); 

        if (string.IsNullOrEmpty(userIdString))
        {
             userIdString = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        }

        if (int.TryParse(userIdString, out int userId))
        {
            return userId;
        }
        
        return null; 
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _db.Users
            .AsNoTracking() 
            .Select(u => new
            {
                u.Id,
                u.Email,
                u.FullName,
                u.PhoneNumber,
                u.Role,
                u.xmin
            })
            .ToListAsync();

        return Ok(users);
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetMe()
    {
        var userId = GetUserIdFromClaims();
        if (userId == null) return BadRequest("User ID claim (sub) is missing or invalid in the token."); 
        
        var user = await _db.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == userId.Value); 
            
        if (user == null) return NotFound("User not found in database.");

        return Ok(new 
        { 
            user.Id, 
            user.Email, 
            user.FullName, 
            user.PhoneNumber, 
            user.Role, 
            user.xmin
        });
    }

    [HttpPut("me")]
    public async Task<IActionResult> UpdateMe(UpdateUserDto dto)
    {
        var userId = GetUserIdFromClaims();
        if (userId == null) return BadRequest("User ID claim (sub) is missing or invalid in the token."); 
        
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId.Value); 
        if (user == null) return NotFound("User not found in database.");

        user.FullName = dto.FullName ?? user.FullName;
        user.PhoneNumber = dto.PhoneNumber ?? user.PhoneNumber;

        _db.Entry(user).Property(u => u.xmin).OriginalValue = dto.xmin;

        try
        {
            await _db.SaveChangesAsync();
            return Ok(new { message = "User profile updated successfully.", fullName = user.FullName });
        }
        catch (DbUpdateConcurrencyException)
        {
            return StatusCode(500, "Concurrency conflict during update. Please refresh and try again.");
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateUser(int id, AdminUpdateUserDto dto)
    {
        var user = await _db.Users.FindAsync(id);
        if (user == null) return NotFound("User to update not found.");

        user.FullName = dto.FullName ?? user.FullName;
        user.PhoneNumber = dto.PhoneNumber ?? user.PhoneNumber;

        if (!string.IsNullOrEmpty(dto.Role))
            user.Role = dto.Role;

        _db.Entry(user).Property(u => u.xmin).OriginalValue = dto.xmin;

        try
        {
            await _db.SaveChangesAsync();
            return Ok(new { message = $"User {id} updated by admin." });
        }
        catch (DbUpdateConcurrencyException)
        {
            return StatusCode(500, "Concurrency conflict during update. Please refresh and try again.");
        }
    }
}

public record UpdateUserDto(string? FullName, string? PhoneNumber, uint xmin);
public record AdminUpdateUserDto(string? FullName, string? PhoneNumber, string? Role, uint xmin);