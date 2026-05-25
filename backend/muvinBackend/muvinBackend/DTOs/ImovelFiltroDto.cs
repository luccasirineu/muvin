using muvinBackend.Enums;

namespace muvinBackend.DTOs;

public class ImovelFiltroDto
{
    public TipoImovelEnum? Tipo { get; set; }
    public FinalidadeImovelEnum? Finalidade { get; set; }
    public decimal? PrecoMaximo { get; set; }
    public string? PalavraChave { get; set; }
    public OrdenacaoImovelEnum Ordenacao { get; set; } = OrdenacaoImovelEnum.MaisRecente;
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}
