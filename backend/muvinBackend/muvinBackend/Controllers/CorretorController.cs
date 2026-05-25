using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using muvinBackend.DTOs;
using muvinBackend.Interfaces;

namespace muvinBackend.Controllers;

[ApiController]
[Route("api/corretor")]
public class CorretorController : ControllerBase
{
    private readonly ICorretorService _service;

    public CorretorController(ICorretorService service)
    {
        _service = service;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] CorretorLoginDto dto)
    {
        var result = await _service.LoginAsync(dto);
        return result is null ? Unauthorized() : Ok(result);
    }

    [HttpGet("perfil")]
    public async Task<IActionResult> GetPerfil()
    {
        var result = await _service.GetMeAsync();
        return result is null ? NotFound() : Ok(result);
    }

    [Authorize]
    [HttpPatch("{uuid:guid}")]
    public async Task<IActionResult> Update(Guid uuid, [FromBody] CorretorUpdateDto dto)
    {
        var result = await _service.UpdateAsync(uuid, dto);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpPost("esqueci-senha")]
    public async Task<IActionResult> EsqueciSenha([FromBody] EsqueciSenhaDto dto)
    {
        try
        {
            await _service.EsqueciSenhaAsync(dto);
        }
        catch (Exception ex)
        {
            // Log do erro sem expor detalhes ao cliente
            Console.Error.WriteLine($"[EsqueciSenha] Falha ao enviar e-mail: {ex.Message}");
            return StatusCode(503, new { mensagem = "Não foi possível enviar o e-mail no momento. Tente novamente em alguns minutos." });
        }
        return Ok(new { mensagem = "Se os dados informados forem válidos, você receberá um e-mail com a nova senha em instantes." });
    }
}
