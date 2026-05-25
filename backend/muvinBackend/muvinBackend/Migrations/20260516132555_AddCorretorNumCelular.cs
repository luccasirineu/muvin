using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace muvinBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddCorretorNumCelular : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "num_celular",
                table: "corretores",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "num_celular",
                table: "corretores");
        }
    }
}
