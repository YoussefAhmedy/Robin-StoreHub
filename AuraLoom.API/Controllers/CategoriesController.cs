using AuraLoom.Domain.Entities;
using AuraLoom.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuraLoom.API.Controllers;

[ApiController]
[Route("api/[controller]")] // المسار سيكون: api/categories
public class CategoriesController : ControllerBase
{
    private readonly AuraLoomDbContext _context;

    // حقن قاعدة البيانات داخل المتحكم
    public CategoriesController(AuraLoomDbContext context)
    {
        _context = context;
    }

    // 1. جلب جميع الأقسام (لعرضها في القائمة الجانبية أو العلوية للموقع)
    // GET: api/categories
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
    {
        // نجلب كل الأقسام من قاعدة البيانات
        var categories = await _context.Categories.ToListAsync();
        
        return Ok(categories); // إعادة البيانات بنجاح (200 OK)
    }

    // 2. جلب المنتجات الخاصة بقسم معين باستخدام الرابط الصديق (Slug)
    // GET: api/categories/{slug}/products  --> مثال: api/categories/women/products
    [HttpGet("{slug}/products")]
    public async Task<ActionResult<IEnumerable<Product>>> GetProductsByCategory(string slug)
    {
        // أولاً: نبحث عن القسم لنتأكد من وجوده
        var category = await _context.Categories.FirstOrDefaultAsync(c => c.Slug == slug);

        // إذا لم نجد القسم، نعيد رسالة خطأ 404
        if (category == null)
        {
            return NotFound(new { message = "القسم غير موجود." });
        }

        // ثانياً: إذا وجدنا القسم، نجلب جميع المنتجات المرتبطة به
        var products = await _context.Products
            .Include(p => p.Category) // تضمين بيانات القسم مع المنتج
            .Where(p => p.CategoryId == category.Id) // تصفية المنتجات حسب رقم القسم
            .ToListAsync();

        return Ok(products); // إعادة المنتجات
    }
}
