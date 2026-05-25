using Microsoft.EntityFrameworkCore;
using muvinBackend.Models;

namespace muvinBackend.Data;

public static class CorretorSeeder
{
    public static async Task SeedAsync(AppDbContext context, IConfiguration configuration)
    {
        if (await context.Corretores.AnyAsync()) return;

        var section = configuration.GetSection("CorretorSeed");

        var corretor = new Corretor
        {
            Uuid = Guid.NewGuid(),
            NomeCompleto = section["NomeCompleto"]!,
            Email = section["Email"]!,
            Senha = BCrypt.Net.BCrypt.HashPassword(section["Senha"]),
            RegistroCreci = section["RegistroCreci"]!,
            Cpf = section["Cpf"]!
        };

        context.Corretores.Add(corretor);
        await context.SaveChangesAsync();
    }
}
