using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OutfitRating.Application.Interfaces
{
    public interface IRatingService
    {
        Task<(double average, int count)> GetRatingStats(Guid outfitId);
        Task RateOutfit(string userId, Guid outfitId, int value);
    }
}
