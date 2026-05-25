namespace muvinBackend.DTOs;

public class CorretorResponseDto
{
    public Guid Uuid { get; set; }
    public string NomeCompleto { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string RegistroCreci { get; set; } = string.Empty;
    public string Cpf { get; set; } = string.Empty;
    public string? NumCelular { get; set; }
    public string? FotoPerfil { get; set; }
}
