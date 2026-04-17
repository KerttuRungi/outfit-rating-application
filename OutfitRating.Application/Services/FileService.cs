using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using OutfitRating.Application.Interfaces;

namespace OutfitRating.Application.Services
{
    public class FileService : IFileService
    {
        private readonly IWebHostEnvironment _webHostEnviorment;

        public FileService(IWebHostEnvironment webHostEnviorment)
        {
            _webHostEnviorment = webHostEnviorment;
        }
        // Allowed file types
        private static readonly string[] AllowedExtensions = { ".jpg", ".png" };
        private const long MaxFileSize = 3 * 1024 * 1024; // 3 MB

        // Helper method to validate file type and size
        private void ValidateImageFile(IFormFile file)
        {
            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!AllowedExtensions.Contains(ext))
                throw new InvalidOperationException($"File type {ext} is not allowed.");
            if (file.Length > MaxFileSize)
                throw new InvalidOperationException($"File size exceeds {MaxFileSize / (1024 * 1024)} MB limit.");
        }

        public async Task<List<string>> UploadImagesAsync(List<IFormFile> files)
        {
            var uploadedFiles = new List<string>();
            var imageUploadsFolder = Path.Combine(_webHostEnviorment.WebRootPath, "images");
            if (!Directory.Exists(imageUploadsFolder))
                Directory.CreateDirectory(imageUploadsFolder);

            foreach (var file in files)
            {
                ValidateImageFile(file);
                var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
                var fileName = Guid.NewGuid() + ext;
                var filePath = Path.Combine(imageUploadsFolder, fileName);
                using var stream = new FileStream(filePath, FileMode.Create);
                await file.CopyToAsync(stream);
                uploadedFiles.Add(fileName);
            }
            return uploadedFiles;
        }
        public async Task DeleteImagesAsync(List<string> fileNames)
        {
            var imageUploadsFolder = Path.Combine(_webHostEnviorment.WebRootPath, "images");
            foreach (var fileName in fileNames)
            {
            var filePath = Path.Combine(imageUploadsFolder, fileName);
            if (File.Exists(filePath))
                File.Delete(filePath);
            }
            await Task.CompletedTask;
        }

        public async Task<List<string>> UpdateImageAsync(string oldFileName, List<IFormFile> newFiles)
        {
            if (string.IsNullOrWhiteSpace(oldFileName))
                throw new ArgumentException("Old file name must be provided.", nameof(oldFileName));
            if (newFiles == null || newFiles.Count == 0)
                throw new ArgumentException("No new files provided.", nameof(newFiles));

            foreach (var file in newFiles)
            {
                ValidateImageFile(file);
            }

            await DeleteImagesAsync(new List<string> { oldFileName });

            var uploaded = await UploadImagesAsync(newFiles);
            return uploaded;
        }
    }
}