using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OutfitRating.Application.Dtos;
using OutfitRating.Application.Interfaces;
using OutfitRating.Domain.Entities;
using OutfitRating.Infrastructure;

namespace OutfitRating.Application.Services
{
    public class OutfitRatingService : IOutfitRatingService
    {
        private readonly AppDbContext _context;
        public OutfitRatingService
        (
            AppDbContext context
        )
        {
            _context = context;
        }

        public async Task<IEnumerable<OutfitDto>> GetAllOutfitsAsync()
        {
            var outfits = await _context.OutfitRating
                .ToListAsync();

            return outfits.Select(o => new OutfitDto
            {
                Id = o.Id,
                Name = o.Name,
                Description = o.Description,
                AverageRating = o.AverageRating,
                RatingsCount = o.RatingsCount
            });
        }

        public async Task<OutfitDto> GetOutfitByIdAsync(Guid id)
        {
            var o = await _context.OutfitRating
                .FirstOrDefaultAsync(o => o.Id == id);

            if (o == null)
            {
                throw new Exception("Outfit not found");
            }

            return new OutfitDto
            {
                Id = o.Id,
                Name = o.Name,
                Description = o.Description,
                AverageRating = o.AverageRating,
                RatingsCount = o.RatingsCount
            };
        }

        public async Task<OutfitDto> CreateOutfitAsync(OutfitDto dto)
        {
            var o = new Outfit
            {
                Id = Guid.NewGuid(),
                Name = dto.Name,
                Description = dto.Description,
                AverageRating = dto.AverageRating,
                RatingsCount = dto.RatingsCount,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.OutfitRating.Add(o);
            await _context.SaveChangesAsync();

            return new OutfitDto
            {
                Id = o.Id,
                Name = o.Name,
                Description = o.Description,
                AverageRating = o.AverageRating,
                RatingsCount = o.RatingsCount
            };
        }

        public async Task<OutfitDto> UpdateOutfitAsync(OutfitDto dto)
        {
            var o = await _context.OutfitRating
                .FindAsync(dto.Id);
            if (o == null)
            {
                throw new Exception("Outfit not found");
            }

            o.Name = dto.Name;
            o.Description = dto.Description;
            o.AverageRating = dto.AverageRating;
            o.RatingsCount = dto.RatingsCount;
            o.UpdatedAt = DateTime.UtcNow;

            _context.OutfitRating.Update(o);
            await _context.SaveChangesAsync();

            return new OutfitDto
            {
                Id = o.Id,
                Name = o.Name,
                Description = o.Description,
                AverageRating = o.AverageRating,
                RatingsCount = o.RatingsCount
            };
        }

        public async Task<OutfitDto> DeleteOutfitAsync(OutfitDto dto)
        {
            var o = await _context.OutfitRating.FindAsync(dto.Id);
            if (o == null)
            {
                throw new Exception("Outfit not found");
            }

            _context.OutfitRating.Remove(o);
            await _context.SaveChangesAsync();

            return new OutfitDto
            {
                Id = o.Id,
                Name = o.Name,
                Description = o.Description,
                AverageRating = o.AverageRating,
                RatingsCount = o.RatingsCount
            };
        }
    }
}
