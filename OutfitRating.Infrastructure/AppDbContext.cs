using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using OutfitRating.Domain.Entities;

namespace OutfitRating.Infrastructure
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<Outfit> OutfitRating { get; set; } //Outfit entitys table not to be confused with ratings
        public DbSet<Rating> Ratings { get; set; }
        public DbSet<StyleFilters> StyleFilters { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder); // Avoids overwriting Identity configurations

            modelBuilder
                .Entity<StyleFilters>()
                .HasData(
                    new StyleFilters { Id = 1, Name = "Casual" },
                    new StyleFilters { Id = 2, Name = "Formal" },
                    new StyleFilters { Id = 3, Name = "Streetwear" },
                    new StyleFilters { Id = 4, Name = "Vintage" },
                    new StyleFilters { Id = 5, Name = "Chic" },
                    new StyleFilters { Id = 6, Name = "Athleisure" },
                    new StyleFilters { Id = 7, Name = "Y2k" },
                    new StyleFilters { Id = 8, Name = "Alternative" }
                );
        }
    }
}
