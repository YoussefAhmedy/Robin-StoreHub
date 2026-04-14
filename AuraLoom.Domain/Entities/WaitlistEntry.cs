namespace AuraLoom.Domain.Entities;

public class WaitlistEntry
{
    public int Id { get; set; }

    public int ProductId { get; set; }
    public Product? Product { get; set; }

    public string  Email    { get; set; } = "";
    public string? Phone    { get; set; }   // optional WhatsApp
    public string? SizeWanted { get; set; }

    public bool Notified   { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
