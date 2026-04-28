/**
 * Batch fix for all 75 symbol detail pages:
 * 1. Increase bottom padding on Verwandt links div (pb-3 → pb-6)
 * 2. Replace CTA <a> link with popup modal beta signup
 * 3. Replace inline biosync link with popup trigger
 */
const fs = require("fs");
const path = require("path");

const symbolsDir = path.join(__dirname, "..", "symbols");

// Localized popup content per language
const localeConfig = {
  de: {
    popupTitle: "Ethyria Beta — Kostenlos starten",
    popupDesc:
      "Trag deine Email ein. Dein persönlicher Download-Link kommt direkt ins Postfach.",
    placeholder: "deine@email.com",
    buttonText: "Zugang sichern ▸",
    closeLabel: "Schließen",
    emailLabel: "Email Adresse",
    locale: "de",
    messages: {
      success: "Du bist dabei. Prüfe jetzt deinen Posteingang.",
      alreadyRegistered:
        "Diese Email ist bereits registriert. Prüfe deinen Posteingang.",
      savedNoEmail: "Gespeichert. Die Bestätigungsmail folgt in Kürze.",
      invalidEmail: "Bitte gib eine gültige Email Adresse ein.",
      sending: "Wird gespeichert...",
      error: "Hat nicht geklappt. Bitte versuch es nochmal.",
      setup: "Signup ist noch nicht aktiv.",
      buttonIdle: "Zugang sichern ▸",
      buttonLoading: "Speichert...",
    },
  },
  en: {
    popupTitle: "Ethyria Beta — Start for Free",
    popupDesc:
      "Enter your email. Your personal download link will arrive in your inbox.",
    placeholder: "your@email.com",
    buttonText: "Get Access ▸",
    closeLabel: "Close",
    emailLabel: "Email Address",
    locale: "en",
    messages: {
      success: "You're in! Check your inbox now.",
      alreadyRegistered: "This email is already registered. Check your inbox.",
      savedNoEmail: "Saved. Confirmation email follows shortly.",
      invalidEmail: "Please enter a valid email address.",
      sending: "Saving...",
      error: "Something went wrong. Please try again.",
      setup: "Signup is not active yet.",
      buttonIdle: "Get Access ▸",
      buttonLoading: "Saving...",
    },
  },
  fr: {
    popupTitle: "Ethyria Beta — Commencer gratuitement",
    popupDesc:
      "Entrez votre email. Votre lien de téléchargement arrivera dans votre boîte mail.",
    placeholder: "votre@email.com",
    buttonText: "Obtenir l'accès ▸",
    closeLabel: "Fermer",
    emailLabel: "Adresse email",
    locale: "fr",
    messages: {
      success: "Vous y êtes ! Vérifiez votre boîte mail.",
      alreadyRegistered:
        "Cet email est déjà enregistré. Vérifiez votre boîte mail.",
      savedNoEmail: "Enregistré. L'email de confirmation suit sous peu.",
      invalidEmail: "Veuillez entrer une adresse email valide.",
      sending: "Enregistrement...",
      error: "Quelque chose a échoué. Réessayez.",
      setup: "L'inscription n'est pas encore active.",
      buttonIdle: "Obtenir l'accès ▸",
      buttonLoading: "Enregistrement...",
    },
  },
  es: {
    popupTitle: "Ethyria Beta — Comenzar gratis",
    popupDesc: "Ingresa tu email. Tu enlace de descarga llegará a tu bandeja.",
    placeholder: "tu@email.com",
    buttonText: "Obtener acceso ▸",
    closeLabel: "Cerrar",
    emailLabel: "Correo electrónico",
    locale: "es",
    messages: {
      success: "¡Ya estás! Revisa tu bandeja de entrada.",
      alreadyRegistered: "Este email ya está registrado. Revisa tu bandeja.",
      savedNoEmail: "Guardado. El email de confirmación llegará pronto.",
      invalidEmail: "Por favor ingresa un email válido.",
      sending: "Guardando...",
      error: "Algo salió mal. Inténtalo de nuevo.",
      setup: "El registro aún no está activo.",
      buttonIdle: "Obtener acceso ▸",
      buttonLoading: "Guardando...",
    },
  },
  ru: {
    popupTitle: "Ethyria Beta — Начать бесплатно",
    popupDesc: "Введите email. Ваша персональная ссылка придёт на почту.",
    placeholder: "ваш@email.com",
    buttonText: "Получить доступ ▸",
    closeLabel: "Закрыть",
    emailLabel: "Email адрес",
    locale: "ru",
    messages: {
      success: "Вы в списке! Проверьте почту.",
      alreadyRegistered: "Этот email уже зарегистрирован. Проверьте почту.",
      savedNoEmail: "Сохранено. Письмо подтверждения придёт скоро.",
      invalidEmail: "Пожалуйста, введите корректный email.",
      sending: "Сохраняем...",
      error: "Что-то пошло не так. Попробуйте снова.",
      setup: "Регистрация ещё не активна.",
      buttonIdle: "Получить доступ ▸",
      buttonLoading: "Сохраняем...",
    },
  },
};

const ENDPOINT =
  "https://script.google.com/macros/s/AKfycbzr-HrFfDis7ntvP-2cO-0K_VtuzISOGWrj2dxHiiKw8k4lFq9UCORGlgG_UQuGMOCr/exec";

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/'/g, "&#39;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildPopupHtml(cfg, assetsPrefix) {
  const msgs = cfg.messages;
  return `
    <!-- Beta Popup Modal -->
    <div id="betaPopup" hidden role="dialog" aria-modal="true" aria-label="${escapeHtml(cfg.popupTitle)}" style="position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;">
      <div onclick="closeBetaPopup()" style="position:absolute;inset:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(6px);"></div>
      <div style="position:relative;width:92%;max-width:420px;background:linear-gradient(135deg,#0d0a1f 0%,#111033 100%);border:1px solid rgba(1,191,255,0.2);border-radius:24px;padding:2rem 1.5rem;box-shadow:0 24px 80px rgba(0,0,0,0.6);">
        <button type="button" onclick="closeBetaPopup()" aria-label="${escapeHtml(cfg.closeLabel)}" style="position:absolute;top:12px;right:16px;background:none;border:none;color:#9ca3af;font-size:24px;cursor:pointer;line-height:1;">×</button>
        <h3 style="font-family:Poppins,Arial,sans-serif;font-size:1.25rem;font-weight:700;margin-bottom:0.5rem;background:linear-gradient(90deg,#22d3ee,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">${escapeHtml(cfg.popupTitle)}</h3>
        <p style="color:#d1d5db;font-size:0.875rem;margin-bottom:1.25rem;line-height:1.5;">${escapeHtml(cfg.popupDesc)}</p>
        <form onsubmit="handleBetaSignup(event)" style="display:flex;flex-direction:column;gap:0.75rem;">
          <label for="betaEmail" class="sr-only">${escapeHtml(cfg.emailLabel)}</label>
          <input type="email" id="betaEmail" name="email" required autocomplete="email" placeholder="${escapeHtml(cfg.placeholder)}" style="width:100%;padding:12px 16px;border-radius:12px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#fff;font-size:0.875rem;outline:none;" onfocus="this.style.borderColor='rgba(1,191,255,0.5)'" onblur="this.style.borderColor='rgba(255,255,255,0.1)'" />
          <input type="text" name="website" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px;" aria-hidden="true" />
          <button type="submit" style="width:100%;padding:12px;border-radius:12px;font-family:Poppins,Arial,sans-serif;font-weight:700;font-size:0.95rem;color:#fff;border:none;cursor:pointer;background:linear-gradient(135deg,#01bfff 0%,#0066ff 100%);box-shadow:0 4px 16px rgba(1,191,255,0.3);">${escapeHtml(cfg.buttonText)}</button>
        </form>
        <output id="betaStatus" class="hidden text-sm" style="display:block;margin-top:0.75rem;text-align:center;"></output>
      </div>
    </div>
    <script>
      window.ethyriaBetaConfig={endpoint:"${ENDPOINT}",locale:"${cfg.locale}",sourcePage:location.pathname.split("/").pop(),messages:${JSON.stringify(msgs)}};
      function openBetaPopup(){var p=document.getElementById("betaPopup");p.hidden=false;p.querySelector("input[type=email]").focus();}
      function closeBetaPopup(){document.getElementById("betaPopup").hidden=true;}
      document.addEventListener("keydown",function(e){if(e.key==="Escape")closeBetaPopup();});
    </script>
    <script src="${assetsPrefix}assets/beta-signup.js" defer></script>`;
}

function detectLang(filePath) {
  if (filePath.includes(path.sep + "en" + path.sep)) return "en";
  if (filePath.includes(path.sep + "fr" + path.sep)) return "fr";
  if (filePath.includes(path.sep + "es" + path.sep)) return "es";
  if (filePath.includes(path.sep + "ru" + path.sep)) return "ru";
  return "de";
}

function getAssetsPrefix(filePath) {
  const lang = detectLang(filePath);
  return lang === "de" ? "../" : "../../";
}

function processFile(filePath) {
  let html = fs.readFileSync(filePath, "utf8");
  const lang = detectLang(filePath);
  const cfg = localeConfig[lang];
  const assetsPrefix = getAssetsPrefix(filePath);
  let changes = [];

  // 1. Fix Verwandt links spacing: pb-3 → pb-6
  const oldPb =
    /(<div class="flex flex-wrap gap-3 justify-center mt-3 pt-3) pb-3(")/g;
  if (oldPb.test(html)) {
    html = html.replace(oldPb, "$1 pb-6$2");
    changes.push("Verwandt pb-3→pb-6");
  }

  // 2. Replace ALL <a href="...#beta"> with popup buttons (handles multiline)
  const betaLinkRegex = /<a[\s\S]*?href="[^"]*#beta"[\s\S]*?<\/a\s*>/gi;
  const betaMatches = html.match(betaLinkRegex);
  if (betaMatches && betaMatches.length > 0) {
    html = html.replace(betaLinkRegex, (match) => {
      return match
        .replace(/<a([\s\S]*?)>/, (tag, attrs) => {
          const cleaned = attrs.replace(/href="[^"]*#beta"\s*/g, "");
          return (
            '<button type="button" onclick="openBetaPopup()"' + cleaned + ">"
          );
        })
        .replace(/<\/a\s*>/gi, "</button>");
    });
    changes.push(`${betaMatches.length}x #beta link→button popup`);
  }

  // 4. Inject popup modal + scripts before </body> (only if not already present)
  if (!html.includes('id="betaPopup"')) {
    const popupHtml = buildPopupHtml(cfg, assetsPrefix);
    html = html.replace("</body>", popupHtml + "\n</body>");
    changes.push("popup injected");
  }

  if (changes.length > 0) {
    fs.writeFileSync(filePath, html, "utf8");
  }
  return changes;
}

// Collect all symbol detail pages
function getSymbolFiles(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getSymbolFiles(fullPath));
    } else if (entry.name.endsWith(".html") && entry.name !== "index.html") {
      results.push(fullPath);
    }
  }
  return results;
}

const files = getSymbolFiles(symbolsDir);
console.log(`Processing ${files.length} symbol pages...`);

let total = 0;
for (const file of files) {
  const changes = processFile(file);
  if (changes.length > 0) {
    const rel = path.relative(path.join(__dirname, ".."), file);
    console.log(`  ✓ ${rel}: ${changes.join(", ")}`);
    total++;
  }
}

console.log(`\nDone! ${total}/${files.length} files updated.`);
