using muvinBackend.DTOs;
using muvinBackend.Models;

namespace muvinBackend.Mappers;

public static class ImovelMapper
{
    public static ImovelResponseDto ToResponse(Imovel imovel) => new()
    {
        Uuid = imovel.Uuid,
        CodInterno = imovel.CodInterno,
        StatusImovel = imovel.StatusImovel,
        Titulo = imovel.Titulo,
        Descricao = imovel.Descricao,
        TipoImovel = imovel.TipoImovel,
        FinalidadeImovel = imovel.FinalidadeImovel,
        PrecoImovel = imovel.PrecoImovel,
        CondominioMensal = imovel.CondominioMensal,
        IptuMensal = imovel.IptuMensal,
        Destaque = imovel.Destaque,
        PublicacaoTimestamp = imovel.PublicacaoTimestamp,
        Caracteristica = new CaracteristicaImovelDto
        {
            Dormitorios = imovel.Caracteristica.Dormitorios,
            Suites = imovel.Caracteristica.Suites,
            Banheiros = imovel.Caracteristica.Banheiros,
            Vagas = imovel.Caracteristica.Vagas,
            AreaUtil = imovel.Caracteristica.AreaUtil
        },
        Endereco = new EnderecoDto
        {
            Logradouro = imovel.Endereco.Logradouro,
            Bairro = imovel.Endereco.Bairro,
            Cidade = imovel.Endereco.Cidade,
            Uf = imovel.Endereco.Uf,
            Cep = imovel.Endereco.Cep
        },
        FotosImovel = imovel.FotosImovel
            .Select(f => new FotoImovelDto { Uuid = f.Uuid, UrlFoto = f.UrlFoto })
            .ToList()
    };

    public static Imovel ToEntity(ImovelRequestDto dto)
    {
        var caracteristica = new CaracteristicaImovel
        {
            Uuid = Guid.NewGuid(),
            Dormitorios = dto.Caracteristica.Dormitorios,
            Suites = dto.Caracteristica.Suites,
            Banheiros = dto.Caracteristica.Banheiros,
            Vagas = dto.Caracteristica.Vagas,
            AreaUtil = dto.Caracteristica.AreaUtil
        };

        var endereco = new Endereco
        {
            Uuid = Guid.NewGuid(),
            Logradouro = dto.Endereco.Logradouro,
            Bairro = dto.Endereco.Bairro,
            Cidade = dto.Endereco.Cidade,
            Uf = dto.Endereco.Uf,
            Cep = dto.Endereco.Cep
        };

        var imovel = new Imovel
        {
            Uuid = Guid.NewGuid(),
            CodInterno = dto.CodInterno,
            StatusImovel = dto.StatusImovel,
            Titulo = dto.Titulo,
            Descricao = dto.Descricao,
            TipoImovel = dto.TipoImovel,
            FinalidadeImovel = dto.FinalidadeImovel,
            PrecoImovel = dto.PrecoImovel,
            CondominioMensal = dto.CondominioMensal,
            IptuMensal = dto.IptuMensal,
            Destaque = dto.Destaque,
            PublicacaoTimestamp = DateTime.UtcNow,
            Caracteristica = caracteristica,
            CaracteristicaId = caracteristica.Uuid,
            Endereco = endereco,
            EnderecoId = endereco.Uuid,
            FotosImovel = dto.UrlFotos.Select(url => new FotoImovel
            {
                Uuid = Guid.NewGuid(),
                UrlFoto = url,
                EnvioTimestamp = DateTime.UtcNow
            }).ToList()
        };

        return imovel;
    }

    public static void UpdateEntity(Imovel imovel, ImovelUpdateDto dto)
    {
        imovel.CodInterno = dto.CodInterno;
        imovel.StatusImovel = dto.StatusImovel;
        imovel.Titulo = dto.Titulo;
        imovel.Descricao = dto.Descricao;
        imovel.TipoImovel = dto.TipoImovel;
        imovel.FinalidadeImovel = dto.FinalidadeImovel;
        imovel.PrecoImovel = dto.PrecoImovel;
        imovel.CondominioMensal = dto.CondominioMensal;
        imovel.IptuMensal = dto.IptuMensal;
        imovel.Destaque = dto.Destaque;

        imovel.Caracteristica.Dormitorios = dto.Caracteristica.Dormitorios;
        imovel.Caracteristica.Suites = dto.Caracteristica.Suites;
        imovel.Caracteristica.Banheiros = dto.Caracteristica.Banheiros;
        imovel.Caracteristica.Vagas = dto.Caracteristica.Vagas;
        imovel.Caracteristica.AreaUtil = dto.Caracteristica.AreaUtil;

        imovel.Endereco.Logradouro = dto.Endereco.Logradouro;
        imovel.Endereco.Bairro = dto.Endereco.Bairro;
        imovel.Endereco.Cidade = dto.Endereco.Cidade;
        imovel.Endereco.Uf = dto.Endereco.Uf;
        imovel.Endereco.Cep = dto.Endereco.Cep;
    }
}
