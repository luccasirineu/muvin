using System.ComponentModel.DataAnnotations;

namespace muvinBackend.DTOs;

public class ImovelUpdateDestaqueDto
{
    [Required]
    public bool Destaque { get; set; }
}
