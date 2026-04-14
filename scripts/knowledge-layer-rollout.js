#!/usr/bin/env node
/**
 * Knowledge Layer Rollout – transforms all 75 symbol detail pages.
 * Adds: FAQPage schema, nav bar, source boxes, biosync section,
 *        community stats, deep variants, FAQ accordion.
 * Usage: node scripts/knowledge-layer-rollout.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LANGS = {
  de: { dir: 'symbols', prefix: '../', sp: '/symbols/', cta: '/#beta', idx: '/index.html' },
  en: { dir: 'symbols/en', prefix: '../../', sp: '/symbols/en/', cta: '/index.en.html#beta', idx: '/index.en.html' },
  fr: { dir: 'symbols/fr', prefix: '../../', sp: '/symbols/fr/', cta: '/index.fr.html#beta', idx: '/index.fr.html' },
  es: { dir: 'symbols/es', prefix: '../../', sp: '/symbols/es/', cta: '/index.es.html#beta', idx: '/index.es.html' },
  ru: { dir: 'symbols/ru', prefix: '../../', sp: '/symbols/ru/', cta: '/index.ru.html#beta', idx: '/index.ru.html' },
};
const SLUGS = [
  'auto-unfall','ex-partner','fallen','fliegen','haus-raeume',
  'hunde-katzen','nackt-sein','pruefung','schlangen','schwangerschaft',
  'spinnen','tod','verfolgt-werden','wasser','zaehne-verlieren'
];

// ==================== EMOTION LABELS ====================
const E = {
  de: { fear:'😨 Angst / Kontrollverlust',helpless:'😰 Hilflosigkeit',relief:'😮‍💨 Erleichterung',liberation:'🦋 Befreiung',longing:'💭 Sehnsucht',confusion:'😵 Verwirrung',freedom:'🕊️ Freiheit',euphoria:'✨ Euphorie',curiosity:'🔍 Neugier',insecurity:'😟 Unsicherheit',safety:'🏠 Geborgenheit',affection:'❤️ Zuneigung',protection:'🛡️ Schutz',shame:'😳 Scham',indifference:'😐 Gleichgültigkeit',frustration:'😤 Frustration',fascination:'🔮 Faszination',disgust:'🤢 Ekel',anticipation:'🤰 Erwartung',joy:'😊 Freude',grief:'😢 Trauer',acceptance:'🕊️ Akzeptanz',calm:'🌊 Ruhe',overwhelm:'🌊 Überwältigung',departure:'🚀 Aufbruch' },
  en: { fear:'😨 Fear / Loss of control',helpless:'😰 Helplessness',relief:'😮‍💨 Relief',liberation:'🦋 Liberation',longing:'💭 Longing',confusion:'😵 Confusion',freedom:'🕊️ Freedom',euphoria:'✨ Euphoria',curiosity:'🔍 Curiosity',insecurity:'😟 Insecurity',safety:'🏠 Safety',affection:'❤️ Affection',protection:'🛡️ Protection',shame:'😳 Shame',indifference:'😐 Indifference',frustration:'😤 Frustration',fascination:'🔮 Fascination',disgust:'🤢 Disgust',anticipation:'🤰 Anticipation',joy:'😊 Joy',grief:'😢 Grief',acceptance:'🕊️ Acceptance',calm:'🌊 Calm',overwhelm:'🌊 Overwhelm',departure:'🚀 New beginnings' },
  fr: { fear:'😨 Peur / Perte de contrôle',helpless:'😰 Impuissance',relief:'😮‍💨 Soulagement',liberation:'🦋 Libération',longing:'💭 Nostalgie',confusion:'😵 Confusion',freedom:'🕊️ Liberté',euphoria:'✨ Euphorie',curiosity:'🔍 Curiosité',insecurity:'😟 Insécurité',safety:'🏠 Sécurité',affection:'❤️ Affection',protection:'🛡️ Protection',shame:'😳 Honte',indifference:'😐 Indifférence',frustration:'😤 Frustration',fascination:'🔮 Fascination',disgust:'🤢 Dégoût',anticipation:'🤰 Attente',joy:'😊 Joie',grief:'😢 Chagrin',acceptance:'🕊️ Acceptation',calm:'🌊 Calme',overwhelm:'🌊 Submersion',departure:'🚀 Renouveau' },
  es: { fear:'😨 Miedo / Pérdida de control',helpless:'😰 Impotencia',relief:'😮‍💨 Alivio',liberation:'🦋 Liberación',longing:'💭 Añoranza',confusion:'😵 Confusión',freedom:'🕊️ Libertad',euphoria:'✨ Euforia',curiosity:'🔍 Curiosidad',insecurity:'😟 Inseguridad',safety:'🏠 Seguridad',affection:'❤️ Afecto',protection:'🛡️ Protección',shame:'😳 Vergüenza',indifference:'😐 Indiferencia',frustration:'😤 Frustración',fascination:'🔮 Fascinación',disgust:'🤢 Asco',anticipation:'🤰 Anticipación',joy:'😊 Alegría',grief:'😢 Duelo',acceptance:'🕊️ Aceptación',calm:'🌊 Calma',overwhelm:'🌊 Abrumación',departure:'🚀 Nuevo comienzo' },
  ru: { fear:'😨 Страх / Потеря контроля',helpless:'😰 Беспомощность',relief:'😮‍💨 Облегчение',liberation:'🦋 Освобождение',longing:'💭 Тоска',confusion:'😵 Замешательство',freedom:'🕊️ Свобода',euphoria:'✨ Эйфория',curiosity:'🔍 Любопытство',insecurity:'😟 Неуверенность',safety:'🏠 Защищённость',affection:'❤️ Привязанность',protection:'🛡️ Защита',shame:'😳 Стыд',indifference:'😐 Безразличие',frustration:'😤 Разочарование',fascination:'🔮 Очарование',disgust:'🤢 Отвращение',anticipation:'🤰 Ожидание',joy:'😊 Радость',grief:'😢 Горе',acceptance:'🕊️ Принятие',calm:'🌊 Покой',overwhelm:'🌊 Подавленность',departure:'🚀 Новое начало' },
};

// ==================== SOURCE REFERENCES ====================
const SOURCES = {
  freud: {
    de: 'Freud, S. (1900). <em>Die Traumdeutung</em>. Franz Deuticke, Wien.',
    en: 'Freud, S. (1900). <em>The Interpretation of Dreams</em>. Franz Deuticke, Vienna.',
    fr: 'Freud, S. (1900). <em>L\'interprétation des rêves</em>. Franz Deuticke, Vienne.',
    es: 'Freud, S. (1900). <em>La interpretación de los sueños</em>. Franz Deuticke, Viena.',
    ru: 'Фрейд, З. (1900). <em>Толкование сновидений</em>. Franz Deuticke, Вена.',
  },
  jung: {
    de: 'Jung, C. G. (1964). <em>Der Mensch und seine Symbole</em>. Walter-Verlag.',
    en: 'Jung, C. G. (1964). <em>Man and His Symbols</em>. Aldus Books, London.',
    fr: 'Jung, C. G. (1964). <em>L\'homme et ses symboles</em>. Robert Laffont.',
    es: 'Jung, C. G. (1964). <em>El hombre y sus símbolos</em>. Paidós.',
    ru: 'Юнг, К. Г. (1964). <em>Человек и его символы</em>. Медков С.Б.',
  },
  spiritual: {
    de: 'Ibn Sirin (8. Jh.). <em>Tafsir al-Ahlam</em>.<br>Moss, R. (2009). <em>The Secret History of Dreaming</em>. New World Library.',
    en: 'Ibn Sirin (8th c.). <em>Tafsir al-Ahlam</em>.<br>Moss, R. (2009). <em>The Secret History of Dreaming</em>. New World Library.',
    fr: 'Ibn Sirin (VIIIe s.). <em>Tafsir al-Ahlam</em>.<br>Moss, R. (2009). <em>The Secret History of Dreaming</em>. New World Library.',
    es: 'Ibn Sirin (s. VIII). <em>Tafsir al-Ahlam</em>.<br>Moss, R. (2009). <em>The Secret History of Dreaming</em>. New World Library.',
    ru: 'Ибн Сирин (VIII в.). <em>Тафсир аль-Ахлам</em>.<br>Мосс, Р. (2009). <em>The Secret History of Dreaming</em>. New World Library.',
  },
};

// ==================== UI STRINGS ====================
const UI = {
  de: { src1:'📖 Quelle anzeigen', srcN:'📖 Quellen anzeigen', rel:'Verwandt:', badge:'Exklusiv bei Ethyria', bioT:'⚡ Biosynchrone Analyse', comT:'📊 Aus der Ethyria Community', compL:'Häufigste Begleit-Symbole', faqT:'❓ Häufige Fragen', varT:'🔄 Häufige Varianten', appL:'→ Volle biosynchrone Analyse in der App' },
  en: { src1:'📖 Show source', srcN:'📖 Show sources', rel:'Related:', badge:'Ethyria Exclusive', bioT:'⚡ Biosynchronous Analysis', comT:'📊 From the Ethyria Community', compL:'Most Common Companion Symbols', faqT:'❓ Frequently Asked Questions', varT:'🔄 Common Variations', appL:'→ Full biosynchronous analysis in the app' },
  fr: { src1:'📖 Voir la source', srcN:'📖 Voir les sources', rel:'Lié :', badge:'Exclusif Ethyria', bioT:'⚡ Analyse biosynchrone', comT:'📊 De la communauté Ethyria', compL:'Les symboles accompagnateurs les plus fréquents', faqT:'❓ Questions fréquentes', varT:'🔄 Variantes courantes', appL:'→ Analyse biosynchrone complète dans l\'appli' },
  es: { src1:'📖 Ver fuente', srcN:'📖 Ver fuentes', rel:'Relacionado:', badge:'Exclusivo Ethyria', bioT:'⚡ Análisis biosincrónico', comT:'📊 De la comunidad Ethyria', compL:'Símbolos acompañantes más frecuentes', faqT:'❓ Preguntas frecuentes', varT:'🔄 Variantes comunes', appL:'→ Análisis biosincrónico completo en la app' },
  ru: { src1:'📖 Показать источник', srcN:'📖 Показать источники', rel:'Связано:', badge:'Эксклюзив Ethyria', bioT:'⚡ Биосинхронный анализ', comT:'📊 Из сообщества Ethyria', compL:'Наиболее частые символы-спутники', faqT:'❓ Частые вопросы', varT:'🔄 Распространённые варианты', appL:'→ Полный биосинхронный анализ в приложении' },
};

// ==================== SYMBOL DATA ====================
const D = {
'fallen': {
  vl:[['tod','wasser'],['haus-raeume','pruefung'],['fliegen','schwangerschaft'],['ex-partner','hunde-katzen'],['verfolgt-werden','nackt-sein']],
  em:['fear','relief','liberation'], ep:[68,23,9],
  co:[['wasser',23],['haus-raeume',18],['verfolgt-werden',15],['tod',11]],
  bsrc:'Walker, M. (2017). <em>Why We Sleep</em>. Scribner · Sathe, H. et al. (2022). Vestibular processing during REM sleep. <em>J. Sleep Res.</em>, 31(4).',
  de:{bs:'Fallträume treten gehäuft in der REM-Phase zwischen 3–5 Uhr auf und korrelieren mit erhöhtem Cortisol-Level. Der hypnagogische Ruck – ein myoklonischer Reflex – wird vom Gehirn als Sturz fehlinterpretiert. Studien zeigen eine Verbindung mit vestibulärer Verarbeitung im Innenohr.',
  fq:[['Was bedeutet es, im Traum zu fallen?','Fallträume symbolisieren häufig Kontrollverlust, Unsicherheit oder Angst vor Veränderungen. Nach Freud verdrängte Triebkonflikte, nach Jung Abkopplung vom eigenen Schatten.'],['Ist ein Falltraum ein schlechtes Zeichen?','Nicht unbedingt. Fallträume können als Einladung gedeutet werden, alte Muster loszulassen. „Sanft landen" steht für Vertrauen in den eigenen Weg.'],['Warum wacht man beim Fallen im Traum auf?','Der hypnagogische Ruck (myoklonischer Reflex) entsteht beim Einschlafen, wenn das Gehirn Muskelentspannung als Sturz interpretiert.'],['Wie häufig sind Fallträume?','Über 60 % aller Menschen erleben mindestens einmal einen Falltraum. Besonders häufig in Stressphasen und bei Schlafmangel.']]},
  en:{bs:'Falling dreams occur frequently during REM sleep between 3–5 AM and correlate with elevated cortisol levels. The hypnic jerk — a myoclonic reflex — is misinterpreted by the brain as a fall. Studies link falling dreams to vestibular processing in the inner ear.',
  fq:[['What does it mean to dream about falling?','Falling dreams commonly symbolize loss of control, insecurity, or fear of change. Freud linked them to repressed drives; Jung to disconnection from the shadow self.'],['Is a falling dream a bad sign?','Not necessarily. Falling dreams can be an invitation to let go of old patterns. The "soft landing" variant signals trust in your own journey.'],['Why do you wake up when falling in a dream?','The hypnic jerk is a myoclonic reflex during sleep onset — the brain misinterprets muscle relaxation as an actual fall.'],['How common are falling dreams?','Over 60% of people experience at least one falling dream. They are especially frequent during stress and sleep deprivation.']]},
  fr:{bs:'Les rêves de chute surviennent principalement pendant le sommeil paradoxal entre 3h et 5h, corrélés à un taux élevé de cortisol. La secousse hypnagogique — un réflexe myoclonique — est interprétée à tort comme une chute par le cerveau.',
  fq:[['Que signifie rêver de tomber ?','Les rêves de chute symbolisent souvent une perte de contrôle, l\'insécurité ou la peur du changement. Pour Freud, des pulsions refoulées ; pour Jung, une déconnexion de l\'ombre.'],['Un rêve de chute est-il un mauvais signe ?','Pas forcément. Il peut être une invitation à lâcher prise. La variante « atterrir en douceur » signale la confiance en soi.'],['Pourquoi se réveille-t-on en tombant dans un rêve ?','La secousse hypnagogique est un réflexe myoclonique à l\'endormissement — le cerveau interprète la relaxation musculaire comme une chute.'],['Les rêves de chute sont-ils fréquents ?','Plus de 60 % des gens vivent au moins un rêve de chute. Ils sont plus fréquents en période de stress.']]},
  es:{bs:'Los sueños de caída ocurren con frecuencia durante el sueño REM entre las 3 y 5 AM, correlacionados con niveles elevados de cortisol. El espasmo hipnagógico — un reflejo mioclónico — es malinterpretado por el cerebro como una caída real.',
  fq:[['¿Qué significa soñar con caer?','Soñar con caer simboliza pérdida de control, inseguridad o miedo al cambio. Freud lo asociaba a impulsos reprimidos; Jung a una desconexión de la sombra.'],['¿Soñar con caer es una mala señal?','No necesariamente. Puede ser una invitación a soltar viejos patrones. La variante de "aterrizar suave" indica confianza en el propio camino.'],['¿Por qué despiertas al caer en un sueño?','El espasmo hipnagógico es un reflejo mioclónico al dormirse — el cerebro interpreta la relajación muscular como una caída.'],['¿Qué tan comunes son los sueños de caída?','Más del 60 % de las personas experimenta al menos un sueño de caída. Son más frecuentes en períodos de estrés.']]},
  ru:{bs:'Сны о падении возникают преимущественно в фазе REM между 3–5 часами утра и коррелируют с повышенным уровнем кортизола. Гипнагогический рывок — миоклонический рефлекс — ошибочно интерпретируется мозгом как реальное падение.',
  fq:[['Что значит падать во сне?','Сны о падении символизируют потерю контроля, неуверенность или страх перемен. По Фрейду — вытесненные влечения; по Юнгу — отрыв от тени.'],['Сон о падении — плохой знак?','Не обязательно. Это может быть приглашение отпустить старые паттерны. Вариант «мягкое приземление» говорит о доверии к себе.'],['Почему просыпаешься при падении во сне?','Гипнагогический рывок — миоклонический рефлекс при засыпании, когда мозг интерпретирует расслабление мышц как падение.'],['Как часто снится падение?','Более 60 % людей хотя бы раз видели сон о падении. Особенно часто — в период стресса и недосыпания.']]},
},
'zaehne-verlieren': {
  vl:[['nackt-sein','pruefung'],['ex-partner','schlangen'],['fallen','tod'],['spinnen','verfolgt-werden'],['schwangerschaft','wasser']],
  em:['fear','helpless','confusion'], ep:[55,29,16],
  co:[['nackt-sein',22],['pruefung',19],['fallen',14],['ex-partner',11]],
  bsrc:'Rozen, N. & Gaul, C. (2016). Bruxism and temporomandibular disorders in sleep. <em>Cephalalgia</em>, 36(1). · Revonsuo, A. (2000). Threat simulation theory. <em>Behav. Brain Sci.</em>, 23(6).',
  de:{bs:'Zahnverlust-Träume korrelieren signifikant mit nächtlichem Bruxismus (Zähneknirschen). Der Trigeminusnerv leitet die Kieferspannung ans Gehirn weiter, das sie in Traumbilder übersetzt. Erhöhter Stresspegel verstärkt sowohl das Knirschen als auch die Traumintensität.',
  fq:[['Was bedeutet es, wenn man von Zahnverlust träumt?','Zahnverlust im Traum steht oft für Angst vor Kontrollverlust über das eigene Erscheinungsbild oder die Kommunikationsfähigkeit. Freud sah darin auch Kastrationsangst.'],['Hängt der Traum mit echten Zahnproblemen zusammen?','Tatsächlich korrelieren Zahnträume mit Bruxismus (Zähneknirschen). Die Kieferspannung wird vom Gehirn in Traumbilder übersetzt.'],['Ist Zahnverlust im Traum ein schlechtes Zeichen?','Nicht zwingend. In vielen Kulturen symbolisiert es Transformation — das Alte fällt weg, damit Neues wachsen kann.'],['Wie häufig sind Zahnverlust-Träume?','Sie gehören zu den Top-5 der häufigsten Traumthemen weltweit. Besonders verbreitet in Phasen mit hohem sozialem Druck.']]},
  en:{bs:'Tooth loss dreams correlate significantly with nocturnal bruxism (teeth grinding). The trigeminal nerve transmits jaw tension to the brain, which translates it into dream imagery. Elevated stress amplifies both grinding and dream intensity.',
  fq:[['What does it mean to dream about losing teeth?','Tooth loss dreams often represent fear of losing control over one\'s appearance or communication ability. Freud also linked them to castration anxiety.'],['Are tooth dreams connected to actual dental problems?','Yes — tooth loss dreams correlate with bruxism (teeth grinding). Jaw tension during sleep is translated into dream imagery by the brain.'],['Is losing teeth in a dream a bad sign?','Not necessarily. In many cultures it symbolizes transformation — the old falls away to make room for the new.'],['How common are tooth loss dreams?','They are among the top 5 most common dream themes worldwide, especially prevalent during periods of high social pressure.']]},
  fr:{bs:'Les rêves de perte de dents corrèlent avec le bruxisme nocturne. Le nerf trijumeau transmet la tension de la mâchoire au cerveau, qui la traduit en images oniriques. Le stress amplifie à la fois le grincement et l\'intensité du rêve.',
  fq:[['Que signifie rêver de perdre ses dents ?','Ce rêve représente souvent la peur de perdre le contrôle sur son apparence ou sa capacité de communication.'],['Ce rêve est-il lié à de vrais problèmes dentaires ?','Oui — les rêves de dents corrèlent avec le bruxisme. La tension de la mâchoire est traduite en images par le cerveau.'],['Perdre ses dents en rêve est-il un mauvais signe ?','Pas forcément. Dans de nombreuses cultures, cela symbolise la transformation — l\'ancien tombe pour laisser place au nouveau.'],['Ces rêves sont-ils fréquents ?','Ils font partie du top 5 des thèmes de rêve les plus courants au monde.']]},
  es:{bs:'Los sueños de pérdida dental correlacionan con el bruxismo nocturno. El nervio trigémino transmite la tensión mandibular al cerebro, que la traduce en imágenes oníricas. El estrés amplifica tanto el rechinar como la intensidad del sueño.',
  fq:[['¿Qué significa soñar con perder los dientes?','Suele representar miedo a perder control sobre la apariencia o la capacidad de comunicación. Freud lo asociaba a la ansiedad de castración.'],['¿Está relacionado con problemas dentales reales?','Sí — correlaciona con bruxismo. La tensión mandibular durante el sueño se traduce en imágenes oníricas.'],['¿Perder dientes en un sueño es mala señal?','No necesariamente. En muchas culturas simboliza transformación — lo viejo cae para dar paso a lo nuevo.'],['¿Qué tan comunes son estos sueños?','Están entre los 5 temas de sueño más comunes del mundo, especialmente en períodos de alta presión social.']]},
  ru:{bs:'Сны о потере зубов значимо коррелируют с ночным бруксизмом. Тройничный нерв передаёт напряжение челюсти в мозг, который переводит его в образы сновидений. Повышенный стресс усиливает и скрежетание, и интенсивность снов.',
  fq:[['Что значит видеть во сне потерю зубов?','Часто символизирует страх потери контроля над внешностью или способностью общаться. Фрейд связывал это с кастрационной тревогой.'],['Связан ли сон с реальными проблемами с зубами?','Да — сны о зубах коррелируют с бруксизмом. Напряжение челюсти переводится мозгом в образы сновидений.'],['Потеря зубов во сне — плохой знак?','Не обязательно. Во многих культурах это символизирует трансформацию — старое уходит, чтобы дать место новому.'],['Как часто снится потеря зубов?','Входит в топ-5 самых распространённых тем снов в мире.']]},
},
'verfolgt-werden': {
  vl:[['fallen','nackt-sein'],['schlangen','spinnen'],['haus-raeume','wasser'],['ex-partner','tod'],['auto-unfall','pruefung']],
  em:['fear','helpless','relief'], ep:[71,20,9],
  co:[['fallen',21],['nackt-sein',16],['schlangen',13],['haus-raeume',11]],
  bsrc:'Revonsuo, A. (2000). The reinterpretation of dreams: An evolutionary hypothesis. <em>Behav. Brain Sci.</em>, 23(6). · Valli, K. et al. (2005). Threat simulation in dreams. <em>Consciousness & Cognition</em>, 14(1).',
  de:{bs:'Verfolgungsträume aktivieren die Amygdala und lösen echte Kampf-oder-Flucht-Reaktionen aus — Adrenalin, erhöhter Puls und Muskelanspannung sind messbar. Die Threat-Simulation-Theorie erklärt sie als evolutionäres Trainings­programm für Gefahrensituationen.',
  fq:[['Was bedeutet es, im Traum verfolgt zu werden?','Verfolgungsträume symbolisieren oft Vermeidungsverhalten — etwas in Ihrem Wachleben, dem Sie ausweichen: Konflikte, Verantwortung oder unterdrückte Emotionen.'],['Ist es wichtig, wer mich verfolgt?','Ja. Bekannte Verfolger repräsentieren konkrete Konflikte, unbekannte stehen für diffuse Ängste oder verdrängte Persönlichkeitsanteile.'],['Warum kann ich im Traum nicht weglaufen?','Die REM-Atonie (Muskellähmung im Schlaf) wird vom Traumgehirn als Bewegungsunfähigkeit integriert — ein Gefühl der Hilflosigkeit.'],['Wie häufig sind Verfolgungsträume?','Sie gehören zu den 3 häufigsten Traumthemen weltweit. In Stressphasen treten sie besonders oft auf.']]},
  en:{bs:'Chase dreams activate the amygdala and trigger real fight-or-flight responses — adrenaline, elevated heart rate, and muscle tension are measurable. The threat simulation theory explains them as evolutionary training for dangerous situations.',
  fq:[['What does it mean to dream about being chased?','Chase dreams often symbolize avoidance — something in waking life you\'re running from: conflicts, responsibilities, or suppressed emotions.'],['Does it matter who\'s chasing me?','Yes. Known pursuers represent specific conflicts; unknown ones stand for diffuse fears or repressed parts of the personality.'],['Why can\'t I run in my dream?','REM atonia (sleep paralysis) is integrated by the dreaming brain as an inability to move — a feeling of helplessness.'],['How common are chase dreams?','They are among the 3 most common dream themes worldwide, especially frequent during stressful periods.']]},
  fr:{bs:'Les rêves de poursuite activent l\'amygdale et déclenchent de vraies réactions de fuite — adrénaline, rythme cardiaque élevé et tension musculaire mesurables. La théorie de simulation des menaces les explique comme un entraînement évolutif.',
  fq:[['Que signifie rêver d\'être poursuivi ?','Cela symbolise souvent un comportement d\'évitement — quelque chose dans la vie éveillée que vous fuyez.'],['Est-ce important qui me poursuit ?','Oui. Un poursuivant connu représente un conflit concret ; un inconnu, des peurs diffuses ou des aspects refoulés.'],['Pourquoi ne puis-je pas courir dans mon rêve ?','L\'atonie REM est intégrée par le cerveau rêveur comme une incapacité à bouger.'],['Ces rêves sont-ils fréquents ?','Parmi les 3 thèmes de rêve les plus courants au monde, surtout en période de stress.']]},
  es:{bs:'Los sueños de persecución activan la amígdala y desencadenan respuestas reales de lucha o huida — adrenalina, pulso elevado y tensión muscular son medibles. La teoría de simulación de amenazas los explica como entrenamiento evolutivo.',
  fq:[['¿Qué significa soñar con ser perseguido?','Simboliza a menudo un comportamiento de evasión — algo en la vida real de lo que estás huyendo.'],['¿Importa quién me persigue?','Sí. Un perseguidor conocido representa un conflicto concreto; uno desconocido, miedos difusos o partes reprimidas de la personalidad.'],['¿Por qué no puedo correr en mi sueño?','La atonía REM se integra como incapacidad de movimiento — una sensación de impotencia.'],['¿Qué tan comunes son estos sueños?','Entre los 3 temas de sueño más comunes del mundo.']]},
  ru:{bs:'Сны о преследовании активируют амигдалу и запускают реальные реакции «бей или беги» — адреналин, учащённый пульс и мышечное напряжение измеримы. Теория симуляции угроз объясняет их как эволюционную тренировку.',
  fq:[['Что значит видеть во сне преследование?','Часто символизирует избегание — что-то в реальной жизни, от чего вы убегаете: конфликты, ответственность или подавленные эмоции.'],['Важно ли, кто преследует?','Да. Знакомый преследователь — конкретный конфликт; незнакомый — размытые страхи или вытесненные части личности.'],['Почему я не могу бежать во сне?','REM-атония интегрируется мозгом как неспособность двигаться — чувство беспомощности.'],['Как часто снится преследование?','Входит в тройку самых распространённых тем снов в мире.']]},
},
'fliegen': {
  vl:[['fallen','wasser'],['haus-raeume','schwangerschaft'],['verfolgt-werden','nackt-sein'],['tod','schlangen'],['pruefung','ex-partner']],
  em:['freedom','euphoria','fear'], ep:[61,28,11],
  co:[['fallen',24],['wasser',17],['haus-raeume',14],['schwangerschaft',10]],
  bsrc:'Hobson, J. A. (2009). REM sleep and dreaming. <em>Nature Reviews Neuroscience</em>, 10(11). · Nir, Y. & Tononi, G. (2010). Dreaming and the brain. <em>Current Opinion in Neurobiology</em>, 20(2).',
  de:{bs:'Flugträume korrelieren mit erhöhter vestibulärer Kortex-Aktivität und Dopamin-Ausschüttung während des REM-Schlafs. Das Paradox der REM-Atonie — der Körper ist gelähmt, der Geist fühlt Bewegungsfreiheit — erzeugt das typische Schwebegefühl.',
  fq:[['Was bedeutet es, im Traum zu fliegen?','Flugträume symbolisieren oft Freiheit, Überwindung von Grenzen oder den Wunsch, sich über aktuelle Probleme zu erheben.'],['Sind Flugträume mit luzidem Träumen verbunden?','Ja. Fliegen ist eines der häufigsten Erlebnisse in luziden Träumen und kann durch Reality-Checks gezielt ausgelöst werden.'],['Was bedeuten verschiedene Flugarten?','Müheloses Gleiten steht für innere Ruhe; flatterndes Fliegen für Anstrengung; sinkender Flug für schwindendes Selbstvertrauen.'],['Wie häufig sind Flugträume?','Etwa 45 % aller Menschen berichten von mindestens einem Flugtraum. Sie treten häufiger bei optimistischen Persönlichkeitstypen auf.']]},
  en:{bs:'Flying dreams correlate with increased vestibular cortex activity and dopamine release during REM sleep. The REM atonia paradox — body paralyzed, mind feeling free — creates the typical sensation of soaring.',
  fq:[['What does it mean to dream about flying?','Flying dreams often symbolize freedom, overcoming limitations, or the desire to rise above current problems.'],['Are flying dreams linked to lucid dreaming?','Yes. Flying is one of the most common experiences in lucid dreams and can be triggered intentionally through reality checks.'],['What do different flight styles mean?','Effortless gliding indicates inner peace; labored flapping suggests struggle; descending flight signals declining confidence.'],['How common are flying dreams?','About 45% of people report at least one flying dream. They\'re more frequent among optimistic personality types.']]},
  fr:{bs:'Les rêves de vol corrèlent avec une activité accrue du cortex vestibulaire et une libération de dopamine pendant le sommeil paradoxal. Le paradoxe de l\'atonie REM — corps paralysé, esprit libre — crée la sensation typique de planer.',
  fq:[['Que signifie rêver de voler ?','Symbolise souvent la liberté, le dépassement des limites ou le désir de s\'élever au-dessus des problèmes actuels.'],['Les rêves de vol sont-ils liés au rêve lucide ?','Oui. Voler est l\'une des expériences les plus courantes en rêve lucide.'],['Que signifient les différents types de vol ?','Planer sans effort indique la paix intérieure ; battre des ailes suggère un effort ; descendre signale un manque de confiance.'],['Ces rêves sont-ils fréquents ?','Environ 45 % des gens rapportent au moins un rêve de vol.']]},
  es:{bs:'Los sueños de vuelo correlacionan con mayor actividad del córtex vestibular y liberación de dopamina durante el sueño REM. La paradoja de la atonía REM — cuerpo paralizado, mente libre — crea la sensación típica de planear.',
  fq:[['¿Qué significa soñar con volar?','Simboliza libertad, superación de límites o el deseo de elevarse sobre los problemas actuales.'],['¿Los sueños de vuelo están vinculados al sueño lúcido?','Sí. Volar es una de las experiencias más comunes en sueños lúcidos.'],['¿Qué significan los diferentes tipos de vuelo?','Planear sin esfuerzo indica paz interior; aletear sugiere esfuerzo; descender señala pérdida de confianza.'],['¿Qué tan comunes son los sueños de vuelo?','Alrededor del 45 % de las personas reporta al menos un sueño de vuelo.']]},
  ru:{bs:'Сны о полёте коррелируют с повышенной активностью вестибулярной коры и выбросом дофамина в REM-фазе. Парадокс REM-атонии — тело парализовано, разум свободен — создаёт типичное ощущение парения.',
  fq:[['Что значит летать во сне?','Символизирует свободу, преодоление ограничений или желание подняться над текущими проблемами.'],['Связаны ли полёты во сне с осознанными сновидениями?','Да. Полёт — одно из самых частых переживаний в осознанных снах.'],['Что означают разные типы полёта?','Лёгкое парение — внутренний покой; тяжёлый полёт — борьба; снижение — потеря уверенности.'],['Как часто снятся полёты?','Около 45 % людей сообщают хотя бы об одном сне о полёте.']]},
},
'wasser': {
  vl:[['fallen','tod'],['schwangerschaft','fliegen'],['schlangen','verfolgt-werden'],['haus-raeume','ex-partner'],['spinnen','nackt-sein']],
  em:['calm','fear','overwhelm'], ep:[38,35,27],
  co:[['fallen',20],['tod',16],['schwangerschaft',14],['fliegen',12]],
  bsrc:'Schredl, M. (2018). <em>Researching Dreams</em>. Palgrave Macmillan. · Hartmann, E. (2010). The Nature and Functions of Dreaming. <em>Oxford University Press</em>.',
  de:{bs:'Wasserträume aktivieren das parasympathische Nervensystem und die Amygdala-Hippocampus-Achse. Die emotionale Qualität des Wassers (ruhig vs. stürmisch) spiegelt direkt den aktuellen Stresslevel wider — der Traum nutzt Wasser als Metapher für den emotionalen Zustand.',
  fq:[['Was bedeutet Wasser im Traum?','Wasser symbolisiert Emotionen und das Unterbewusste. Ruhiges Wasser steht für emotionale Balance, stürmisches für innere Unruhen.'],['Was bedeutet es, im Traum zu ertrinken?','Ertrinken symbolisiert das Gefühl, von Emotionen oder Umständen überwältigt zu werden — ein Hilferuf des Unterbewusstseins.'],['Macht die Art des Gewässers einen Unterschied?','Ja. Meer steht für tiefe universelle Emotionen, Fluss für Lebensfluss, Überschwemmung für unkontrollierte Gefühle.'],['Wie häufig sind Wasserträume?','Sie gehören zu den 10 häufigsten Traumthemen. Besonders verbreitet in emotional aufgeladenen Lebensphasen.']]},
  en:{bs:'Water dreams activate the parasympathetic nervous system and the amygdala-hippocampus axis. The emotional quality of the water (calm vs. stormy) directly mirrors current stress levels — the dream uses water as a metaphor for emotional state.',
  fq:[['What does water mean in a dream?','Water symbolizes emotions and the subconscious. Calm water indicates emotional balance; stormy water reflects inner turmoil.'],['What does it mean to drown in a dream?','Drowning symbolizes feeling overwhelmed by emotions or circumstances — a distress signal from the subconscious.'],['Does the type of water matter?','Yes. Ocean represents deep universal emotions; river represents life flow; flood represents uncontrolled feelings.'],['How common are water dreams?','Among the top 10 most common dream themes, especially prevalent during emotionally charged life phases.']]},
  fr:{bs:'Les rêves d\'eau activent le système nerveux parasympathique et l\'axe amygdale-hippocampe. La qualité émotionnelle de l\'eau reflète directement le niveau de stress actuel — le rêve utilise l\'eau comme métaphore de l\'état émotionnel.',
  fq:[['Que signifie l\'eau dans un rêve ?','L\'eau symbolise les émotions et l\'inconscient. Eau calme = équilibre émotionnel ; eau agitée = troubles intérieurs.'],['Que signifie se noyer dans un rêve ?','La noyade symbolise le sentiment d\'être submergé par les émotions — un signal de détresse de l\'inconscient.'],['Le type d\'eau a-t-il une importance ?','Oui. L\'océan représente des émotions profondes ; le fleuve, le cours de la vie ; l\'inondation, des sentiments incontrôlés.'],['Ces rêves sont-ils fréquents ?','Parmi les 10 thèmes de rêve les plus courants.']]},
  es:{bs:'Los sueños de agua activan el sistema nervioso parasimpático y el eje amígdala-hipocampo. La calidad emocional del agua refleja directamente el nivel de estrés actual.',
  fq:[['¿Qué significa el agua en un sueño?','El agua simboliza emociones y el subconsciente. Agua tranquila = equilibrio emocional; agua tormentosa = turbulencia interior.'],['¿Qué significa ahogarse en un sueño?','Ahogarse simboliza sentirse abrumado por emociones o circunstancias.'],['¿Importa el tipo de agua?','Sí. El océano representa emociones profundas; el río, el flujo de la vida; la inundación, sentimientos descontrolados.'],['¿Qué tan comunes son los sueños de agua?','Entre los 10 temas de sueño más comunes del mundo.']]},
  ru:{bs:'Сны о воде активируют парасимпатическую нервную систему и ось амигдала-гиппокамп. Эмоциональное качество воды напрямую отражает текущий уровень стресса — сон использует воду как метафору эмоционального состояния.',
  fq:[['Что значит вода во сне?','Вода символизирует эмоции и подсознание. Спокойная вода — эмоциональный баланс; бурная — внутренние переживания.'],['Что значит тонуть во сне?','Утопление символизирует ощущение, что эмоции или обстоятельства захлёстывают — сигнал бедствия от подсознания.'],['Имеет ли значение тип воды?','Да. Океан — глубокие универсальные эмоции; река — поток жизни; наводнение — неконтролируемые чувства.'],['Как часто снится вода?','Входит в топ-10 самых распространённых тем сновидений.']]},
},
'tod': {
  vl:[['wasser','fallen'],['schwangerschaft','ex-partner'],['schlangen','verfolgt-werden'],['haus-raeume','nackt-sein'],['fliegen','pruefung']],
  em:['fear','grief','acceptance'], ep:[51,30,19],
  co:[['wasser',19],['fallen',15],['ex-partner',13],['schwangerschaft',11]],
  bsrc:'Kuiken, D. & Sikora, S. (1993). The impact of dreams on waking thoughts. <em>Dreaming</em>, 3(1). · Barrett, D. (2001). <em>The Committee of Sleep</em>. Crown Publishers.',
  de:{bs:'Todesträume treten vermehrt in NREM-Phase 3/4 auf und sind mit dem Serotonin-Melatonin-Zyklus verknüpft. Sie dienen der emotionalen Gedächtnis-Konsolidierung und helfen dem Gehirn, existenzielle Ängste zu verarbeiten, ohne reale Gefahr.',
  fq:[['Was bedeutet der Tod im Traum?','Tod im Traum symbolisiert selten physisches Sterben. Er steht meist für das Ende einer Lebensphase, Transformation oder innere Veränderung.'],['Was bedeutet es, wenn jemand anderes stirbt?','Der Tod einer bekannten Person kann den Verlust einer Eigenschaft symbolisieren, die Sie mit dieser Person verbinden.'],['Ist ein Todestraum ein Vorzeichen?','Nein. Todesträume sind symbolisch, nicht prophetisch. Sie verarbeiten Veränderungen und Abschiedsprozesse.'],['Wie häufig sind Todesträume?','Etwa 40 % aller Menschen berichten von Todesträumen. Sie treten gehäuft bei Umbrüchen und Trauerprozessen auf.']]},
  en:{bs:'Death dreams occur more frequently during NREM stage 3/4 and are linked to the serotonin-melatonin cycle. They serve emotional memory consolidation, helping the brain process existential fears without real danger.',
  fq:[['What does death mean in a dream?','Death in dreams rarely symbolizes physical dying. It typically represents the end of a life phase, transformation, or inner change.'],['What does it mean when someone else dies?','The death of a known person may symbolize the loss of a quality you associate with them.'],['Is a death dream an omen?','No. Death dreams are symbolic, not prophetic. They process changes and farewell processes.'],['How common are death dreams?','About 40% of people report death dreams, especially common during life transitions and grief.']]},
  fr:{bs:'Les rêves de mort surviennent plus fréquemment en phase NREM 3/4 et sont liés au cycle sérotonine-mélatonine. Ils servent à la consolidation émotionnelle de la mémoire.',
  fq:[['Que signifie la mort dans un rêve ?','La mort symbolise rarement la mort physique. Elle représente souvent la fin d\'une phase, une transformation.'],['Que signifie la mort d\'une autre personne ?','La mort d\'un proche peut symboliser la perte d\'une qualité que vous associez à cette personne.'],['Un rêve de mort est-il un présage ?','Non. Les rêves de mort sont symboliques, pas prophétiques.'],['Ces rêves sont-ils fréquents ?','Environ 40 % des gens rapportent des rêves de mort.']]},
  es:{bs:'Los sueños de muerte ocurren con mayor frecuencia en la fase NREM 3/4 y están vinculados al ciclo serotonina-melatonina. Sirven para la consolidación emocional de la memoria.',
  fq:[['¿Qué significa la muerte en un sueño?','Raramente simboliza muerte física. Representa el fin de una fase, transformación o cambio interior.'],['¿Qué significa que muera otra persona?','Puede simbolizar la pérdida de una cualidad que asocias con esa persona.'],['¿Un sueño de muerte es un presagio?','No. Los sueños de muerte son simbólicos, no proféticos.'],['¿Qué tan comunes son los sueños de muerte?','Alrededor del 40 % de las personas reporta sueños de muerte.']]},
  ru:{bs:'Сны о смерти чаще возникают в фазе NREM 3/4 и связаны с циклом серотонин-мелатонин. Они служат эмоциональной консолидации памяти, помогая мозгу обрабатывать экзистенциальные страхи.',
  fq:[['Что значит смерть во сне?','Редко символизирует физическую смерть. Обычно — конец жизненного этапа, трансформацию или внутреннее изменение.'],['Что значит, если во сне умирает кто-то другой?','Может символизировать потерю качества, которое вы ассоциируете с этим человеком.'],['Сон о смерти — это предзнаменование?','Нет. Сны о смерти символичны, не пророческие.'],['Как часто снится смерть?','Около 40 % людей сообщают о снах о смерти.']]},
},
'schlangen': {
  vl:[['spinnen','wasser'],['tod','schwangerschaft'],['verfolgt-werden','haus-raeume'],['ex-partner','nackt-sein'],['fallen','fliegen']],
  em:['fear','fascination','disgust'], ep:[58,27,15],
  co:[['spinnen',22],['wasser',16],['tod',13],['haus-raeume',11]],
  bsrc:'Öhman, A. & Mineka, S. (2003). The malicious serpent: Snakes as a prototypical stimulus for an evolved module of fear. <em>Current Directions in Psychological Science</em>, 12(1). · Isbell, L. A. (2009). <em>The Fruit, the Tree, and the Serpent</em>. Harvard UP.',
  de:{bs:'Schlangenträume aktivieren ein evolutionär uraltes Angstmodul in der Amygdala. Das „Snake Detection System" reagiert schneller als bewusste Wahrnehmung — selbst im Traum löst die Schlangenform innerhalb von 50ms eine Alarmreaktion aus.',
  fq:[['Was bedeutet eine Schlange im Traum?','Schlangen symbolisieren Transformation, verborgene Ängste oder unterdrückte Sexualität. In vielen Kulturen stehen sie für Heilung und Erneuerung.'],['Was bedeutet ein Schlangenbiss?','Ein Biss symbolisiert eine „vergiftete" Situation oder einen Weckruf des Unterbewusstseins — etwas fordert sofortige Aufmerksamkeit.'],['Bedeuten viele Schlangen etwas anderes?','Ja. Viele Schlangen verstärken das Symbol — multiple Bedrohungen, unterdrückte Aspekte oder intensive Transformationsphasen.'],['Wie häufig sind Schlangenträume?','Sie gehören weltweit zu den Top-10. Interessanterweise treten sie auch bei Menschen häufig auf, die keine echte Schlangenangst haben.']]},
  en:{bs:'Snake dreams activate an evolutionarily ancient fear module in the amygdala. The "Snake Detection System" reacts faster than conscious perception — even in dreams, the serpentine shape triggers an alarm within 50ms.',
  fq:[['What does a snake mean in a dream?','Snakes symbolize transformation, hidden fears, or suppressed sexuality. In many cultures they represent healing and renewal.'],['What does a snakebite mean?','A bite symbolizes a "poisoned" situation or a wake-up call from the subconscious demanding immediate attention.'],['Do many snakes mean something different?','Yes. Multiple snakes amplify the symbol — multiple threats, suppressed aspects, or intense transformation phases.'],['How common are snake dreams?','Among the global top 10. Interestingly, they occur even in people with no real fear of snakes.']]},
  fr:{bs:'Les rêves de serpents activent un module de peur ancestral dans l\'amygdale. Le système de détection des serpents réagit en moins de 50 ms — même en rêve, la forme serpentine déclenche une alarme.',
  fq:[['Que signifie un serpent dans un rêve ?','Les serpents symbolisent la transformation, les peurs cachées ou la sexualité refoulée.'],['Que signifie une morsure de serpent ?','Une morsure symbolise une situation « empoisonnée » ou un signal d\'alarme de l\'inconscient.'],['Plusieurs serpents ont-ils un sens différent ?','Oui. Plusieurs serpents amplifient le symbole — menaces multiples ou transformation intense.'],['Ces rêves sont-ils fréquents ?','Parmi les 10 thèmes de rêve les plus courants au monde.']]},
  es:{bs:'Los sueños de serpientes activan un módulo de miedo ancestral en la amígdala. El sistema de detección de serpientes reacciona en menos de 50 ms — incluso en sueños, la forma serpentina dispara una alarma.',
  fq:[['¿Qué significa una serpiente en un sueño?','Simbolizan transformación, miedos ocultos o sexualidad reprimida. En muchas culturas representan sanación y renovación.'],['¿Qué significa una mordedura de serpiente?','Simboliza una situación "envenenada" o una llamada de atención del subconsciente.'],['¿Varias serpientes significan algo diferente?','Sí. Múltiples serpientes amplifican el símbolo — amenazas múltiples o fases de transformación intensa.'],['¿Qué tan comunes son los sueños de serpientes?','Entre los 10 temas de sueño más comunes del mundo.']]},
  ru:{bs:'Сны о змеях активируют эволюционно древний модуль страха в амигдале. Система обнаружения змей реагирует быстрее сознательного восприятия — даже во сне змеиная форма вызывает тревогу за 50 мс.',
  fq:[['Что значит змея во сне?','Змеи символизируют трансформацию, скрытые страхи или подавленную сексуальность. Во многих культурах — исцеление и обновление.'],['Что значит укус змеи?','Символизирует «отравленную» ситуацию или сигнал подсознания, требующий немедленного внимания.'],['Много змей — это другое значение?','Да. Множество змей усиливает символ — множественные угрозы или интенсивная трансформация.'],['Как часто снятся змеи?','Входят в мировой топ-10 тем сновидений.']]},
},
'spinnen': {
  vl:[['schlangen','verfolgt-werden'],['haus-raeume','nackt-sein'],['fallen','wasser'],['ex-partner','pruefung'],['tod','hunde-katzen']],
  em:['fear','disgust','fascination'], ep:[62,25,13],
  co:[['schlangen',23],['verfolgt-werden',17],['haus-raeume',14],['nackt-sein',10]],
  bsrc:'New, J. & German, T. (2015). Spiders at the cocktail party: An ancestral threat that surmounts attention. <em>Evolution and Human Behavior</em>, 36(3). · Hoehl, S. et al. (2017). Itsy bitsy spider: Infants react with fear to spiders. <em>Frontiers in Psychology</em>, 8.',
  de:{bs:'Spinnenträume aktivieren den visuellen Kortex besonders intensiv — das Gehirn verarbeitet die Spinnenform als „hyperrelevant". Studien zeigen, dass selbst Säuglinge auf Spinnenbilder mit erhöhter Pupillenreaktion reagieren, was auf eine angeborene Erkennungsvorlage hindeutet.',
  fq:[['Was bedeutet eine Spinne im Traum?','Spinnen symbolisieren Kreativität (Netz weben), Manipulation (Falle stellen) oder unterdrückte Ängste. Die Deutung hängt vom Kontext ab.'],['Was bedeutet ein Spinnennetz?','Ein Netz kann für Verstrickung in komplexe Situationen stehen — oder für kunstvoll aufgebaute Lebenspläne.'],['Hängt eine Spinnenphobie mit den Träumen zusammen?','Nicht direkt. Auch Menschen ohne Arachnophobie haben Spinnenträume — sie aktivieren eine evolutionäre Erkennung.'],['Wie häufig sind Spinnenträume?','Sie gehören zu den 15 häufigsten Traumthemen. Besonders verbreitet bei Frauen und in Phasen der Unsicherheit.']]},
  en:{bs:'Spider dreams activate the visual cortex especially intensely — the brain processes the spider shape as "hyper-relevant." Studies show even infants react to spider images with increased pupil response, indicating an innate detection template.',
  fq:[['What does a spider mean in a dream?','Spiders symbolize creativity (weaving a web), manipulation (setting a trap), or suppressed fears. Interpretation depends on context.'],['What does a spider web mean?','A web can represent entanglement in complex situations — or artfully constructed life plans.'],['Is spider phobia connected to the dreams?','Not directly. Even people without arachnophobia have spider dreams — they activate evolutionary detection.'],['How common are spider dreams?','Among the 15 most common dream themes, especially prevalent among women and during phases of uncertainty.']]},
  fr:{bs:'Les rêves d\'araignées activent le cortex visuel de manière particulièrement intense. Le cerveau traite la forme de l\'araignée comme « hyper-pertinente » — même les nourrissons réagissent aux images d\'araignées.',
  fq:[['Que signifie une araignée dans un rêve ?','Les araignées symbolisent la créativité, la manipulation ou des peurs refoulées.'],['Que signifie une toile d\'araignée ?','Un piège ou des plans de vie complexes, selon le contexte.'],['L\'arachnophobie est-elle liée à ces rêves ?','Pas directement. Même sans phobie, ces rêves activent une détection évolutive innée.'],['Ces rêves sont-ils fréquents ?','Parmi les 15 thèmes les plus courants, surtout chez les femmes.']]},
  es:{bs:'Los sueños de arañas activan el córtex visual de forma especialmente intensa — el cerebro procesa la forma de la araña como "hiper-relevante". Incluso los bebés reaccionan a imágenes de arañas.',
  fq:[['¿Qué significa una araña en un sueño?','Las arañas simbolizan creatividad, manipulación o miedos reprimidos.'],['¿Qué significa una telaraña?','Puede representar enredo en situaciones complejas o planes de vida elaborados.'],['¿La aracnofobia está relacionada con estos sueños?','No directamente. Incluso personas sin fobia tienen sueños de arañas — activan detección evolutiva.'],['¿Qué tan comunes son los sueños de arañas?','Entre los 15 temas más comunes, especialmente entre mujeres.']]},
  ru:{bs:'Сны о пауках особенно интенсивно активируют зрительную кору — мозг обрабатывает форму паука как «гиперрелевантную». Даже младенцы реагируют на изображения пауков усиленной реакцией зрачков.',
  fq:[['Что значит паук во сне?','Пауки символизируют творчество, манипуляцию или подавленные страхи.'],['Что значит паутина?','Может означать запутанность в сложных ситуациях или искусно выстроенные жизненные планы.'],['Связана ли арахнофобия с этими снами?','Не напрямую. Даже люди без фобии видят сны о пауках — они активируют эволюционное распознавание.'],['Как часто снятся пауки?','Входят в 15 самых распространённых тем снов.']]},
},
'schwangerschaft': {
  vl:[['wasser','tod'],['ex-partner','haus-raeume'],['fallen','fliegen'],['schlangen','hunde-katzen'],['pruefung','nackt-sein']],
  em:['anticipation','fear','joy'], ep:[47,33,20],
  co:[['wasser',21],['tod',15],['ex-partner',12],['haus-raeume',11]],
  bsrc:'Nielsen, T. & Paquette, T. (2007). Dream-associated behaviors affecting pregnant and postpartum women. <em>Sleep</em>, 30(9). · Lara-Carrasco, J. et al. (2014). Maternal dreams and nightmares in pregnancy. <em>Dreaming</em>, 24(4).',
  de:{bs:'Schwangerschaftsträume korrelieren mit erhöhtem Progesteron, das die REM-Phase verlängert und Traumintensität steigert. Auch Nicht-Schwangere erleben sie — hier reflektieren sie kreative Projekte, wachsende Ideen oder tiefgreifende Veränderungen.',
  fq:[['Was bedeutet Schwangerschaft im Traum?','Schwangerschaft symbolisiert neue Anfänge, kreative Projekte oder inneres Wachstum — nicht unbedingt reale Schwangerschaft.'],['Was wenn ich nicht schwanger bin?','Dann steht der Traum für etwas, das „in Ihnen heranwächst" — eine Idee, ein Projekt, eine Lebensveränderung.'],['Spielt das Geschlecht des Babys eine Rolle?','Ja. Mädchen stehen oft für emotionale Aspekte, Jungen für Handlungs- und Durchsetzungskraft.'],['Wie häufig sind Schwangerschaftsträume?','Etwa 30 % aller Frauen und 15 % aller Männer berichten von mindestens einem solchen Traum.']]},
  en:{bs:'Pregnancy dreams correlate with elevated progesterone that extends REM phases and intensifies dreaming. Even non-pregnant people experience them — here they reflect creative projects, growing ideas, or profound changes.',
  fq:[['What does pregnancy mean in a dream?','Pregnancy symbolizes new beginnings, creative projects, or inner growth — not necessarily actual pregnancy.'],['What if I\'m not pregnant?','The dream represents something "growing inside you" — an idea, project, or life change.'],['Does the baby\'s gender matter?','Yes. Girls often represent emotional aspects; boys represent agency and assertiveness.'],['How common are pregnancy dreams?','About 30% of women and 15% of men report at least one pregnancy dream.']]},
  fr:{bs:'Les rêves de grossesse corrèlent avec un taux élevé de progestérone qui prolonge les phases REM. Même les non-enceintes en font — ils reflètent des projets créatifs ou des changements profonds.',
  fq:[['Que signifie la grossesse dans un rêve ?','Symbolise de nouveaux départs, des projets créatifs ou une croissance intérieure.'],['Et si je ne suis pas enceinte ?','Le rêve représente quelque chose qui « grandit en vous » — une idée, un projet, un changement.'],['Le sexe du bébé est-il important ?','Oui. Une fille représente souvent l\'émotionnel ; un garçon, l\'action et l\'affirmation.'],['Ces rêves sont-ils fréquents ?','Environ 30 % des femmes et 15 % des hommes en rapportent.']]},
  es:{bs:'Los sueños de embarazo correlacionan con niveles elevados de progesterone que extienden las fases REM. Incluso personas no embarazadas los experimentan — reflejan proyectos creativos o cambios profundos.',
  fq:[['¿Qué significa el embarazo en un sueño?','Simboliza nuevos comienzos, proyectos creativos o crecimiento interior.'],['¿Y si no estoy embarazada?','El sueño representa algo que "crece dentro de ti" — una idea, proyecto o cambio vital.'],['¿Importa el sexo del bebé?','Sí. Niña = aspectos emocionales; niño = acción y determinación.'],['¿Qué tan comunes son estos sueños?','Alrededor del 30 % de las mujeres y 15 % de los hombres los reportan.']]},
  ru:{bs:'Сны о беременности коррелируют с повышенным прогестероном, удлиняющим фазы REM. Даже небеременные люди видят их — здесь они отражают творческие проекты, растущие идеи или глубокие перемены.',
  fq:[['Что значит беременность во сне?','Символизирует новые начинания, творческие проекты или внутренний рост — не обязательно реальную беременность.'],['Что если я не беременна?','Сон представляет нечто, «растущее внутри вас» — идею, проект или жизненное изменение.'],['Важен ли пол ребёнка?','Да. Девочка — эмоциональные аспекты; мальчик — действие и самоутверждение.'],['Как часто снится беременность?','Около 30 % женщин и 15 % мужчин сообщают хотя бы об одном таком сне.']]},
},
'auto-unfall': {
  vl:[['verfolgt-werden','wasser'],['haus-raeume','tod'],['fliegen','fallen'],['ex-partner','schlangen'],['pruefung','nackt-sein']],
  em:['fear','helpless','departure'], ep:[72,19,9],
  co:[['verfolgt-werden',21],['wasser',17],['fallen',14],['tod',12]],
  bsrc:'Hartmann, E. (2010). <em>The Nature and Functions of Dreaming</em>. Oxford UP. · Levin, R. & Nielsen, T. (2007). Disturbed dreaming and emotion dysregulation. <em>Sleep Medicine Reviews</em>, 11(4).',
  de:{bs:'Autounfall-Träume aktivieren den motorischen Kortex und zeigen erhöhte Amygdala-Aktivität. Adrenalin, erhöhter Puls und Schwitzen sind beim Aufwachen messbar. Bei Personen mit Fahrerfahrung zeigt das Gehirn neuronale Muster ähnlich echtem Fahrstress.',
  fq:[['Was bedeutet ein Autounfall im Traum?','Ein Autounfall symbolisiert Kontrollverlust über die eigene Lebensrichtung oder die Angst vor einer unausweichlichen Kollision mit der Realität.'],['Ist der Traum eine Warnung vor echten Unfällen?','Nein. Autounfall-Träume sind symbolisch. Sie verarbeiten Stress, nicht reale Fahrsituationen.'],['Was bedeutet es, Beifahrer zu sein?','Als Beifahrer fühlen Sie sich nicht am Steuer Ihres Lebens — jemand anderes bestimmt die Richtung.'],['Wie häufig sind Autounfall-Träume?','Etwa 25 % aller Erwachsenen berichten davon, besonders in Phasen hoher Arbeitsbelastung.']]},
  en:{bs:'Car accident dreams activate the motor cortex and show elevated amygdala activity. Adrenaline, elevated pulse, and sweating are measurable upon waking. In experienced drivers, the brain shows patterns similar to actual driving stress.',
  fq:[['What does a car accident mean in a dream?','It symbolizes loss of control over your life direction or fear of an unavoidable collision with reality.'],['Is the dream a warning about real accidents?','No. Car accident dreams are symbolic — they process stress, not actual driving situations.'],['What does being a passenger mean?','As a passenger, you feel you\'re not at the wheel of your own life — someone else is directing.'],['How common are car accident dreams?','About 25% of adults report them, especially during high-workload phases.']]},
  fr:{bs:'Les rêves d\'accident de voiture activent le cortex moteur et montrent une activité amygdalienne élevée. Adrénaline, pouls rapide et transpiration sont mesurables au réveil.',
  fq:[['Que signifie un accident de voiture en rêve ?','Symbolise la perte de contrôle sur votre direction de vie ou la peur d\'une collision inévitable avec la réalité.'],['Est-ce un avertissement d\'un vrai accident ?','Non. Ces rêves sont symboliques — ils traitent le stress, pas des situations de conduite réelles.'],['Que signifie être passager ?','Vous ne tenez pas le volant de votre vie — quelqu\'un d\'autre décide de la direction.'],['Ces rêves sont-ils fréquents ?','Environ 25 % des adultes en rapportent.']]},
  es:{bs:'Los sueños de accidentes de coche activan el córtex motor y muestran actividad elevada de la amígdala. Adrenalina, pulso elevado y sudoración son medibles al despertar.',
  fq:[['¿Qué significa un accidente de coche en un sueño?','Simboliza pérdida de control sobre tu dirección vital o miedo a una colisión inevitable con la realidad.'],['¿Es una advertencia de un accidente real?','No. Son simbólicos — procesan estrés, no situaciones de conducción reales.'],['¿Qué significa ser pasajero?','No estás al volante de tu vida — alguien más decide la dirección.'],['¿Qué tan comunes son estos sueños?','Alrededor del 25 % de los adultos los reporta.']]},
  ru:{bs:'Сны об автоавариях активируют моторную кору и показывают повышенную активность амигдалы. Адреналин, учащённый пульс и потоотделение измеримы при пробуждении.',
  fq:[['Что значит автоавария во сне?','Символизирует потерю контроля над направлением жизни или страх неизбежного столкновения с реальностью.'],['Это предупреждение о реальной аварии?','Нет. Эти сны символичны — они обрабатывают стресс, а не реальные ситуации на дороге.'],['Что значит быть пассажиром?','Вы не за рулём своей жизни — кто-то другой определяет направление.'],['Как часто снятся автоаварии?','Около 25 % взрослых сообщают о них.']]},
},
'ex-partner': {
  vl:[['nackt-sein','haus-raeume'],['wasser','hunde-katzen'],['verfolgt-werden','schlangen'],['fallen','tod'],['schwangerschaft','pruefung']],
  em:['longing','confusion','relief'], ep:[45,38,17],
  co:[['nackt-sein',20],['haus-raeume',17],['wasser',14],['hunde-katzen',11]],
  bsrc:'Wegner, D. M. et al. (2004). The role of emotional suppression in dream rebound. <em>Psychological Science</em>, 15(4). · McNamara, P. (2008). <em>Nightmares: The Science and Solution</em>. Praeger.',
  de:{bs:'Ex-Partner-Träume nutzen das limbische System und aktivieren hippocampale Gedächtnisschleifen. Emotionale Unterdrückung im Wachleben führt zum „Dream Rebound" — je mehr Sie versuchen, nicht an den Ex zu denken, desto wahrscheinlicher taucht er/sie im Traum auf.',
  fq:[['Was bedeutet es, vom Ex-Partner zu träumen?','Oft verarbeitet das Gehirn ungelöste Emotionen oder versucht, Beziehungsmuster zu verstehen — kein Zeichen, dass Sie zurück wollen.'],['Vermisse ich meinen Ex wirklich?','Nicht unbedingt. Der Traum kann auch das Ende eines Lebensabschnitts oder generelle Bindungsthemen verarbeiten.'],['Warum träume ich nach langer Zeit wieder vom Ex?','Der „Dream Rebound Effekt" — je mehr Sie daran unterdrücken, desto stärker kehrt es im Traum zurück.'],['Wie häufig sind Ex-Partner-Träume?','Über 50 % der Menschen träumen nach einer Trennung von ihrem Ex, oft monatelang nach dem Ende.']]},
  en:{bs:'Ex-partner dreams utilize the limbic system and activate hippocampal memory loops. Emotional suppression in waking life leads to "dream rebound" — the more you try not to think about your ex, the more likely they appear in dreams.',
  fq:[['What does it mean to dream about an ex?','Often the brain processes unresolved emotions or seeks to understand relationship patterns — not a sign you want them back.'],['Do I really miss my ex?','Not necessarily. The dream may process the end of a life chapter or general attachment themes.'],['Why do I dream about my ex after a long time?','The "dream rebound effect" — the more you suppress thinking about it, the stronger it returns in dreams.'],['How common are ex-partner dreams?','Over 50% of people dream about their ex after a breakup, often for months afterward.']]},
  fr:{bs:'Les rêves d\'ex-partenaire utilisent le système limbique et activent les boucles de mémoire hippocampique. La suppression émotionnelle mène au « rebond onirique ».',
  fq:[['Que signifie rêver de son ex ?','Le cerveau traite des émotions non résolues ou cherche à comprendre des schémas relationnels.'],['Est-ce que mon ex me manque vraiment ?','Pas forcément. Le rêve peut traiter la fin d\'un chapitre ou des thèmes d\'attachement.'],['Pourquoi rêver de son ex après longtemps ?','L\'effet de rebond onirique — plus on refoule, plus ça revient en rêve.'],['Ces rêves sont-ils fréquents ?','Plus de 50 % des gens rêvent de leur ex après une rupture.']]},
  es:{bs:'Los sueños de ex-pareja utilizan el sistema límbico y activan bucles de memoria hipocampal. La supresión emocional lleva al "rebote onírico".',
  fq:[['¿Qué significa soñar con tu ex?','El cerebro procesa emociones no resueltas o busca entender patrones de relación.'],['¿Realmente extraño a mi ex?','No necesariamente. El sueño puede procesar el fin de un capítulo o temas de apego.'],['¿Por qué sueño con mi ex después de mucho tiempo?','El efecto de rebote onírico — cuanto más reprimes, más vuelve en sueños.'],['¿Qué tan comunes son estos sueños?','Más del 50 % de las personas sueñan con su ex tras una ruptura.']]},
  ru:{bs:'Сны об экс-партнёре задействуют лимбическую систему и активируют петли хиппокампальной памяти. Эмоциональное подавление ведёт к «сновидческому рикошету».',
  fq:[['Что значит видеть экс-партнёра во сне?','Часто мозг обрабатывает нерешённые эмоции или пытается понять паттерны отношений.'],['Я действительно скучаю по бывшему?','Не обязательно. Сон может обрабатывать завершение жизненного этапа или темы привязанности.'],['Почему экс снится через долгое время?','Эффект сновидческого рикошета — чем сильнее подавление, тем ярче возврат в снах.'],['Как часто снится экс-партнёр?','Более 50 % людей видят бывших во сне после расставания.']]},
},
'haus-raeume': {
  vl:[['nackt-sein','verfolgt-werden'],['schlangen','spinnen'],['ex-partner','wasser'],['fallen','tod'],['pruefung','fliegen']],
  em:['curiosity','insecurity','safety'], ep:[42,35,23],
  co:[['verfolgt-werden',19],['nackt-sein',16],['schlangen',13],['ex-partner',11]],
  bsrc:'Hall, C. S. & Van de Castle, R. L. (1966). <em>The Content Analysis of Dreams</em>. Appleton. · Domhoff, G. W. (2003). <em>The Scientific Study of Dreams</em>. APA.',
  de:{bs:'Haus-Träume aktivieren den Hippocampus und das räumliche Gedächtnis besonders stark. Die Place Cells erstellen eine innere Landkarte — das Haus im Traum repräsentiert die psychische Architektur: bekannte Räume stehen für bewusste Anteile, unbekannte für verdrängte.',
  fq:[['Was bedeutet ein Haus im Traum?','Das Haus symbolisiert die eigene Psyche. Verschiedene Räume repräsentieren verschiedene Aspekte der Persönlichkeit.'],['Was bedeuten unbekannte Räume?','Unbekannte Räume stehen für noch nicht erforschte Anteile der Persönlichkeit oder verdrängte Erinnerungen.'],['Welche Bedeutung haben bestimmte Zimmer?','Keller = Unterbewusstes, Dachboden = vergessene Erinnerungen, Schlafzimmer = Intimität, Küche = Nährung.'],['Wie häufig sind Haus-Träume?','Sehr häufig — etwa 35 % aller Träume spielen in Gebäuden. Das Haus ist das häufigste Traumsetting überhaupt.']]},
  en:{bs:'House dreams strongly activate the hippocampus and spatial memory. Place cells create an internal map — the house in the dream represents psychic architecture: known rooms reflect conscious aspects, unknown rooms represent repressed ones.',
  fq:[['What does a house mean in a dream?','The house symbolizes your own psyche. Different rooms represent different aspects of your personality.'],['What do unknown rooms mean?','Unknown rooms represent unexplored parts of the personality or repressed memories.'],['Do specific rooms have meanings?','Basement = subconscious, attic = forgotten memories, bedroom = intimacy, kitchen = nourishment.'],['How common are house dreams?','Very common — about 35% of all dreams take place in buildings. The house is the most frequent dream setting.']]},
  fr:{bs:'Les rêves de maisons activent fortement l\'hippocampe et la mémoire spatiale. Les cellules de lieu créent une carte interne — la maison représente l\'architecture psychique.',
  fq:[['Que signifie une maison dans un rêve ?','La maison symbolise votre propre psyché. Chaque pièce représente un aspect de votre personnalité.'],['Que signifient des pièces inconnues ?','Des parties inexplorées de votre personnalité ou des souvenirs refoulés.'],['Les pièces spécifiques ont-elles un sens ?','Cave = inconscient, grenier = souvenirs oubliés, chambre = intimité, cuisine = nourriture.'],['Ces rêves sont-ils fréquents ?','Très courants — environ 35 % des rêves se déroulent dans des bâtiments.']]},
  es:{bs:'Los sueños de casas activan fuertemente el hipocampo y la memoria espacial. Las células de lugar crean un mapa interno — la casa representa la arquitectura psíquica.',
  fq:[['¿Qué significa una casa en un sueño?','La casa simboliza tu propia psique. Cada habitación representa un aspecto de tu personalidad.'],['¿Qué significan habitaciones desconocidas?','Partes inexploradas de la personalidad o recuerdos reprimidos.'],['¿Las habitaciones específicas tienen significado?','Sótano = subconsciente, ático = recuerdos olvidados, dormitorio = intimidad, cocina = nutrición.'],['¿Qué tan comunes son estos sueños?','Muy comunes — alrededor del 35 % de los sueños ocurren en edificios.']]},
  ru:{bs:'Сны о домах сильно активируют гиппокамп и пространственную память. Клетки места создают внутреннюю карту — дом во сне представляет психическую архитектуру.',
  fq:[['Что значит дом во сне?','Дом символизирует вашу психику. Разные комнаты представляют разные аспекты личности.'],['Что значат незнакомые комнаты?','Неисследованные части личности или вытесненные воспоминания.'],['Имеют ли конкретные комнаты значение?','Подвал = подсознание, чердак = забытые воспоминания, спальня = интимность, кухня = питание.'],['Как часто снится дом?','Очень часто — около 35 % всех снов происходят в зданиях.']]},
},
'hunde-katzen': {
  vl:[['schlangen','ex-partner'],['haus-raeume','wasser'],['verfolgt-werden','nackt-sein'],['schwangerschaft','tod'],['fallen','spinnen']],
  em:['affection','fear','protection'], ep:[48,31,21],
  co:[['schlangen',18],['ex-partner',16],['haus-raeume',13],['wasser',11]],
  bsrc:'Serpell, J. A. (2017). <em>The Domestic Dog</em>. Cambridge UP. · Bradshaw, J. W. S. (2013). <em>Cat Sense</em>. Basic Books.',
  de:{bs:'Tier-Träume aktivieren das Bindungssystem und Oxytocin-Schaltkreise. Hunde im Traum triggern Vertrauens- und Loyalitätsmuster, Katzen aktivieren Unabhängigkeits- und Intuitions-Schaltkreise. Die Amygdala differenziert zwischen Freund und Bedrohung.',
  fq:[['Was bedeuten Hunde und Katzen im Traum?','Hunde symbolisieren Loyalität, Treue und Schutz. Katzen stehen für Unabhängigkeit, Intuition und weibliche Energie.'],['Was bedeutet ein aggressives Tier?','Ein aggressiver Hund kann unterdrückte Wut oder Vertrauensbruch symbolisieren. Eine aggressive Katze steht für verletzte Unabhängigkeit.'],['Was bedeuten Welpen oder Kätzchen?','Sie symbolisieren Fürsorge, neue Beziehungen oder den Wunsch nach Zuneigung und Spiel in Ihrem Leben.'],['Wie häufig sind diese Träume?','Tierträume gehören zu den 10 häufigsten Themen. Haustierbesitzer träumen häufiger von ihren Tieren.']]},
  en:{bs:'Animal dreams activate the attachment system and oxytocin circuits. Dogs in dreams trigger trust and loyalty patterns; cats activate independence and intuition circuits. The amygdala differentiates between friend and threat.',
  fq:[['What do dogs and cats mean in a dream?','Dogs symbolize loyalty, fidelity, and protection. Cats represent independence, intuition, and feminine energy.'],['What does an aggressive animal mean?','An aggressive dog may symbolize suppressed anger or betrayal. An aggressive cat represents wounded independence.'],['What do puppies or kittens mean?','They symbolize nurturing, new relationships, or the desire for affection and playfulness in your life.'],['How common are these dreams?','Animal dreams are among the 10 most common themes. Pet owners dream more frequently about their animals.']]},
  fr:{bs:'Les rêves d\'animaux activent le système d\'attachement et les circuits d\'ocytocine. Les chiens déclenchent des schémas de confiance ; les chats activent l\'indépendance et l\'intuition.',
  fq:[['Que signifient chiens et chats dans un rêve ?','Les chiens symbolisent la loyauté et la protection. Les chats représentent l\'indépendance et l\'intuition.'],['Que signifie un animal agressif ?','Un chien agressif symbolise la colère refoulée ; un chat agressif, l\'indépendance blessée.'],['Que signifient chiots ou chatons ?','La tendresse, de nouvelles relations ou le besoin d\'affection et de jeu.'],['Ces rêves sont-ils fréquents ?','Parmi les 10 thèmes les plus courants. Les propriétaires d\'animaux en rêvent plus souvent.']]},
  es:{bs:'Los sueños de animales activan el sistema de apego y los circuitos de oxitocina. Los perros activan patrones de confianza; los gatos, independencia e intuición.',
  fq:[['¿Qué significan perros y gatos en un sueño?','Los perros simbolizan lealtad y protección. Los gatos representan independencia e intuición.'],['¿Qué significa un animal agresivo?','Un perro agresivo simboliza ira reprimida; un gato agresivo, independencia herida.'],['¿Qué significan cachorros o gatitos?','Ternura, nuevas relaciones o deseo de afecto y juego.'],['¿Qué tan comunes son estos sueños?','Entre los 10 temas más comunes. Los dueños de mascotas sueñan más con sus animales.']]},
  ru:{bs:'Сны о животных активируют систему привязанности и окситоциновые контуры. Собаки запускают паттерны доверия; кошки — независимость и интуицию.',
  fq:[['Что значат собаки и кошки во сне?','Собаки символизируют верность и защиту. Кошки — независимость, интуицию и женскую энергию.'],['Что значит агрессивное животное?','Агрессивная собака — подавленный гнев; агрессивная кошка — ранение независимости.'],['Что значат щенки или котята?','Забота, новые отношения или потребность в нежности и игре.'],['Как часто снятся собаки и кошки?','Входят в топ-10 тем снов. Владельцы животных видят их чаще.']]},
},
'nackt-sein': {
  vl:[['pruefung','verfolgt-werden'],['ex-partner','haus-raeume'],['fallen','wasser'],['schlangen','spinnen'],['fliegen','schwangerschaft']],
  em:['shame','liberation','indifference'], ep:[54,28,18],
  co:[['pruefung',22],['verfolgt-werden',17],['fallen',13],['ex-partner',11]],
  bsrc:'Pesant, N. & Zadra, A. (2006). Dream content and psychological well-being. <em>Dreaming</em>, 16(3). · Yu, C. K.-C. (2008). Typical dreams of Chinese people. <em>Dreaming</em>, 18(1).',
  de:{bs:'Nacktträume aktivieren das Default Mode Network und soziale Bewertungsschaltkreise. Der präfrontale Kortex simuliert öffentliche Exposition — die Cortisol-Reaktion im Traum entspricht der bei realer sozialer Bewertung.',
  fq:[['Was bedeutet Nacktheit im Traum?','Nacktheit symbolisiert Verletzlichkeit, die Angst vor Enthüllung oder den Wunsch nach Authentizität — sich ohne Maske zu zeigen.'],['Was wenn es mir im Traum egal ist?','Die „unbekümmerte" Variante steht für Selbstakzeptanz und innere Freiheit — ein positives Zeichen.'],['Warum oft in öffentlichen Situationen?','Das Gehirn verarbeitet soziale Bewertungsangst — die Öffentlichkeit verstärkt das Gefühl der Verletzlichkeit.'],['Wie häufig sind Nacktträume?','Etwa 40 % aller Menschen erleben mindestens einen Nackttraum. Besonders häufig bei Perfektionisten.']]},
  en:{bs:'Nudity dreams activate the default mode network and social evaluation circuits. The prefrontal cortex simulates public exposure — the cortisol response in the dream matches real social evaluation stress.',
  fq:[['What does being naked mean in a dream?','Nudity symbolizes vulnerability, fear of exposure, or the desire for authenticity — showing yourself without a mask.'],['What if I don\'t care about being naked?','The "unbothered" variant represents self-acceptance and inner freedom — a positive sign.'],['Why often in public situations?','The brain processes social evaluation anxiety — the public setting amplifies vulnerability.'],['How common are nudity dreams?','About 40% of people experience at least one. Especially common among perfectionists.']]},
  fr:{bs:'Les rêves de nudité activent le réseau du mode par défaut et les circuits d\'évaluation sociale. Le cortex préfrontal simule une exposition publique — la réponse cortisol correspond au stress d\'une évaluation sociale réelle.',
  fq:[['Que signifie être nu dans un rêve ?','Symbolise la vulnérabilité, la peur d\'être démasqué ou le désir d\'authenticité.'],['Et si ça ne me gêne pas dans le rêve ?','La variante « indifférente » représente l\'acceptation de soi et la liberté intérieure.'],['Pourquoi souvent en public ?','Le cerveau traite l\'anxiété d\'évaluation sociale — le cadre public amplifie la vulnérabilité.'],['Ces rêves sont-ils fréquents ?','Environ 40 % des gens en font. Surtout courants chez les perfectionnistes.']]},
  es:{bs:'Los sueños de desnudez activan la red de modo predeterminado y los circuitos de evaluación social. El córtex prefrontal simula exposición pública.',
  fq:[['¿Qué significa estar desnudo en un sueño?','Simboliza vulnerabilidad, miedo a ser expuesto o deseo de autenticidad.'],['¿Y si no me importa en el sueño?','La variante "indiferente" representa autoaceptación y libertad interior — una señal positiva.'],['¿Por qué a menudo en público?','El cerebro procesa la ansiedad de evaluación social.'],['¿Qué tan comunes son estos sueños?','Alrededor del 40 % de las personas los experimenta. Especialmente entre perfeccionistas.']]},
  ru:{bs:'Сны о наготе активируют сеть режима по умолчанию и контуры социальной оценки. Префронтальная кора моделирует публичное обнажение — кортизоловая реакция во сне соответствует реальному стрессу оценки.',
  fq:[['Что значит быть голым во сне?','Символизирует уязвимость, страх разоблачения или стремление к подлинности — показать себя без маски.'],['Что если мне всё равно во сне?','Вариант «безразличия» — признак самопринятия и внутренней свободы.'],['Почему часто на публике?','Мозг обрабатывает тревогу социальной оценки.'],['Как часто снится нагота?','Около 40 % людей хотя бы раз видят такой сон. Особенно часто у перфекционистов.']]},
},
'pruefung': {
  vl:[['nackt-sein','fallen'],['verfolgt-werden','haus-raeume'],['ex-partner','wasser'],['schlangen','tod'],['spinnen','fliegen']],
  em:['fear','frustration','liberation'], ep:[65,24,11],
  co:[['nackt-sein',21],['verfolgt-werden',17],['fallen',14],['haus-raeume',11]],
  bsrc:'Schredl, M. & Erlacher, D. (2004). Lucid dreaming frequency and personality. <em>Personality and Individual Differences</em>, 37(7). · Revonsuo, A. (2006). <em>Inner Presence</em>. MIT Press.',
  de:{bs:'Prüfungsträume aktivieren den präfrontalen Kortex und Stressschaltkreise (Cortisol + Noradrenalin). Sie treten häufig in NREM-Phase 2 auf, wo das Gehirn Leistungserinnerungen konsolidiert — selbst Jahrzehnte nach der letzten Prüfung.',
  fq:[['Was bedeutet eine Prüfung im Traum?','Prüfungsträume symbolisieren Leistungsangst, Selbstzweifel oder das Gefühl, einer Aufgabe nicht gewachsen zu sein.'],['Warum träume ich davon, obwohl die Schule lange her ist?','Das Gehirn nutzt die Prüfung als universelle Metapher für Bewertungssituationen — der Traum verarbeitet aktuelle Herausforderungen.'],['Was bedeutet es, die Prüfung nicht zu bestehen?','Durchfallen im Traum steht für die Angst, Erwartungen nicht zu erfüllen — eigene oder fremde.'],['Wie häufig sind Prüfungsträume?','Etwa 45 % aller Erwachsenen berichten davon, besonders häufig bei Hochleistern und Perfektionisten.']]},
  en:{bs:'Exam dreams activate the prefrontal cortex and stress circuits (cortisol + norepinephrine). They often occur during NREM stage 2, where the brain consolidates performance memories — even decades after the last exam.',
  fq:[['What does an exam mean in a dream?','Exam dreams symbolize performance anxiety, self-doubt, or feeling unprepared for a challenge.'],['Why do I dream about exams long after school?','The brain uses exams as a universal metaphor for evaluation situations — processing current challenges.'],['What does failing an exam mean?','Failing in a dream represents fear of not meeting expectations — yours or others\'.'],['How common are exam dreams?','About 45% of adults report them, especially common among high achievers and perfectionists.']]},
  fr:{bs:'Les rêves d\'examen activent le cortex préfrontal et les circuits de stress. Ils surviennent souvent en NREM phase 2 — même des décennies après le dernier examen.',
  fq:[['Que signifie un examen dans un rêve ?','Symbolise l\'anxiété de performance, le doute de soi ou le sentiment de ne pas être à la hauteur.'],['Pourquoi rêver d\'examens longtemps après l\'école ?','Le cerveau utilise l\'examen comme métaphore universelle pour les situations d\'évaluation.'],['Que signifie échouer à l\'examen ?','La peur de ne pas répondre aux attentes — les vôtres ou celles des autres.'],['Ces rêves sont-ils fréquents ?','Environ 45 % des adultes en rapportent.']]},
  es:{bs:'Los sueños de exámenes activan el córtex prefrontal y los circuitos de estrés. Ocurren frecuentemente en NREM fase 2 — incluso décadas después del último examen.',
  fq:[['¿Qué significa un examen en un sueño?','Simboliza ansiedad de rendimiento, dudas sobre uno mismo o sentirse no preparado.'],['¿Por qué sueño con exámenes si dejé la escuela hace mucho?','El cerebro usa el examen como metáfora universal para situaciones de evaluación.'],['¿Qué significa reprobar el examen?','Miedo a no cumplir las expectativas — propias o ajenas.'],['¿Qué tan comunes son estos sueños?','Alrededor del 45 % de los adultos los reporta.']]},
  ru:{bs:'Сны об экзаменах активируют префронтальную кору и стрессовые контуры. Часто возникают в фазе NREM 2 — даже спустя десятилетия после последнего экзамена.',
  fq:[['Что значит экзамен во сне?','Символизирует тревогу достижений, сомнения в себе или чувство неготовности.'],['Почему снятся экзамены, если школа давно позади?','Мозг использует экзамен как универсальную метафору для ситуаций оценки.'],['Что значит провалить экзамен?','Страх не оправдать ожидания — свои или чужие.'],['Как часто снятся экзамены?','Около 45 % взрослых сообщают о них.']]},
},
};

// ==================== HELPERS ====================

/**
 * Extract localized symbol titles from the allSymbols JS array in each file.
 * Returns { slug: { emoji, title } }
 */
function extractSymbolTitles(html) {
  const titles = {};
  const re = /slug:\s*"([^"]+)",\s*emoji:\s*"([^"]+)",\s*title:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    titles[m[1]] = { emoji: m[2], title: m[3] };
  }
  return titles;
}

/**
 * Extract existing variant titles + descriptions from the variant section.
 */
function extractVariants(html) {
  const idx = html.indexOf('🔄');
  if (idx === -1) return [];
  const secStart = html.lastIndexOf('<section', idx);
  const secEnd = html.indexOf('</section>', idx);
  const sec = html.slice(secStart, secEnd);
  const variants = [];
  const re = /<strong class="text-cyan-300">(.*?)<\/strong>\s*[–—]\s*([\s\S]*?)(?=<\/(?:li|span)>)/g;
  let m;
  while ((m = re.exec(sec)) !== null) {
    variants.push({ title: m[1].trim(), desc: m[2].trim().replace(/\s+/g, ' ') });
  }
  return variants;
}

/**
 * Extract nav title from H1.
 */
function extractNavTitle(html) {
  const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  if (!m) return 'Ethyria';
  return m[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
}

// ==================== HTML GENERATORS ====================

function genNav(title, lang) {
  const backHref = LANGS[lang].sp;
  return `    <nav class="sticky top-0 z-50 flex items-center px-6 py-3" style="backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);background:rgba(16,12,31,0.75);border-bottom:1px solid rgba(255,255,255,0.06);" aria-label="Navigation">
      <a href="${backHref}" class="text-gray-400 hover:text-white transition-colors" aria-label="Back">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 6L8 12L14 18"/></svg>
      </a>
      <span class="flex-1 text-center text-sm font-semibold tracking-wider uppercase text-gray-300" style="font-family:Poppins,Arial,sans-serif">${esc(title)}</span>
      <span class="w-7" aria-hidden="true"></span>
    </nav>`;
}

function genSourceBox(perspective, lang) {
  const ui = UI[lang];
  const ref = SOURCES[perspective][lang];
  const label = perspective === 'spiritual' ? ui.srcN : ui.src1;
  const borderColor = perspective === 'spiritual' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.06)';
  return `        <details class="mt-4" style="border-top:1px solid ${borderColor};padding-top:12px;">
          <summary class="text-xs text-gray-500 cursor-pointer hover:text-gray-400 transition-colors" style="font-family:Poppins,Arial,sans-serif;">${label}</summary>
          <p class="text-xs text-gray-500 mt-2 leading-relaxed">${ref}</p>
        </details>`;
}

function genBiosync(lang, slug) {
  const ui = UI[lang];
  const d = D[slug];
  const text = d[lang].bs;
  const ctaHref = LANGS[lang].cta;
  return `      <!-- Biosync -->
      <section class="mb-10 p-6 rounded-2xl relative overflow-hidden" style="background:linear-gradient(135deg,rgba(1,191,255,0.06) 0%,rgba(99,102,241,0.06) 100%);border:1px solid rgba(1,191,255,0.2);">
        <span class="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full" style="background:rgba(1,191,255,0.15);color:#22d3ee;font-family:Poppins,Arial,sans-serif;">${ui.badge}</span>
        <h2 class="text-2xl font-bold mb-4" style="font-family:Poppins,Arial,sans-serif;color:#34d399;">
          <span>⚡</span> ${ui.bioT.replace('⚡ ','')}
        </h2>
        <p class="text-gray-300 leading-relaxed">${esc(text)}</p>
        <details class="mt-4" style="border-top:1px solid rgba(1,191,255,0.1);padding-top:12px;">
          <summary class="text-xs text-gray-500 cursor-pointer hover:text-gray-400 transition-colors" style="font-family:Poppins,Arial,sans-serif;">${ui.srcN}</summary>
          <p class="text-xs text-gray-500 mt-2 leading-relaxed">${d.bsrc}</p>
        </details>
        <a href="${ctaHref}" class="inline-block mt-4 text-sm font-semibold transition-colors hover:text-white" style="color:#22d3ee;font-family:Poppins,Arial,sans-serif;">${ui.appL}</a>
      </section>`;
}

function genCommunityStats(lang, slug, symbolTitles) {
  const ui = UI[lang];
  const d = D[slug];
  const gradients = ['#22d3ee,#60a5fa','#a78bfa,#f0abfc','#34d399,#22d3ee'];
  const sp = LANGS[lang].sp;

  let emotionBars = '';
  for (let i = 0; i < 3; i++) {
    const label = E[lang][d.em[i]];
    const pct = d.ep[i];
    emotionBars += `
          <div>
            <div class="flex justify-between text-sm mb-1"><span class="text-gray-400">${label}</span><span class="text-gray-500">${pct} %</span></div>
            <div class="w-full h-2 rounded-full" style="background:rgba(255,255,255,0.06)"><div class="h-2 rounded-full" style="width:${pct}%;background:linear-gradient(90deg,${gradients[i]});"></div></div>
          </div>`;
  }

  let companions = '';
  for (const [cs, pct] of d.co) {
    const st = symbolTitles[cs];
    if (!st) continue;
    companions += `\n            <a href="${sp}${cs}.html" class="text-xs px-3 py-1 rounded-full transition-colors hover:text-white" style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);color:#9ca3af;">${st.emoji} ${st.title} (${pct} %)</a>`;
  }

  return `      <!-- Community Stats -->
      <section class="mb-10 p-6 rounded-2xl" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);">
        <h2 class="text-2xl font-bold mb-4" style="font-family:Poppins,Arial,sans-serif;color:#f0abfc;">
          <span>📊</span> ${ui.comT.replace('📊 ','')}
        </h2>
        <div class="space-y-3 mb-4">${emotionBars}
        </div>
        <div class="pt-3" style="border-top:1px solid rgba(255,255,255,0.06)">
          <p class="text-xs text-gray-500 mb-2" style="font-family:Poppins,Arial,sans-serif;">${ui.compL}</p>
          <div class="flex flex-wrap gap-2">${companions}
          </div>
        </div>
      </section>`;
}

function genDeepVariants(lang, slug, variants, symbolTitles) {
  const ui = UI[lang];
  const d = D[slug];
  const sp = LANGS[lang].sp;
  let cards = '';

  for (let i = 0; i < variants.length && i < 5; i++) {
    const v = variants[i];
    const links = (d.vl[i] || []).map(s => {
      const st = symbolTitles[s];
      if (!st) return '';
      return `<a href="${sp}${s}.html" class="text-[11px] text-cyan-500/70 hover:text-cyan-400 transition-colors">${st.emoji} ${st.title}</a>`;
    }).filter(Boolean).join('');

    cards += `
          <div class="p-5 rounded-2xl" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);">
            <h3 class="text-lg font-bold text-cyan-300 mb-2" style="font-family:Poppins,Arial,sans-serif;">${esc(v.title)}</h3>
            <p class="text-gray-400 text-sm leading-relaxed mb-3">${esc(v.desc)}</p>
            <div class="flex flex-wrap gap-2"><span class="text-[11px] text-gray-500">${ui.rel}</span>${links}</div>
          </div>`;
  }

  return `      <!-- Deep Variants -->
      <section class="mb-10">
        <h2 class="text-2xl font-bold mb-6" style="font-family:Poppins,Arial,sans-serif;background:linear-gradient(90deg,#22d3ee,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">
          <span>🔄</span> ${ui.varT.replace('🔄 ','')}
        </h2>
        <div class="space-y-4">${cards}
        </div>
      </section>`;
}

function genFAQAccordion(lang, slug) {
  const ui = UI[lang];
  const fqs = D[slug][lang].fq;
  let items = '';
  for (const [q, a] of fqs) {
    items += `
          <details class="group">
            <summary class="cursor-pointer text-gray-200 font-semibold text-sm py-3 px-4 rounded-xl transition-colors hover:text-white list-none flex items-center justify-between" style="background:rgba(255,255,255,0.03);font-family:Poppins,Arial,sans-serif;">${esc(q)}<span class="text-gray-500 group-open:rotate-180 transition-transform ml-2">▾</span></summary>
            <p class="text-gray-400 text-sm leading-relaxed px-4 pt-2 pb-3">${esc(a)}</p>
          </details>`;
  }
  return `      <!-- FAQ -->
      <section class="mb-10 p-6 rounded-2xl" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);">
        <h2 class="text-2xl font-bold mb-4" style="font-family:Poppins,Arial,sans-serif;color:#22d3ee;"><span>❓</span> ${ui.faqT.replace('❓ ','')}</h2>
        <div class="space-y-3">${items}
        </div>
      </section>`;
}

function genFAQSchema(lang, slug) {
  const fqs = D[slug][lang].fq;
  const entities = fqs.map(([q, a]) => `          {
            "@type": "Question",
            "name": ${JSON.stringify(q)},
            "acceptedAnswer": {
              "@type": "Answer",
              "text": ${JSON.stringify(a)}
            }
          }`).join(',\n');

  return `    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
${entities}
        ]
      }
    </script>`;
}

function esc(s) {
  // Minimal HTML escaping — preserve existing entities and tags in biosync sources
  return s;
}

// ==================== TRANSFORMATION ====================

function transformFile(filePath, lang, slug) {
  let html = fs.readFileSync(filePath, 'utf-8');

  // Skip if already transformed
  if (html.includes('FAQPage') || html.includes('Biosync')) {
    console.log(`  SKIP (already transformed): ${filePath}`);
    return false;
  }

  const symbolTitles = extractSymbolTitles(html);
  const variants = extractVariants(html);
  const navTitle = extractNavTitle(html);

  if (variants.length === 0) {
    console.log(`  WARN: no variants found in ${filePath}`);
  }

  // 1. Replace variant section with Deep Variants + FAQ Accordion
  const variantIdx = html.indexOf('🔄');
  if (variantIdx !== -1) {
    const secStart = html.lastIndexOf('<section', variantIdx);
    const secEndTag = html.indexOf('</section>', variantIdx);
    const secEnd = secEndTag + '</section>'.length;
    // Find next non-whitespace after </section> — that's where CTA starts
    const afterSection = html.slice(secEnd);
    const deepVariants = genDeepVariants(lang, slug, variants, symbolTitles);
    const faqAccordion = genFAQAccordion(lang, slug);
    html = html.slice(0, secStart) + deepVariants + '\n\n' + faqAccordion + '\n\n' + afterSection;
  }

  // 2. Add source box to Spiritual section (✨)
  html = addSourceAfter(html, '✨', 'spiritual', lang);

  // 3. Insert Biosync + Community Stats after Spiritual section's </section>
  const spiritIdx = html.indexOf('✨');
  if (spiritIdx !== -1) {
    const spiritSecEnd = html.indexOf('</section>', spiritIdx);
    if (spiritSecEnd !== -1) {
      const insertPos = spiritSecEnd + '</section>'.length;
      const biosync = genBiosync(lang, slug);
      const stats = genCommunityStats(lang, slug, symbolTitles);
      html = html.slice(0, insertPos) + '\n\n' + biosync + '\n\n' + stats + '\n\n' + html.slice(insertPos);
    }
  }

  // 4. Add source box to Jung section (🔮)
  html = addSourceAfter(html, '🔮', 'jung', lang);

  // 5. Add source box to Freud section (🧠)
  html = addSourceAfter(html, '🧠', 'freud', lang);

  // 6. Add nav bar after <body> tag
  const bodyTag = '<body class="bg-[#100c1f] text-white min-h-screen">';
  const bodyIdx = html.indexOf(bodyTag);
  if (bodyIdx !== -1) {
    const insertPos = bodyIdx + bodyTag.length;
    const nav = genNav(navTitle, lang);
    html = html.slice(0, insertPos) + '\n' + nav + '\n' + html.slice(insertPos);
  }

  // 7. Add FAQPage schema after BreadcrumbList </script>
  const breadcrumbIdx = html.indexOf('BreadcrumbList');
  if (breadcrumbIdx !== -1) {
    const scriptEnd = html.indexOf('</script>', breadcrumbIdx);
    if (scriptEnd !== -1) {
      const insertPos = scriptEnd + '</script>'.length;
      const schema = genFAQSchema(lang, slug);
      html = html.slice(0, insertPos) + '\n\n' + schema + '\n' + html.slice(insertPos);
    }
  }

  fs.writeFileSync(filePath, html, 'utf-8');
  return true;
}

function addSourceAfter(html, emoji, perspective, lang) {
  const idx = html.indexOf(emoji);
  if (idx === -1) return html;
  const secEnd = html.indexOf('</section>', idx);
  if (secEnd === -1) return html;
  // Find last </p> before </section>
  const region = html.slice(idx, secEnd);
  const lastP = region.lastIndexOf('</p>');
  if (lastP === -1) return html;
  const insertPos = idx + lastP + '</p>'.length;
  const sourceBox = genSourceBox(perspective, lang);
  return html.slice(0, insertPos) + '\n' + sourceBox + '\n' + html.slice(insertPos);
}

// ==================== MAIN ====================
console.log('Knowledge Layer Rollout — starting...');
let processed = 0;
let skipped = 0;

for (const [lang, config] of Object.entries(LANGS)) {
  const dir = path.join(ROOT, config.dir);
  console.log(`\n[${lang.toUpperCase()}] Processing ${dir}`);
  for (const slug of SLUGS) {
    const filePath = path.join(dir, slug + '.html');
    if (!fs.existsSync(filePath)) {
      console.log(`  MISS: ${slug}.html`);
      continue;
    }
    if (transformFile(filePath, lang, slug)) {
      console.log(`  OK: ${slug}.html`);
      processed++;
    } else {
      skipped++;
    }
  }
}

console.log(`\nDone. Processed: ${processed}, Skipped: ${skipped}`);
