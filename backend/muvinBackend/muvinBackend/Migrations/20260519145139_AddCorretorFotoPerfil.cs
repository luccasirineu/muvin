using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace muvinBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddCorretorFotoPerfil : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "foto_perfil",
                table: "corretores",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "foto_perfil",
                table: "corretores");
        }
    }
}
