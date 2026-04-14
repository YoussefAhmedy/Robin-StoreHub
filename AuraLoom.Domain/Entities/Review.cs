namespace AuraLoom.Domain.Entities;

public class Review
{
    public int Id { get; set; }

    public int ProductId { get; set; }
    public Product? Product { get; set; }

    public int UserId { get; set; }
    public User? User { get; set; }

    public int     Rating  { get; set; }  // 1–5
    public string? Title   { get; set; }
    public string? Body    { get; set; }
    public string? SizePurchased { get; set; }
    public bool    Verified { get; set; } // bought this item

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
