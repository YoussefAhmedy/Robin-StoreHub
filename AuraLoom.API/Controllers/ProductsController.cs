using AuraLoom.Domain.Entities;
using AuraLoom.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuraLoom.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly AuraLoomDbContext _context;
    public ProductsController(AuraLoomDbContext context) => _context = context;

    // GET: api/products?gender=Men&subCategory=Hoodie&season=Winter&minPrice=500&maxPrice=2000&size=M&available=true&page=1&pageSize=24
    [HttpGet]
    public async Task<IActionResult> GetProducts(
        [FromQuery] string? gender,
        [FromQuery] string? subCategory,
        [FromQuery] string? season,
        [FromQuery] string? ageGroup,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice,
        [FromQuery] string? size,
        [FromQuery] string? color,
        [FromQuery] bool?   available,
        [FromQuery] bool?   trending,
        [FromQuery] string? sort = "default",
        [FromQuery] int     page = 1,
        [FromQuery] int     pageSize = 24)
    {
        IQueryable<Product> q = _context.Products.Include(p => p.Category).AsQueryable();

        if (!string.IsNullOrEmpty(gender) && Enum.TryParse<Gender>(gender, true, out var g))
            q = q.Where(p => p.Gender == g);

        if (!string.IsNullOrEmpty(season) && Enum.TryParse<Season>(season, true, out var s))
            q = q.Where(p => p.Season == s || p.Season == Season.AllSeason);

        if (!string.IsNullOrEmpty(subCategory))
            q = q.Where(p => p.SubCategory != null && p.SubCategory.ToLower() == subCategory.ToLower());

        if (!string.IsNullOrEmpty(ageGroup))
            q = q.Where(p => p.AgeGroup != null && p.AgeGroup == ageGroup);

        if (minPrice.HasValue) q = q.Where(p => (p.DiscountPrice ?? p.Price) >= minPrice.Value);
        if (maxPrice.HasValue) q = q.Where(p => (p.DiscountPrice ?? p.Price) <= maxPrice.Value);

        if (!string.IsNullOrEmpty(size))
            q = q.Where(p => p.SizesJson != null && p.SizesJson.Contains(size));

        if (!string.IsNullOrEmpty(color))
            q = q.Where(p => p.ColorTags != null && p.ColorTags.Contains(color.ToLower()));

        if (available.HasValue)
            q = q.Where(p => p.IsAvailable == available.Value && p.StockQuantity > 0);

        if (trending == true)
            q = q.Where(p => p.IsTrending);

        q = sort switch
        {
            "price-asc"  => q.OrderBy(p => p.DiscountPrice ?? p.Price),
            "price-desc" => q.OrderByDescending(p => p.DiscountPrice ?? p.Price),
            "name"       => q.OrderBy(p => p.Name),
            "new"        => q.OrderByDescending(p => p.CreatedAt),
            _            => q.OrderByDescending(p => p.IsTrending).ThenByDescending(p => p.CreatedAt),
        };

        var total = await q.CountAsync();
        var items = await q
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new {
                p.Id, p.Name, p.Slug, p.Price, p.DiscountPrice,
                p.ImageUrl, p.SizesJson, p.IsAvailable, p.StockQuantity,
                p.IsTrending, p.IsFeatured, p.Gender, p.Season, p.SubCategory, p.AgeGroup, p.ColorTags,
                Category = p.Category == null ? null : new { p.Category.Id, p.Category.Name },
                AvgRating = p.Reviews.Any() ? Math.Round(p.Reviews.Average(r => (double)r.Rating), 1) : 0,
                ReviewCount = p.Reviews.Count,
            })
            .ToListAsync();

        return Ok(new { total, page, pageSize, items });
    }

    // GET: api/products/trending
    [HttpGet("trending")]
    public async Task<IActionResult> GetTrending() =>
        Ok(await _context.Products.Include(p => p.Category).Where(p => p.IsTrending).ToListAsync());

    // GET: api/products/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var p = await _context.Products.Include(p => p.Category).FirstOrDefaultAsync(p => p.Id == id);
        return p == null ? NotFound() : Ok(p);
    }

    // GET: api/products/slug/{slug}
    [HttpGet("slug/{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var p = await _context.Products
            .Include(p => p.Category)
            .Include(p => p.Reviews)
            .FirstOrDefaultAsync(p => p.Slug == slug);
        return p == null ? NotFound() : Ok(new {
            p.Id, p.Name, p.Slug, p.Description, p.Materials, p.FitNotes,
            p.Price, p.DiscountPrice, p.ImageUrl, p.ImageUrlsJson,
            p.SizesJson, p.ColorTags, p.Gender, p.Season, p.SubCategory, p.AgeGroup,
            p.IsTrending, p.IsAvailable, p.StockQuantity,
            Category = p.Category == null ? null : new { p.Category.Id, p.Category.Name },
            AvgRating   = p.Reviews.Any() ? Math.Round(p.Reviews.Average(r => (double)r.Rating), 1) : 0,
            ReviewCount = p.Reviews.Count,
        });
    }

    // GET: api/products/{id}/related
    [HttpGet("{id}/related")]
    public async Task<IActionResult> GetRelated(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return NotFound();

        var related = await _context.Products
            .Include(p => p.Category)
            .Where(p => p.Id != id && p.CategoryId == product.CategoryId && p.IsAvailable)
            .OrderByDescending(p => p.IsTrending)
            .Take(4)
            .ToListAsync();

        return Ok(related);
    }

    // GET: api/products/filters — returns available filter options from current catalog
    [HttpGet("filters")]
    public async Task<IActionResult> GetFilters()
    {
        var subCategories = await _context.Products
            .Where(p => p.SubCategory != null)
            .Select(p => p.SubCategory!).Distinct().ToListAsync();

        var priceStats = await _context.Products.AnyAsync()
            ? new { min = await _context.Products.MinAsync(p => p.DiscountPrice ?? p.Price),
                    max = await _context.Products.MaxAsync(p => p.DiscountPrice ?? p.Price) }
            : new { min = 0m, max = 0m };

        return Ok(new {
            genders = new[] { "Men", "Women", "Boys", "Girls", "Unisex" },
            seasons = new[] { "Summer", "Winter", "AllSeason" },
            subCategories,
            ageGroups = new[] { "2-4Y", "5-7Y", "8-10Y", "11-13Y" },
            priceStats,
        });
    }
}
