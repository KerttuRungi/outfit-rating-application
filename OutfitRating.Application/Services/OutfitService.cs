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
    public class OutfitService : IOutfitService
    {
        private readonly AppDbContext _context;
        private readonly IFileService _fileService;

        public OutfitService(AppDbContext context, IFileService fileService)
        {
            _context = context;
            _fileService = fileService;
        }

        public async Task<IEnumerable<OutfitDto>> GetAllOutfitsAsync()
        {
            var outfits = await _context
                .OutfitRating.Include(o => o.Images)
                .Include(o => o.Style)
                .ToListAsync();

            return outfits.Select(o => new OutfitDto
            {
                Id = o.Id,
                Name = o.Name,
                Description = o.Description,
                AverageRating = o.AverageRating,
                RatingsCount = o.RatingsCount,
                StyleId = o.StyleId,
                StyleName = o.Style?.Name,
                ImageUrls = o.Images?.Select(img => img.FilePath).ToList() ?? new List<string>(),
            });
        }

        public async Task<OutfitDto> GetOutfitByIdAsync(Guid id)
        {
            var o = await _context
                .OutfitRating.Include(x => x.Images)
                .Include(x => x.Style)
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
                RatingsCount = o.RatingsCount,
                StyleId = o.StyleId,
                ImageUrls = o.Images?.Select(img => img.FilePath).ToList() ?? new List<string>(),
                StyleName = o.Style?.Name,
            };
        }

        public async Task<IEnumerable<OutfitDto>> GetOutfitsByCreatorIdAsync(string creatorId)
        {
            var outfits = await _context
                .OutfitRating.Where(o => o.CreatorId == creatorId)
                .Include(o => o.Images)
                .Include(o => o.Style)
                .ToListAsync();
            return outfits.Select(o => new OutfitDto
            {
                Id = o.Id,
                Name = o.Name,
                Description = o.Description,
                AverageRating = o.AverageRating,
                RatingsCount = o.RatingsCount,
                StyleId = o.StyleId,
                StyleName = o.Style?.Name,
                ImageUrls = o.Images?.Select(img => img.FilePath).ToList() ?? new List<string>(),
            });
        }

        public async Task<OutfitDto> CreateOutfitAsync(OutfitDto dto, string creatorId)
        {
            var uploadedFiles = new List<string>();

            if (dto.Images != null && dto.Images.Any())
            {
                uploadedFiles = await _fileService.UploadImagesAsync(dto.Images);
            }

            // validate style exists (styles are preset in the DB)
            if (dto.StyleId <= 0 || !await _context.StyleFilters.AnyAsync(s => s.Id == dto.StyleId))
            {
                throw new Exception("Invalid or missing style selected");
            }

            var o = new Outfit
            {
                Id = Guid.NewGuid(),
                CreatorId = creatorId,
                Name = dto.Name,
                Description = dto.Description,
                AverageRating = dto.AverageRating,
                RatingsCount = dto.RatingsCount,
                StyleId = dto.StyleId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            };

            foreach (var fileName in uploadedFiles)
            {
                o.Images.Add(
                    new OutfitImages
                    {
                        Id = Guid.NewGuid(),
                        Name = fileName,
                        FilePath = "/images/" + fileName,
                        OutfitId = o.Id,
                    }
                );
            }

            _context.OutfitRating.Add(o);
            await _context.SaveChangesAsync();

            // load navigation to avoid an extra query later
            await _context.Entry(o).Reference(x => x.Style).LoadAsync();

            return new OutfitDto
            {
                Id = o.Id,
                Name = o.Name,
                Description = o.Description,
                AverageRating = o.AverageRating,
                RatingsCount = o.RatingsCount,
                StyleId = o.StyleId,
                StyleName = o.Style?.Name,
            };
        }

        public async Task<OutfitDto> UpdateOutfitAsync(OutfitDto dto)
        {
            var o = await _context
                .OutfitRating.Include(x => x.Images)
                .Include(x => x.Style)
                .FirstOrDefaultAsync(x => x.Id == dto.Id);
            if (o == null)
            {
                throw new Exception("Outfit not found");
            }

            o.Name = dto.Name;
            o.Description = dto.Description;
            o.AverageRating = dto.AverageRating;
            o.RatingsCount = dto.RatingsCount;
            // validate new style exists before assigning
            if (dto.StyleId <= 0 || !await _context.StyleFilters.AnyAsync(s => s.Id == dto.StyleId))
            {
                throw new Exception("Invalid or missing style selected");
            }
            o.StyleId = dto.StyleId;
            o.UpdatedAt = DateTime.UtcNow;

            if (dto.Images != null && dto.Images.Any())
            {
                var oldFileNames = o.Images.Select(img => img.Name).ToList();
                await _fileService.DeleteImagesAsync(oldFileNames);
                foreach (var img in o.Images.ToList())
                {
                    _context.Set<OutfitImages>().Remove(img);
                }
                await _context.SaveChangesAsync();

                await _context.Entry(o).Collection(x => x.Images).LoadAsync();

                var uploadedFiles = await _fileService.UploadImagesAsync(dto.Images);
                foreach (var fileName in uploadedFiles)
                {
                    var newImage = new OutfitImages
                    {
                        Id = Guid.NewGuid(),
                        Name = fileName,
                        FilePath = "/images/" + fileName,
                        OutfitId = o.Id,
                    };
                    _context.Set<OutfitImages>().Add(newImage);
                    o.Images.Add(newImage);
                }
                await _context.SaveChangesAsync();
            }
            else
            {
                await _context.SaveChangesAsync();
            }

            // ensure navigation reflects current StyleId
            await _context.Entry(o).Reference(x => x.Style).LoadAsync();

            return new OutfitDto
            {
                Id = o.Id,
                Name = o.Name,
                Description = o.Description,
                AverageRating = o.AverageRating,
                RatingsCount = o.RatingsCount,
                StyleId = o.StyleId,
                StyleName = o.Style?.Name,
            };
        }

        public async Task<OutfitDto> DeleteOutfitAsync(OutfitDto dto)
        {
            var o = await _context
                .OutfitRating.Include(x => x.Images)
                .Include(x => x.Style)
                .FirstOrDefaultAsync(x => x.Id == dto.Id);
            if (o == null)
            {
                throw new Exception("Outfit not found");
            }

            var oldFileNames = o.Images.Select(img => img.Name).ToList();
            if (oldFileNames.Any())
            {
                await _fileService.DeleteImagesAsync(oldFileNames);
            }

            // make sure we have the style name before removing the entity
            await _context.Entry(o).Reference(x => x.Style).LoadAsync();
            var styleName = o.Style?.Name;

            _context.OutfitRating.Remove(o);
            await _context.SaveChangesAsync();

            return new OutfitDto
            {
                Id = o.Id,
                Name = o.Name,
                Description = o.Description,
                AverageRating = o.AverageRating,
                RatingsCount = o.RatingsCount,
                StyleId = o.StyleId,
                StyleName = styleName,
            };
        }

        public async Task<IEnumerable<OutfitDto>> GetOutfitsByStyleAsync(int styleId)
        {
            var outfits = await _context
                .OutfitRating.Where(o => o.StyleId == styleId)
                .Include(o => o.Images)
                .Include(o => o.Style)
                .ToListAsync();

            return outfits.Select(o => new OutfitDto
            {
                Id = o.Id,
                Name = o.Name,
                StyleId = o.StyleId,
                StyleName = o.Style?.Name,
                ImageUrls = o.Images?.Select(img => img.FilePath).ToList() ?? new List<string>(),
            });
        }
    }
}
