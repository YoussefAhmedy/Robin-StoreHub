using AuraLoom.API.Services;
using AuraLoom.Domain.Entities;
using AuraLoom.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuraLoom.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WaitlistController : ControllerBase
{
    private readonly AuraLoomDbContext _context;
    private readonly IEmailService _email;
    public WaitlistController(AuraLoomDbContext context, IEmailService email)
    { _context = context; _email = email; }

    // POST: api/waitlist — join waitlist for a sold-out product
    [HttpPost]
    public async Task<IActionResult> Join([FromBody] WaitlistDto dto)
    {
        var product = await _context.Products.FindAsync(dto.ProductId);
        if (product == null) return NotFound();

        var exists = await _context.WaitlistEntries
            .AnyAsync(w => w.ProductId == dto.ProductId && w.Email == dto.Email);
        if (exists)
            return Ok(new { message = "Already on the waitlist." });

        _context.WaitlistEntries.Add(new WaitlistEntry
        {
            ProductId = dto.ProductId,
            Email     = dto.Email,
            Phone     = dto.Phone,
            SizeWanted = dto.SizeWanted,
        });
        await _context.SaveChangesAsync();

        // Confirmation email to user
        await _email.SendWaitlistConfirmationAsync(dto.Email, product.Name);

        return Ok(new { message = "You're on the waitlist! We'll notify you when it's back." });
    }

    // GET: api/waitlist/{productId}/count — lightweight: just the count
    [HttpGet("{productId}/count")]
    public async Task<IActionResult> Count(int productId)
    {
        var count = await _context.WaitlistEntries.CountAsync(w => w.ProductId == productId);
        return Ok(new { count });
    }

    // POST: api/waitlist/{productId}/notify — Admin: blast all waitlist entries
    [HttpPost("{productId}/notify")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<IActionResult> NotifyAll(int productId)
    {
        var product = await _context.Products.FindAsync(productId);
        if (product == null) return NotFound();

        var entries = await _context.WaitlistEntries
            .Where(w => w.ProductId == productId && !w.Notified)
            .ToListAsync();

        foreach (var entry in entries)
        {
            await _email.SendWaitlistAlertAsync(entry.Email, product.Name, product.Slug);
            entry.Notified = true;
        }

        await _context.SaveChangesAsync();
        return Ok(new { message = $"Notified {entries.Count} people.", count = entries.Count });
    }
}

public class WaitlistDto
{
    public int    ProductId  { get; set; }
    public string Email      { get; set; } = "";
    public string? Phone     { get; set; }
    public string? SizeWanted { get; set; }
}
