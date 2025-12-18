using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovieTown.Models;

namespace MovieTown.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CinemaController : ControllerBase
    {
        private readonly CinemaDbContext _db;

        public CinemaController(CinemaDbContext db)
        {
            _db = db;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cinema>>> GetCinemas()
        {
            var cinemas = await _db.Cinemas.ToListAsync();
            return Ok(cinemas);
        }
    }
}
