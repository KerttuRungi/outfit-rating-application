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
        public OutfitService
        (
            AppDbContext context,
            IFileService fileService
        )
        {
            _context = context;
            _fileService = fileService;
        }

        public async Task<IEnumerable<OutfitDto>> GetAllOutfitsAsync()
        {
            var outfits = await _context.OutfitRating
                .Include(o => o.Images)
                .ToListAsync();

            return outfits.Select(o => new OutfitDto
            {
                Id = o.Id,
                Name = o.Name,
                Description = o.Description,
                AverageRating = o.AverageRating,
                RatingsCount = o.RatingsCount,
                ImageUrls = o.Images?.Select(img => img.FilePath).ToList() ?? new List<string>()
            });
        }

        public async Task<OutfitDto> GetOutfitByIdAsync(Guid id)
        {
            var o = await _context.OutfitRating
                .Include(x => x.Images)
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
                ImageUrls = o.Images?.Select(img => img.FilePath).ToList() ?? new List<string>()
            };
        }

        public async Task<IEnumerable<OutfitDto>> GetOutfitsByCreatorIdAsync(string creatorId)
        {
            var outfits = await _context.OutfitRating
                .Where(o => o.CreatorId == creatorId)
                .Include(o => o.Images)
                .ToListAsync();
            return outfits.Select(o => new OutfitDto
            {
                Id = o.Id,
                Name = o.Name,
                Description = o.Description,
                AverageRating = o.AverageRating,
                RatingsCount = o.RatingsCount,
                ImageUrls = o.Images?.Select(img => img.FilePath).ToList() ?? new List<string>()
            });
        }
        public async Task<OutfitDto> CreateOutfitAsync(OutfitDto dto, string creatorId)
        {
            var uploadedFiles = new List<string>();

            if (dto.Images != null && dto.Images.Any())
            {
                uploadedFiles = await _fileService.UploadImagesAsync(dto.Images);
            }

            var o = new Outfit
            {
                Id = Guid.NewGuid(),
                CreatorId = creatorId,
                Name = dto.Name,
                Description = dto.Description,
                AverageRating = dto.AverageRating,
                RatingsCount = dto.RatingsCount,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            foreach (var fileName in uploadedFiles)
            {
                o.Images.Add(new OutfitImages
                {
                    Id = Guid.NewGuid(),
                    Name = fileName,
                    FilePath = "/images/" + fileName,
                    OutfitId = o.Id
                });
            }

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
                .Include(x => x.Images)
                .FirstOrDefaultAsync(x => x.Id == dto.Id);
            if (o == null)
            {
                throw new Exception("Outfit not found");
            }

            o.Name = dto.Name;
            o.Description = dto.Description;
            o.AverageRating = dto.AverageRating;
            o.RatingsCount = dto.RatingsCount;
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
                        OutfitId = o.Id
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
            var o = await _context.OutfitRating
                .Include(x => x.Images)
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
