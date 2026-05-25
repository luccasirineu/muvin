using System.Net;
using System.Net.Mail;
using muvinBackend.Interfaces;

namespace muvinBackend.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task EnviarRecuperacaoSenhaAsync(string destinatario, string nomeCorretor, string novaSenha)
    {
        var section = _configuration.GetSection("Email");

        using var client = new SmtpClient(section["Smtp"]!, int.Parse(section["Porta"]!))
        {
            EnableSsl = true,
            Credentials = new NetworkCredential(section["Usuario"]!, section["Senha"]!)
        };

        using var message = new MailMessage
        {
            From    = new MailAddress(section["Usuario"]!, "Muvin Imóveis"),
            Subject = "Recuperação de acesso — Muvin Imóveis",
            Body    = BuildHtml(nomeCorretor, novaSenha),
            IsBodyHtml = true
        };
        message.To.Add(destinatario);

        await client.SendMailAsync(message);
    }

    private static string BuildHtml(string nome, string senha) => $"""
        <!DOCTYPE html>
        <html lang="pt-BR">
        <body style="font-family:Arial,sans-serif;background:#f6f7fb;padding:40px 0;margin:0">
          <table width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td align="center">
                <table width="520" cellspacing="0" cellpadding="0"
                       style="background:#fff;border-radius:10px;padding:32px;box-shadow:0 2px 8px rgba(0,0,0,.1)">

                  <tr>
                    <td align="center">
                      <h2 style="color:#2b8a3e;margin-bottom:8px">Nova Senha</h2>
                      <p style="font-size:16px;color:#555;margin:0">Olá, <b>{nome}</b>!</p>
                      <p style="font-size:15px;color:#666;margin-top:10px">
                        Recebemos uma solicitação de recuperação de acesso ao painel
                        <b>Muvin Imóveis</b>. Sua nova senha temporária é:
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:16px 0">
                      <div style="background:#f0f4ff;border-left:4px solid #3b82f6;
                                  padding:16px 20px;border-radius:5px;text-align:center">
                        <p style="margin:0;font-size:22px;font-weight:bold;letter-spacing:4px;color:#1e3a8a">{senha}</p>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:8px 0 24px">
                      <p style="font-size:14px;color:#555;margin:0">
                        Acesse o painel normalmente com essa senha.<br>
                        <b>Recomendamos que você troque sua senha assim que fizer login</b>,
                        acessando a seção de Perfil no painel administrativo.
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td align="center" style="color:#999;font-size:12px;border-top:1px solid #eee;padding-top:20px">
                      Se você não solicitou a recuperação de senha, ignore este e-mail.
                      Sua senha anterior não foi alterada.<br><br>
                      — Equipe Muvin Imóveis
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
        """;
}
