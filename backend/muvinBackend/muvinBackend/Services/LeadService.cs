using Microsoft.EntityFrameworkCore;
using muvinBackend.Data;
using muvinBackend.DTOs;
using muvinBackend.Enums;
using muvinBackend.Interfaces;
using muvinBackend.Mappers;

namespace muvinBackend.Services;

public class LeadService : ILeadService
{
    private readonly AppDbContext _context;

    public LeadService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResponseDto<LeadResponseDto>> GetAllPagedAsync(int page, int pageSize)
    {
        var query = _context.Leads.AsNoTracking();

        var totalCount = await query.CountAsync();

        var data = await query
            .OrderByDescending(l => l.EnvioTimestamp)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResponseDto<LeadResponseDto>
        {
            Data = data.Select(LeadMapper.ToResponse).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
        };
    }

    public async Task<PagedResponseDto<LeadResponseDto>> GetByStatusAsync(StatusLeadEnum status, int page, int pageSize)
    {
        var query = _context.Leads
            .AsNoTracking()
            .Where(l => l.StatusLead == status);

        var totalCount = await query.CountAsync();

        var data = await query
            .OrderByDescending(l => l.EnvioTimestamp)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResponseDto<LeadResponseDto>
        {
            Data = data.Select(LeadMapper.ToResponse).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
        };
    }

    public async Task<LeadResponseDto> CreateAsync(LeadRequestDto dto)
    {
        var lead = LeadMapper.ToEntity(dto);
        _context.Leads.Add(lead);
        await _context.SaveChangesAsync();
        return LeadMapper.ToResponse(lead);
    }

    public async Task<LeadResponseDto?> UpdateStatusAsync(Guid uuid, LeadUpdateStatusDto dto)
    {
        var lead = await _context.Leads.FindAsync(uuid);
        if (lead is null) return null;

        lead.StatusLead = dto.StatusLead;
        await _context.SaveChangesAsync();
        return LeadMapper.ToResponse(lead);
    }
}
