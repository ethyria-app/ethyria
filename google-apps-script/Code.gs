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
  if (contentType.includes("application/json") && rawBody) {
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

function checkMailAuthorization_() {
  const iconBlob = UrlFetchApp.fetch(
    "https://ostyles.github.io/ethyria/assets/Ethyria_symbol.png",
  )
    .getBlob()
    .setName("Ethyria_symbol.png");

  return {
    ok: true,
    remainingDailyQuota: MailApp.getRemainingDailyQuota(),
    iconName: iconBlob.getName(),
    iconBytes: iconBlob.getBytes().length,
  };
}

function getEmailTemplate_(locale) {
  const downloadUrl = CONFIG.downloadUrl;
  const siteUrl = "https://ostyles.github.io/ethyria/";

  const i18n = {
    de: {
      subject: "Willkommen bei Ethyria - Deine 30 Tage Premium starten jetzt",
      greeting: "Liebe Traeumerin, lieber Traeumer,",
      intro1: "herzlich willkommen in der Ethyria Traum-Community.",
      intro2:
        "Wir freuen uns, dass du als einer der ersten 100 Pioniere dabei bist, um die Zukunft der wissenschaftlichen Traumanalyse mitzugestalten. Dein Zugang fuer die Beta-Phase ist jetzt vorgemerkt.",
      benefitsLead: "Deine Beta-Vorteile im Ueberblick:",
      benefits: [
        "30 Tage Ethyria Premium gratis: voller Zugriff auf alle Analyse-Tools und unsere spezialisierten Prompt-as-a-Service-Funktionen.",
        "Kein Abo-Zwang: Dein Testzeitraum endet automatisch. Es entstehen keine Kosten.",
        "Bonus: Wenn du uns nach dem Test eine kurze Bewertung schickst und den Fragebogen ausfuellst, schenken wir dir einen weiteren Monat Premium.",
      ],
      downloadLead:
        "Ueber den folgenden Link gelangst du direkt zum Download und zur Einrichtung deines Accounts:",
      downloadLabel: "Ethyria Beta herunterladen und Premium freischalten",
      setupHint:
        "Nach dem Download kannst du die App installieren und deinen Zugang in wenigen Schritten aktivieren.",
      privacyLead: "Ein Wort zu deiner Privatsphaere:",
      privacyText:
        "Traumanalyse ist ein zutiefst persoenliches Thema. Deine Daten werden nach hohen Sicherheitsstandards verschluesselt, streng vertraulich behandelt und niemals an Dritte weitergegeben.",
      closing: "Wir sind gespannt auf deine ersten Erkenntnisse.",
      signoff: "Mit freundlichen Gruessen,",
      signatureName: "Oliver",
      signatureRole: "Gruender von Ethyria",
    },
    fr: {
      subject:
        "Bienvenue chez Ethyria - Vos 30 jours Premium commencent maintenant",
      greeting: "Chere reveuse, cher reveur,",
      intro1: "bienvenue dans la communaute des reves Ethyria.",
      intro2:
        "Nous sommes ravis de vous compter parmi les 100 premiers pionniers qui contribueront a faconner l'avenir de l'analyse scientifique des reves. Votre acces a la beta est maintenant reserve.",
      benefitsLead: "Vos avantages beta en bref :",
      benefits: [
        "30 jours d'Ethyria Premium offerts : acces complet a tous les outils d'analyse et a nos fonctionnalites specialisees de prompt-as-a-service.",
        "Aucun abonnement impose : votre periode d'essai se termine automatiquement. Aucun frais ne vous sera facture.",
        "Bonus : si vous nous envoyez un court avis apres l'essai et remplissez notre questionnaire, nous vous offrons un mois Premium supplementaire.",
      ],
      downloadLead:
        "Utilisez le lien ci-dessous pour telecharger la beta et finaliser la creation de votre acces :",
      downloadLabel: "Telecharger Ethyria Beta et activer Premium",
      setupHint:
        "Apres le telechargement, installez l'application et activez votre acces en quelques etapes.",
      privacyLead: "Un mot sur votre vie privee :",
      privacyText:
        "L'analyse des reves est un sujet profondement personnel. Vos donnees sont chiffrees selon des standards de securite eleves, traitees de maniere strictement confidentielle et jamais partagees avec des tiers.",
      closing: "Nous avons hate de decouvrir vos premiers retours.",
      signoff: "Bien cordialement,",
      signatureName: "Oliver",
      signatureRole: "Fondateur d'Ethyria",
    },
    es: {
      subject: "Bienvenido a Ethyria - Tus 30 dias Premium empiezan ahora",
      greeting: "Querida sonadora, querido sonador,",
      intro1: "bienvenido a la comunidad de suenos de Ethyria.",
      intro2:
        "Nos alegra mucho que formes parte de los primeros 100 pioneros que ayudaran a dar forma al futuro del analisis cientifico de los suenos. Tu acceso a la beta ya ha quedado reservado.",
      benefitsLead: "Tus ventajas beta de un vistazo:",
      benefits: [
        "30 dias de Ethyria Premium gratis: acceso completo a todas las herramientas de analisis y a nuestras funciones especializadas de prompt-as-a-service.",
        "Sin suscripcion obligatoria: tu periodo de prueba termina automaticamente. No se generan cargos.",
        "Bonus: si nos envias una breve valoracion despues de la prueba y completas nuestro cuestionario, te regalamos un mes adicional de Premium.",
      ],
      downloadLead:
        "Usa el siguiente enlace para descargar la beta y completar la activacion de tu cuenta:",
      downloadLabel: "Descargar Ethyria Beta y activar Premium",
      setupHint:
        "Despues de la descarga, instala la app y activa tu acceso en pocos pasos.",
      privacyLead: "Una palabra sobre tu privacidad:",
      privacyText:
        "El analisis de suenos es algo profundamente personal. Tus datos se cifran segun altos estandares de seguridad, se tratan de forma estrictamente confidencial y nunca se comparten con terceros.",
      closing: "Tenemos muchas ganas de conocer tus primeras impresiones.",
      signoff: "Saludos cordiales,",
      signatureName: "Oliver",
      signatureRole: "Fundador de Ethyria",
    },
    ru: {
      subject:
        "Dobro pozhalovat v Ethyria - Vashi 30 dney Premium nachinayutsya seychas",
      greeting: "Dorogaya mechtatelnitsa, dorogoy mechtatel,",
      intro1: "dobro pozhalovat v soobshchestvo snov Ethyria.",
      intro2:
        "My ochen rady, chto vy sredi pervykh 100 pionerov, kotorye pomogut formirovat budushchee nauchnogo analiza snov. Vash dostup k beta-versii uzhe zarezervirovan.",
      benefitsLead: "Vashi beta-preimushchestva:",
      benefits: [
        "30 dney Ethyria Premium besplatno: polnyy dostup ko vsem instrumentam analiza i nashim spetsializirovannym funktsiyam prompt-as-a-service.",
        "Bez obyazatelnoy podpiski: probnyy period zavershitsya avtomaticheski. Nikakikh spisaniy ne budet.",
        "Bonus: esli posle testa vy otpravite nam korotkiy otzyv i zapolnite nashu anketu, my podarim vam eshche odin mesyats Premium.",
      ],
      downloadLead:
        "Ispolzuyte ssylku nizhe, chtoby skachat beta-versiyu i zavershit nastroiku akkaunta:",
      downloadLabel: "Skachat Ethyria Beta i aktivirovat Premium",
      setupHint:
        "Posle zagruzki ustanovite prilozhenie i aktiviruyte dostup za neskolko shagov.",
      privacyLead: "Neskolko slov o vashey konfidentsialnosti:",
      privacyText:
        "Analiz snov - gluboko lichnaya tema. Vashi dannye shifruyutsya po vysokim standartam bezopasnosti, strogo konfidentsialny i nikogda ne peredayutsya tretim litsam.",
      closing: "Nam ochen interesno uznat o vashikh pervykh vpechatleniyakh.",
      signoff: "S uvazheniem,",
      signatureName: "Oliver",
      signatureRole: "Osnovatel Ethyria",
    },
    en: {
      subject: "Welcome to Ethyria - Your 30 days of Premium start now",
      greeting: "Dear Dreamer,",
      intro1: "welcome to the Ethyria dream community.",
      intro2:
        "We are delighted to have you with us as one of the first 100 pioneers helping shape the future of scientific dream analysis. Your beta access has now been reserved.",
      benefitsLead: "Your beta benefits at a glance:",
      benefits: [
        "30 days of Ethyria Premium for free: full access to all analysis tools and our specialized prompt-as-a-service features.",
        "No subscription trap: your trial ends automatically. No charges apply.",
        "Bonus: if you send us a short review after the trial and complete our questionnaire, we will gift you one more month of Premium.",
      ],
      downloadLead:
        "Use the link below to download the beta and complete your account setup:",
      downloadLabel: "Download Ethyria Beta and unlock Premium",
      setupHint:
        "After the download, install the app and activate your access in just a few steps.",
      privacyLead: "A note on your privacy:",
      privacyText:
        "Dream analysis is deeply personal. Your data is encrypted to high security standards, treated as strictly confidential, and never shared with third parties.",
      closing: "We cannot wait to hear about your first insights.",
      signoff: "Best regards,",
      signatureName: "Oliver",
      signatureRole: "Founder of Ethyria",
    },
  };

  const t = i18n[locale] || i18n.en;
  const textBenefits = t.benefits.map(function (item) {
    return "- " + item;
  });
  const htmlBenefits = t.benefits
    .map(function (item) {
      return (
        '<tr><td style="padding:0 0 12px;">' +
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0">' +
        "<tr>" +
        '<td width="24" valign="top" style="padding:2px 10px 0 0;color:#01bfff;font-size:16px;line-height:1;">&#9679;</td>' +
        '<td style="font-size:14px;line-height:1.7;color:#d9e4ff;">' +
        item +
        "</td>" +
        "</tr>" +
        "</table>" +
        "</td></tr>"
      );
    })
    .join("");

  const text = [t.greeting, "", t.intro1, "", t.intro2, "", t.benefitsLead]
    .concat(textBenefits)
    .concat([
      "",
      t.downloadLead,
      t.downloadLabel + ": " + downloadUrl,
      "",
      t.setupHint,
      "",
      t.privacyLead,
      t.privacyText,
      "",
      t.closing,
      "",
      t.signoff,
      t.signatureName,
      t.signatureRole,
    ])
    .join("\n");

  const html = [
    '<!DOCTYPE html><html><head><meta charset="utf-8"></head>',
    '<body style="margin:0;padding:0;background-color:#100c1f;font-family:Inter,Arial,Helvetica,sans-serif;">',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#100c1f" style="background-color:#100c1f;background-image:linear-gradient(135deg,#100c1f 0%,#08134e 55%,#001a79 100%);">',
    '<tr><td align="center" style="padding:34px 12px;">',

    // Card
    '<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#101a3a;border:1px solid rgba(255,255,255,0.10);border-radius:24px;overflow:hidden;box-shadow:0 22px 60px rgba(0,0,0,0.38);">',

    // Hero background
    '<tr><td style="padding:0;background-color:#08134e;background-image:linear-gradient(135deg,#100c1f 0%,#08134e 48%,#001a79 100%);">',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0">',
    '<tr><td align="center" style="padding:30px 20px 10px;">',
    '<table role="presentation" cellpadding="0" cellspacing="0" style="border-radius:26px;background-color:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.10);box-shadow:0 18px 34px rgba(0,0,0,0.24);">',
    '<tr><td style="padding:18px 22px 16px;" align="center">',
    '<div style="font-family:Poppins,Arial,Helvetica,sans-serif;font-size:30px;line-height:0.95;color:#ffffff;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;">Ethyria</div>',
    '<div style="padding-top:8px;font-family:Inter,Arial,Helvetica,sans-serif;font-size:10px;line-height:1;letter-spacing:0.3em;text-transform:uppercase;color:#9fdcff;">Dream Deeper</div>',
    "</td></tr>",
    "</table>",
    "</td></tr>",

    // Greeting
    '<tr><td align="center" style="padding:0 34px 8px;">',
    '<h1 style="margin:0;font-family:Poppins,Arial,Helvetica,sans-serif;font-size:28px;line-height:1.25;color:#ffffff;font-weight:700;letter-spacing:0.01em;">' +
      t.greeting +
      "</h1>",
    "</td></tr>",

    '<tr><td align="center" style="padding:0 34px 26px;">',
    '<p style="margin:0;font-size:15px;line-height:1.7;color:#9fdcff;">ostyles.github.io/ethyria</p>',
    "</td></tr>",
    "</table>",
    "</td></tr>",

    // Intro
    '<tr><td style="padding:30px 34px 24px;font-size:15px;line-height:1.75;color:#d9e4ff;">',
    '<p style="margin:0 0 14px;">' + t.intro1 + "</p>",
    '<p style="margin:0;">' + t.intro2 + "</p>",
    "</td></tr>",

    // Benefits
    '<tr><td style="padding:0 34px 24px;">',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.10);border-radius:20px;">',
    '<tr><td style="padding:24px 24px 8px;font-family:Poppins,Arial,Helvetica,sans-serif;font-size:18px;line-height:1.35;color:#ffffff;font-weight:700;">',
    t.benefitsLead,
    "</td></tr>",
    '<tr><td style="padding:0 24px 10px;">',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0">',
    htmlBenefits,
    "</table>",
    "</td></tr>",
    "</table>",
    "</td></tr>",

    // Download intro
    '<tr><td style="padding:0 34px 18px;font-size:15px;line-height:1.7;color:#d9e4ff;">',
    t.downloadLead,
    "</td></tr>",

    // Download button
    '<tr><td align="center" style="padding:0 34px 24px;">',
    '<table role="presentation" cellpadding="0" cellspacing="0">',
    '<tr><td align="center" bgcolor="#3184ff" style="background-color:#3184ff;border-radius:999px;box-shadow:0 0 15px rgba(49,132,255,0.40);">',
    '<a href="' +
      downloadUrl +
      '" style="display:inline-block;padding:16px 34px;font-family:Poppins,Arial,Helvetica,sans-serif;font-size:16px;line-height:1.2;font-weight:700;letter-spacing:0.01em;color:#ffffff;text-decoration:none;border-radius:999px;border:1px solid rgba(255,255,255,0.08);">',
    t.downloadLabel + " &rarr;",
    "</a>",
    "</td></tr>",
    "</table>",
    "</td></tr>",

    // Setup hint
    '<tr><td style="padding:0 34px 26px;font-size:13px;line-height:1.7;color:#9fb1d9;">',
    t.setupHint,
    "</td></tr>",

    // Privacy
    '<tr><td style="padding:0 34px 24px;">',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#121a36;border:1px solid rgba(1,191,255,0.18);border-radius:18px;">',
    '<tr><td style="padding:20px 22px 8px;font-family:Poppins,Arial,Helvetica,sans-serif;font-size:16px;line-height:1.35;color:#ffffff;font-weight:700;">',
    t.privacyLead,
    "</td></tr>",
    '<tr><td style="padding:0 22px 20px;font-size:14px;line-height:1.7;color:#d9e4ff;">',
    t.privacyText,
    "</td></tr>",
    "</table>",
    "</td></tr>",

    // Divider
    '<tr><td style="padding:0 34px;"><hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:0;"></td></tr>',

    // Closing
    '<tr><td style="padding:22px 34px 12px;font-size:14px;line-height:1.7;color:#d9e4ff;">',
    t.closing,
    "</td></tr>",
    '<tr><td style="padding:0 34px 30px;font-size:14px;line-height:1.7;color:#d9e4ff;">',
    t.signoff +
      '<br><strong style="color:#ffffff;">' +
      t.signatureName +
      '</strong><br><span style="color:#a855f7;">' +
      t.signatureRole +
      "</span>",
    "</td></tr>",

    // Footer
    '<tr><td align="center" style="padding:0 34px 22px;">',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:rgba(255,255,255,0.03);border-top:1px solid rgba(255,255,255,0.06);">',
    '<tr><td align="center" style="padding:18px 20px 20px;font-size:11px;line-height:1.7;color:#91a0c6;">',
    "Ethyria AI · Beta access · Secure delivery via Gmail<br>",
    '<a href="' +
      siteUrl +
      '" style="color:#01bfff;text-decoration:none;">ostyles.github.io/ethyria</a>',
    "</td></tr>",
    "</table>",
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
  return ["de", "en", "fr", "es", "ru"].includes(locale) ? locale : "en";
}

function isValidEmail_(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function jsonOutput_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
