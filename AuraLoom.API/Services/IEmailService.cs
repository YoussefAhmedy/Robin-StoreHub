namespace AuraLoom.API.Services;

public interface IEmailService
{
    Task SendOrderConfirmationAsync(string toEmail, string orderNumber, decimal total, string shippingAddress);
    Task SendOrderStatusUpdateAsync(string toEmail, string orderNumber, string newStatus);
    Task SendShippingConfirmationAsync(string toEmail, string orderNumber, string? trackingNumber, string address);
    Task SendWelcomeEmailAsync(string toEmail, string firstName, string role);
    Task SendAdminNewOrderAlertAsync(string orderNumber, string customerName, decimal total);
    Task SendFinanceReportAsync(string toEmail, object reportData);
    Task SendWaitlistConfirmationAsync(string toEmail, string productName);
    Task SendWaitlistAlertAsync(string toEmail, string productName, string productSlug);
}
