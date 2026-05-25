using Microsoft.EntityFrameworkCore;
using muvinBackend.Data;
using muvinBackend.DTOs;
using muvinBackend.Enums;
using muvinBackend.Interfaces;
using muvinBackend.Mappers;
using muvinBackend.Models;

namespace muvinBackend.Services;

public class ImovelService : IImovelService
{
    private readonly AppDbContext _context;

    public ImovelService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResponseDto<ImovelResponseDto>> GetAllPagedAsync(int page, int pageSize)
    {
        var query = _context.Imoveis
            .Include(i => i.Caracteristica)
            .Include(i => i.Endereco)
            .Include(i => i.FotosImovel)
            .AsNoTracking();

        var totalCount = await query.CountAsync();

        var data = await query
            .OrderByDescending(i => i.PublicacaoTimestamp)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResponseDto<ImovelResponseDto>
        {
            Data = data.Select(ImovelMapper.ToResponse).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
        };
    }

    public async Task<PagedResponseDto<ImovelResponseDto>> GetDestaquePagedAsync(int page, int pageSize)
    {
        var query = _context.Imoveis
            .Include(i => i.Caracteristica)
            .Include(i => i.Endereco)
            .Include(i => i.FotosImovel)
            .Where(i => i.Destaque)
            .AsNoTracking();

        var totalCount = await query.CountAsync();

        var data = await query
            .OrderByDescending(i => i.PublicacaoTimestamp)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResponseDto<ImovelResponseDto>
        {
            Data = data.Select(ImovelMapper.ToResponse).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
        };
    }

    public async Task<PagedResponseDto<ImovelResponseDto>> BuscarPagedAsync(ImovelFiltroDto filtro)
    {
        var query = _context.Imoveis
            .Include(i => i.Caracteristica)
            .Include(i => i.Endereco)
            .Include(i => i.FotosImovel)
            .AsNoTracking();

        if (filtro.Tipo.HasValue)
            query = query.Where(i => i.TipoImovel == filtro.Tipo.Value);

        if (filtro.Finalidade.HasValue)
            query = query.Where(i => i.FinalidadeImovel == filtro.Finalidade.Value);

        if (filtro.PrecoMaximo.HasValue)
            query = query.Where(i => i.PrecoImovel <= filtro.PrecoMaximo.Value);

        if (!string.IsNullOrWhiteSpace(filtro.PalavraChave))
        {
            var kw = filtro.PalavraChave.ToLower();
            query = query.Where(i =>
                i.Endereco.Bairro.ToLower().Contains(kw) ||
                i.Endereco.Cidade.ToLower().Contains(kw) ||
                i.Endereco.Cep.ToLower().Contains(kw));
        }

        var totalCount = await query.CountAsync();

        query = filtro.Ordenacao switch
        {
            OrdenacaoImovelEnum.MaiorPreco => query.OrderByDescending(i => i.PrecoImovel),
            OrdenacaoImovelEnum.MenorPreco => query.OrderBy(i => i.PrecoImovel),
            _ => query.OrderByDescending(i => i.PublicacaoTimestamp)
        };

        var data = await query
            .Skip((filtro.Page - 1) * filtro.PageSize)
            .Take(filtro.PageSize)
            .ToListAsync();

        return new PagedResponseDto<ImovelResponseDto>
        {
            Data = data.Select(ImovelMapper.ToResponse).ToList(),
            Page = filtro.Page,
            PageSize = filtro.PageSize,
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling((double)totalCount / filtro.PageSize)
        };
    }

    public async Task<PagedResponseDto<ImovelResponseDto>?> GetProximosAsync(Guid uuid, int page, int pageSize)
    {
        var referencia = await _context.Imoveis
            .Include(i => i.Endereco)
            .AsNoTracking()
            .FirstOrDefaultAsync(i => i.Uuid == uuid);

        if (referencia is null) return null;

        var cepPrefixo = referencia.Endereco.Cep.Length >= 5
            ? referencia.Endereco.Cep[..5]
            : referencia.Endereco.Cep;
        var bairro = referencia.Endereco.Bairro.ToLower();
        var cidade = referencia.Endereco.Cidade.ToLower();

        var baseQuery = _context.Imoveis
            .Include(i => i.Caracteristica)
            .Include(i => i.Endereco)
            .Include(i => i.FotosImovel)
            .AsNoTracking()
            .Where(i => i.Uuid != uuid);

        IQueryable<Imovel> query;

        if (await baseQuery.AnyAsync(i => i.Endereco.Cep.StartsWith(cepPrefixo)))
            query = baseQuery.Where(i => i.Endereco.Cep.StartsWith(cepPrefixo));
        else if (await baseQuery.AnyAsync(i => i.Endereco.Bairro.ToLower() == bairro))
            query = baseQuery.Where(i => i.Endereco.Bairro.ToLower() == bairro);
        else if (await baseQuery.AnyAsync(i => i.Endereco.Cidade.ToLower() == cidade))
            query = baseQuery.Where(i => i.Endereco.Cidade.ToLower() == cidade);
        else
            query = baseQuery.Where(_ => false);

        var totalCount = await query.CountAsync();

        var data = await query
            .OrderByDescending(i => i.PublicacaoTimestamp)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResponseDto<ImovelResponseDto>
        {
            Data = data.Select(ImovelMapper.ToResponse).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
        };
    }

    public async Task<ImovelResponseDto?> GetByIdAsync(Guid uuid)
    {
        var imovel = await _context.Imoveis
            .Include(i => i.Caracteristica)
            .Include(i => i.Endereco)
            .Include(i => i.FotosImovel)
            .AsNoTracking()
            .FirstOrDefaultAsync(i => i.Uuid == uuid);

        return imovel is null ? null : ImovelMapper.ToResponse(imovel);
    }

    public async Task<ImovelResponseDto> CreateAsync(ImovelRequestDto dto)
    {
        var imovel = ImovelMapper.ToEntity(dto);
        _context.Imoveis.Add(imovel);
        await _context.SaveChangesAsync();
        return ImovelMapper.ToResponse(imovel);
    }

    public async Task<ImovelResponseDto?> UpdateAsync(Guid uuid, ImovelUpdateDto dto)
    {
        var imovel = await _context.Imoveis
            .Include(i => i.Caracteristica)
            .Include(i => i.Endereco)
            .Include(i => i.FotosImovel)
            .FirstOrDefaultAsync(i => i.Uuid == uuid);

        if (imovel is null) return null;

        ImovelMapper.UpdateEntity(imovel, dto);

        _context.FotoImoveis.RemoveRange(imovel.FotosImovel.ToList());

        var newPhotos = dto.UrlFotos.Select(url => new FotoImovel
        {
            Uuid = Guid.NewGuid(),
            UrlFoto = url,
            EnvioTimestamp = DateTime.UtcNow,
            ImovelId = imovel.Uuid
        }).ToList();

        await _context.FotoImoveis.AddRangeAsync(newPhotos);

        await _context.SaveChangesAsync();

        imovel.FotosImovel = newPhotos;
        return ImovelMapper.ToResponse(imovel);
    }

    public async Task<ImovelResponseDto?> UpdateDestaqueAsync(Guid uuid, ImovelUpdateDestaqueDto dto)
    {
        var imovel = await _context.Imoveis
            .Include(i => i.Caracteristica)
            .Include(i => i.Endereco)
            .Include(i => i.FotosImovel)
            .FirstOrDefaultAsync(i => i.Uuid == uuid);

        if (imovel is null) return null;

        imovel.Destaque = dto.Destaque;
        await _context.SaveChangesAsync();
        return ImovelMapper.ToResponse(imovel);
    }

    public async Task<bool> DeleteAsync(Guid uuid)
    {
        var imovel = await _context.Imoveis.FindAsync(uuid);
        if (imovel is null) return false;

        _context.Imoveis.Remove(imovel);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IList<BairroStatsDto>> GetTopBairrosAsync(int top)
    {
        return await _context.Imoveis
            .AsNoTracking()
            .Select(i => new { i.Endereco.Bairro, i.Endereco.Cidade })
            .GroupBy(x => new { x.Bairro, x.Cidade })
            .Select(g => new BairroStatsDto
            {
                Bairro = g.Key.Bairro,
                Cidade = g.Key.Cidade,
                Quantidade = g.Count()
            })
            .OrderByDescending(b => b.Quantidade)
            .Take(top)
            .ToListAsync();
    }
}
