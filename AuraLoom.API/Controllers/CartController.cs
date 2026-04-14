using System.Security.Claims;
using AuraLoom.Domain.Entities;
using AuraLoom.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuraLoom.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CartController : ControllerBase
{
    private readonly AuraLoomDbContext _context;

    public CartController(AuraLoomDbContext context) => _context = context;

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    // GET: api/cart
    [HttpGet]
    public async Task<IActionResult> GetCart()
    {
        var userId = GetUserId();
        var items = await _context.CartItems
            .Include(c => c.Product).ThenInclude(p => p!.Category)
            .Where(c => c.UserId == userId)
            .ToListAsync();
        return Ok(items);
    }

    // POST: api/cart
    [HttpPost]
    public async Task<IActionResult> AddToCart([FromBody] AddToCartDto request)
    {
        var userId = GetUserId();

        var existing = await _context.CartItems
            .FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == request.ProductId && c.SelectedSize == request.SelectedSize);

        if (existing != null)
        {
            existing.Quantity += request.Quantity;
        }
        else
        {
            _context.CartItems.Add(new CartItem
            {
                UserId = userId,
                ProductId = request.ProductId,
                Quantity = request.Quantity,
                SelectedSize = request.SelectedSize,
            });
        }

        await _context.SaveChangesAsync();
        return Ok(new { message = "Added to cart." });
    }

    // PUT: api/cart/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateQuantity(int id, [FromBody] UpdateCartDto request)
    {
        var userId = GetUserId();
        var item = await _context.CartItems.FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);
        if (item == null) return NotFound();

        item.Quantity = request.Quantity;
        await _context.SaveChangesAsync();
        return Ok(new { message = "Updated." });
    }

    // DELETE: api/cart/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> RemoveFromCart(int id)
    {
        var userId = GetUserId();
        var item = await _context.CartItems.FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);
        if (item == null) return NotFound();

        _context.CartItems.Remove(item);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Removed." });
    }
}

public class AddToCartDto
{
    public int ProductId { get; set; }
    public int Quantity  { get; set; } = 1;
    public string? SelectedSize { get; set; }
}

public class UpdateCartDto
{
    public int Quantity { get; set; }
}
