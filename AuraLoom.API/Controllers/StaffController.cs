using System.Security.Claims;
using AuraLoom.Domain.Entities;
using AuraLoom.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using AuraLoom.API.Services;
namespace AuraLoom.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Employee,Staff,SuperAdmin,Admin")]
public class StaffController : ControllerBase
{
    private readonly AuraLoomDbContext _context;
    private readonly IEmailService _emailService;

    public StaffController(AuraLoomDbContext context, IEmailService emailService)
    {
        _context = context;
        _emailService = emailService;
    }

    // GET: api/staff/orders — all orders for staff view
    [HttpGet("orders")]
    public async Task<IActionResult> GetOrders()
    {
        var orders = await _context.Orders
            .Include(o => o.User)
            .Include(o => o.Items).ThenInclude(i => i.Product)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
        return Ok(orders);
    }

    // PUT: api/staff/orders/{id}/status
    [HttpPut("orders/{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] StaffStatusDto dto)
    {
        var order = await _context.Orders.Include(o => o.User).FirstOrDefaultAsync(o => o.Id == id);
        if (order == null) return NotFound();

        order.Status = Enum.Parse<OrderStatus>(dto.Status, true);
        if (order.Status == OrderStatus.Delivered)
            order.DeliveredAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        if (order.User != null)
            await _emailService.SendOrderStatusUpdateAsync(order.User.Email, order.OrderNumber, dto.Status);

        return Ok(new { message = "Order status updated.", order.Status });
    }

    // PUT: api/staff/orders/{id}/ship
    [HttpPut("orders/{id}/ship")]
    public async Task<IActionResult> ShipOrder(int id, [FromBody] ShipOrderDto dto)
    {
        var order = await _context.Orders.Include(o => o.User).FirstOrDefaultAsync(o => o.Id == id);
        if (order == null) return NotFound();

        order.Status = OrderStatus.Shipped;
        order.TrackingNumber = dto.TrackingNumber;
        order.StaffNotes = dto.Notes;
        order.ShippedAt = DateTime.UtcNow;

        if (Enum.TryParse<ShippingMethod>(dto.ShippingMethod, true, out var method))
            order.ShippingMethod = method;

        await _context.SaveChangesAsync();

        if (order.User != null)
            await _emailService.SendShippingConfirmationAsync(
                order.User.Email,
                order.OrderNumber,
                dto.TrackingNumber,
                order.ShippingAddress
            );

        return Ok(new { message = "Order shipped!", order.TrackingNumber });
    }
}

public class StaffStatusDto { public required string Status { get; set; } }

public class ShipOrderDto
{
    public string? TrackingNumber { get; set; }
    public string? ShippingMethod { get; set; }
    public string? Notes { get; set; }
}
