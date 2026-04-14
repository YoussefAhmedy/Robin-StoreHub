namespace AuraLoom.Domain.Entities;

public class Category
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Slug { get; set; }
    public string? Description { get; set; }

    // علاقة: القسم الواحد يمكن أن يحتوي على عدة منتجات
    public ICollection<Product> Products { get; set; } = new List<Product>();
}