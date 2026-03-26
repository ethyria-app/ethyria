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
  const templates = {
    de: {
      subject: "Danke fuer deine Ethyria Anmeldung",
      text:
        "Danke fuer deine Anmeldung zu Ethyria.\n\nDein Download-Link:\n" +
        downloadUrl +
        "\n\nWir freuen uns, dass du zu den ersten Nutzern gehoerst.\n\nLiebe Gruesse\nEthyria",
      html:
        '<p>Danke fuer deine Anmeldung zu <strong>Ethyria</strong>.</p><p>Hier ist dein Download-Link:</p><p><a href="' +
        downloadUrl +
        '">' +
        downloadUrl +
        "</a></p><p>Wir freuen uns, dass du zu den ersten Nutzern gehoerst.</p><p>Liebe Gruesse<br>Ethyria</p>",
    },
    fr: {
      subject: "Merci pour votre inscription a Ethyria",
      text:
        "Merci pour votre inscription a Ethyria.\n\nVotre lien de telechargement :\n" +
        downloadUrl +
        "\n\nNous sommes ravis de vous compter parmi les premiers utilisateurs.\n\nA bientot\nEthyria",
      html:
        '<p>Merci pour votre inscription a <strong>Ethyria</strong>.</p><p>Voici votre lien de telechargement :</p><p><a href="' +
        downloadUrl +
        '">' +
        downloadUrl +
        "</a></p><p>Nous sommes ravis de vous compter parmi les premiers utilisateurs.</p><p>A bientot<br>Ethyria</p>",
    },
    es: {
      subject: "Gracias por unirte a Ethyria",
      text:
        "Gracias por registrarte en Ethyria.\n\nTu enlace de descarga:\n" +
        downloadUrl +
        "\n\nNos alegra mucho tenerte entre los primeros usuarios.\n\nUn saludo\nEthyria",
      html:
        '<p>Gracias por registrarte en <strong>Ethyria</strong>.</p><p>Aqui tienes tu enlace de descarga:</p><p><a href="' +
        downloadUrl +
        '">' +
        downloadUrl +
        "</a></p><p>Nos alegra mucho tenerte entre los primeros usuarios.</p><p>Un saludo<br>Ethyria</p>",
    },
    ru: {
      subject: "Spasibo za registratsiyu v Ethyria",
      text:
        "Spasibo za registratsiyu v Ethyria.\n\nVasha ssylka dlya skachivaniya:\n" +
        downloadUrl +
        "\n\nMy rady videt vas sredi pervykh polzovateley.\n\nS uvazheniem\nEthyria",
      html:
        '<p>Spasibo za registratsiyu v <strong>Ethyria</strong>.</p><p>Vot vasha ssylka dlya skachivaniya:</p><p><a href="' +
        downloadUrl +
        '">' +
        downloadUrl +
        "</a></p><p>My rady videt vas sredi pervykh polzovateley.</p><p>S uvazheniem<br>Ethyria</p>",
    },
    en: {
      subject: "Thanks for joining Ethyria",
      text:
        "Thanks for joining Ethyria.\n\nYour download link:\n" +
        downloadUrl +
        "\n\nWe are excited to have you among our first users.\n\nBest regards\nEthyria",
      html:
        '<p>Thanks for joining <strong>Ethyria</strong>.</p><p>Here is your download link:</p><p><a href="' +
        downloadUrl +
        '">' +
        downloadUrl +
        "</a></p><p>We are excited to have you among our first users.</p><p>Best regards<br>Ethyria</p>",
    },
  };

  return templates[locale] || templates.en;
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
