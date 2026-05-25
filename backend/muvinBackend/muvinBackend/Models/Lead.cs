using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using muvinBackend.Enums;

namespace muvinBackend.Models;


public class Lead
{
    [Key]
    [Column("uuid")]
    public Guid Uuid { get; set; }

    [Required]
    [Column("nome_completo")]
    [MaxLength(150)]
    public string NomeCompleto { get; set; }

    [Required]
    [Column("num_celular")]
    [MaxLength(20)]
    public string NumCelular { get; set; }

    [Required]
    [Column("email")]
    [MaxLength(150)]
    public string Email { get; set; }

    [Column("mensagem", TypeName = "TEXT")]
    public string Mensagem { get; set; }

    [Required]
    [Column("desejo")]
    public TipoDesejoEnum Desejo { get; set; }

    [Required]
    [Column("status_lead")]
    public StatusLeadEnum StatusLead { get; set; }

    [Column("envio_timestamp")]
    public DateTime EnvioTimestamp { get; set; }
}