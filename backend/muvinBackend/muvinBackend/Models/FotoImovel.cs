using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace muvinBackend.Models;

public class FotoImovel
{
    [Key]
    [Column("uuid")]
    public Guid Uuid { get; set; }

    [Required]
    [Column("url_foto")]
    public string UrlFoto { get; set; }

    [Column("envio_timestamp")]
    public DateTime EnvioTimestamp { get; set; }

    // FK
    [Required]
    [Column("imovel_id")]
    public Guid ImovelId { get; set; }

    // RELACIONAMENTO N:1
    [ForeignKey(nameof(ImovelId))]
    public Imovel Imovel { get; set; }
}