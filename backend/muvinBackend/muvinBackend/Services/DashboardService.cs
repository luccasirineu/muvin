using Microsoft.EntityFrameworkCore;
using muvinBackend.Data;
using muvinBackend.DTOs;
using muvinBackend.Enums;
using muvinBackend.Interfaces;

namespace muvinBackend.Services;

public class DashboardService : IDashboardService
{
    private readonly AppDbContext _context;

    public DashboardService(AppDbContext context)
    {
        _context = context;
    }

    public Task<int> GetImoveisDisponiveisAsync() =>
        _context.Imoveis.CountAsync(i => i.StatusImovel == StatusImovelEnum.Disponivel);

    public Task<int> GetLeadsNovosAsync() =>
        _context.Leads.CountAsync(l => l.StatusLead == StatusLeadEnum.Novo);

    public Task<int> GetLeadsEmNegociacaoAsync() =>
        _context.Leads.CountAsync(l => l.StatusLead == StatusLeadEnum.Negociacao);

    public async Task<LeadFunilDto> GetFunilLeadsAsync()
    {
        var counts = await _context.Leads
            .GroupBy(l => l.StatusLead)
            .Select(g => new { Status = g.Key, Quantidade = g.Count() })
            .ToListAsync();

        int Get(StatusLeadEnum s) => counts.FirstOrDefault(c => c.Status == s)?.Quantidade ?? 0;

        return new LeadFunilDto
        {
            Novo = Get(StatusLeadEnum.Novo),
            EmContato = Get(StatusLeadEnum.EmContato),
            Negociacao = Get(StatusLeadEnum.Negociacao),
            Arquivado = Get(StatusLeadEnum.Arquivado),
            Fechado = Get(StatusLeadEnum.Fechado)
        };
    }
}
