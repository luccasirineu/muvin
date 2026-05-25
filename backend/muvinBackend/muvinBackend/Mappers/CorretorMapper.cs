using muvinBackend.DTOs;
using muvinBackend.Models;

namespace muvinBackend.Mappers;

public static class CorretorMapper
{
    public static CorretorResponseDto ToResponse(Corretor corretor) => new()
    {
        Uuid = corretor.Uuid,
        NomeCompleto = corretor.NomeCompleto,
        Email = corretor.Email,
        RegistroCreci = corretor.RegistroCreci,
        Cpf = corretor.Cpf,
        NumCelular = corretor.NumCelular,
        FotoPerfil = corretor.FotoPerfil
    };
}
