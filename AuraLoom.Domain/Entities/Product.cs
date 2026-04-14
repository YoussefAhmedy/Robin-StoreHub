namespace AuraLoom.Domain.Entities;

public enum Gender { Men, Women, Boys, Girls, Unisex }
public enum Season { Summer, Winter, AllSeason }

public class Product
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Slug { get; set; }
    public string? Description { get; set; }
    public string? Materials { get; set; }
    public string? FitNotes { get; set; }      // e.g. "Oversized — size down"

    public decimal Price { get; set; }
    public decimal? DiscountPrice { get; set; }

    // Media
    public string? ImageUrl { get; set; }
    public string? ImageUrlsJson { get; set; }  // JSON array

    // Variants
    public string? SizesJson { get; set; }       // ["XS","S","M","L","XL"]
    public string? ColorTags { get; set; }        // "black,white,olive"
    public string? OptionsJson { get; set; }

    // Taxonomy — filtering fields
    public Gender Gender { get; set; } = Gender.Unisex;
    public Season Season { get; set; } = Season.AllSeason;
    public string? SubCategory { get; set; }     // Sweatshirt | Hoodie | T-Shirt | Shirt | Outerwear
    public string? AgeGroup { get; set; }         // null for adults | "2-4Y" | "5-8Y" | "9-14Y"

    // Brand flags
    public bool IsTrending  { get; set; }
    public bool IsFeatured  { get; set; }
    public bool IsSustainable { get; set; }

    public bool IsAvailable   { get; set; } = true;
    public int  StockQuantity { get; set; }

    public int CategoryId { get; set; }
    public Category? Category { get; set; }

    // Reviews
    public ICollection<Review> Reviews { get; set; } = new List<Review>();

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
