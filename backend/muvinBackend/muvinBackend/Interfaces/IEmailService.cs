namespace muvinBackend.Interfaces;

public interface IEmailService
{
    Task EnviarRecuperacaoSenhaAsync(string destinatario, string nomeCorretor, string novaSenha);
}
