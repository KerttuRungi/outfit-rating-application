using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace OutfitRating.Application.Dtos
{
    public class OutfitDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public double AverageRating { get; set; }
        public int RatingsCount { get; set; }
        public int? StyleId { get; set; }
        public string? StyleName { get; set; }
        public List<IFormFile>? Images { get; set; } = new();
        public List<string>? ImageUrls { get; set; } = new();
    }
}
