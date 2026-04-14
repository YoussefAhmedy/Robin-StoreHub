using AuraLoom.Domain.Entities;
using AuraLoom.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using AuraLoom.API.Services;
namespace AuraLoom.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "SuperAdmin,Admin")]
public class AdminController : ControllerBase
{
    private readonly AuraLoomDbContext _context;
    private readonly IEmailService _emailService;

    public AdminController(AuraLoomDbContext context, IEmailService emailService)
    {
        _context = context;
        _emailService = emailService;
    }

    // GET: api/admin/stats
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var totalRevenue = await _context.Orders
            .Where(o => o.Status != OrderStatus.Cancelled)
            .SumAsync(o => o.TotalAmount);

        var totalOrders = await _context.Orders.CountAsync();
        var pendingOrders = await _context.Orders.CountAsync(o => o.Status == OrderStatus.Pending);
        var shippedOrders = await _context.Orders.CountAsync(o => o.Status == OrderStatus.Shipped);
        var totalUsers = await _context.Users.CountAsync();
        var ordersToday = await _context.Orders
            .CountAsync(o => o.CreatedAt.Date == DateTime.UtcNow.Date);

        return Ok(new
        {
            totalRevenue,
            totalOrders,
            pendingOrders,
            shippedOrders,
            totalUsers,
            ordersToday
        });
    }

    // GET: api/admin/finance
    [HttpGet("finance")]
    public async Task<IActionResult> GetFinance()
    {
        var last6Months = Enumerable.Range(0, 6)
            .Select(i => DateTime.UtcNow.AddMonths(-i))
            .Reverse()
            .ToList();

        var data = new List<object>();
        foreach (var month in last6Months)
        {
            var revenue = await _context.Orders
                .Where(o => o.CreatedAt.Year == month.Year && o.CreatedAt.Month == month.Month && o.Status != OrderStatus.Cancelled)
                .SumAsync(o => (decimal?)o.TotalAmount) ?? 0;

            var count = await _context.Orders
                .CountAsync(o => o.CreatedAt.Year == month.Year && o.CreatedAt.Month == month.Month);

            data.Add(new { month = month.ToString("MMM"), revenue, orders = count });
        }
        return Ok(data);
    }

    // GET: api/admin/orders
    [HttpGet("orders")]
    public async Task<IActionResult> GetAllOrders()
    {
        var orders = await _context.Orders
            .Include(o => o.User)
            .Include(o => o.Items).ThenInclude(i => i.Product)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
        return Ok(orders);
    }

    // PUT: api/admin/orders/{id}/status
    [HttpPut("orders/{id}/status")]
    public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] UpdateStatusDto dto)
    {
        var order = await _context.Orders.Include(o => o.User).FirstOrDefaultAsync(o => o.Id == id);
        if (order == null) return NotFound();

        order.Status = Enum.Parse<OrderStatus>(dto.Status, true);
        await _context.SaveChangesAsync();

        // Send role-based email notification
        if (order.User != null)
            await _emailService.SendOrderStatusUpdateAsync(order.User.Email, order.OrderNumber, dto.Status);

        return Ok(new { message = "Status updated.", order.Status });
    }

    // GET: api/admin/products
    [HttpGet("products")]
    public async Task<IActionResult> GetProducts()
    {
        var products = await _context.Products.Include(p => p.Category).ToListAsync();
        return Ok(products);
    }

    // POST: api/admin/products
    [HttpPost("products")]
    public async Task<IActionResult> CreateProduct([FromBody] ProductDto dto)
    {
        var slug = dto.Name.ToLower().Replace(" ", "-").Replace("'", "");
        var category = await _context.Categories.FirstOrDefaultAsync(c => c.Name == dto.CategoryName)
            ?? new Category 
            { 
                Name = dto.CategoryName ?? "Uncategorized",
                Slug = (dto.CategoryName ?? "Uncategorized").ToLower().Replace(" ", "-")
            };

        if (category.Id == 0)
        {
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
        }

        var product = new Product
        {
            Name = dto.Name,
            Slug = slug,
            Description = dto.Description,
            Price = dto.Price,
            DiscountPrice = dto.DiscountPrice,
            ImageUrl = dto.ImageUrl,
            ImageUrlsJson = dto.ImageUrlsJson,
            SizesJson = dto.SizesJson,
            OptionsJson = dto.OptionsJson,
            IsTrending = dto.IsTrending,
            IsFeatured = dto.IsFeatured,
            IsAvailable = dto.IsAvailable,
            StockQuantity = dto.StockQuantity,
            CategoryId = category.Id
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProducts), new { id = product.Id }, product);
    }

    // PUT: api/admin/products/{id}
    [HttpPut("products/{id}")]
    public async Task<IActionResult> UpdateProduct(int id, [FromBody] ProductDto dto)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return NotFound();

        product.Name = dto.Name;
        product.Description = dto.Description;
        product.Price = dto.Price;
        product.DiscountPrice = dto.DiscountPrice;
        product.ImageUrl = dto.ImageUrl;
        product.ImageUrlsJson = dto.ImageUrlsJson;
        product.SizesJson = dto.SizesJson;
        product.OptionsJson = dto.OptionsJson;
        product.IsTrending = dto.IsTrending;
        product.IsFeatured = dto.IsFeatured;
        product.IsAvailable = dto.IsAvailable;
        product.StockQuantity = dto.StockQuantity;
        product.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(product);
    }

    // DELETE: api/admin/products/{id}
    [HttpDelete("products/{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return NotFound();
        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Product deleted." });
    }

    // GET: api/admin/users
    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _context.Users
            .Select(u => new { u.Id, u.FirstName, u.LastName, u.Email, u.Role, u.CreatedAt, u.IsEmailVerified })
            .ToListAsync();
        return Ok(users);
    }
}

// DTOs
public class UpdateStatusDto { public required string Status { get; set; } }

public class ProductDto
{
    public required string Name { get; set; }
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public decimal? DiscountPrice { get; set; }
    public string? ImageUrl { get; set; }
    public string? ImageUrlsJson { get; set; }
    public string? SizesJson { get; set; }
    public string? OptionsJson { get; set; }
    public bool IsTrending { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsAvailable { get; set; } = true;
    public int StockQuantity { get; set; }
    public string? CategoryName { get; set; }
}
