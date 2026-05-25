using Microsoft.AspNetCore.Mvc;
using muvinBackend.DTOs;
using muvinBackend.Interfaces;

namespace muvinBackend.Controllers;

[ApiController]
[Route("api/imoveis")]
public class ImovelController : ControllerBase
{
    private readonly IImovelService _service;

    public ImovelController(IImovelService service)
    {
        _service = service;
    }

    [HttpGet("bairros")]
    public async Task<IActionResult> GetTopBairros([FromQuery] int top = 6)
    {
        if (top < 1 || top > 50)
            return BadRequest("O parâmetro top deve estar entre 1 e 50.");

        var result = await _service.GetTopBairrosAsync(top);
        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        if (page < 1 || pageSize < 1)
            return BadRequest("Página e tamanho de página devem ser maiores que zero.");

        if (pageSize > 100)
            return BadRequest("O tamanho máximo de página é 100.");

        var result = await _service.GetAllPagedAsync(page, pageSize);
        return Ok(result);
    }

    [HttpGet("busca")]
    public async Task<IActionResult> Buscar([FromQuery] ImovelFiltroDto filtro)
    {
        if (filtro.Page < 1 || filtro.PageSize < 1)
            return BadRequest("Página e tamanho de página devem ser maiores que zero.");

        if (filtro.PageSize > 100)
            return BadRequest("O tamanho máximo de página é 100.");

        var result = await _service.BuscarPagedAsync(filtro);
        return Ok(result);
    }

    [HttpGet("destaque")]
    public async Task<IActionResult> GetDestaque([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        if (page < 1 || pageSize < 1)
            return BadRequest("Página e tamanho de página devem ser maiores que zero.");

        if (pageSize > 100)
            return BadRequest("O tamanho máximo de página é 100.");

        var result = await _service.GetDestaquePagedAsync(page, pageSize);
        return Ok(result);
    }

    [HttpGet("{uuid:guid}/proximos")]
    public async Task<IActionResult> GetProximos(Guid uuid, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        if (page < 1 || pageSize < 1)
            return BadRequest("Página e tamanho de página devem ser maiores que zero.");

        if (pageSize > 100)
            return BadRequest("O tamanho máximo de página é 100.");

        var result = await _service.GetProximosAsync(uuid, page, pageSize);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpGet("{uuid:guid}")]
    public async Task<IActionResult> GetById(Guid uuid)
    {
        var result = await _service.GetByIdAsync(uuid);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ImovelRequestDto dto)
    {
        var result = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { uuid = result.Uuid }, result);
    }

    [HttpPut("{uuid:guid}")]
    public async Task<IActionResult> Update(Guid uuid, [FromBody] ImovelUpdateDto dto)
    {
        var result = await _service.UpdateAsync(uuid, dto);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpPatch("{uuid:guid}/destaque")]
    public async Task<IActionResult> UpdateDestaque(Guid uuid, [FromBody] ImovelUpdateDestaqueDto dto)
    {
        var result = await _service.UpdateDestaqueAsync(uuid, dto);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpDelete("{uuid:guid}")]
    public async Task<IActionResult> Delete(Guid uuid)
    {
        var deleted = await _service.DeleteAsync(uuid);
        return deleted ? NoContent() : NotFound();
    }
}
