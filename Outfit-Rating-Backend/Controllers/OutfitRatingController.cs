using Microsoft.AspNetCore.Authorization;
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
    [Authorize]
    public class OutfitRatingController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IOutfitService _outfitService;
        private readonly IRatingService _ratingService;

        public OutfitRatingController(
            AppDbContext context,
            IOutfitService outfitRatingService,
            IRatingService ratingService
        )
        {
            _context = context;
            _outfitService = outfitRatingService;
            _ratingService = ratingService;
        }

        // Retrieves the current user's ID from claims (string from Identity)
        private string GetUserId()
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                throw new UnauthorizedAccessException("User ID claim not found.");
            return userIdClaim.Value;
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
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new { message = "An error occurred while creating the item." }
                );
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
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new { message = "An error occurred while retrieving the outfit." }
                );
            }
        }

        [HttpGet("creator/{creatorId}")]
        public async Task<IActionResult> GetOutfitsByCreatorId(string creatorId)
        {
            try
            {
                var outfit = await _outfitService.GetOutfitsByCreatorIdAsync(creatorId);
                if (outfit == null)
                {
                    return NotFound($"No outfits found for {creatorId}");
                }
                return Ok(outfit);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateOutfitAsync([FromForm] OutfitDto dto)
        {
            var creatorId = GetUserId();
            var createdOutfit = await _outfitService.CreateOutfitAsync(dto, creatorId);
            return Ok(createdOutfit);
        }

        [HttpPut("{Id:guid}")]
        public async Task<IActionResult> UpdateOutfitAsync(Guid Id, [FromForm] OutfitDto dto)
        {
            var userId = GetUserId();

            var outfit = await _context.OutfitRating.FindAsync(Id);
            if (outfit == null)
            {
                return NotFound($"Outfit with ID {Id} not found.");
            }

            if (outfit.CreatorId != userId)
            {
                return Forbid();
            }

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
            var userId = GetUserId();

            var outfit = await _context.OutfitRating.FindAsync(Id);
            if (outfit == null)
            {
                return NotFound($"Outfit with ID {Id} not found.");
            }

            if (outfit.CreatorId != userId)
            {
                return Forbid();
            }

            var deletedOutfit = await _outfitService.DeleteOutfitAsync(new OutfitDto { Id = Id }); //Only require id for delete
            if (deletedOutfit == null)
            {
                return BadRequest("Could not delete outfit");
            }
            return Ok(deletedOutfit);
        }

        // Endpoint for rating an outfit
        [HttpPost("{Id:guid}/rating")]
        public async Task<IActionResult> Rate([FromRoute] Guid Id, [FromBody] RatingsDto dto)
        {
            try
            {
                var userId = GetUserId();

                await _ratingService.RateOutfit(userId, Id, dto.Value);

                var stats = await _ratingService.GetRatingStats(Id);
                return Ok(new { averageRating = stats.average, ratingsCount = stats.count });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // Endpoint for filtering outfits by style
        [HttpGet("style/{styleId:int}")]
        public async Task<IActionResult> GetByStyle(int styleId)
        {
            var outfits = await _outfitService.GetOutfitsByStyleAsync(styleId);
            return Ok(outfits);
        }
    }
}
