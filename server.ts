import express from "express";
import path from "path";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Body parsing middleware
app.use(express.json());

// In-memory archive for submitted inquiries so no inquiry is ever lost
interface StoredMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  deliveredViaSMTP: boolean;
}

const messageArchive: StoredMessage[] = [];

// API health endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    recipient: "hafsasaeed1074@gmail.com",
    archivedCount: messageArchive.length,
  });
});

// Endpoint to view received inquiries
app.get("/api/messages", (req, res) => {
  res.json({
    total: messageArchive.length,
    messages: messageArchive,
  });
});

// API endpoint for Contact form submissions
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: "Please fill in all fields (name, email, subject, message).",
      });
    }

    const targetRecipient =
      process.env.RECIPIENT_EMAIL || "hafsasaeed1074@gmail.com";
    const gmailUser = process.env.GMAIL_USER || "hafsasaeed1074@gmail.com";
    const gmailPass = (
      process.env.GMAIL_APP_PASSWORD ||
      process.env.EMAIL_PASS ||
      ""
    ).trim();

    // Prepare direct 1-click fallback URLs
    const formattedSubject = `[Portfolio Inquiry] ${subject} - from ${name}`;
    const formattedBody = [
      `Dear Hafsa,`,
      ``,
      `You have received a new inquiry from your portfolio website:`,
      ``,
      `═══════════════════════════════════════`,
      `👤 SENDER DETAILS`,
      `• Name: ${name}`,
      `• Email: ${email}`,
      `═══════════════════════════════════════`,
      `📋 INQUIRY SUBJECT:`,
      `${subject}`,
      ``,
      `💬 MESSAGE:`,
      `${message}`,
      ``,
      `═══════════════════════════════════════`,
      `HOW TO REPLY:`,
      `Hit 'Reply' in your email client or reply directly to ${email}.`,
      `═══════════════════════════════════════`,
      `Sent via Hafsa Saeed's Portfolio Website.`,
    ].join("\n");

    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(targetRecipient)}&su=${encodeURIComponent(formattedSubject)}&body=${encodeURIComponent(formattedBody)}`;
    const mailtoUrl = `mailto:${encodeURIComponent(targetRecipient)}?subject=${encodeURIComponent(formattedSubject)}&body=${encodeURIComponent(formattedBody)}`;
    const whatsappUrl = `https://wa.me/923275535987?text=${encodeURIComponent(`Hi Hafsa! I am ${name} (${email}). ${subject}: ${message}`)}`;

    // Store in message archive immediately
    const record: StoredMessage = {
      id: `msg_${Date.now()}`,
      name,
      email,
      subject,
      message,
      createdAt: new Date().toISOString(),
      deliveredViaSMTP: false,
    };
    messageArchive.unshift(record);

    console.log(
      `[Contact Form Received] From: ${name} <${email}> | Subject: ${subject}`,
    );

    // If a Gmail password or App Password is provided, try sending via Nodemailer
    if (gmailPass && gmailPass.length > 5) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: gmailUser,
            pass: gmailPass,
          },
        });

        const mailOptions = {
          from: `"${name} via Portfolio" <${gmailUser}>`,
          replyTo: email,
          to: targetRecipient,
          subject: formattedSubject,
          text: formattedBody,
          html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #10b981; border-radius: 16px; background-color: #ffffff; color: #1f2937;">
              <div style="background: linear-gradient(135deg, #059669, #10b981); padding: 20px; border-radius: 12px; text-align: center; color: #ffffff;">
                <h2 style="margin: 0; font-size: 22px;">New Portfolio Message!</h2>
                <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Hafsa Saeed - Portfolio Contact Form</p>
              </div>
              
              <div style="margin-top: 20px; padding: 15px; background-color: #f9fafb; border-radius: 10px; border: 1px solid #e5e7eb;">
                <p style="margin: 6px 0;"><strong>Sender Name:</strong> ${name}</p>
                <p style="margin: 6px 0;"><strong>Sender Email:</strong> <a href="mailto:${email}" style="color: #059669;">${email}</a></p>
                <p style="margin: 6px 0;"><strong>Subject:</strong> ${subject}</p>
                <p style="margin: 6px 0;"><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
              </div>

              <div style="margin-top: 20px;">
                <h3 style="color: #065f46; margin-bottom: 8px; font-size: 16px;">Message Content:</h3>
                <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; border-radius: 8px; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</div>
              </div>

              <div style="margin-top: 25px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 15px;">
                <p>Direct reply is configured to <strong>${email}</strong>. Simply click "Reply" in your email client.</p>
              </div>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
        record.deliveredViaSMTP = true;
        console.log(
          `[Email Sent Successfully] Delivered to ${targetRecipient}`,
        );

        return res.json({
          success: true,
          delivered: true,
          message:
            "Your message has been delivered directly to Hafsa Saeed at hafsasaeed1074@gmail.com!",
          gmailComposeUrl,
          mailtoUrl,
          whatsappUrl,
        });
      } catch (smtpErr: any) {
        console.warn(
          "[Gmail SMTP Notice]: Google SMTP rejected login credentials.",
          smtpErr?.message,
        );

        // Detect Google 535 Bad Credentials / App Password requirement
        const isBadCredentials =
          smtpErr?.code === "EAUTH" ||
          String(smtpErr?.message || "").includes("535") ||
          String(smtpErr?.message || "").includes("BadCredentials");

        return res.json({
          success: true,
          delivered: false,
          authNotice: true,
          isBadCredentials,
          message: isBadCredentials
            ? "Your message was successfully logged! Note: Google requires a 16-character App Password for direct SMTP. You can also click the button below to send directly via Gmail Web."
            : "Your message was saved! You can also click below to open in Gmail directly.",
          gmailComposeUrl,
          mailtoUrl,
          whatsappUrl,
        });
      }
    }

    // Try FormSubmit email forwarder (free service delivering to targetRecipient)
    try {
      const formSubmitRes = await fetch(
        `https://formsubmit.co/ajax/${targetRecipient}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Referer:
              (req.headers.referer as string) ||
              (req.headers.origin as string) ||
              "https://hafsasaeed-portfolio.app",
            Origin:
              (req.headers.origin as string) ||
              "https://hafsasaeed-portfolio.app",
            "User-Agent": "Mozilla/5.0 (Portfolio-Contact-Service)",
          },
          body: JSON.stringify({
            name,
            email,
            _replyto: email,
            _subject: formattedSubject,
            message,
            _captcha: "false",
          }),
        },
      );

      const formSubmitData: any = await formSubmitRes.json();
      console.log("[FormSubmit response]:", formSubmitData);

      if (
        formSubmitData &&
        (formSubmitData.success === "true" || formSubmitData.success === true)
      ) {
        record.deliveredViaSMTP = true;
        return res.json({
          success: true,
          delivered: true,
          provider: "FormSubmit",
          message:
            "Your message has been delivered directly to Hafsa Saeed at hafsasaeed1074@gmail.com!",
          gmailComposeUrl,
          mailtoUrl,
          whatsappUrl,
        });
      } else if (
        formSubmitData &&
        formSubmitData.message &&
        formSubmitData.message.includes("Activation")
      ) {
        return res.json({
          success: true,
          delivered: false,
          needsActivation: true,
          message:
            'Your message was logged on the server. FormSubmit sent a one-time activation email to hafsasaeed1074@gmail.com. Once activated, automated emails will deliver automatically. To send immediately right now, click "Open in Gmail Web" below!',
          gmailComposeUrl,
          mailtoUrl,
          whatsappUrl,
        });
      }
    } catch (fsErr) {
      console.warn("[FormSubmit fallback error]:", fsErr);
    }

    // Fallback if neither SMTP nor FormSubmit was activated yet
    console.log(`[Message Saved to Server Archive] From: ${name} (${email})`);

    return res.json({
      success: true,
      delivered: false,
      isSimulated: true,
      message:
        'Your message was recorded on the server! To deliver it directly to Hafsa\'s Gmail inbox right now, click "Send via Gmail Web" below (everything is prefilled).',
      gmailComposeUrl,
      mailtoUrl,
      whatsappUrl,
    });
  } catch (error: any) {
    console.error("Error handling contact submission:", error);
    return res.status(500).json({
      success: false,
      error:
        "An error occurred while handling your message. Please reach out directly on WhatsApp or Gmail.",
    });
  }
});

// Vite & Static Asset Handling
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Portfolio server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
