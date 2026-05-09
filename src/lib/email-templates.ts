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

export const resetPasswordEmailTemplate = (url: string, name: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Reset your password</title>
</head>
<body style="margin:0;padding:0;background-color:#0f172a;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#1e293b;border-radius:16px;overflow:hidden;box-shadow:0 25px 50px rgba(0,0,0,0.5);">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#ef4444,#8b5cf6);padding:40px;text-align:center;">
              <h1 style="margin:0;font-size:32px;font-weight:900;color:#ffffff;letter-spacing:-1px;">RYUK</h1>
              <p style="margin:8px 0 0;color:#e0e7ff;font-size:14px;letter-spacing:2px;text-transform:uppercase;">Password Reset</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:48px 40px;">
              <h2 style="margin:0 0 16px;font-size:24px;color:#f1f5f9;font-weight:700;">
                Hey ${name.split(" ")[0]} 👋
              </h2>
              <p style="margin:0 0 24px;font-size:16px;color:#94a3b8;line-height:1.7;">
                We received a request to reset your RYUK password. Click the button below to choose a new password. If you didn't request this, you can safely ignore this email.
              </p>

              <!-- Button -->
              <table cellpadding="0" cellspacing="0" style="margin:32px 0;">
                <tr>
                  <td style="background:linear-gradient(135deg,#ef4444,#8b5cf6);border-radius:8px;">
                    <a href="${url}" 
                       style="display:inline-block;padding:16px 40px;color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;letter-spacing:0.5px;">
                      Reset My Password →
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
              <div style="background:#0f172a;border-left:4px solid #ef4444;border-radius:4px;padding:16px 20px;">
                <p style="margin:0;font-size:13px;color:#64748b;line-height:1.6;">
                  ⏱ This link expires in <strong style="color:#94a3b8;">1 hour</strong>. If you didn't request a password reset, please secure your account immediately.
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
                You're receiving this because you requested a password reset on RYUK
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


export const welcomeEmailTemplate = (name: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to RYUK</title>
</head>
<body style="margin:0;padding:0;background-color:#0f172a;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#1e293b;border-radius:16px;overflow:hidden;box-shadow:0 25px 50px rgba(0,0,0,0.5);">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#3b82f6,#8b5cf6);padding:48px 40px;text-align:center;">
              <h1 style="margin:0;font-size:40px;font-weight:900;color:#ffffff;letter-spacing:-1px;">RYUK</h1>
              <p style="margin:12px 0 0;color:#e0e7ff;font-size:16px;">You're officially in 🎉</p>
            </td>
          </tr>

          <!-- Celebration Banner -->
          <tr>
            <td style="background:#0f172a;padding:24px 40px;text-align:center;">
              <p style="margin:0;font-size:32px;">🎊 🥳 🎉</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:48px 40px;">
              <h2 style="margin:0 0 16px;font-size:26px;color:#f1f5f9;font-weight:700;">
                Welcome aboard, ${name.split(" ")[0]}!
              </h2>
              <p style="margin:0 0 24px;font-size:16px;color:#94a3b8;line-height:1.7;">
                Your email has been verified and your RYUK account is now fully active. We're thrilled to have you as part of our community!
              </p>

              <!-- What you can do -->
              <div style="background:#0f172a;border-radius:12px;padding:24px;margin-bottom:32px;">
                <p style="margin:0 0 16px;font-size:14px;font-weight:700;color:#f1f5f9;text-transform:uppercase;letter-spacing:1px;">Here's what you can do now:</p>
                
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:10px 0;border-bottom:1px solid #1e293b;">
                      <p style="margin:0;font-size:15px;color:#94a3b8;">
                        ✍️ <strong style="color:#f1f5f9;">Write posts</strong> — Share your thoughts with the world
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;border-bottom:1px solid #1e293b;">
                      <p style="margin:0;font-size:15px;color:#94a3b8;">
                        🗂️ <strong style="color:#f1f5f9;">Manage your content</strong> — Edit and organize your posts
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;">
                      <p style="margin:0;font-size:15px;color:#94a3b8;">
                        👤 <strong style="color:#f1f5f9;">Customize your profile</strong> — Make it your own
                      </p>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="background:linear-gradient(135deg,#3b82f6,#8b5cf6);border-radius:8px;">
                    <a href="${process.env.BETTER_AUTH_URL}/dashboard"
                       style="display:inline-block;padding:16px 48px;color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;letter-spacing:0.5px;">
                      Go to Dashboard →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #334155;text-align:center;">
              <p style="margin:0;font-size:12px;color:#475569;">
                © 2026 RYUK · All rights reserved
              </p>
              <p style="margin:8px 0 0;font-size:12px;color:#334155;">
                You're receiving this because you just verified your RYUK account
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