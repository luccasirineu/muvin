using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace muvinBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddDestaqueToImovel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "destaque",
                table: "Imoveis",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "destaque",
                table: "Imoveis");
        }
    }
}
