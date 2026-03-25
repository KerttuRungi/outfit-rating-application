using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace OutfitRating.Application.Interfaces
{
    public interface IFileService
    {
        Task<List<string>> UploadImagesAsync(List<IFormFile> file);
        Task<List<string>> UpdateImageAsync(string oldFileName, List<IFormFile> newFiles);
        Task DeleteImagesAsync(List<string> fileNames);
    }
}
