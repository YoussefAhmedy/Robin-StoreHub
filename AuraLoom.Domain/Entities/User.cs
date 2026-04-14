namespace AuraLoom.Domain.Entities;

public class User
{
    public int Id { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    
    // البريد الإلكتروني سيكون هو اسم المستخدم لتسجيل الدخول
    public required string Email { get; set; }
    
    // لن نقوم بحفظ كلمة المرور الحقيقية أبداً! بل سنحفظ "نسخة مشفرة" منها
    public required string PasswordHash { get; set; }
    
    // تحديد دور أو صلاحية المستخدم (زائر عادي أم مدير النظام)
    public string Role { get; set; } = "Customer"; // القيمة الافتراضية هي زبون "Customer"
    
    public bool IsEmailVerified { get; set; }
    
    // الرموز المميزة (Tokens) لإبقاء المستخدم مسجلاً بأمان لفترة أطول
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiry { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
