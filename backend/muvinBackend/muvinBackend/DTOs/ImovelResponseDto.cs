using muvinBackend.Enums;

namespace muvinBackend.DTOs;

public class ImovelResponseDto
{
    public Guid Uuid { get; set; }
    public string CodInterno { get; set; } = string.Empty;
    public StatusImovelEnum StatusImovel { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string? Descricao { get; set; }
    public TipoImovelEnum TipoImovel { get; set; }
    public FinalidadeImovelEnum FinalidadeImovel { get; set; }
    public decimal PrecoImovel { get; set; }
    public decimal CondominioMensal { get; set; }
    public decimal IptuMensal { get; set; }
    public bool Destaque { get; set; }
    public DateTime PublicacaoTimestamp { get; set; }
    public CaracteristicaImovelDto Caracteristica { get; set; } = new();
    public EnderecoDto Endereco { get; set; } = new();
    public List<FotoImovelDto> FotosImovel { get; set; } = new();
}
