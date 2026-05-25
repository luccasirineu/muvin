using muvinBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace muvinBackend.Data;


 public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Imovel> Imoveis { get; set; }
    public DbSet<CaracteristicaImovel> CaracteristicaImoveis { get; set; }
    public DbSet<Endereco> Enderecos { get; set; }
    public DbSet<FotoImovel> FotoImoveis { get; set; }
    public DbSet<Lead> Leads { get; set; }
    public DbSet<Corretor> Corretores { get; set; }

    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Imovel>()
            .HasOne(i => i.Caracteristica)
            .WithOne(c => c.Imovel)
            .HasForeignKey<Imovel>(i => i.CaracteristicaId);

        modelBuilder.Entity<Imovel>()
            .HasOne(i => i.Endereco)
            .WithOne(e => e.Imovel)
            .HasForeignKey<Imovel>(i => i.EnderecoId);

        modelBuilder.Entity<Imovel>()
            .HasMany(i => i.FotosImovel)
            .WithOne(f => f.Imovel)
            .HasForeignKey(f => f.ImovelId);
    }
}
