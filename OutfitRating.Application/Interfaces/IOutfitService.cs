using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OutfitRating.Application.Dtos;

namespace OutfitRating.Application.Interfaces
{
    public interface IOutfitService
    {
       Task<IEnumerable<OutfitDto>> GetAllOutfitsAsync();
        Task<OutfitDto> GetOutfitByIdAsync(Guid Id);
        Task<OutfitDto> CreateOutfitAsync(OutfitDto dto);
        Task<OutfitDto> UpdateOutfitAsync(OutfitDto dto);
        Task<OutfitDto> DeleteOutfitAsync(OutfitDto dto);
    }
}
