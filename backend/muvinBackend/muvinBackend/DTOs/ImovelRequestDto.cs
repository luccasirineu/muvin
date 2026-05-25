using System.ComponentModel.DataAnnotations;
using muvinBackend.Enums;

namespace muvinBackend.DTOs;

public class ImovelRequestDto
{
    [Required]
    [MaxLength(50)]
    public string CodInterno { get; set; } = string.Empty;

    [Required]
    public StatusImovelEnum StatusImovel { get; set; }

    [Required]
    [MaxLength(150)]
    public string Titulo { get; set; } = string.Empty;

    public string? Descricao { get; set; }

    [Required]
    public TipoImovelEnum TipoImovel { get; set; }

    [Required]
    public FinalidadeImovelEnum FinalidadeImovel { get; set; }

    [Required]
    [Range(0.01, double.MaxValue)]
    public decimal PrecoImovel { get; set; }

    public decimal CondominioMensal { get; set; }
    public decimal IptuMensal { get; set; }
    public bool Destaque { get; set; }

    [Required]
    public CaracteristicaImovelDto Caracteristica { get; set; } = new();

    [Required]
    public EnderecoDto Endereco { get; set; } = new();

    public List<string> UrlFotos { get; set; } = new();
}
