using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using OutfitRating.Application.Dtos;
using OutfitRating.Application.Interfaces;
using OutfitRating.Application.Services;
using OutfitRating.Infrastructure;

namespace Outfit_Rating_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableRateLimiting("fixed")]
    public class OutfitRatingController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IOutfitService _outfitService;
        private readonly IRatingService _ratingService;

        public OutfitRatingController(AppDbContext context, IOutfitService outfitRatingService, IRatingService ratingService)
        {
            _context = context;
            _outfitService = outfitRatingService;
            _ratingService = ratingService;
        }

        // Retrieves the current user's ID from claims
        private Guid GetUserId()
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                throw new UnauthorizedAccessException("User ID claim not found.");
            return Guid.Parse(userIdClaim.Value);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllOutfits()
        {
            try
            {
                var outfit = await _outfitService.GetAllOutfitsAsync();
                if (outfit == null || !outfit.Any())
                {
                    return NotFound("No items found.");
                }
                return Ok(outfit);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
            new { message = "An error occurred while creating the item." });

            }
        }
        [HttpGet("{Id:guid}")]
        public async Task<IActionResult> GetOutfitById(Guid Id)
        {
            try
            {
                var outfit = await _outfitService.GetOutfitByIdAsync(Id);
                if (outfit == null)
                {
                    return NotFound($"Outfit with ID {Id} not found.");
                }
                return Ok(outfit);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { message = "An error occurred while retrieving the outfit." });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateOutfitAsync([FromForm] OutfitDto dto)
        {
            var createdOutfit = await _outfitService.CreateOutfitAsync(dto);
            return Ok(createdOutfit);
        }

        [HttpPut("{Id:guid}")]
        public async Task<IActionResult> UpdateOutfitAsync(Guid Id, [FromForm] OutfitDto dto)
        {
            dto.Id = Id;
            var updatedOutfit = await _outfitService.UpdateOutfitAsync(dto);
            if (updatedOutfit == null)
            {
                return BadRequest("Could not update outfit");
            }
            return Ok(updatedOutfit);
        }

        [HttpDelete("{Id:guid}")]
        public async Task<IActionResult> DeleteOutfitAsync(Guid Id)
        {
            var deletedOutfit = await _outfitService.DeleteOutfitAsync(new OutfitDto { Id = Id }); //Only require id for delete
            if (deletedOutfit == null)
            {
                return BadRequest("Could not delete outfit");
            }
            return Ok(deletedOutfit);
        }

        [HttpPost("rating")]
        public async Task<IActionResult> Rate(Guid outfitId, int value)
        {
            var userId = GetUserId();

            await _ratingService.RateOutfit(userId, outfitId, value);

            return Ok();
        }
    }
}