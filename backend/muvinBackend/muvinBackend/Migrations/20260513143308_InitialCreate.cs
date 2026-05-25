using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace muvinBackend.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CaracteristicaImoveis",
                columns: table => new
                {
                    uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    dormitorios = table.Column<int>(type: "integer", nullable: false),
                    suites = table.Column<int>(type: "integer", nullable: false),
                    banheiros = table.Column<int>(type: "integer", nullable: false),
                    vagas = table.Column<int>(type: "integer", nullable: false),
                    area_util = table.Column<double>(type: "double precision", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CaracteristicaImoveis", x => x.uuid);
                });

            migrationBuilder.CreateTable(
                name: "Enderecos",
                columns: table => new
                {
                    uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    logradouro = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    bairro = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    cidade = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    uf = table.Column<string>(type: "character varying(2)", maxLength: 2, nullable: false),
                    cep = table.Column<string>(type: "character varying(9)", maxLength: 9, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Enderecos", x => x.uuid);
                });

            migrationBuilder.CreateTable(
                name: "Leads",
                columns: table => new
                {
                    uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    nome_completo = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    num_celular = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    email = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    mensagem = table.Column<string>(type: "TEXT", nullable: false),
                    desejo = table.Column<int>(type: "integer", nullable: false),
                    status_lead = table.Column<int>(type: "integer", nullable: false),
                    envio_timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Leads", x => x.uuid);
                });

            migrationBuilder.CreateTable(
                name: "Imoveis",
                columns: table => new
                {
                    uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    cod_interno = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    status_imovel = table.Column<int>(type: "integer", nullable: false),
                    titulo = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    descricao = table.Column<string>(type: "TEXT", nullable: false),
                    tipo_imovel = table.Column<int>(type: "integer", nullable: false),
                    finalidade_imovel = table.Column<int>(type: "integer", nullable: false),
                    preco_imovel = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    condominio_mensal = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    iptu_mensal = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    publicacao_timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CaracteristicaId = table.Column<Guid>(type: "uuid", nullable: false),
                    EnderecoId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Imoveis", x => x.uuid);
                    table.ForeignKey(
                        name: "FK_Imoveis_CaracteristicaImoveis_CaracteristicaId",
                        column: x => x.CaracteristicaId,
                        principalTable: "CaracteristicaImoveis",
                        principalColumn: "uuid",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Imoveis_Enderecos_EnderecoId",
                        column: x => x.EnderecoId,
                        principalTable: "Enderecos",
                        principalColumn: "uuid",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FotoImoveis",
                columns: table => new
                {
                    uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    url_foto = table.Column<string>(type: "text", nullable: false),
                    envio_timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    imovel_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FotoImoveis", x => x.uuid);
                    table.ForeignKey(
                        name: "FK_FotoImoveis_Imoveis_imovel_id",
                        column: x => x.imovel_id,
                        principalTable: "Imoveis",
                        principalColumn: "uuid",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FotoImoveis_imovel_id",
                table: "FotoImoveis",
                column: "imovel_id");

            migrationBuilder.CreateIndex(
                name: "IX_Imoveis_CaracteristicaId",
                table: "Imoveis",
                column: "CaracteristicaId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Imoveis_EnderecoId",
                table: "Imoveis",
                column: "EnderecoId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FotoImoveis");

            migrationBuilder.DropTable(
                name: "Leads");

            migrationBuilder.DropTable(
                name: "Imoveis");

            migrationBuilder.DropTable(
                name: "CaracteristicaImoveis");

            migrationBuilder.DropTable(
                name: "Enderecos");
        }
    }
}
