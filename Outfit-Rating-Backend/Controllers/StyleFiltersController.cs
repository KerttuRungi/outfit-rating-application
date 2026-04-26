using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using OutfitRating.Application.Dtos;
using OutfitRating.Infrastructure;

namespace Outfit_Rating_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableRateLimiting("fixed")]
    public class StyleFiltersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StyleFiltersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllStyles()
        {
            try
            {
                var styles = await _context.StyleFilters.ToListAsync();
                if (styles == null || !styles.Any())
                {
                    return NotFound("No styles found.");
                }
                var dtos = styles.Select(s => new StyleFiltersDto { Id = s.Id, Name = s.Name });
                return Ok(dtos);
            }
            catch (Exception ex)
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new { message = "An error occurred while retrieving styles." }
                );
            }
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetStyleById(int id)
        {
            try
            {
                var style = await _context.StyleFilters.FirstOrDefaultAsync(s => s.Id == id);
                if (style == null)
                {
                    return NotFound($"Style with ID {id} not found.");
                }
                var dto = new StyleFiltersDto { Id = style.Id, Name = style.Name };
                return Ok(dto);
            }
            catch (Exception ex)
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new { message = "An error occurred while retrieving the style." }
                );
            }
        }
    }
}
