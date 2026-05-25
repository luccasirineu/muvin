using muvinBackend.DTOs;

namespace muvinBackend.Interfaces;

public interface ICorretorService
{
    Task<CorretorLoginResponseDto?> LoginAsync(CorretorLoginDto dto);
    Task<CorretorResponseDto?> UpdateAsync(Guid uuid, CorretorUpdateDto dto);
    Task<CorretorResponseDto?> GetMeAsync();
    Task EsqueciSenhaAsync(EsqueciSenhaDto dto);
}
