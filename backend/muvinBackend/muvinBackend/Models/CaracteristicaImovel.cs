using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace muvinBackend.Models;

public class CaracteristicaImovel
{
    [Key]
    [Column("uuid")]
    public Guid Uuid { get; set; }

    [Column("dormitorios")]
    public int Dormitorios { get; set; }

    [Column("suites")]
    public int Suites { get; set; }

    [Column("banheiros")]
    public int Banheiros { get; set; }

    [Column("vagas")]
    public int Vagas { get; set; }

    [Column("area_util")]
    public double AreaUtil { get; set; }

    // RELACIONAMENTO REVERSO
    public Imovel Imovel { get; set; }
}