using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using muvinBackend.Enums;


namespace muvinBackend.Models;

public class Imovel
{
    [Key]
    [Column("uuid")]
    public Guid Uuid { get; set; }

    [Required]
    [Column("cod_interno")]
    [MaxLength(50)]
    public string CodInterno { get; set; }

    [Required]
    [Column("status_imovel")]
    public StatusImovelEnum StatusImovel { get; set; }

    [Required]
    [Column("titulo")]
    [MaxLength(150)]
    public string Titulo { get; set; }

    [Column("descricao", TypeName = "TEXT")]
    public string Descricao { get; set; }

    [Required]
    [Column("tipo_imovel")]
    public TipoImovelEnum TipoImovel { get; set; }

    [Required]
    [Column("finalidade_imovel")]
    public FinalidadeImovelEnum FinalidadeImovel { get; set; }

    [Required]
    [Column("preco_imovel", TypeName = "decimal(18,2)")]
    public decimal PrecoImovel { get; set; }

    [Column("condominio_mensal", TypeName = "decimal(18,2)")]
    public decimal CondominioMensal { get; set; }

    [Column("iptu_mensal", TypeName = "decimal(18,2)")]
    public decimal IptuMensal { get; set; }

    [Column("publicacao_timestamp")]
    public DateTime PublicacaoTimestamp { get; set; }

    [Required]
    [Column("destaque")]
    public bool Destaque { get; set; }

    public Guid CaracteristicaId { get; set; }

    [ForeignKey(nameof(CaracteristicaId))]
    public CaracteristicaImovel Caracteristica { get; set; }

    public Guid EnderecoId { get; set; }

    [ForeignKey(nameof(EnderecoId))]
    public Endereco Endereco { get; set; }

    public List<FotoImovel> FotosImovel { get; set; } = new();
}