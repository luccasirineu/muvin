using muvinBackend.DTOs;

namespace muvinBackend.Interfaces;

public interface IDashboardService
{
    Task<int> GetImoveisDisponiveisAsync();
    Task<int> GetLeadsNovosAsync();
    Task<int> GetLeadsEmNegociacaoAsync();
    Task<LeadFunilDto> GetFunilLeadsAsync();
}
