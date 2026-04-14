using System.Security.Claims;
using AuraLoom.API.Services;
using AuraLoom.Domain.Entities;
using AuraLoom.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuraLoom.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly AuraLoomDbContext _context;
    private readonly IEmailService _emailService;

    public OrdersController(AuraLoomDbContext context, IEmailService emailService)
    {
        _context = context;
        _emailService = emailService;
    }

    // POST: api/orders — Checkout from cart
    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] CheckoutDto request)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
            return Unauthorized();

        var cartItems = await _context.CartItems
            .Include(c => c.Product)
            .Where(c => c.UserId == userId)
            .ToListAsync();

        if (!cartItems.Any())
            return BadRequest(new { message = "Cart is empty." });

        decimal totalAmount = cartItems.Sum(c => c.Quantity * (c.Product!.DiscountPrice ?? c.Product.Price));
        string orderNumber = $"RBN-{DateTime.Now.Year}-{new Random().Next(1000, 9999)}";

        var shippingMethod = Enum.TryParse<ShippingMethod>(request.ShippingMethod ?? "Standard", true, out var method)
            ? method : ShippingMethod.Standard;

        var order = new Order
        {
            OrderNumber = orderNumber,
            UserId = userId,
            TotalAmount = totalAmount,
            ShippingAddress = request.ShippingAddress,
            ShippingMethod = shippingMethod,
            Status = OrderStatus.Pending
        };

        foreach (var item in cartItems)
        {
            order.Items.Add(new OrderItem
            {
                ProductId = item.ProductId,
                Quantity = item.Quantity,
                UnitPrice = item.Product!.DiscountPrice ?? item.Product.Price,
                SelectedSize = item.SelectedSize,
            });
        }

        _context.Orders.Add(order);
        _context.CartItems.RemoveRange(cartItems);
        await _context.SaveChangesAsync();

        // Send confirmation email
        var user = await _context.Users.FindAsync(userId);
        if (user != null)
        {
            await _emailService.SendOrderConfirmationAsync(
                user.Email, orderNumber, totalAmount, request.ShippingAddress);

            // Alert admin
            await _emailService.SendAdminNewOrderAlertAsync(
                orderNumber, $"{user.FirstName} {user.LastName}", totalAmount);
        }

        return Ok(new { message = "Order placed successfully!", orderNumber });
    }

    // GET: api/orders — My orders
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Order>>> GetMyOrders()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var orders = await _context.Orders
            .Include(o => o.Items).ThenInclude(i => i.Product)
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return Ok(orders);
    }
}

public class CheckoutDto
{
    public required string ShippingAddress { get; set; }
    public string? ShippingMethod { get; set; }
}
