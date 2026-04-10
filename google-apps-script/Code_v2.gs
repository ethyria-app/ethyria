const CONFIG = Object.freeze({
  spreadsheetId: "13cqkjTZAUADUMl0_IiK01pd3ZFcO-BTXFJNFosNf_J8",
  sheetName: "beta_signups",
  senderName: "Ethyria",
  replyTo: "support@ethyria.at",
  logoUrl: "https://ostyles.github.io/ethyria/assets/splahscreen.png",
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
  const iconBlob = UrlFetchApp.fetch(CONFIG.logoUrl)
    .getBlob()
    .setName("splahscreen.png");

  return {
    ok: true,
    remainingDailyQuota: MailApp.getRemainingDailyQuota(),
    iconName: iconBlob.getName(),
    iconBytes: iconBlob.getBytes().length,
  };
}

function getEmailTemplate_(locale) {
  const logoUrl = CONFIG.logoUrl;

  const i18n = {
    de: {
      subject: "Willkommen in der Ethyria Traum-Community",
      greeting: "Liebe Träumerin, lieber Träumer,",
      headline: "Willkommen in der Ethyria Traum-Community!",
      thanks:
        "Vielen Dank für dein Interesse als Beta-Tester für Ethyria. Wir freuen uns sehr, dass du dabei bist!",
      listThanks: "Danke für deinen Eintrag in unsere E-Mail-Liste!",
      downloadInfo:
        "Sobald die Beta-Version startet, erhältst du innerhalb der nächsten 4 Wochen eine persönliche E-Mail mit deinem exklusiven Download-Link direkt in dein Postfach.",
      rewardLead: "Deine Belohnung:",
      rewardItems: [
        "30 Tage alle Premium-Features völlig kostenlos.",
        "Option auf 60 Tage: Wenn du nach Ablauf der 30 Tage bereit bist, uns eine kurze Bewertung abzugeben und einen 2-minütigen Fragebogen in der Ethyria-App auszufüllen, schenken wir dir weitere 30 Tage Premium — insgesamt also 60 Tage gratis.",
      ],
      devNote:
        "Wir entwickeln ständig weiter, um dir ein stetig besseres Erlebnis bieten zu können. Wir sind offen für alles, um diese Idee der KI-Traum-Deutung weiterzuentwickeln — dein Feedback ist dabei entscheidend.",
      privacyLead: "Ein Wort zu deiner Privatsphäre:",
      privacyText:
        "Traumanalyse ist ein zutiefst persönliches Thema. Deine Daten werden nach hohen Sicherheitsstandards verschlüsselt, streng vertraulich behandelt und niemals an Dritte weitergegeben.",
      stayTuned:
        "Halte dein Postfach im Auge — dein exklusiver Zugang kommt bald!",
      closing: "Wir sind gespannt auf deine ersten Erkenntnisse.",
      signoff: "Bis bald,",
      signatureName: "Oliver",
      signatureRole: "Chefträumer",
    },
    en: {
      subject: "Welcome to the Ethyria Dream Community",
      greeting: "Dear Dreamer,",
      headline: "Welcome to the Ethyria Dream Community!",
      thanks:
        "Thank you for your interest as a beta tester for Ethyria. We are thrilled to have you on board!",
      listThanks: "Thank you for signing up to our email list!",
      downloadInfo:
        "As soon as the beta launches, you will receive a personal email with your exclusive download link directly in your inbox — within the next 4 weeks.",
      rewardLead: "Your Reward:",
      rewardItems: [
        "30 days of all premium features completely free.",
        "Option for 60 days: If you are willing to leave a short review and fill out a 2-minute questionnaire in the Ethyria app after your 30 days, we will gift you another 30 days of Premium — 60 days in total for free.",
      ],
      devNote:
        "We are constantly evolving to offer you an ever-better experience. We are open to all ideas to further develop this vision of AI dream interpretation — your feedback is key.",
      privacyLead: "A note on your privacy:",
      privacyText:
        "Dream analysis is deeply personal. Your data is encrypted to high security standards, treated as strictly confidential, and never shared with third parties.",
      stayTuned:
        "Keep an eye on your inbox — your exclusive access is coming soon!",
      closing: "We cannot wait to hear about your first insights.",
      signoff: "See you soon,",
      signatureName: "Oliver",
      signatureRole: "Chief Dreamer",
    },
    fr: {
      subject: "Bienvenue dans la communauté des rêves Ethyria",
      greeting: "Chère rêveuse, cher rêveur,",
      headline: "Bienvenue dans la communauté des rêves Ethyria !",
      thanks:
        "Merci pour votre intérêt en tant que bêta-testeur pour Ethyria. Nous sommes ravis de vous compter parmi nous !",
      listThanks: "Merci pour votre inscription à notre liste e-mail !",
      downloadInfo:
        "Dès le lancement de la version bêta, vous recevrez un e-mail personnel avec votre lien de téléchargement exclusif directement dans votre boîte de réception — dans les 4 prochaines semaines.",
      rewardLead: "Votre récompense :",
      rewardItems: [
        "30 jours de toutes les fonctionnalités Premium entièrement gratuites.",
        "Option pour 60 jours : si vous acceptez de nous laisser un court avis et de remplir un questionnaire de 2 minutes dans l'application Ethyria après vos 30 jours, nous vous offrons 30 jours supplémentaires de Premium — soit 60 jours gratuits au total.",
      ],
      devNote:
        "Nous évoluons en permanence pour vous offrir une expérience toujours meilleure. Nous sommes ouverts à toutes les idées pour faire avancer cette vision de l'interprétation des rêves par l'IA — vos retours sont essentiels.",
      privacyLead: "Un mot sur votre vie privée :",
      privacyText:
        "L'analyse des rêves est un sujet profondément personnel. Vos données sont chiffrées selon des standards de sécurité élevés, traitées de manière strictement confidentielle et jamais partagées avec des tiers.",
      stayTuned:
        "Surveillez votre boîte de réception — votre accès exclusif arrive bientôt !",
      closing: "Nous avons hâte de découvrir vos premiers retours.",
      signoff: "À bientôt,",
      signatureName: "Oliver",
      signatureRole: "Rêveur en Chef",
    },
    es: {
      subject: "Bienvenido a la comunidad de sueños Ethyria",
      greeting: "Querida soñadora, querido soñador,",
      headline: "¡Bienvenido a la comunidad de sueños Ethyria!",
      thanks:
        "Gracias por tu interés como beta-tester de Ethyria. ¡Estamos encantados de tenerte a bordo!",
      listThanks: "¡Gracias por inscribirte en nuestra lista de correo!",
      downloadInfo:
        "En cuanto se lance la versión beta, recibirás un correo personal con tu enlace de descarga exclusivo directamente en tu bandeja de entrada — dentro de las próximas 4 semanas.",
      rewardLead: "Tu recompensa:",
      rewardItems: [
        "30 días de todas las funciones Premium completamente gratis.",
        "Opción de 60 días: si después de tus 30 días estás dispuesto a dejarnos una breve valoración y completar un cuestionario de 2 minutos en la app de Ethyria, te regalamos otros 30 días de Premium — 60 días gratis en total.",
      ],
      devNote:
        "Evolucionamos constantemente para ofrecerte una experiencia cada vez mejor. Estamos abiertos a todas las ideas para seguir desarrollando esta visión de la interpretación de sueños con IA — tu feedback es clave.",
      privacyLead: "Una palabra sobre tu privacidad:",
      privacyText:
        "El análisis de sueños es algo profundamente personal. Tus datos se cifran según altos estándares de seguridad, se tratan de forma estrictamente confidencial y nunca se comparten con terceros.",
      stayTuned:
        "¡Estate atento a tu bandeja de entrada — tu acceso exclusivo llegará pronto!",
      closing: "Tenemos muchas ganas de conocer tus primeras impresiones.",
      signoff: "¡Hasta pronto!",
      signatureName: "Oliver",
      signatureRole: "Soñador en Jefe",
    },
    ru: {
      subject: "Добро пожаловать в сообщество снов Ethyria",
      greeting: "Дорогая мечтательница, дорогой мечтатель,",
      headline: "Добро пожаловать в сообщество снов Ethyria!",
      thanks:
        "Спасибо за ваш интерес в качестве бета-тестера Ethyria. Мы очень рады, что вы с нами!",
      listThanks: "Спасибо за подписку на нашу рассылку!",
      downloadInfo:
        "Как только бета-версия будет запущена, вы получите личное письмо с эксклюзивной ссылкой для скачивания прямо в ваш почтовый ящик — в течение ближайших 4 недель.",
      rewardLead: "Ваше вознаграждение:",
      rewardItems: [
        "30 дней всех Premium-функций совершенно бесплатно.",
        "Вариант на 60 дней: если после 30 дней вы готовы оставить короткий отзыв и заполнить 2-минутную анкету в приложении Ethyria, мы подарим вам ещё 30 дней Premium — всего 60 дней бесплатно.",
      ],
      devNote:
        "Мы постоянно развиваемся, чтобы предложить вам всё лучший опыт. Мы открыты для всех идей по дальнейшему развитию этой концепции толкования снов с помощью ИИ — ваши отзывы имеют решающее значение.",
      privacyLead: "Несколько слов о вашей конфиденциальности:",
      privacyText:
        "Анализ снов — глубоко личная тема. Ваши данные шифруются по высоким стандартам безопасности, строго конфиденциальны и никогда не передаются третьим лицам.",
      stayTuned: "Следите за почтой — ваш эксклюзивный доступ скоро появится!",
      closing: "Нам очень интересно узнать о ваших первых впечатлениях.",
      signoff: "До скорого,",
      signatureName: "Oliver",
      signatureRole: "Главный Мечтатель",
    },
  };

  const t = i18n[locale] || i18n.en;

  const textRewards = t.rewardItems.map(function (item) {
    return "- " + item;
  });
  const htmlRewards = t.rewardItems
    .map(function (item) {
      return (
        '<tr><td style="padding:0 0 12px;">' +
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0">' +
        "<tr>" +
        '<td width="24" valign="top" style="padding:2px 10px 0 0;color:#01bfff;font-size:16px;line-height:1;">&#9679;</td>' +
        '<td style="font-family:Inter,Arial,Helvetica,sans-serif;font-size:14px;line-height:1.7;color:#d9e4ff;">' +
        item +
        "</td>" +
        "</tr>" +
        "</table>" +
        "</td></tr>"
      );
    })
    .join("");

  const text = [
    t.greeting,
    "",
    t.headline,
    "",
    t.thanks,
    "",
    t.listThanks,
    "",
    t.downloadInfo,
    "",
    t.rewardLead,
  ]
    .concat(textRewards)
    .concat([
      "",
      t.devNote,
      "",
      t.privacyLead,
      t.privacyText,
      "",
      t.stayTuned,
      "",
      t.closing,
      "",
      t.signoff,
      t.signatureName,
      t.signatureRole,
    ])
    .join("\n");

  const html = [
    '<!DOCTYPE html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Poppins:wght@700&display=swap" rel="stylesheet"></head>',
    '<body style="margin:0;padding:0;background-color:#100c1f;font-family:Inter,Arial,Helvetica,sans-serif;">',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#100c1f" style="background-color:#100c1f;background-image:linear-gradient(135deg,#100c1f 0%,#08134e 55%,#001a79 100%);">',
    '<tr><td align="center" style="padding:34px 12px;">',

    // Card
    '<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#101a3a;border:1px solid rgba(255,255,255,0.10);border-radius:24px;overflow:hidden;box-shadow:0 22px 60px rgba(0,0,0,0.38);">',

    // Logo / Hero image
    '<tr><td align="center" style="padding:0;background-color:#08134e;background-image:linear-gradient(135deg,#100c1f 0%,#08134e 48%,#001a79 100%);">',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0">',
    '<tr><td align="center" style="padding:30px 20px 10px;">',
    '<img src="' +
      logoUrl +
      '" alt="Ethyria" width="220" style="display:block;max-width:220px;width:100%;height:auto;border-radius:20px;" />',
    "</td></tr>",

    // Headline
    '<tr><td align="center" style="padding:14px 34px 8px;">',
    '<h1 style="margin:0;font-family:Poppins,Arial,Helvetica,sans-serif;font-size:24px;line-height:1.3;color:#ffffff;font-weight:700;letter-spacing:0.01em;">' +
      t.headline +
      "</h1>",
    "</td></tr>",

    "</table>",
    "</td></tr>",

    // Thanks
    '<tr><td style="padding:30px 34px 14px;font-family:Inter,Arial,Helvetica,sans-serif;font-size:15px;line-height:1.75;color:#d9e4ff;">',
    '<p style="margin:0;">' + t.thanks + "</p>",
    "</td></tr>",

    // List thanks
    '<tr><td style="padding:0 34px 14px;font-family:Inter,Arial,Helvetica,sans-serif;font-size:15px;line-height:1.75;color:#01bfff;font-weight:600;">',
    t.listThanks,
    "</td></tr>",

    // Download info
    '<tr><td style="padding:0 34px 24px;font-family:Inter,Arial,Helvetica,sans-serif;font-size:15px;line-height:1.75;color:#d9e4ff;">',
    '<p style="margin:0;">' + t.downloadInfo + "</p>",
    "</td></tr>",

    // Reward box
    '<tr><td style="padding:0 34px 24px;">',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.10);border-radius:20px;">',
    '<tr><td style="padding:24px 24px 8px;font-family:Poppins,Arial,Helvetica,sans-serif;font-size:18px;line-height:1.35;color:#ffffff;font-weight:700;">',
    t.rewardLead,
    "</td></tr>",
    '<tr><td style="padding:0 24px 10px;">',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0">',
    htmlRewards,
    "</table>",
    "</td></tr>",
    "</table>",
    "</td></tr>",

    // Dev note
    '<tr><td style="padding:0 34px 24px;font-family:Inter,Arial,Helvetica,sans-serif;font-size:14px;line-height:1.75;color:#d9e4ff;font-style:italic;">',
    t.devNote,
    "</td></tr>",

    // Privacy
    '<tr><td style="padding:0 34px 24px;">',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#121a36;border:1px solid rgba(1,191,255,0.18);border-radius:18px;">',
    '<tr><td style="padding:20px 22px 8px;font-family:Poppins,Arial,Helvetica,sans-serif;font-size:16px;line-height:1.35;color:#ffffff;font-weight:700;">',
    t.privacyLead,
    "</td></tr>",
    '<tr><td style="padding:0 22px 20px;font-family:Inter,Arial,Helvetica,sans-serif;font-size:14px;line-height:1.7;color:#d9e4ff;">',
    t.privacyText,
    "</td></tr>",
    "</table>",
    "</td></tr>",

    // Stay tuned
    '<tr><td style="padding:0 34px 8px;font-family:Inter,Arial,Helvetica,sans-serif;font-size:15px;line-height:1.75;color:#9fdcff;font-weight:600;text-align:center;">',
    t.stayTuned,
    "</td></tr>",

    // Divider
    '<tr><td style="padding:8px 34px;"><hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:0;"></td></tr>',

    // Closing
    '<tr><td style="padding:22px 34px 12px;font-family:Inter,Arial,Helvetica,sans-serif;font-size:14px;line-height:1.7;color:#d9e4ff;">',
    t.closing,
    "</td></tr>",
    '<tr><td style="padding:0 34px 30px;font-family:Inter,Arial,Helvetica,sans-serif;font-size:14px;line-height:1.7;color:#d9e4ff;">',
    t.signoff +
      '<br><strong style="color:#ffffff;">' +
      t.signatureName +
      '</strong><br><span style="color:#01bfff;">' +
      t.signatureRole +
      "</span>",
    "</td></tr>",

    // Footer
    '<tr><td align="center" style="padding:0 34px 22px;">',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:rgba(255,255,255,0.03);border-top:1px solid rgba(255,255,255,0.06);">',
    '<tr><td align="center" style="padding:18px 20px 20px;font-family:Inter,Arial,Helvetica,sans-serif;font-size:11px;line-height:1.7;color:#91a0c6;">',
    "Ethyria | Traumdeutung App mit KI &middot; Traumtagebuch &amp; Traumanalyse (Android)<br>",
    '<a href="https://ethyria.at" style="color:#01bfff;text-decoration:none;">ethyria.at</a>',
    " | ",
    '<a href="mailto:support@ethyria.at" style="color:#01bfff;text-decoration:none;">support@ethyria.at</a>',
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
