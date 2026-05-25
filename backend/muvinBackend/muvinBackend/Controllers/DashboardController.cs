using Microsoft.AspNetCore.Mvc;
using muvinBackend.Interfaces;

namespace muvinBackend.Controllers;

[ApiController]
[Route("api/dashboard")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _service;

    public DashboardController(IDashboardService service)
    {
        _service = service;
    }

    [HttpGet("imoveis/disponiveis")]
    public async Task<IActionResult> GetImoveisDisponiveis()
    {
        var quantidade = await _service.GetImoveisDisponiveisAsync();
        return Ok(new { quantidade });
    }

    [HttpGet("leads/novos")]
    public async Task<IActionResult> GetLeadsNovos()
    {
        var quantidade = await _service.GetLeadsNovosAsync();
        return Ok(new { quantidade });
    }

    [HttpGet("leads/em-negociacao")]
    public async Task<IActionResult> GetLeadsEmNegociacao()
    {
        var quantidade = await _service.GetLeadsEmNegociacaoAsync();
        return Ok(new { quantidade });
    }

    [HttpGet("leads/funil")]
    public async Task<IActionResult> GetFunilLeads()
    {
        var funil = await _service.GetFunilLeadsAsync();
        return Ok(funil);
    }
}
