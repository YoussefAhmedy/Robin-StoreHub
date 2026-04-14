using System.Net;
using System.Net.Mail;

namespace AuraLoom.API.Services;

/// <summary>
/// Role-based email service for Robin.
/// Configure SMTP settings in appsettings.json under "EmailSettings".
/// </summary>
public class EmailService : IEmailService
{
    private readonly IConfiguration _config;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration config, ILogger<EmailService> logger)
    {
        _config = config;
        _logger = logger;
    }

    private async Task SendAsync(string to, string subject, string htmlBody)
    {
        var settings = _config.GetSection("EmailSettings");
        var host = settings["SmtpHost"] ?? "localhost";
        var port = int.Parse(settings["SmtpPort"] ?? "587");
        var user = settings["SmtpUser"] ?? "";
        var pass = settings["SmtpPass"] ?? "";
        var from = settings["FromAddress"] ?? "noreply@robin.store";

        try
        {
            using var client = new SmtpClient(host, port)
            {
                Credentials = new NetworkCredential(user, pass),
                EnableSsl = true
            };
            var msg = new MailMessage(from, to, subject, htmlBody) { IsBodyHtml = true };
            await client.SendMailAsync(msg);
            _logger.LogInformation("Email sent to {To}: {Subject}", to, subject);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {To}", to);
        }
    }

    // ── CUSTOMER EMAILS ──

    public async Task SendOrderConfirmationAsync(string toEmail, string orderNumber, decimal total, string shippingAddress)
    {
        var html = $@"
        <div style='font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#F6F2EC;padding:2rem;'>
          <h1 style='color:#BF4317;font-size:2.5rem;margin-bottom:0.5rem;'>Robin</h1>
          <p style='font-size:0.8rem;letter-spacing:0.12em;text-transform:uppercase;color:#7A7670;'>Order Confirmed</p>
          <hr style='border:none;border-top:1px solid #D8D0C5;margin:1.5rem 0;'/>
          <h2 style='font-size:1.5rem;color:#0E0D0B;'>Thank you for your order.</h2>
          <p style='color:#3A3830;line-height:1.7;'>Your order <strong>{orderNumber}</strong> has been confirmed.</p>
          <p style='color:#3A3830;'>Total: <strong>{total:N2} EGP</strong></p>
          <p style='color:#3A3830;'>Delivering to: {shippingAddress}</p>
          <p style='margin-top:2rem;font-size:0.82rem;color:#7A7670;'>No restocks planned — thank you for being part of this drop.</p>
          <p style='font-size:0.8rem;color:#7A7670;margin-top:2rem;'>— Robin Studio</p>
        </div>";
        await SendAsync(toEmail, $"Robin — Order {orderNumber} Confirmed ✓", html);
    }

    public async Task SendOrderStatusUpdateAsync(string toEmail, string orderNumber, string newStatus)
    {
        var emoji = newStatus switch { "Shipped" => "📦", "Delivered" => "✅", "Cancelled" => "❌", _ => "🔔" };
        var html = $@"
        <div style='font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#F6F2EC;padding:2rem;'>
          <h1 style='color:#BF4317;font-size:2.5rem;margin-bottom:0.5rem;'>Robin</h1>
          <hr style='border:none;border-top:1px solid #D8D0C5;margin:1.5rem 0;'/>
          <h2 style='font-size:1.5rem;'>{emoji} Order Update</h2>
          <p style='color:#3A3830;line-height:1.7;'>Your order <strong>{orderNumber}</strong> status has been updated to: <strong>{newStatus}</strong>.</p>
          <p style='font-size:0.8rem;color:#7A7670;margin-top:2rem;'>— Robin Studio</p>
        </div>";
        await SendAsync(toEmail, $"Robin — {orderNumber} is now {newStatus} {emoji}", html);
    }

    public async Task SendShippingConfirmationAsync(string toEmail, string orderNumber, string? trackingNumber, string address)
    {
        var trackingInfo = string.IsNullOrEmpty(trackingNumber) ? "No tracking number provided." : $"Your tracking number is: <strong>{trackingNumber}</strong>";
        var html = $@"
        <div style='font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#F6F2EC;padding:2rem;'>
          <h1 style='color:#BF4317;font-size:2.5rem;margin-bottom:0.5rem;'>Robin</h1>
          <hr style='border:none;border-top:1px solid #D8D0C5;margin:1.5rem 0;'/>
          <h2 style='font-size:1.5rem;'>📦 Your order is on the way!</h2>
          <p style='color:#3A3830;'>Order <strong>{orderNumber}</strong> has been shipped to {address}.</p>
          <p style='color:#3A3830;'>{trackingInfo}</p>
          <p style='font-size:0.8rem;color:#7A7670;margin-top:2rem;'>— Robin Studio</p>
        </div>";
        await SendAsync(toEmail, $"Robin — {orderNumber} Shipped 📦", html);
    }

    // ── NEW USER WELCOME (Role-Based) ──

    public async Task SendWelcomeEmailAsync(string toEmail, string firstName, string role)
    {
        var (roleTitle, roleMsg) = role switch
        {
            "SuperAdmin" => ("Super Admin", "You have full access to the Robin admin dashboard, AI assistant, financial reports, and user management."),
            "Admin"      => ("Admin",       "You have access to the Robin admin dashboard including product management and order oversight."),
            "Employee"   => ("Staff",       "You have access to the Robin staff portal to manage orders, update statuses, and track shipments."),
            "Finance"    => ("Finance",     "You have access to Robin's financial reports, revenue analytics, and export tools."),
            _            => ("Customer",    "Welcome to Robin. You can now browse our limited drops, track your orders, and be first to know about new collections.")
        };
        var html = $@"
        <div style='font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#F6F2EC;padding:2rem;'>
          <h1 style='color:#BF4317;font-size:2.5rem;margin-bottom:0.5rem;'>Robin</h1>
          <p style='font-size:0.8rem;letter-spacing:0.12em;text-transform:uppercase;color:#7A7670;'>{roleTitle} Account</p>
          <hr style='border:none;border-top:1px solid #D8D0C5;margin:1.5rem 0;'/>
          <h2 style='font-size:1.5rem;'>Welcome, {firstName}.</h2>
          <p style='color:#3A3830;line-height:1.7;'>{roleMsg}</p>
          <p style='font-size:0.8rem;color:#7A7670;margin-top:2rem;'>— Robin Studio</p>
        </div>";
        await SendAsync(toEmail, $"Welcome to Robin, {firstName}.", html);
    }

    public async Task SendAdminNewOrderAlertAsync(string orderNumber, string customerName, decimal total)
    {
        var adminEmail = _config["EmailSettings:AdminAlertEmail"] ?? "";
        if (string.IsNullOrEmpty(adminEmail)) return;
        var html = $@"<div style='font-family:sans-serif;'><h2>New Order: {orderNumber}</h2><p>Customer: {customerName}</p><p>Total: {total:N2} EGP</p></div>";
        await SendAsync(adminEmail, $"[Robin] New Order {orderNumber} — {total:N2} EGP", html);
    }

    public async Task SendFinanceReportAsync(string toEmail, object reportData)
    {
        var html = $@"<div style='font-family:Georgia,serif;background:#F6F2EC;padding:2rem;'><h1 style='color:#BF4317;'>Robin Finance Report</h1><p>See attached or dashboard for full details.</p></div>";
        await SendAsync(toEmail, "[Robin] Monthly Finance Report", html);
    }


    // ── WAITLIST EMAILS ──

    public async Task SendWaitlistConfirmationAsync(string toEmail, string productName)
    {
        var html = $@"<div style='font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#F6F2EC;padding:2rem;'>
          <h1 style='color:#BF4317;font-size:2.5rem;'>Robin</h1>
          <hr style='border:none;border-top:1px solid #D8D0C5;margin:1.5rem 0;'/>
          <h2>You're on the list.</h2>
          <p style='color:#3A3830;line-height:1.7;'>You've been added to the waitlist for <strong>{productName}</strong>. We'll email you the moment it's back in stock — before anyone else.</p>
          <p style='font-size:0.8rem;color:#7A7670;margin-top:2rem;'>— Robin Studio</p></div>";
        await SendAsync(toEmail, $"Robin — Waitlist confirmed: {productName}", html);
    }

    public async Task SendWaitlistAlertAsync(string toEmail, string productName, string productSlug)
    {
        var html = $@"<div style='font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#F6F2EC;padding:2rem;'>
          <h1 style='color:#BF4317;font-size:2.5rem;'>Robin</h1>
          <hr style='border:none;border-top:1px solid #D8D0C5;margin:1.5rem 0;'/>
          <h2>It's back. 🔔</h2>
          <p style='color:#3A3830;line-height:1.7;'><strong>{productName}</strong> is back in stock. As a waitlist member, you have priority access for the next 24 hours.</p>
          <a href='https://robin.store/product/{productSlug}' style='display:inline-block;background:#BF4317;color:white;padding:0.75rem 2rem;font-size:0.85rem;font-weight:600;text-decoration:none;letter-spacing:0.08em;text-transform:uppercase;margin-top:1.5rem;'>Shop Now</a>
          <p style='font-size:0.8rem;color:#7A7670;margin-top:2rem;'>— Robin Studio</p></div>";
        await SendAsync(toEmail, $"Robin — {productName} is back in stock 🔔", html);
    }
}
