using System.ComponentModel.DataAnnotations;

namespace muvinBackend.DTOs;

public class CorretorUpdateDto
{
    [MaxLength(150)]
    public string? NomeCompleto { get; set; }

    [EmailAddress]
    [MaxLength(150)]
    public string? Email { get; set; }

    [MinLength(6)]
    public string? Senha { get; set; }

    [MaxLength(20)]
    public string? RegistroCreci { get; set; }

    [MaxLength(14)]
    public string? Cpf { get; set; }

    [MaxLength(20)]
    public string? NumCelular { get; set; }

    public string? FotoPerfil { get; set; }
}
