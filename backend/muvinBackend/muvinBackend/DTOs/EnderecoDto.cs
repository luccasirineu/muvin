using System.ComponentModel.DataAnnotations;

namespace muvinBackend.DTOs;

public class EnderecoDto
{
    [Required]
    public string Logradouro { get; set; } = string.Empty;

    [Required]
    public string Bairro { get; set; } = string.Empty;

    [Required]
    public string Cidade { get; set; } = string.Empty;

    [Required]
    [MaxLength(2)]
    public string Uf { get; set; } = string.Empty;

    [Required]
    public string Cep { get; set; } = string.Empty;
}
