namespace AuraLoom.Domain.Entities;

public class NewsletterSubscriber
{
    public int Id { get; set; }
    public required string Email { get; set; }
    public DateTime SubscribedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true; // لكي نتمكن من إلغاء اشتراكه لاحقاً إذا أراد
}
