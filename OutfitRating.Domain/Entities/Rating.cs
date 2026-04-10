using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OutfitRating.Domain.Entities
{
    public class Rating
    {
        public Guid Id { get; set; }
        public string UserId { get; set; }
        public Guid OutfitId { get; set; }
        public int Value { get; set; } //from 1 to 5

        public Outfit Outfit { get; set; }
    }
}
