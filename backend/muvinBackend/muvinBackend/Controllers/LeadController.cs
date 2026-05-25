using Microsoft.AspNetCore.Mvc;
using muvinBackend.DTOs;
using muvinBackend.Enums;
using muvinBackend.Interfaces;

namespace muvinBackend.Controllers;

[ApiController]
[Route("api/leads")]
public class LeadController : ControllerBase
{
    private readonly ILeadService _service;

    public LeadController(ILeadService service)
    {
        _service = service;
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

    [HttpGet("filtro")]
    public async Task<IActionResult> GetByStatus(
        [FromQuery] StatusLeadEnum status,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        if (page < 1 || pageSize < 1)
            return BadRequest("Página e tamanho de página devem ser maiores que zero.");

        if (pageSize > 100)
            return BadRequest("O tamanho máximo de página é 100.");

        var result = await _service.GetByStatusAsync(status, page, pageSize);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] LeadRequestDto dto)
    {
        var result = await _service.CreateAsync(dto);
        return Created($"api/leads/{result.Uuid}", result);
    }

    [HttpPatch("{uuid:guid}/status")]
    public async Task<IActionResult> UpdateStatus(Guid uuid, [FromBody] LeadUpdateStatusDto dto)
    {
        var result = await _service.UpdateStatusAsync(uuid, dto);
        return result is null ? NotFound() : Ok(result);
    }
}
