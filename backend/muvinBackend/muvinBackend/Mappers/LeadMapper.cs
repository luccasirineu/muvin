using muvinBackend.DTOs;
using muvinBackend.Enums;
using muvinBackend.Models;

namespace muvinBackend.Mappers;

public static class LeadMapper
{
    public static LeadResponseDto ToResponse(Lead lead) => new()
    {
        Uuid = lead.Uuid,
        NomeCompleto = lead.NomeCompleto,
        NumCelular = lead.NumCelular,
        Email = lead.Email,
        Mensagem = lead.Mensagem,
        Desejo = lead.Desejo,
        StatusLead = lead.StatusLead,
        EnvioTimestamp = lead.EnvioTimestamp
    };

    public static Lead ToEntity(LeadRequestDto dto) => new()
    {
        Uuid = Guid.NewGuid(),
        NomeCompleto = dto.NomeCompleto,
        NumCelular = dto.NumCelular,
        Email = dto.Email,
        Mensagem = dto.Mensagem,
        Desejo = dto.Desejo,
        StatusLead = StatusLeadEnum.Novo,
        EnvioTimestamp = DateTime.UtcNow
    };
}
