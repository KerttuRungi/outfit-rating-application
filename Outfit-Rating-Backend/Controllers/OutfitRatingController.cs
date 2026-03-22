using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OutfitRating.Application.Dtos;
using OutfitRating.Application.Interfaces;
using OutfitRating.Infrastructure;

namespace Outfit_Rating_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OutfitRatingController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IOutfitRatingService _outfitRatingService;

        public OutfitRatingController(AppDbContext context, IOutfitRatingService outfitRatingService)
        {
            _context = context;
            _outfitRatingService = outfitRatingService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllOutfits()
        {
            try
            {
                var outfit = await _outfitRatingService.GetAllOutfitsAsync();
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
                var outfit = await _outfitRatingService.GetOutfitByIdAsync(Id);
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
            var createdOutfit = await _outfitRatingService.CreateOutfitAsync(dto);
            return Ok(createdOutfit);
        }

        [HttpPut("{Id:guid}")]
        public async Task<IActionResult> UpdateOutfitAsync( Guid Id, OutfitDto dto)
        {
            dto.Id = Id;
            var updatedOutfit = await _outfitRatingService.UpdateOutfitAsync(dto);
            if (updatedOutfit == null)
            {
                return BadRequest("Could not update outfit");
            }
            return Ok(updatedOutfit);
        }

        [HttpDelete("{Id:guid}")]
        public async Task<IActionResult> DeleteOutfitAsync( Guid Id, OutfitDto dto)
        {
            dto.Id = Id;
            var deletedOutfit = await _outfitRatingService.DeleteOutfitAsync(dto);
            if (deletedOutfit == null)
            {
                return BadRequest("Could not delete outfit");
            }
            return Ok(deletedOutfit);
        }
    }
}