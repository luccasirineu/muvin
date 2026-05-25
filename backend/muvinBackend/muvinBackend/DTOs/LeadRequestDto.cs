using System.ComponentModel.DataAnnotations;
using muvinBackend.Enums;

namespace muvinBackend.DTOs;

public class LeadRequestDto
{
    [Required]
    [MaxLength(150)]
    public string NomeCompleto { get; set; }

    [Required]
    [MaxLength(20)]
    public string NumCelular { get; set; }

    [Required]
    [MaxLength(150)]
    public string Email { get; set; }

    public string? Mensagem { get; set; }

    [Required]
    public TipoDesejoEnum Desejo { get; set; }
}
