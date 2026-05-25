using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using muvinBackend.Data;
using muvinBackend.DTOs;
using muvinBackend.Interfaces;
using muvinBackend.Mappers;

namespace muvinBackend.Services;

public class CorretorService : ICorretorService
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly IEmailService _emailService;

    public CorretorService(AppDbContext context, IConfiguration configuration, IEmailService emailService)
    {
        _context = context;
        _configuration = configuration;
        _emailService = emailService;
    }

    public async Task<CorretorLoginResponseDto?> LoginAsync(CorretorLoginDto dto)
    {
        var corretor = await _context.Corretores
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Email == dto.Email);

        if (corretor is null || !BCrypt.Net.BCrypt.Verify(dto.Senha, corretor.Senha))
            return null;

        var jwtSection = _configuration.GetSection("Jwt");
        var key = Encoding.UTF8.GetBytes(jwtSection["SecretKey"]!);
        var expiracao = DateTime.UtcNow.AddHours(int.Parse(jwtSection["ExpiracaoHoras"]!));

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(
            [
                new Claim(ClaimTypes.NameIdentifier, corretor.Uuid.ToString()),
                new Claim(ClaimTypes.Email, corretor.Email),
                new Claim(ClaimTypes.Name, corretor.NomeCompleto)
            ]),
            Expires = expiracao,
            Issuer = jwtSection["Issuer"],
            Audience = jwtSection["Audience"],
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);

        return new CorretorLoginResponseDto
        {
            Token = tokenHandler.WriteToken(token),
            ExpiracaoUtc = expiracao,
            Corretor = CorretorMapper.ToResponse(corretor)
        };
    }

    public async Task<CorretorResponseDto?> GetMeAsync()
    {
        var corretor = await _context.Corretores
            .AsNoTracking()
            .FirstOrDefaultAsync();

        return corretor is null ? null : CorretorMapper.ToResponse(corretor);
    }

    public async Task<CorretorResponseDto?> UpdateAsync(Guid uuid, CorretorUpdateDto dto)
    {
        var corretor = await _context.Corretores.FirstOrDefaultAsync(c => c.Uuid == uuid);

        if (corretor is null) return null;

        if (dto.NomeCompleto is not null) corretor.NomeCompleto = dto.NomeCompleto;
        if (dto.Email is not null) corretor.Email = dto.Email;
        if (dto.RegistroCreci is not null) corretor.RegistroCreci = dto.RegistroCreci;
        if (dto.Cpf is not null) corretor.Cpf = dto.Cpf;
        if (dto.Senha is not null) corretor.Senha = BCrypt.Net.BCrypt.HashPassword(dto.Senha);
        if (dto.NumCelular is not null) corretor.NumCelular = dto.NumCelular;
        if (dto.FotoPerfil is not null) corretor.FotoPerfil = dto.FotoPerfil.Length == 0 ? null : dto.FotoPerfil;

        await _context.SaveChangesAsync();
        return CorretorMapper.ToResponse(corretor);
    }

    public async Task EsqueciSenhaAsync(EsqueciSenhaDto dto)
    {
        var corretor = await _context.Corretores
            .FirstOrDefaultAsync(c => c.Email == dto.Email);

        if (corretor is null)
            return;

        var cpfDigitos = Regex.Replace(corretor.Cpf, @"\D", "");
        if (!cpfDigitos.EndsWith(dto.UltimosDigitosCpf))
            return;

        var novaSenha = GerarSenhaAleatoria();

        // Envia o e-mail antes de salvar: se o envio falhar, a senha não muda
        await _emailService.EnviarRecuperacaoSenhaAsync(corretor.Email, corretor.NomeCompleto, novaSenha);

        corretor.Senha = BCrypt.Net.BCrypt.HashPassword(novaSenha);
        await _context.SaveChangesAsync();
    }

    private static string GerarSenhaAleatoria()
    {
        const string minusculas = "abcdefghjkmnpqrstuvwxyz";
        const string maiusculas = "ABCDEFGHJKMNPQRSTUVWXYZ";
        const string digitos    = "23456789";
        const string simbolos   = "@#$!";
        const string todos      = minusculas + maiusculas + digitos + simbolos;

        var bytes = RandomNumberGenerator.GetBytes(12);
        var chars = new char[12];

        // Garante ao menos um de cada categoria
        chars[0] = minusculas[bytes[0] % minusculas.Length];
        chars[1] = maiusculas[bytes[1] % maiusculas.Length];
        chars[2] = digitos[bytes[2]    % digitos.Length];
        chars[3] = simbolos[bytes[3]   % simbolos.Length];
        for (int i = 4; i < 12; i++)
            chars[i] = todos[bytes[i] % todos.Length];

        RandomNumberGenerator.Shuffle(chars.AsSpan());
        return new string(chars);
    }
}
