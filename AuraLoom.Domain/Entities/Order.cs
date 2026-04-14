namespace AuraLoom.Domain.Entities;

public enum OrderStatus
{
    Pending, Confirmed, Shipped, Delivered, Cancelled
}

public enum ShippingMethod
{
    Standard, Express, Pickup
}

public class Order
{
    public int Id { get; set; }
    public required string OrderNumber { get; set; }

    public int UserId { get; set; }
    public User? User { get; set; }

    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public decimal TotalAmount { get; set; }

    public required string ShippingAddress { get; set; }
    public ShippingMethod ShippingMethod { get; set; } = ShippingMethod.Standard;

    // Shipping tracking
    public string? TrackingNumber { get; set; }
    public string? StaffNotes { get; set; }

    public DateTime? ShippedAt { get; set; }
    public DateTime? DeliveredAt { get; set; }

    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class OrderItem
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public Order? Order { get; set; }
    public int ProductId { get; set; }
    public Product? Product { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public string? SelectedSize { get; set; }
}
