// ─────────────────────────────────────────────────────────────
//  Ethyria – v4 Direct Download
//  Sheet: "beta_signups"
//
//  Signup → Download-Email wird SOFORT gesendet (kein 2-Step-Flow).
//
//  SETUP:
//    1. Diesen Code in Google Apps Script einfügen (alten Code ersetzen).
//    2. clearAllSignupData_() einmal ausführen → löscht alle alten Einträge.
//    3. Neu deployen → neue URL in alle HTML-Files eintragen.
// ─────────────────────────────────────────────────────────────

const CONFIG = Object.freeze({
  spreadsheetId: "13cqkjTZAUADUMl0_IiK01pd3ZFcO-BTXFJNFosNf_J8",
  sheetName: "beta_signups",
  senderName: "Ethyria",
  replyTo: "support@ethyria.at",
  logoUrl: "https://ethyria-app.github.io/ethyria/assets/splahscreen.png",
  downloadUrl:
    "https://ethyria-app.github.io/ethyria/assets/Ethyria_Beta_V1.0.apk",
});

// ─────────────────────────────────────────────────────────────
//  Web App Entry Points
// ─────────────────────────────────────────────────────────────

function doGet() {
  return jsonOutput_({ status: "ok" });
}

function doPost(e) {
  try {
    const payload = getPayload_(e);

    // Honeypot anti-spam
    if (payload.website) {
      return jsonOutput_({ status: "ignored" });
    }

    const email = normalizeEmail_(payload.email);
    if (!isValidEmail_(email)) {
      return jsonOutput_({ status: "invalid_email" });
    }

    const locale = sanitizeLocale_(payload.locale);
    const sheet = getSheet_();

    if (findRowByEmail_(sheet, email) > 1) {
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
      sendDownloadEmail_(email, locale);
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

// ─────────────────────────────────────────────────────────────
//  TEST: Testmail senden (Adresse + Locale anpassen, dann ausführen)
// ─────────────────────────────────────────────────────────────

function testSendDirectEmail() {
  sendDownloadEmail_("ethyria.app@gmail.com", "de");
  Logger.log("Test-Email gesendet.");
}

// ─────────────────────────────────────────────────────────────
//  CLEANUP: Alle Signup-Daten löschen (einmalig ausführen!)
//  Löscht alle Zeilen ab Zeile 2 in beta_signups.
//  Den alten Sheet "beta_download" manuell in Google Sheets löschen.
// ─────────────────────────────────────────────────────────────

function clearAllSignupData() {
  const ss = SpreadsheetApp.openById(CONFIG.spreadsheetId);
  const sheet = ss.getSheetByName(CONFIG.sheetName);
  if (!sheet) {
    Logger.log("Sheet '" + CONFIG.sheetName + "' nicht gefunden.");
    return;
  }
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    Logger.log("Keine Daten vorhanden. Nichts zu löschen.");
    return;
  }
  sheet.deleteRows(2, lastRow - 1);
  Logger.log("Alle " + (lastRow - 1) + " Einträge gelöscht. Sheet ist clean.");
}

// ─────────────────────────────────────────────────────────────
//  Sheet helpers
// ─────────────────────────────────────────────────────────────

function getSheet_() {
  const ss = SpreadsheetApp.openById(CONFIG.spreadsheetId);
  let sheet = ss.getSheetByName(CONFIG.sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.sheetName);
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
  for (let i = 0; i < values.length; i += 1) {
    if (normalizeEmail_(values[i][0]) === email) {
      return i + 2;
    }
  }
  return -1;
}

// ─────────────────────────────────────────────────────────────
//  Email sender
// ─────────────────────────────────────────────────────────────

function sendDownloadEmail_(email, locale) {
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

// ─────────────────────────────────────────────────────────────
//  i18n + Email Template (Download-Email, alle 5 Sprachen)
// ─────────────────────────────────────────────────────────────

function getEmailTemplate_(locale) {
  const logoUrl = CONFIG.logoUrl;
  const downloadUrl = CONFIG.downloadUrl;

  const i18n = {
    de: {
      subject: "Dein Ethyria-Zugang ist da — Jetzt herunterladen",
      greeting: "Liebe Träumerin, lieber Träumer,",
      headline: "Dein exklusiver Zugang zu Ethyria ist bereit!",
      intro:
        "Das Warten hat sich gelohnt — als einer unserer geschätzten Beta-Tester erhältst du jetzt deinen persönlichen Download-Link.",
      ctaLabel: "▸ Ethyria Beta herunterladen",
      stepsLead: "So startest du:",
      steps: [
        "Lade die APK-Datei über den Button oben herunter.",
        "Öffne die Datei auf deinem Android-Gerät.",
        "Erstelle dein Konto — deine 30 Tage Premium starten sofort.",
      ],
      benefitsLead: "Deine Premium-Vorteile (30 Tage gratis):",
      benefits: [
        "Unbegrenzte KI-gestützte Traumdeutungen",
        "Persönliches Traumtagebuch mit Muster-Erkennung",
        "Zugang zu allen Deutungsmodellen (Freud, Jung, Islamisch, u.\u202Fv.\u202Fm.)",
        "Keine Werbung, keine versteckten Kosten",
      ],
      bonusLead: "Bonus: Verlängere auf 60 Tage!",
      bonusText:
        "Wenn du nach deinen 30 Tagen eine kurze Bewertung abgibst und einen 2-minütigen Fragebogen in der App ausfüllst, schenken wir dir weitere 30 Tage Premium — insgesamt also 60 Tage gratis.",
      installLead: "Hinweis zur Installation:",
      installText:
        "Da Ethyria aktuell als Beta-APK verfügbar ist (noch nicht im Play Store), musst du möglicherweise die Installation aus unbekannten Quellen in deinen Android-Einstellungen erlauben. Das ist sicher — die App ist signiert und verifiziert.",
      privacyLead: "Deine Privatsphäre bleibt geschützt:",
      privacyText:
        "Deine Traumdaten werden nach höchsten Sicherheitsstandards verschlüsselt und niemals an Dritte weitergegeben. Du hast die volle Kontrolle über deine Daten.",
      closing:
        "Wir freuen uns auf dein Feedback — es hilft uns, Ethyria noch besser zu machen.",
      signoff: "Träum gut,",
      signatureName: "Oliver",
      signatureRole: "Chefträumer",
    },
    en: {
      subject: "Your Ethyria Access is Here — Download Now",
      greeting: "Dear Dreamer,",
      headline: "Your Exclusive Access to Ethyria is Ready!",
      intro:
        "The wait is over — as one of our valued beta testers, here is your personal download link.",
      ctaLabel: "▸ Download Ethyria Beta",
      stepsLead: "Getting Started:",
      steps: [
        "Download the APK file using the button above.",
        "Open the file on your Android device.",
        "Create your account — your 30-day Premium trial starts immediately.",
      ],
      benefitsLead: "Your Premium Benefits (30 Days Free):",
      benefits: [
        "Unlimited AI-powered dream interpretations",
        "Personal dream journal with pattern recognition",
        "Access to all interpretation models (Freud, Jung, Islamic, and more)",
        "No ads, no hidden costs",
      ],
      bonusLead: "Bonus: Extend to 60 Days!",
      bonusText:
        "If you leave a short review and fill out a 2-minute questionnaire in the app after your 30 days, we will gift you another 30 days of Premium — 60 days free in total.",
      installLead: "Installation Note:",
      installText:
        "Since Ethyria is currently available as a beta APK (not yet on the Play Store), you may need to enable installation from unknown sources in your Android settings. This is safe — the app is signed and verified.",
      privacyLead: "Your Privacy Stays Protected:",
      privacyText:
        "Your dream data is encrypted to the highest security standards and never shared with third parties. You have full control over your data.",
      closing:
        "We look forward to your feedback — it helps us make Ethyria even better.",
      signoff: "Dream well,",
      signatureName: "Oliver",
      signatureRole: "Chief Dreamer",
    },
    fr: {
      subject: "Ton accès Ethyria est arrivé — Télécharge maintenant",
      greeting: "Chère rêveuse, cher rêveur,",
      headline: "Ton accès exclusif à Ethyria est prêt !",
      intro:
        "L'attente est terminée — en tant que bêta-testeur privilégié, voici ton lien de téléchargement personnel.",
      ctaLabel: "▸ Télécharger Ethyria Beta",
      stepsLead: "Pour commencer :",
      steps: [
        "Télécharge le fichier APK via le bouton ci-dessus.",
        "Ouvre le fichier sur ton appareil Android.",
        "Crée ton compte — tes 30 jours Premium commencent immédiatement.",
      ],
      benefitsLead: "Tes avantages Premium (30 jours gratuits) :",
      benefits: [
        "Interprétations de rêves illimitées assistées par IA",
        "Journal de rêves personnel avec reconnaissance de motifs",
        "Accès à tous les modèles d'interprétation (Freud, Jung, Islamique, etc.)",
        "Aucune publicité, aucun coût caché",
      ],
      bonusLead: "Bonus : Prolonge à 60 jours !",
      bonusText:
        "Si tu laisses un court avis et remplis un questionnaire de 2 minutes dans l'application après tes 30 jours, nous t'offrons 30 jours supplémentaires de Premium — soit 60 jours gratuits au total.",
      installLead: "Note d'installation :",
      installText:
        "Ethyria étant actuellement disponible en APK bêta (pas encore sur le Play Store), tu devras peut-être autoriser l'installation à partir de sources inconnues dans les paramètres Android. C'est sûr — l'application est signée et vérifiée.",
      privacyLead: "Ta vie privée reste protégée :",
      privacyText:
        "Tes données de rêves sont chiffrées selon les normes de sécurité les plus élevées et ne sont jamais partagées avec des tiers. Tu as le contrôle total sur tes données.",
      closing:
        "Nous attendons tes retours avec impatience — ils nous aident à rendre Ethyria encore meilleur.",
      signoff: "Fais de beaux rêves,",
      signatureName: "Oliver",
      signatureRole: "Rêveur en Chef",
    },
    es: {
      subject: "Tu acceso a Ethyria ha llegado — Descarga ahora",
      greeting: "Querida soñadora, querido soñador,",
      headline: "¡Tu acceso exclusivo a Ethyria está listo!",
      intro:
        "La espera ha terminado — como uno de nuestros valiosos beta-testers, aquí tienes tu enlace de descarga personal.",
      ctaLabel: "▸ Descargar Ethyria Beta",
      stepsLead: "Cómo empezar:",
      steps: [
        "Descarga el archivo APK usando el botón de arriba.",
        "Abre el archivo en tu dispositivo Android.",
        "Crea tu cuenta — tus 30 días Premium comienzan de inmediato.",
      ],
      benefitsLead: "Tus beneficios Premium (30 días gratis):",
      benefits: [
        "Interpretaciones de sueños ilimitadas con IA",
        "Diario de sueños personal con reconocimiento de patrones",
        "Acceso a todos los modelos de interpretación (Freud, Jung, Islámico, y más)",
        "Sin anuncios, sin costes ocultos",
      ],
      bonusLead: "Bonus: ¡Extiende a 60 días!",
      bonusText:
        "Si dejas una breve valoración y completas un cuestionario de 2 minutos en la app después de tus 30 días, te regalamos otros 30 días de Premium — 60 días gratis en total.",
      installLead: "Nota de instalación:",
      installText:
        "Como Ethyria está actualmente disponible como APK beta (aún no en Play Store), es posible que necesites permitir la instalación desde fuentes desconocidas en los ajustes de Android. Es seguro — la app está firmada y verificada.",
      privacyLead: "Tu privacidad sigue protegida:",
      privacyText:
        "Tus datos de sueños están cifrados con los más altos estándares de seguridad y nunca se comparten con terceros. Tienes el control total sobre tus datos.",
      closing:
        "Esperamos tus comentarios con muchas ganas — nos ayudan a hacer Ethyria aún mejor.",
      signoff: "¡Que sueñes bien!",
      signatureName: "Oliver",
      signatureRole: "Soñador en Jefe",
    },
    ru: {
      subject: "Твой доступ к Ethyria здесь — Скачай сейчас",
      greeting: "Дорогая мечтательница, дорогой мечтатель,",
      headline: "Твой эксклюзивный доступ к Ethyria готов!",
      intro:
        "Ожидание окончено — как один из наших ценных бета-тестеров, вот твоя персональная ссылка для скачивания.",
      ctaLabel: "▸ Скачать Ethyria Beta",
      stepsLead: "Как начать:",
      steps: [
        "Скачай APK-файл по кнопке выше.",
        "Открой файл на своём Android-устройстве.",
        "Создай аккаунт — твои 30 дней Premium начинаются сразу.",
      ],
      benefitsLead: "Твои Premium-преимущества (30 дней бесплатно):",
      benefits: [
        "Неограниченные толкования снов с помощью ИИ",
        "Личный дневник снов с распознаванием паттернов",
        "Доступ ко всем моделям толкования (Фрейд, Юнг, Исламское и другие)",
        "Без рекламы, без скрытых расходов",
      ],
      bonusLead: "Бонус: Продли до 60 дней!",
      bonusText:
        "Если после 30 дней ты оставишь короткий отзыв и заполнишь 2-минутную анкету в приложении, мы подарим тебе ещё 30 дней Premium — всего 60 дней бесплатно.",
      installLead: "Примечание по установке:",
      installText:
        "Поскольку Ethyria сейчас доступна как бета-APK (ещё не в Play Store), возможно, потребуется разрешить установку из неизвестных источников в настройках Android. Это безопасно — приложение подписано и верифицировано.",
      privacyLead: "Твоя конфиденциальность остаётся защищённой:",
      privacyText:
        "Данные твоих снов зашифрованы по самым высоким стандартам безопасности и никогда не передаются третьим лицам. У тебя полный контроль над своими данными.",
      closing:
        "Мы с нетерпением ждём твоих отзывов — они помогают сделать Ethyria ещё лучше.",
      signoff: "Приятных снов,",
      signatureName: "Oliver",
      signatureRole: "Главный Мечтатель",
    },
  };

  const t = i18n[locale] || i18n.en;

  // ── Plain text version ──────────────────────────────────
  const textSteps = t.steps.map(function (s, i) {
    return i + 1 + ". " + s;
  });
  const textBenefits = t.benefits.map(function (b) {
    return "- " + b;
  });

  const text = [
    t.greeting,
    "",
    t.headline,
    "",
    t.intro,
    "",
    t.ctaLabel + ": " + downloadUrl,
    "",
    t.stepsLead,
  ]
    .concat(textSteps)
    .concat(["", t.benefitsLead])
    .concat(textBenefits)
    .concat([
      "",
      t.bonusLead,
      t.bonusText,
      "",
      t.installLead,
      t.installText,
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

  // ── HTML helpers ────────────────────────────────────────
  var htmlSteps = t.steps
    .map(function (s, i) {
      return (
        '<tr><td style="padding:0 0 10px;">' +
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>' +
        '<td width="28" valign="top" style="padding:2px 8px 0 0;color:#01bfff;font-family:Poppins,Arial,sans-serif;font-size:15px;font-weight:700;line-height:1;">' +
        (i + 1) +
        ".</td>" +
        '<td style="font-family:Inter,Arial,Helvetica,sans-serif;font-size:14px;line-height:1.7;color:#d9e4ff;">' +
        s +
        "</td>" +
        "</tr></table></td></tr>"
      );
    })
    .join("");

  var htmlBenefits = t.benefits
    .map(function (b) {
      return (
        '<tr><td style="padding:0 0 10px;">' +
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>' +
        '<td width="24" valign="top" style="padding:2px 10px 0 0;color:#01bfff;font-size:16px;line-height:1;">&#9679;</td>' +
        '<td style="font-family:Inter,Arial,Helvetica,sans-serif;font-size:14px;line-height:1.7;color:#d9e4ff;">' +
        b +
        "</td>" +
        "</tr></table></td></tr>"
      );
    })
    .join("");

  // ── HTML email ──────────────────────────────────────────
  var html = [
    '<!DOCTYPE html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Poppins:wght@700&display=swap" rel="stylesheet"></head>',
    '<body style="margin:0;padding:0;background-color:#100c1f;font-family:Inter,Arial,Helvetica,sans-serif;">',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#100c1f" style="background-color:#100c1f;background-image:linear-gradient(135deg,#100c1f 0%,#07112b 50%,#001a79 100%);">',
    '<tr><td align="center" style="padding:34px 12px;">',

    // Card
    '<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:transparent;border-radius:24px;overflow:hidden;">',

    // Logo / Hero
    '<tr><td align="center" style="padding:0;">',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0">',
    '<tr><td align="center" style="padding:30px 20px 10px;">',
    '<img src="' +
      logoUrl +
      '" alt="Ethyria" width="220" style="display:block;max-width:220px;width:100%;height:auto;border-radius:20px;" />',
    "</td></tr>",
    '<tr><td align="center" style="padding:14px 34px 8px;">',
    '<h1 style="margin:0;font-family:Poppins,Arial,Helvetica,sans-serif;font-size:24px;line-height:1.3;font-weight:700;letter-spacing:0.01em;background:linear-gradient(90deg,#22d3ee 0%,#60a5fa 35%,#a78bfa 70%,#f0abfc 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;color:#22d3ee;">' +
      t.headline +
      "</h1>",
    "</td></tr>",
    "</table>",
    "</td></tr>",

    // Intro
    '<tr><td style="padding:30px 34px 14px;font-family:Inter,Arial,Helvetica,sans-serif;font-size:15px;line-height:1.75;color:#d9e4ff;">',
    '<p style="margin:0;">' + t.intro + "</p>",
    "</td></tr>",

    // CTA Button
    '<tr><td align="center" style="padding:10px 34px 28px;">',
    '<table role="presentation" cellpadding="0" cellspacing="0"><tr><td>',
    '<a href="' +
      downloadUrl +
      '" target="_blank" style="display:inline-block;padding:16px 38px;font-family:Poppins,Arial,Helvetica,sans-serif;font-size:17px;font-weight:700;color:#ffffff;background:linear-gradient(135deg,#01bfff 0%,#0066ff 100%);border-radius:14px;text-decoration:none;letter-spacing:0.02em;box-shadow:0 6px 24px rgba(1,191,255,0.30);">' +
      t.ctaLabel +
      "</a>",
    "</td></tr></table>",
    "</td></tr>",

    // Getting Started
    '<tr><td style="padding:0 34px 24px;">',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.10);border-radius:20px;">',
    '<tr><td style="padding:24px 24px 8px;font-family:Poppins,Arial,Helvetica,sans-serif;font-size:18px;line-height:1.35;font-weight:700;background:linear-gradient(90deg,#22d3ee 0%,#60a5fa 35%,#a78bfa 70%,#f0abfc 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;color:#22d3ee;">' +
      t.stepsLead +
      "</td></tr>",
    '<tr><td style="padding:0 24px 16px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">' +
      htmlSteps +
      "</table></td></tr>",
    "</table></td></tr>",

    // Premium Benefits
    '<tr><td style="padding:0 34px 24px;">',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.10);border-radius:20px;">',
    '<tr><td style="padding:24px 24px 8px;font-family:Poppins,Arial,Helvetica,sans-serif;font-size:18px;line-height:1.35;font-weight:700;background:linear-gradient(90deg,#22d3ee 0%,#60a5fa 35%,#a78bfa 70%,#f0abfc 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;color:#22d3ee;">' +
      t.benefitsLead +
      "</td></tr>",
    '<tr><td style="padding:0 24px 16px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">' +
      htmlBenefits +
      "</table></td></tr>",
    "</table></td></tr>",

    // Bonus Box
    '<tr><td style="padding:0 34px 24px;">',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.10);border-radius:18px;">',
    '<tr><td style="padding:20px 22px 8px;font-family:Poppins,Arial,Helvetica,sans-serif;font-size:16px;line-height:1.35;font-weight:700;background:linear-gradient(90deg,#22d3ee 0%,#60a5fa 35%,#a78bfa 70%,#f0abfc 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;color:#22d3ee;">' +
      t.bonusLead +
      "</td></tr>",
    '<tr><td style="padding:0 22px 20px;font-family:Inter,Arial,Helvetica,sans-serif;font-size:14px;line-height:1.7;color:#d9e4ff;">' +
      t.bonusText +
      "</td></tr>",
    "</table></td></tr>",

    // Installation Note
    '<tr><td style="padding:0 34px 24px;">',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:18px;">',
    '<tr><td style="padding:20px 22px 8px;font-family:Poppins,Arial,Helvetica,sans-serif;font-size:16px;line-height:1.35;font-weight:700;background:linear-gradient(90deg,#22d3ee 0%,#60a5fa 35%,#a78bfa 70%,#f0abfc 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;color:#22d3ee;">&#9881; ' +
      t.installLead +
      "</td></tr>",
    '<tr><td style="padding:0 22px 20px;font-family:Inter,Arial,Helvetica,sans-serif;font-size:14px;line-height:1.7;color:#d9e4ff;">' +
      t.installText +
      "</td></tr>",
    "</table></td></tr>",

    // Privacy Box
    '<tr><td style="padding:0 34px 24px;">',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.10);border-radius:18px;">',
    '<tr><td style="padding:20px 22px 8px;font-family:Poppins,Arial,Helvetica,sans-serif;font-size:16px;line-height:1.35;font-weight:700;background:linear-gradient(90deg,#22d3ee 0%,#60a5fa 35%,#a78bfa 70%,#f0abfc 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;color:#22d3ee;">&#128274; ' +
      t.privacyLead +
      "</td></tr>",
    '<tr><td style="padding:0 22px 20px;font-family:Inter,Arial,Helvetica,sans-serif;font-size:14px;line-height:1.7;color:#d9e4ff;">' +
      t.privacyText +
      "</td></tr>",
    "</table></td></tr>",

    // Divider
    '<tr><td style="padding:8px 34px;"><hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:0;"></td></tr>',

    // Closing
    '<tr><td style="padding:22px 34px 12px;font-family:Inter,Arial,Helvetica,sans-serif;font-size:14px;line-height:1.7;color:#d9e4ff;">' +
      t.closing +
      "</td></tr>",
    '<tr><td style="padding:0 34px 30px;font-family:Inter,Arial,Helvetica,sans-serif;font-size:14px;line-height:1.7;color:#d9e4ff;">' +
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
    "</td></tr></table></td></tr>",

    "</table>",
    "</td></tr></table>",
    "</body></html>",
  ].join("");

  return { subject: t.subject, text: text, html: html };
}

// ─────────────────────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────────────────────

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

function jsonOutput_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function normalizeEmail_(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function sanitizeLocale_(value) {
  var locale = String(value || "en")
    .trim()
    .toLowerCase()
    .slice(0, 2);
  return ["de", "en", "fr", "es", "ru"].indexOf(locale) > -1 ? locale : "en";
}

function isValidEmail_(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
