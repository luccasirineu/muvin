using muvinBackend.Enums;

namespace muvinBackend.DTOs;

public class LeadResponseDto
{
    public Guid Uuid { get; set; }
    public string NomeCompleto { get; set; }
    public string NumCelular { get; set; }
    public string Email { get; set; }
    public string? Mensagem { get; set; }
    public TipoDesejoEnum Desejo { get; set; }
    public StatusLeadEnum StatusLead { get; set; }
    public DateTime EnvioTimestamp { get; set; }
}
