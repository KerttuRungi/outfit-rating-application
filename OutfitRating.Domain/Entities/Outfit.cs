using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OutfitRating.Domain.Entities
{
    public class Outfit
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public double AverageRating { get; set; }
        public int RatingsCount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public List<OutfitImages> Images { get; set; } = new();
        //to later implement image upload
    }
}
