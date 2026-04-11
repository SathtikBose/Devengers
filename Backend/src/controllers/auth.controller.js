const User = require("../models/User");
const crypto = require("crypto");
const hashPassword = require("../utils/hashPassword");
const comparePassword = require("../utils/comparePassword");
const generateToken = require("../utils/generateToken");
const { sendMail } = require("../utils/mailer");

function getPublicBaseUrl(req) {
  return (
    process.env.PUBLIC_BACKEND_URL ||
    `${req.protocol}://${req.get("host")}`
  );
}

function hashResetCode(code) {
  return crypto.createHash("sha256").update(code).digest("hex");
}

function generateVerificationCode() {
  return `${crypto.randomInt(0, 1000000)}`.padStart(6, "0");
}

function buildResetCodeEmailHtml({ verificationCode, email }) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your NutriScan Verification Code</title>
  </head>
  <body style="margin:0;padding:0;background:#eef3ec;font-family:Arial,sans-serif;color:#1f2937;">
    <div style="max-width:600px;margin:40px auto;padding:0 16px;">
      <div style="background:#ffffff;border-radius:20px;padding:32px;box-shadow:0 10px 30px rgba(22,101,52,0.08);">
        <div style="width:64px;height:64px;border-radius:999px;background:#166534;color:#ffffff;display:flex;align-items:center;justify-content:center;font-weight:bold;margin:0 auto 20px;">
          NS
        </div>
        <h1 style="margin:0 0 12px;font-size:28px;text-align:center;color:#166534;">Password reset code</h1>
        <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">
          Hi ${email}, we received a request to reset your NutriScan password.
        </p>
        <p style="margin:0 0 28px;font-size:16px;line-height:1.6;">
          Use the verification code below in the app to continue. This code expires in 10 minutes.
        </p>
        <div style="margin:0 0 28px;padding:18px;border-radius:18px;background:#f0fdf4;border:1px solid #bbf7d0;text-align:center;">
          <div style="font-size:12px;letter-spacing:0.25em;color:#4b5563;margin-bottom:10px;">VERIFICATION CODE</div>
          <div style="font-size:32px;font-weight:bold;letter-spacing:0.35em;color:#166534;">${verificationCode}</div>
        </div>
        <p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:#4b5563;">
          If you did not request a password reset, you can safely ignore this email.
        </p>
      </div>
    </div>
  </body>
</html>`;
}

function buildResetPageHtml({
  title,
  message,
  token = "",
  tone = "default",
  showForm = false,
}) {
  const action = token
    ? `/auth/reset-password?token=${encodeURIComponent(token)}`
    : "/auth/reset-password";
  const isError = tone === "error";
  const accent = isError ? "#b91c1c" : "#166534";
  const surface = isError ? "#fef2f2" : "#f0fdf4";
  const border = isError ? "#fecaca" : "#bbf7d0";
  const cardCopy = showForm
    ? `<p class="helper-text">${message}</p>
       <form method="POST" action="${action}" class="reset-form" id="resetForm">
         <input type="hidden" name="token" value="${token}" />
         <div class="field">
           <label for="password">New password</label>
           <input id="password" type="password" name="password" required minlength="6" placeholder="Enter your new password" />
         </div>
         <div class="field">
           <label for="confirmPassword">Confirm password</label>
           <input id="confirmPassword" type="password" name="confirmPassword" required minlength="6" placeholder="Re-enter your new password" />
         </div>
         <p class="password-note">Use at least 6 characters.</p>
         <p id="formError" class="form-error" aria-live="polite"></p>
         <button type="submit" class="submit-btn">
           Update Password
         </button>
       </form>
       <script>
         const form = document.getElementById("resetForm");
         const passwordInput = document.getElementById("password");
         const confirmPasswordInput = document.getElementById("confirmPassword");
         const formError = document.getElementById("formError");

         form.addEventListener("submit", function (event) {
           formError.textContent = "";

           if (passwordInput.value.length < 6) {
             event.preventDefault();
             formError.textContent = "Password must be at least 6 characters long.";
             passwordInput.focus();
             return;
           }

           if (passwordInput.value !== confirmPasswordInput.value) {
             event.preventDefault();
             formError.textContent = "Passwords do not match.";
             confirmPasswordInput.focus();
           }
         });
       </script>`
    : `<p class="helper-text">${message}</p>`;

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <style>
      :root {
        color-scheme: light;
        --accent: ${accent};
        --surface: ${surface};
        --border: ${border};
        --text: #111827;
        --muted: #4b5563;
        --page: linear-gradient(135deg, #f7fee7 0%, #ecfdf5 50%, #f8fafc 100%);
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px 16px;
        background: var(--page);
        font-family: Arial, sans-serif;
        color: var(--text);
      }

      .shell {
        width: 100%;
        max-width: 460px;
      }

      .card {
        background: rgba(255, 255, 255, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.8);
        border-radius: 24px;
        padding: 32px 24px;
        box-shadow: 0 24px 60px rgba(15, 23, 42, 0.12);
        backdrop-filter: blur(12px);
      }

      .badge {
        width: 72px;
        height: 72px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
        background: var(--accent);
        color: #ffffff;
        font-size: 24px;
        font-weight: 700;
        letter-spacing: 0.08em;
      }

      h1 {
        margin: 0 0 12px;
        text-align: center;
        font-size: 30px;
        line-height: 1.2;
        color: var(--accent);
      }

      .helper-text {
        margin: 0 0 24px;
        font-size: 15px;
        line-height: 1.7;
        color: var(--muted);
        text-align: center;
      }

      .reset-form {
        display: grid;
        gap: 16px;
      }

      .field label {
        display: block;
        margin-bottom: 8px;
        font-size: 14px;
        font-weight: 700;
        color: #374151;
      }

      .field input {
        width: 100%;
        border: 1px solid #d1d5db;
        border-radius: 14px;
        padding: 14px 16px;
        font-size: 16px;
        outline: none;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
      }

      .field input:focus {
        border-color: var(--accent);
        box-shadow: 0 0 0 4px rgba(22, 163, 74, 0.15);
      }

      .password-note {
        margin: -4px 0 0;
        font-size: 13px;
        color: var(--muted);
      }

      .form-error {
        min-height: 20px;
        margin: 0;
        color: #b91c1c;
        font-size: 14px;
        font-weight: 600;
      }

      .submit-btn {
        width: 100%;
        border: none;
        border-radius: 999px;
        padding: 14px 18px;
        background: var(--accent);
        color: #ffffff;
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;
        transition: transform 0.2s ease, opacity 0.2s ease;
      }

      .submit-btn:hover {
        transform: translateY(-1px);
        opacity: 0.96;
      }

      .status-panel {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 18px;
        padding: 18px;
      }

      @media (max-width: 480px) {
        .card {
          padding: 28px 18px;
        }

        h1 {
          font-size: 26px;
        }
      }
    </style>
  </head>
  <body>
    <main class="shell">
      <section class="card">
        <div class="badge">
          NS
        </div>
        <h1>${title}</h1>
        <div${showForm ? "" : ' class="status-panel"'}>
          ${cardCopy}
        </div>
      </section>
    </main>
  </body>
</html>`;
}

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already in use" });
    }
    const hashed = await hashPassword(password);
    const user = await User.create({ name, email, password: hashed });
    const token = generateToken(user._id);

    // ✅ Return BOTH user and token
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || null,
        allergies: user.allergies || [],
        diet: user.diet || null,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = generateToken(user._id);

    // ✅ Return BOTH user and token
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || null,
        allergies: user.allergies || [],
        diet: user.diet || null,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "New password must be at least 8 characters long",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await comparePassword(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const isSamePassword = await comparePassword(newPassword, user.password);

    if (isSamePassword) {
      return res.status(400).json({
        message: "New password must be different from your current password",
      });
    }

    user.password = await hashPassword(newPassword);
    user.passwordResetToken = undefined;
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return res.json({
      message: "Password updated successfully",
    });
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        message: "If that email exists, a verification code has been sent.",
      });
    }

    const verificationCode = generateVerificationCode();
    user.passwordResetToken = undefined;
    user.passwordResetCode = hashResetCode(verificationCode);
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendMail({
      to: user.email,
      subject: "Your NutriScan password reset code",
      text:
        `Your NutriScan password reset verification code is ${verificationCode}. ` +
        "This code expires in 10 minutes.",
      html: buildResetCodeEmailHtml({
        verificationCode,
        email: user.email,
      }),
    });

    res.json({
      message: "If that email exists, a verification code has been sent.",
    });
  } catch (err) {
    next(err);
  }
};

exports.verifyForgotPasswordCode = async (req, res, next) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        message: "Email and verification code are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user || !user.passwordResetCode || !user.passwordResetExpires) {
      return res.status(400).json({
        message: "Invalid or expired verification code",
      });
    }

    if (user.passwordResetExpires <= new Date()) {
      user.passwordResetCode = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      return res.status(400).json({
        message: "Verification code has expired. Please request a new one.",
      });
    }

    if (user.passwordResetCode !== hashResetCode(code)) {
      return res.status(400).json({
        message: "Incorrect verification code",
      });
    }

    return res.json({
      message: "Verification code accepted",
      verified: true,
    });
  } catch (err) {
    next(err);
  }
};

exports.resetPasswordWithCode = async (req, res, next) => {
  try {
    const { email, code, password, confirmPassword } = req.body;

    if (!email || !code || !password || !confirmPassword) {
      return res.status(400).json({
        message: "Email, verification code, password, and confirm password are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    const user = await User.findOne({ email });

    if (!user || !user.passwordResetCode || !user.passwordResetExpires) {
      return res.status(400).json({
        message: "Invalid or expired verification code",
      });
    }

    if (user.passwordResetExpires <= new Date()) {
      user.passwordResetCode = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      return res.status(400).json({
        message: "Verification code has expired. Please request a new one.",
      });
    }

    if (user.passwordResetCode !== hashResetCode(code)) {
      return res.status(400).json({
        message: "Incorrect verification code",
      });
    }

    user.password = await hashPassword(password);
    user.passwordResetToken = undefined;
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return res.json({
      message: "Password updated successfully",
    });
  } catch (err) {
    next(err);
  }
};

exports.renderResetPasswordPage = async (req, res, next) => {
  try {
    return res.send(
      buildResetPageHtml({
        title: "Reset in the app",
        message: "Password reset now uses a 6-digit verification code sent by email. Return to the app, enter your email, verify the code, and set a new password there.",
      }),
    );
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    return res.send(
      buildResetPageHtml({
        title: "Reset in the app",
        message: "Password reset now happens inside the app using a 6-digit email verification code. Open the app and use the Forgot Password screen to continue.",
      }),
    );
  } catch (err) {
    next(err);
  }
};
