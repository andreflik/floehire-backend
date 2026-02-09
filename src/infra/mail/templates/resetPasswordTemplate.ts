export function resetPasswordTemplate(link: string) {
  return `
    <div style="font-family: Arial, sans-serif;">
      <h2>Redefinição de senha</h2>
      <p>Você solicitou a redefinição de sua senha.</p>
      <p>Clique no botão abaixo para criar uma nova senha:</p>
      <p>
        <a href="${link}" style="
          display: inline-block;
          padding: 10px 20px;
          background: #4f46e5;
          color: #fff;
          text-decoration: none;
          border-radius: 5px;
        ">
          Redefinir senha
        </a>
      </p>
      <p>Se você não solicitou isso, ignore este e-mail.</p>
    </div>
  `;
}
