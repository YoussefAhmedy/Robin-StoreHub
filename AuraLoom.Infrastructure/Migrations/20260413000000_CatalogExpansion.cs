using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable
namespace AuraLoom.Infrastructure.Migrations
{
    public partial class CatalogExpansion : Migration
    {
        protected override void Up(MigrationBuilder m)
        {
            // Product — new taxonomy + media fields
            m.AddColumn<string>("ImageUrl",      "Products", "nvarchar(max)", nullable:true);
            m.AddColumn<string>("ImageUrlsJson", "Products", "nvarchar(max)", nullable:true);
            m.AddColumn<string>("SizesJson",     "Products", "nvarchar(max)", nullable:true);
            m.AddColumn<string>("ColorTags",     "Products", "nvarchar(max)", nullable:true);
            m.AddColumn<string>("OptionsJson",   "Products", "nvarchar(max)", nullable:true);
            m.AddColumn<string>("Materials",     "Products", "nvarchar(max)", nullable:true);
            m.AddColumn<string>("FitNotes",      "Products", "nvarchar(max)", nullable:true);
            m.AddColumn<string>("SubCategory",   "Products", "nvarchar(max)", nullable:true);
            m.AddColumn<string>("AgeGroup",      "Products", "nvarchar(max)", nullable:true);
            m.AddColumn<int>   ("Gender",        "Products", "int",           nullable:false, defaultValue:4);
            m.AddColumn<int>   ("Season",        "Products", "int",           nullable:false, defaultValue:2);
            m.AddColumn<bool>  ("IsFeatured",    "Products", "bit",           nullable:false, defaultValue:false);

            // Order — shipping enhancements
            m.AddColumn<int>   ("ShippingMethod","Orders", "int",           nullable:false, defaultValue:0);
            m.AddColumn<string>("TrackingNumber","Orders", "nvarchar(max)", nullable:true);
            m.AddColumn<string>("StaffNotes",    "Orders", "nvarchar(max)", nullable:true);
            m.AddColumn<DateTime?>("ShippedAt",  "Orders", "datetime2",     nullable:true);
            m.AddColumn<DateTime?>("DeliveredAt","Orders", "datetime2",     nullable:true);

            // OrderItem — size
            m.AddColumn<string>("SelectedSize","OrderItems","nvarchar(max)", nullable:true);

            // CartItem — size
            m.AddColumn<string>("SelectedSize","CartItems", "nvarchar(max)", nullable:true);

            // Reviews table
            m.CreateTable("Reviews", t => new {
                Id            = t.Column<int>(nullable:false).Annotation("SqlServer:Identity","1,1"),
                ProductId     = t.Column<int>(),
                UserId        = t.Column<int>(),
                Rating        = t.Column<int>(),
                Title         = t.Column<string>("nvarchar(max)", nullable:true),
                Body          = t.Column<string>("nvarchar(max)", nullable:true),
                SizePurchased = t.Column<string>("nvarchar(max)", nullable:true),
                Verified      = t.Column<bool>(defaultValue:false),
                CreatedAt     = t.Column<DateTime>(defaultValueSql:"GETUTCDATE()"),
            }, constraints: t => {
                t.PrimaryKey("PK_Reviews", x => x.Id);
                t.ForeignKey("FK_Reviews_Products", x => x.ProductId, "Products","Id", onDelete:ReferentialAction.Cascade);
                t.ForeignKey("FK_Reviews_Users",    x => x.UserId,    "Users",   "Id", onDelete:ReferentialAction.Cascade);
            });
            m.CreateIndex("IX_Reviews_ProductId_UserId","Reviews",new[]{"ProductId","UserId"},unique:true);

            // WaitlistEntries table
            m.CreateTable("WaitlistEntries", t => new {
                Id          = t.Column<int>(nullable:false).Annotation("SqlServer:Identity","1,1"),
                ProductId   = t.Column<int>(),
                Email       = t.Column<string>("nvarchar(256)"),
                Phone       = t.Column<string>("nvarchar(max)", nullable:true),
                SizeWanted  = t.Column<string>("nvarchar(max)", nullable:true),
                Notified    = t.Column<bool>(defaultValue:false),
                CreatedAt   = t.Column<DateTime>(defaultValueSql:"GETUTCDATE()"),
            }, constraints: t => {
                t.PrimaryKey("PK_WaitlistEntries", x => x.Id);
                t.ForeignKey("FK_WL_Products", x => x.ProductId, "Products","Id", onDelete:ReferentialAction.Cascade);
            });
        }

        protected override void Down(MigrationBuilder m)
        {
            m.DropTable("Reviews");
            m.DropTable("WaitlistEntries");
            foreach (var col in new[]{
                ("Products","ImageUrl"),("Products","ImageUrlsJson"),("Products","SizesJson"),
                ("Products","ColorTags"),("Products","OptionsJson"),("Products","Materials"),
                ("Products","FitNotes"),("Products","SubCategory"),("Products","AgeGroup"),
                ("Products","Gender"),("Products","Season"),("Products","IsFeatured"),
                ("Orders","ShippingMethod"),("Orders","TrackingNumber"),("Orders","StaffNotes"),
                ("Orders","ShippedAt"),("Orders","DeliveredAt"),
                ("OrderItems","SelectedSize"),("CartItems","SelectedSize"),
            }) m.DropColumn(col.Item2, col.Item1);
        }
    }
}
