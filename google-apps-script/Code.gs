const CONFIG = Object.freeze({
  spreadsheetId: "13cqkjTZAUADUMl0_IiK01pd3ZFcO-BTXFJNFosNf_J8",
  sheetName: "beta_signups",
  senderName: "Ethyria",
  replyTo: "ethyria.app@gmail.com",
  downloadUrl: "https://ostyles.github.io/ethyria/assets/ethyria_beta.apk",
});

function doGet() {
  return jsonOutput_({ status: "ok" });
}

function doPost(e) {
  try {
    const payload = getPayload_(e);
    if (payload.website) {
      return jsonOutput_({ status: "ignored" });
    }

    const email = normalizeEmail_(payload.email);
    if (!isValidEmail_(email)) {
      return jsonOutput_({ status: "invalid_email" });
    }

    const locale = sanitizeLocale_(payload.locale);
    const sheet = getSheet_();
    const existingRow = findRowByEmail_(sheet, email);
    if (existingRow > 1) {
      return jsonOutput_({ status: "already_registered" });
    }

    const now = new Date();
    sheet.appendRow([
      now,
      email,
      locale,
      String(payload.sourcePage || ""),
      String(payload.pageUrl || ""),
      String(payload.userAgent || ""),
      "pending",
      "",
      "",
    ]);

    const row = sheet.getLastRow();

    try {
      sendWelcomeEmail_(email, locale);
      sheet.getRange(row, 7).setValue("sent");
      sheet.getRange(row, 8).setValue(new Date());
      return jsonOutput_({ status: "success" });
    } catch (mailError) {
      sheet.getRange(row, 7).setValue("saved_no_email");
      sheet.getRange(row, 9).setValue(String(mailError));
      return jsonOutput_({ status: "saved_no_email" });
    }
  } catch (error) {
    return jsonOutput_({ status: "error", message: String(error) });
  }
}

function getPayload_(e) {
  if (!e) {
    return {};
  }

  const contentType = e.postData && e.postData.type ? e.postData.type : "";
  const rawBody = e.postData && e.postData.contents ? e.postData.contents : "";
  if (contentType.indexOf("application/json") !== -1 && rawBody) {
    return JSON.parse(rawBody);
  }

  return e.parameter || {};
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.openById(CONFIG.spreadsheetId);
  let sheet = spreadsheet.getSheetByName(CONFIG.sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(CONFIG.sheetName);
  }

  const headers = [
    "Timestamp",
    "Email",
    "Locale",
    "Source Page",
    "Page URL",
    "User Agent",
    "Status",
    "Mail Sent At",
    "Error",
  ];

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function findRowByEmail_(sheet, email) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return -1;
  }

  const values = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
  for (let index = 0; index < values.length; index += 1) {
    if (normalizeEmail_(values[index][0]) === email) {
      return index + 2;
    }
  }

  return -1;
}

function sendWelcomeEmail_(email, locale) {
  const template = getEmailTemplate_(locale);
  MailApp.sendEmail({
    to: email,
    subject: template.subject,
    body: template.text,
    htmlBody: template.html,
    name: CONFIG.senderName,
    replyTo: CONFIG.replyTo,
  });
}

function getEmailTemplate_(locale) {
  const downloadUrl = CONFIG.downloadUrl;
  const logoUrl = "https://ostyles.github.io/ethyria/assets/Ethyria_symbol.png";
  const siteUrl = "https://ostyles.github.io/ethyria/";

  const i18n = {
    de: {
      subject: "Willkommen bei Ethyria — Dein Beta-Zugang",
      greeting: "Willkommen bei Ethyria!",
      thankYou:
        "Danke, dass du dich fuer die Beta angemeldet hast. Du gehoerst zu den Ersten, die Ethyria erleben duerfen.",
      downloadLabel: "Beta-APK herunterladen",
      howTo:
        "So gehts: Lade die APK herunter, erlaube die Installation aus unbekannten Quellen und starte Ethyria.",
      closing: "Wir freuen uns auf dein Feedback!",
      signoff: "Liebe Gruesse",
    },
    fr: {
      subject: "Bienvenue sur Ethyria — Votre acces beta",
      greeting: "Bienvenue sur Ethyria !",
      thankYou:
        "Merci de vous etre inscrit a la beta. Vous faites partie des premiers a decouvrir Ethyria.",
      downloadLabel: "Telecharger la beta APK",
      howTo:
        "Comment faire : telechargez l'APK, autorisez l'installation depuis des sources inconnues et lancez Ethyria.",
      closing: "Nous avons hate de recevoir vos retours !",
      signoff: "A bientot",
    },
    es: {
      subject: "Bienvenido a Ethyria — Tu acceso beta",
      greeting: "Bienvenido a Ethyria!",
      thankYou:
        "Gracias por registrarte en la beta. Eres de los primeros en probar Ethyria.",
      downloadLabel: "Descargar beta APK",
      howTo:
        "Como funciona: descarga el APK, permite la instalacion desde fuentes desconocidas e inicia Ethyria.",
      closing: "Esperamos tu feedback!",
      signoff: "Un saludo",
    },
    ru: {
      subject: "Dobro pozhalovat v Ethyria — Vash beta-dostup",
      greeting: "Dobro pozhalovat v Ethyria!",
      thankYou:
        "Spasibo za registratsiyu v beta-versii. Vy sredi pervykh, kto ispytaet Ethyria.",
      downloadLabel: "Skachat beta APK",
      howTo:
        "Kak nachat: skachayte APK, razreshite ustanovku iz neizvestnykh istochnikov i zapustite Ethyria.",
      closing: "Zhdyom vashikh otzyvov!",
      signoff: "S uvazheniem",
    },
    en: {
      subject: "Welcome to Ethyria — Your Beta Access",
      greeting: "Welcome to Ethyria!",
      thankYou:
        "Thanks for signing up for the beta. You are among the first to experience Ethyria.",
      downloadLabel: "Download Beta APK",
      howTo:
        "How to start: download the APK, allow installation from unknown sources, and launch Ethyria.",
      closing: "We look forward to your feedback!",
      signoff: "Best regards",
    },
  };

  const t = i18n[locale] || i18n.en;

  const text = [
    t.greeting,
    "",
    t.thankYou,
    "",
    t.downloadLabel + ": " + downloadUrl,
    "",
    t.howTo,
    "",
    t.closing,
    "",
    t.signoff,
    "Ethyria",
  ].join("\n");

  const html = [
    '<!DOCTYPE html><html><head><meta charset="utf-8"></head>',
    '<body style="margin:0;padding:0;background-color:#0d0d1a;font-family:Arial,Helvetica,sans-serif;">',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0d0d1a;">',
    '<tr><td align="center" style="padding:30px 10px;">',

    // Card
    '<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background-color:#1a1a2e;border-radius:16px;overflow:hidden;">',

    // Logo header
    '<tr><td align="center" style="padding:32px 20px 16px;">',
    '<img src="' +
      logoUrl +
      '" alt="Ethyria" width="80" height="80" style="display:block;border:0;border-radius:16px;" />',
    "</td></tr>",

    // Greeting
    '<tr><td align="center" style="padding:0 30px 8px;">',
    '<h1 style="margin:0;font-size:22px;color:#ffffff;">' +
      t.greeting +
      "</h1>",
    "</td></tr>",

    // Thank you text
    '<tr><td style="padding:8px 30px 24px;font-size:15px;line-height:1.6;color:#c0c0d0;">',
    t.thankYou,
    "</td></tr>",

    // Download button
    '<tr><td align="center" style="padding:0 30px 24px;">',
    '<a href="' +
      downloadUrl +
      '" style="display:inline-block;padding:14px 36px;background:linear-gradient(135deg,#6c3ce0,#a855f7);color:#ffffff;font-size:16px;font-weight:bold;text-decoration:none;border-radius:30px;">',
    t.downloadLabel + " &darr;",
    "</a>",
    "</td></tr>",

    // How-to hint
    '<tr><td style="padding:0 30px 24px;font-size:13px;line-height:1.5;color:#8888a0;">',
    t.howTo,
    "</td></tr>",

    // Divider
    '<tr><td style="padding:0 30px;"><hr style="border:none;border-top:1px solid #2a2a3e;margin:0;"></td></tr>',

    // Closing
    '<tr><td style="padding:20px 30px 12px;font-size:14px;color:#c0c0d0;">',
    t.closing,
    "</td></tr>",
    '<tr><td style="padding:0 30px 28px;font-size:14px;color:#c0c0d0;">',
    t.signoff + '<br><strong style="color:#a855f7;">Ethyria</strong>',
    "</td></tr>",

    // Footer
    '<tr><td align="center" style="padding:16px 30px 20px;font-size:11px;color:#555570;">',
    '<a href="' +
      siteUrl +
      '" style="color:#7c5ce0;text-decoration:none;">ostyles.github.io/ethyria</a>',
    "</td></tr>",

    "</table>",
    "</td></tr></table>",
    "</body></html>",
  ].join("");

  return { subject: t.subject, text: text, html: html };
}

function normalizeEmail_(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function sanitizeLocale_(value) {
  const locale = String(value || "en")
    .trim()
    .toLowerCase()
    .slice(0, 2);
  return ["de", "en", "fr", "es", "ru"].indexOf(locale) >= 0 ? locale : "en";
}

function isValidEmail_(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function jsonOutput_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
