using AuraLoom.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AuraLoom.Infrastructure.Data;

public class AuraLoomDbContext : DbContext
{
    public AuraLoomDbContext(DbContextOptions<AuraLoomDbContext> options) : base(options) {}

    public DbSet<Product>              Products              { get; set; }
    public DbSet<Category>             Categories            { get; set; }
    public DbSet<User>                 Users                 { get; set; }
    public DbSet<CartItem>             CartItems             { get; set; }
    public DbSet<Order>                Orders                { get; set; }
    public DbSet<OrderItem>            OrderItems            { get; set; }
    public DbSet<NewsletterSubscriber> NewsletterSubscribers { get; set; }
    public DbSet<Review>               Reviews               { get; set; }
    public DbSet<WaitlistEntry>        WaitlistEntries       { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Product>().Property(p => p.Price).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<Product>().Property(p => p.DiscountPrice).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<Order>().Property(o => o.TotalAmount).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<OrderItem>().Property(i => i.UnitPrice).HasColumnType("decimal(18,2)");

        modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
        modelBuilder.Entity<Product>().HasIndex(p => p.Slug).IsUnique();

        // One product → many reviews
        modelBuilder.Entity<Review>()
            .HasOne(r => r.Product).WithMany(p => p.Reviews)
            .HasForeignKey(r => r.ProductId).OnDelete(DeleteBehavior.Cascade);

        // One user → one review per product (unique constraint)
        modelBuilder.Entity<Review>()
            .HasIndex(r => new { r.ProductId, r.UserId }).IsUnique();

        modelBuilder.Entity<Order>()
            .HasMany(o => o.Items).WithOne(i => i.Order)
            .HasForeignKey(i => i.OrderId).OnDelete(DeleteBehavior.Cascade);
    }
}
