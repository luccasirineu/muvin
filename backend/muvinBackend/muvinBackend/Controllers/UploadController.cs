using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using muvinBackend.Interfaces;

namespace muvinBackend.Controllers;

[ApiController]
[Route("api/upload")]
[Authorize]
public class UploadController : ControllerBase
{
    private readonly IStorageService _storage;
    private static readonly string[] AllowedTypes = ["image/jpeg", "image/png", "image/webp"];

    public UploadController(IStorageService storage)
    {
        _storage = storage;
    }

    [HttpPost("foto")]
    public async Task<IActionResult> UploadFoto(IFormFile file)
    {
        if (file.Length > 5 * 1024 * 1024)
            return BadRequest(new { error = "Arquivo muito grande. Máximo: 5 MB." });

        if (!AllowedTypes.Contains(file.ContentType))
            return BadRequest(new { error = "Formato inválido. Use JPEG, PNG ou WebP." });

        await using var stream = file.OpenReadStream();
        var url = await _storage.UploadAsync(stream, file.FileName, file.ContentType);

        return Ok(new { url });
    }
}
