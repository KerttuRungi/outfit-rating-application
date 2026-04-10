using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OutfitRating.Application.Interfaces;
using OutfitRating.Domain.Entities;
using OutfitRating.Infrastructure;

namespace OutfitRating.Application.Services
{
    public class RatingService : IRatingService
    {
        private readonly AppDbContext _context;
        public RatingService
        (
            AppDbContext context
        )
        {
            _context = context;
        }
        public async Task<(double average, int count)> GetRatingStats(Guid outfitId)
        {
            var ratings = await _context.Ratings
                .Where(r => r.OutfitId == outfitId)
                .ToListAsync();

            if (!ratings.Any())
                return (0, 0);

            var avg = ratings.Average(r => r.Value);
            var count = ratings.Count;

            return (avg, count);
        }
        public async Task RateOutfit(string userId, Guid outfitId, int value)
        {
            if (value < 1 || value > 5)
                throw new Exception("Rating must be between 1 and 5");

            var existing = await _context.Ratings
                .FirstOrDefaultAsync(r => r.UserId == userId && r.OutfitId == outfitId);


            if (existing != null)
            {
                existing.Value = value;
            }
            else
            {

                var rating = new Rating
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    OutfitId = outfitId,
                    Value = value
                };

                _context.Ratings.Add(rating);
            }

            await _context.SaveChangesAsync();

            var (average, count) = await GetRatingStats(outfitId);

            var outfit = await _context.OutfitRating
                .FirstOrDefaultAsync(o => o.Id == outfitId);

            if (outfit != null)
            {
                outfit.AverageRating = average;
                outfit.RatingsCount = count;
                outfit.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
            }
        }
    }

}

