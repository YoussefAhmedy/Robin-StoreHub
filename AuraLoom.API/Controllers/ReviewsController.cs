using System.Security.Claims;
using AuraLoom.Domain.Entities;
using AuraLoom.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuraLoom.API.Controllers;

[ApiController]
[Route("api/products/{productId}/reviews")]
public class ReviewsController : ControllerBase
{
    private readonly AuraLoomDbContext _context;
    public ReviewsController(AuraLoomDbContext context) => _context = context;

    // GET: api/products/5/reviews
    [HttpGet]
    public async Task<IActionResult> GetReviews(int productId, [FromQuery] int page = 1, [FromQuery] int pageSize = 5)
    {
        var query = _context.Reviews
            .Include(r => r.User)
            .Where(r => r.ProductId == productId)
            .OrderByDescending(r => r.CreatedAt);

        var total = await query.CountAsync();
        var avgRating = total > 0 ? await query.AverageAsync(r => (double)r.Rating) : 0;

        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(r => new {
                r.Id, r.Rating, r.Title, r.Body, r.SizePurchased, r.Verified, r.CreatedAt,
                Author = r.User!.FirstName + " " + r.User.LastName[0] + ".",
            })
            .ToListAsync();

        return Ok(new { total, avgRating = Math.Round(avgRating, 1), page, pageSize, items });
    }

    // POST: api/products/5/reviews
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateReview(int productId, [FromBody] CreateReviewDto dto)
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdStr, out int userId)) return Unauthorized();

        if (await _context.Reviews.AnyAsync(r => r.ProductId == productId && r.UserId == userId))
            return BadRequest(new { message = "You have already reviewed this product." });

        if (dto.Rating < 1 || dto.Rating > 5)
            return BadRequest(new { message = "Rating must be between 1 and 5." });

        // Check if buyer
        var verified = await _context.Orders
            .Include(o => o.Items)
            .AnyAsync(o => o.UserId == userId && o.Items.Any(i => i.ProductId == productId));

        var review = new Review
        {
            ProductId = productId, UserId = userId,
            Rating = dto.Rating, Title = dto.Title, Body = dto.Body,
            SizePurchased = dto.SizePurchased, Verified = verified,
        };

        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Review submitted.", review.Id });
    }
}

public class CreateReviewDto
{
    public int     Rating        { get; set; }
    public string? Title         { get; set; }
    public string? Body          { get; set; }
    public string? SizePurchased { get; set; }
}
