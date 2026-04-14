using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AuraLoom.Infrastructure.Data;
using AuraLoom.Domain.Entities;
using System.Threading.Tasks;

namespace AuraLoom.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NewsletterController : ControllerBase
{
    private readonly AuraLoomDbContext _context;

    public NewsletterController(AuraLoomDbContext context)
    {
        _context = context;
    }

    [HttpPost("subscribe")]
    public async Task<IActionResult> Subscribe([FromBody] SubscribeDto request)
    {
        // التأكد من أن البريد غير مسجل مسبقاً
        var exists = await _context.NewsletterSubscribers.AnyAsync(n => n.Email == request.Email);
        
        if (exists)
        {
            return BadRequest(new { message = "هذا البريد الإلكتروني مشترك بالفعل في النشرة البريدية." });
        }

        // إضافة المشترك الجديد
        _context.NewsletterSubscribers.Add(new NewsletterSubscriber { Email = request.Email });
        await _context.SaveChangesAsync();

        return Ok(new { message = "تم الاشتراك بنجاح! شكراً لانضمامك لعائلة AuraLoom." });
    }
}

public class SubscribeDto
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;

}
