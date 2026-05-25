using System.ComponentModel.DataAnnotations;

namespace muvinBackend.DTOs;

public class CorretorLoginDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Senha { get; set; } = string.Empty;
}
