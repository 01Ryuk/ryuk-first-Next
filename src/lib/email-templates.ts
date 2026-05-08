export const verificationEmailTemplate = (url: string, name: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verify your email</title>
</head>
<body style="margin:0;padding:0;background-color:#0f172a;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#1e293b;border-radius:16px;overflow:hidden;box-shadow:0 25px 50px rgba(0,0,0,0.5);">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#3b82f6,#8b5cf6);padding:40px;text-align:center;">
              <h1 style="margin:0;font-size:32px;font-weight:900;color:#ffffff;letter-spacing:-1px;">RYUK</h1>
              <p style="margin:8px 0 0;color:#e0e7ff;font-size:14px;letter-spacing:2px;text-transform:uppercase;">Email Verification</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:48px 40px;">
              <h2 style="margin:0 0 16px;font-size:24px;color:#f1f5f9;font-weight:700;">
                Hey ${name.split(" ")[0]} 👋
              </h2>
              <p style="margin:0 0 24px;font-size:16px;color:#94a3b8;line-height:1.7;">
                Welcome to RYUK! We're excited to have you on board. Just one more step — verify your email address to activate your account and start creating posts.
              </p>

              <!-- Button -->
              <table cellpadding="0" cellspacing="0" style="margin:32px 0;">
                <tr>
                  <td style="background:linear-gradient(135deg,#3b82f6,#8b5cf6);border-radius:8px;">
                    <a href="${url}" 
                       style="display:inline-block;padding:16px 40px;color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;letter-spacing:0.5px;">
                      Verify My Email →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;font-size:14px;color:#64748b;line-height:1.6;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="margin:0 0 32px;font-size:13px;color:#3b82f6;word-break:break-all;">
                ${url}
              </p>

              <!-- Warning -->
              <div style="background:#0f172a;border-left:4px solid #3b82f6;border-radius:4px;padding:16px 20px;">
                <p style="margin:0;font-size:13px;color:#64748b;line-height:1.6;">
                  ⏱ This link expires in <strong style="color:#94a3b8;">24 hours</strong>. If you didn't create a RYUK Posts account, you can safely ignore this email.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #334155;text-align:center;">
              <p style="margin:0;font-size:12px;color:#475569;">
                © 2026 RYUK · All rights reserved
              </p>
              <p style="margin:8px 0 0;font-size:12px;color:#334155;">
                You're receiving this because you signed up at RYUK
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;