namespace muvinBackend.DTOs;

public class CorretorLoginResponseDto
{
    public string Token { get; set; } = string.Empty;
    public DateTime ExpiracaoUtc { get; set; }
    public CorretorResponseDto Corretor { get; set; } = new();
}
