using muvinBackend.DTOs;
using muvinBackend.Enums;

namespace muvinBackend.Interfaces;

public interface ILeadService
{
    Task<PagedResponseDto<LeadResponseDto>> GetAllPagedAsync(int page, int pageSize);
    Task<PagedResponseDto<LeadResponseDto>> GetByStatusAsync(StatusLeadEnum status, int page, int pageSize);
    Task<LeadResponseDto> CreateAsync(LeadRequestDto dto);
    Task<LeadResponseDto?> UpdateStatusAsync(Guid uuid, LeadUpdateStatusDto dto);
}
