using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace muvinBackend.Models;

[Table("corretores")]
public class Corretor
{
    [Key]
    [Column("uuid")]
    public Guid Uuid { get; set; }

    [Required]
    [Column("nome_completo")]
    public string NomeCompleto { get; set; }

    [Required]
    [Column("email")]
    public string Email { get; set; }

    [Required]
    [Column("senha")]
    public string Senha { get; set; }

    [Required]
    [Column("registro_creci")]
    public string RegistroCreci { get; set; }

    [Required]
    [Column("cpf")]
    public string Cpf { get; set; }

    [Column("num_celular")]
    public string? NumCelular { get; set; }

    [Column("foto_perfil")]
    public string? FotoPerfil { get; set; }
}
