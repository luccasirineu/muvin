using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace muvinBackend.Models;

public class Endereco
{
    [Key]
    [Column("uuid")]
    public Guid Uuid { get; set; }

    [Required]
    [Column("logradouro")]
    [MaxLength(200)]
    public string Logradouro { get; set; }

    [Required]
    [Column("bairro")]
    [MaxLength(100)]
    public string Bairro { get; set; }

    [Required]
    [Column("cidade")]
    [MaxLength(100)]
    public string Cidade { get; set; }

    [Required]
    [Column("uf")]
    [MaxLength(2)]
    public string Uf { get; set; }

    [Required]
    [Column("cep")]
    [MaxLength(9)]
    public string Cep { get; set; }

    // RELACIONAMENTO REVERSO
    public Imovel Imovel { get; set; }
}