using muvinBackend.DTOs;

namespace muvinBackend.Interfaces;

public interface IImovelService
{
    Task<PagedResponseDto<ImovelResponseDto>> GetAllPagedAsync(int page, int pageSize);
    Task<PagedResponseDto<ImovelResponseDto>> GetDestaquePagedAsync(int page, int pageSize);
    Task<PagedResponseDto<ImovelResponseDto>> BuscarPagedAsync(ImovelFiltroDto filtro);
    Task<PagedResponseDto<ImovelResponseDto>?> GetProximosAsync(Guid uuid, int page, int pageSize);
    Task<ImovelResponseDto?> GetByIdAsync(Guid uuid);
    Task<ImovelResponseDto> CreateAsync(ImovelRequestDto dto);
    Task<ImovelResponseDto?> UpdateAsync(Guid uuid, ImovelUpdateDto dto);
    Task<ImovelResponseDto?> UpdateDestaqueAsync(Guid uuid, ImovelUpdateDestaqueDto dto);
    Task<bool> DeleteAsync(Guid uuid);
    Task<IList<BairroStatsDto>> GetTopBairrosAsync(int top);
}
