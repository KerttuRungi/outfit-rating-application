using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using OutfitRating.Domain.Entities;
using OutfitRating.Infrastructure.Migrations;
using System.Security.Claims;

namespace Outfit_Rating_Backend.Controllers
{
    [ApiController]
    [Route("auth")]
    public class AuthController : ControllerBase
    {
        private readonly SignInManager<ApplicationUser> _signInManager;

        public AuthController(SignInManager<ApplicationUser> signInManager)
        {
            _signInManager = signInManager;
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            // Reset cookies
            await _signInManager.SignOutAsync();

            return Ok(new { message = "Logged out successfully" });
        }

        //Get user id for creatorId
        [HttpGet("user-id")]
        [Authorize]
        public IActionResult GetUserId()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            return Ok(new { userId });
        }
}
}