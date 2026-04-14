using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AuraLoom.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RobinRebrand : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Add new Product columns
            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Products",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImageUrlsJson",
                table: "Products",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SizesJson",
                table: "Products",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OptionsJson",
                table: "Products",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsFeatured",
                table: "Products",
                type: "bit",
                nullable: false,
                defaultValue: false);

            // Add new Order columns
            migrationBuilder.AddColumn<int>(
                name: "ShippingMethod",
                table: "Orders",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "TrackingNumber",
                table: "Orders",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StaffNotes",
                table: "Orders",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ShippedAt",
                table: "Orders",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeliveredAt",
                table: "Orders",
                type: "datetime2",
                nullable: true);

            // Add SelectedSize to OrderItems
            migrationBuilder.AddColumn<string>(
                name: "SelectedSize",
                table: "OrderItems",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "ImageUrl",      table: "Products");
            migrationBuilder.DropColumn(name: "ImageUrlsJson", table: "Products");
            migrationBuilder.DropColumn(name: "SizesJson",     table: "Products");
            migrationBuilder.DropColumn(name: "OptionsJson",   table: "Products");
            migrationBuilder.DropColumn(name: "IsFeatured",    table: "Products");
            migrationBuilder.DropColumn(name: "ShippingMethod",table: "Orders");
            migrationBuilder.DropColumn(name: "TrackingNumber",table: "Orders");
            migrationBuilder.DropColumn(name: "StaffNotes",    table: "Orders");
            migrationBuilder.DropColumn(name: "ShippedAt",     table: "Orders");
            migrationBuilder.DropColumn(name: "DeliveredAt",   table: "Orders");
            migrationBuilder.DropColumn(name: "SelectedSize",  table: "OrderItems");
        }
    }
}
