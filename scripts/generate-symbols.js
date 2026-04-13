const fs = require("fs");
const path = require("path");

const symbols = [
  {
    slug: "fallen",
    emoji: "🕳️",
    de: {
      title: "Traumdeutung Fallen",
      h1: "Traumdeutung: Fallen & Stürzen – Was bedeutet es?",
      metaDesc:
        "Traum vom Fallen oder Stürzen? Erfahre die KI-gestützte Traumdeutung nach Freud, Jung und mehr. Was dein Unterbewusstsein dir sagen will – jetzt mit Ethyria analysieren.",
      keywords:
        "Traumdeutung Fallen, Traum vom Fallen, Stürzen im Traum, Fallen Traum Bedeutung, Traumdeutung Absturz",
      intro:
        "Träume vom Fallen oder Stürzen gehören zu den universellsten Traumerlebnissen überhaupt. Fast jeder Mensch hat mindestens einmal im Leben einen solchen Traum – und wacht oft mit Herzrasen auf. Doch was steckt wirklich dahinter?",
      freud:
        "Für Sigmund Freud symbolisiert das Fallen im Traum oft einen Kontrollverlust über verdrängte Triebe oder Wünsche. Der Sturz kann unbewusste Ängste vor moralischem Versagen oder dem Verlust gesellschaftlicher Stellung repräsentieren. Besonders häufig tritt dieses Traumsymbol in Phasen auf, in denen das Über-Ich (die moralische Instanz) mit dem Es (den Trieben) in Konflikt gerät.",
      jung: "Carl Gustav Jung interpretierte Fallträume als Hinweis auf eine überhöhte Selbsteinschätzung oder eine Abkopplung vom eigenen Schatten. Der Sturz symbolisiert die Notwendigkeit, sich mit der eigenen Verletzlichkeit auseinanderzusetzen und den Kontakt zur Erde – zum Realen – wiederherzustellen. Jung sah darin oft einen heilsamen Prozess der Individuation.",
      spiritual:
        "In spirituellen Traditionen wird das Fallen oft als Zeichen einer energetischen Neuausrichtung gedeutet. Der Traum kann darauf hinweisen, dass alte Glaubenssätze losgelassen werden müssen, um Platz für Wachstum zu schaffen. In der islamischen Traumdeutung kann ein Sturz je nach Kontext sowohl Warnung als auch Reinigung bedeuten.",
      variants: [
        "Fallen ins Bodenlose – extremer Kontrollverlust, existenzielle Angst",
        "Fallen von einem Gebäude – berufliche oder soziale Unsicherheit",
        "Fallen und sanft landen – Vertrauen in den eigenen Prozess",
        "Jemand anderen fallen sehen – Sorge um nahestehende Personen",
        "Fallen und Aufwachen – der Körper schützt sich selbst (hypnagogischer Ruck)",
      ],
    },
  },
  {
    slug: "zaehne-verlieren",
    emoji: "🦷",
    de: {
      title: "Traumdeutung Zähne verlieren",
      h1: "Traumdeutung: Zähne verlieren – Was bedeutet es?",
      metaDesc:
        "Traum vom Zähne verlieren? Die häufigste Traumsymbolik erklärt – KI-Analyse nach Freud, Jung und islamischer Deutung. Jetzt mit Ethyria deuten.",
      keywords:
        "Traumdeutung Zähne, Zähne verlieren Traum, Traum Zähne fallen aus, Zahnverlust Traum Bedeutung",
      intro:
        "Der Traum vom Zahnverlust ist eines der häufigsten und intensivsten Traumsymbole weltweit. Ob einzelne Zähne herausfallen, bröckeln oder sich auflösen – die emotionale Wirkung ist fast immer stark. Über Kulturen und Epochen hinweg beschäftigt dieses Symbol die Menschheit.",
      freud:
        "Freud sah im Zahnverlust-Traum einen direkten Bezug zu Kastrationsangst und dem Verlust von Potenz oder Attraktivität. Der Zahn als hartes, sichtbares Körperteil steht für Stärke und Selbstbild. Sein Verlust im Traum signalisiert die Angst vor Schwäche, Alterung oder dem Verlust sexueller Anziehungskraft.",
      jung: "Jung interpretierte Zahnträume als Symbol für Transformation und Erneuerung – ähnlich dem natürlichen Zahnwechsel in der Kindheit. Der Verlust alter Zähne macht Platz für Neues. Es kann auch auf eine Phase hindeuten, in der alte Überzeugungen oder Identitäten abgelegt werden müssen.",
      spiritual:
        "In vielen spirituellen Traditionen wird Zahnverlust im Traum mit Kommunikation und Selbstausdruck verbunden. Zähne stehen für die Fähigkeit, sich zu behaupten und gehört zu werden. Islamische Traumdeuter sehen je nach Kontext Hinweise auf Familie, Gesundheit oder bevorstehende Veränderungen.",
      variants: [
        "Alle Zähne fallen aus – tiefgreifende Verunsicherung, Identitätskrise",
        "Zähne bröckeln langsam – schleichender Vertrauensverlust",
        "Zähne ausspucken – Bedürfnis, etwas Unausgesprochenes loszulassen",
        "Zähne wachsen nach – Erneuerung, Wachstum, neue Phase",
        "Zähne beim Lächeln verlieren – Angst vor sozialer Bloßstellung",
      ],
    },
  },
  {
    slug: "verfolgt-werden",
    emoji: "🏃",
    de: {
      title: "Traumdeutung Verfolgt werden",
      h1: "Traumdeutung: Verfolgt werden – Was bedeutet es?",
      metaDesc:
        "Verfolgungsträume gehören zu den häufigsten Albträumen. Was sie bedeuten – KI-Analyse nach Freud, Jung und spiritueller Deutung. Jetzt mit Ethyria analysieren.",
      keywords:
        "Traumdeutung Verfolgt werden, Verfolgungstraum, Traum verfolgt werden Bedeutung, Albtraum Verfolgung",
      intro:
        "Verfolgungsträume sind die häufigste Form von Albträumen. Das Gefühl, gejagt zu werden und nicht entkommen zu können, erzeugt intensive Angst – auch nach dem Aufwachen. Doch der Verfolger repräsentiert selten eine reale Bedrohung.",
      freud:
        'Freud deutete Verfolgungsträume als Ausdruck verdrängter Wünsche oder Schuldgefühle, die das Bewusstsein zu "verfolgen" beginnen. Der Verfolger symbolisiert oft das eigene Über-Ich – die innere moralische Instanz, die verdict über unbewusste Impulse fällt.',
      jung: "Für Jung ist der Verfolger meist der eigene Schatten – der abgelehnte Teil der Persönlichkeit. Der Traum fordert dazu auf, sich diesem Schatten zu stellen statt zu fliehen. Erst die Konfrontation ermöglicht Integration und persönliches Wachstum.",
      spiritual:
        "Spirituelle Deutungen sehen in Verfolgungsträumen oft ungelöste karmische Themen oder energetische Blockaden. Der Verfolger kann ein Symbol für ungelebte Potenziale sein, die nach Ausdruck drängen. Die Lösung liegt nicht in der Flucht, sondern im Innehalten.",
      variants: [
        "Von einem Monster verfolgt – unbewusste, unbenannte Ängste",
        "Von einer bekannten Person verfolgt – ungelöster Konflikt mit dieser Person",
        "Verfolgt und nicht laufen können – Ohnmachtsgefühl im Wachleben",
        "Verfolgt und verstecken – Vermeidungsverhalten, Konfrontationsangst",
        "Verfolger einholen – Zeitdruck, überwältigende Verantwortung",
      ],
    },
  },
  {
    slug: "fliegen",
    emoji: "🕊️",
    de: {
      title: "Traumdeutung Fliegen",
      h1: "Traumdeutung: Fliegen – Was bedeutet es?",
      metaDesc:
        "Traum vom Fliegen? Ein Zeichen für Freiheit oder Kontrollverlust? KI-gestützte Traumdeutung nach Freud, Jung & mehr. Jetzt mit Ethyria analysieren.",
      keywords:
        "Traumdeutung Fliegen, Traum vom Fliegen, Flugtraum Bedeutung, Fliegen im Traum",
      intro:
        "Das Fliegen im Traum gehört zu den euphorischsten Traumerlebnissen. Das Gefühl, über Landschaften zu schweben, Schwerkraft zu überwinden und grenzenlose Freiheit zu spüren, bleibt oft noch Stunden nach dem Aufwachen präsent.",
      freud:
        "Freud interpretierte Flugträume als Ausdruck libidinöser Energie und des Wunsches, sich über gesellschaftliche Normen zu erheben. Der Flug symbolisiert die Befreiung von Hemmungen und verdrängten Wünschen – ein kurzzeitiges Aussetzen der Realitätsprinzipien.",
      jung: "Jung sah im Fliegen die Verbindung zum Geistigen und die Fähigkeit, Probleme aus einer höheren Perspektive zu betrachten. Es symbolisiert Kreativität, Inspiration und den Zugang zum kollektiven Unbewussten. Allerdings warnte er auch: Zu hoch fliegen kann eine Abkopplung von der Realität bedeuten.",
      spiritual:
        "In spirituellen Traditionen wird das Fliegen oft als außerkörperliche Erfahrung oder Astralreise gedeutet. Es steht für spirituelles Erwachen, den Zugang zu höheren Bewusstseinsebenen und die Verbindung mit dem göttlichen Selbst.",
      variants: [
        "Frei und kontrolliert fliegen – Selbstvertrauen, Meisterschaft",
        "Mühsam flattern – innerer Widerstand, Zweifel am eigenen Weg",
        "Plötzlich abstürzen – Angst vor dem Scheitern nach Erfolg",
        "Über bekannte Orte fliegen – neue Perspektive auf Vertrautes",
        "Mit anderen zusammen fliegen – gemeinsame Ziele, kollektive Energie",
      ],
    },
  },
  {
    slug: "wasser",
    emoji: "🌊",
    de: {
      title: "Traumdeutung Wasser",
      h1: "Traumdeutung: Wasser & Meer – Was bedeutet es?",
      metaDesc:
        "Wasser im Traum – Meer, Fluss, Überschwemmung? Erfahre die Bedeutung mit KI-Analyse nach Freud, Jung und spiritueller Deutung. Jetzt mit Ethyria deuten.",
      keywords:
        "Traumdeutung Wasser, Traum vom Meer, Wasser im Traum Bedeutung, Traumdeutung Überschwemmung, Traumdeutung Fluss",
      intro:
        "Wasser ist eines der mächtigsten und vielschichtigsten Traumsymbole. Ob ruhiger See, tosende Wellen, klarer Fluss oder dunkle Flut – Wasser spiegelt fast immer den emotionalen Zustand der Träumenden wider.",
      freud:
        "Freud sah Wasser als Symbol für das Unbewusste selbst – den Ozean verdrängter Erinnerungen, Wünsche und Triebe. Die Art des Wassers zeigt den Zustand des Es: Ruhiges Wasser deutet auf Gleichgewicht, trübes oder stürmisches Wasser auf innere Konflikte.",
      jung: "Für Jung ist Wasser das zentrale Symbol des kollektiven Unbewussten. Tauchen ins Wasser bedeutet das Eintauchen in tiefe psychische Schichten. Die Klarheit des Wassers zeigt, wie bewusst die Person ihren eigenen Gefühlen gegenübersteht.",
      spiritual:
        "In nahezu allen spirituellen Traditionen steht Wasser für Reinigung, Erneuerung und emotionale Heilung. Fließendes Wasser symbolisiert den Fluss des Lebens, stehendes Wasser kann auf Stagnation hindeuten. Islamische Traumdeuter unterscheiden zwischen reinem und unreinem Wasser als Hinweis auf Segen oder Prüfung.",
      variants: [
        "Klares ruhiges Wasser – emotionale Klarheit, innerer Frieden",
        "Trübes/schmutziges Wasser – unterdrückte Emotionen, Konfusion",
        "Überschwemmung – emotionale Überwältigung, unkontrollierbare Gefühle",
        "Im Wasser schwimmen – Umgang mit eigenen Emotionen, Flow",
        "Wasser trinken – emotionale Nahrung, Heilung, Erfrischung",
      ],
    },
  },
  {
    slug: "tod",
    emoji: "💀",
    de: {
      title: "Traumdeutung Tod",
      h1: "Traumdeutung: Tod & Sterben – Was bedeutet es?",
      metaDesc:
        "Traum vom Tod oder Sterben? Keine Angst – es geht selten um den physischen Tod. KI-Traumdeutung nach Freud, Jung und spiritueller Sicht. Ethyria erklärt.",
      keywords:
        "Traumdeutung Tod, Traum vom Sterben, Tod im Traum Bedeutung, Traumdeutung Sterben",
      intro:
        "Träume vom Tod oder Sterben lösen oft starke Angst aus – doch in der Traumdeutung steht der Tod fast nie für das physische Lebensende. Er ist eines der kraftvollsten Symbole für Transformation, Abschluss und Neuanfang.",
      freud:
        "Freud interpretierte Todesträume oft als Ausdruck verdrängter Aggressionen oder Wünsche. Der Tod einer bekannten Person im Traum kann unterdrückte Konflikte mit dieser Person symbolisieren. Der eigene Tod kann paradoxerweise den Wunsch nach Befreiung von unerträglichen Situationen darstellen.",
      jung: "Jung sah den Tod im Traum als das mächtigste Symbol der Transformation. Er markiert das Ende einer alten Lebensphase und den Beginn einer neuen. Der Tod des alten Selbst ist notwendig für die Geburt des erneuerten Selbst – ein zentraler Aspekt der Individuation.",
      spiritual:
        "Viele spirituelle Traditionen deuten den Traumtod als Übergang und Erneuerung. In der islamischen Traumdeutung kann der Tod auf Reue, spirituelle Reinigung oder den Beginn eines neuen Lebensabschnitts hinweisen. Buddhistische Deutungen sehen darin die Erinnerung an die Vergänglichkeit und den Wert des Augenblicks.",
      variants: [
        "Eigener Tod – tiefgreifende Transformation, Identitätswandel",
        "Tod eines geliebten Menschen – Angst vor Verlust oder Veränderung in der Beziehung",
        "Tod eines Fremden – ablegen einer unbekannten Seite des Selbst",
        "Beerdigung besuchen – Abschiednehmen von alten Gewohnheiten",
        "Auferstehung nach dem Tod – Erneuerung, zweite Chance, Resilienz",
      ],
    },
  },
  {
    slug: "schlangen",
    emoji: "🐍",
    de: {
      title: "Traumdeutung Schlange",
      h1: "Traumdeutung: Schlangen – Was bedeutet es?",
      metaDesc:
        "Schlange im Traum? Symbol für Heilung, Gefahr oder Transformation? KI-Traumdeutung nach Freud, Jung, islamisch. Jetzt mit Ethyria analysieren.",
      keywords:
        "Traumdeutung Schlange, Schlange im Traum, Traum Schlange Bedeutung, Traumdeutung Schlangenbiss",
      intro:
        "Die Schlange ist eines der ältesten und ambivalentesten Traumsymbole der Menschheit. Sie kann gleichzeitig Heilung und Gefahr, Weisheit und Verführung, Erneuerung und Tod symbolisieren.",
      freud:
        "Für Freud war die Schlange ein klassisches phallisches Symbol – ein Ausdruck sexueller Energie und verdrängter Triebe. Der Schlangenbiss im Traum kann auf verbotene Wünsche oder die Angst vor sexueller Überwältigung hinweisen.",
      jung: "Jung sah in der Schlange ein archetypisches Symbol für Transformation (Häutung), Kundalini-Energie und die Verbindung zwischen Bewusstem und Unbewusstem. Die Schlange als chthonisches Wesen verbindet uns mit der Erde und den tiefsten Schichten der Psyche.",
      spiritual:
        "In vielen Kulturen ist die Schlange ein heiliges Tier. Im Hinduismus symbolisiert sie Kundalini-Energie, im Christentum Versuchung, in der Medizin Heilung (Äskulapstab). Islamische Traumdeuter sehen in Schlangen oft Feinde oder Versuchungen, aber auch Schutz – je nach Verhalten der Schlange.",
      variants: [
        "Schlange beißt – Warnung, Verrat oder Weckruf",
        "Schlange häutet sich – persönliche Erneuerung, Transformation",
        "Schlange im Haus – unbewusste Bedrohung im persönlichen Raum",
        "Bunte/goldene Schlange – spirituelle Erkenntnis, Kundalini",
        "Schlange töten – Überwindung von Angst oder Feindschaft",
      ],
    },
  },
  {
    slug: "spinnen",
    emoji: "🕷️",
    de: {
      title: "Traumdeutung Spinne",
      h1: "Traumdeutung: Spinnen – Was bedeutet es?",
      metaDesc:
        "Spinne im Traum? Kreativität oder Angst? KI-gestützte Traumdeutung nach Freud, Jung und spiritueller Sicht. Jetzt mit Ethyria entschlüsseln.",
      keywords:
        "Traumdeutung Spinne, Spinne im Traum, Traum Spinne Bedeutung, Traumdeutung Spinnweben",
      intro:
        "Spinnen im Traum polarisieren wie kaum ein anderes Symbol. Für die einen sind sie der pure Albtraum, für andere faszinierende Wesen. In der Traumdeutung tragen Spinnen vielschichtige Botschaften über Kreativität, Kontrolle und weibliche Kraft.",
      freud:
        'Freud verband die Spinne mit der dominierenden Mutterfigur – dem "verschlingenden Weiblichen". Das Netz steht für Verstrickung in familiäre oder emotionale Abhängigkeiten. Die Spinnenangst im Traum kann verdrängte Ambivalenz gegenüber einer nahestehenden Frauenfigur ausdrücken.',
      jung: 'Jung sah in der Spinne die "Weberin des Schicksals" – ein archetypisches Symbol für Kreativität, Geduld und die Fähigkeit, das eigene Lebensnetz zu spinnen. Die Spinne verbindet verschiedene Aspekte des Lebens zu einem Ganzen. Sie symbolisiert auch die Anima – das weibliche Prinzip in der männlichen Psyche.',
      spiritual:
        "In indigenen Kulturen wird die Spinne als Schöpferin verehrt (z.B. Grandmother Spider bei den Navajo). Sie webt die Welt ins Dasein. Spirituell kann die Spinne im Traum auf deine kreative Schöpferkraft hinweisen und die Aufforderung sein, dein eigenes Lebensnetz bewusster zu gestalten.",
      variants: [
        "Große Spinne – dominantes Thema, das Aufmerksamkeit fordert",
        "Viele kleine Spinnen – Überforderung durch viele kleine Probleme",
        "Spinnweben – vernachlässigte Bereiche des Lebens",
        "Spinne beißt – toxische Beziehung oder unterschätzte Gefahr",
        "Spinne webt ein Netz – Kreativität, Planung, Geduld",
      ],
    },
  },
  {
    slug: "schwangerschaft",
    emoji: "🤰",
    de: {
      title: "Traumdeutung Schwangerschaft",
      h1: "Traumdeutung: Schwangerschaft – Was bedeutet es?",
      metaDesc:
        "Traum von Schwangerschaft? Symbol für Neuanfang oder Angst? KI-Traumdeutung nach Freud, Jung und spiritueller Sicht. Ethyria analysiert.",
      keywords:
        "Traumdeutung Schwangerschaft, Schwanger im Traum, Traum Schwangerschaft Bedeutung, Traumdeutung Baby",
      intro:
        "Schwangerschaftsträume betreffen längst nicht nur werdende Mütter. Menschen jeden Geschlechts und Alters träumen davon – denn die Schwangerschaft im Traum symbolisiert primär Kreativität, Wachstum und das Heranreifen von etwas Neuem.",
      freud:
        "Freud sah in Schwangerschaftsträumen den unbewussten Wunsch nach Fruchtbarkeit, Schöpfung oder die Angst vor den Konsequenzen sexueller Handlungen. Der wachsende Bauch symbolisiert etwas, das sich nicht mehr verbergen lässt – ein Geheimnis, das ans Licht drängt.",
      jung: 'Jung interpretierte Schwangerschaft im Traum als Zeichen der Individuation – ein neuer Aspekt der Persönlichkeit reift heran. Das "Kind" im Bauch steht für kreatives Potenzial, eine neue Idee oder einen Lebensabschnitt, der geboren werden will.',
      spiritual:
        'Spirituelle Deutungen sehen in der Traumschwangerschaft die Manifestation von Absichten und Wünschen. Etwas wurde energetisch "empfangen" und wächst nun heran. Islamische Traumdeuter können darin je nach Kontext Segen, Verantwortung oder bevorstehende Veränderung sehen.',
      variants: [
        "Selbst schwanger sein – neue Idee oder Projekt reift",
        "Andere Person schwanger – Projektion eigener Wünsche",
        "Geburt erleben – Vollendung, Durchbruch, Ergebnis",
        "Ungewollte Schwangerschaft – Überforderung, unerwartete Verantwortung",
        "Schwangerschaft verbergen – Geheimnis, Angst vor Verurteilung",
      ],
    },
  },
  {
    slug: "auto-unfall",
    emoji: "🚗",
    de: {
      title: "Traumdeutung Auto & Unfall",
      h1: "Traumdeutung: Auto fahren & Unfall – Was bedeutet es?",
      metaDesc:
        "Traum vom Auto fahren oder Unfall? Symbol für Lebensweg und Kontrollverlust. KI-Analyse nach Freud, Jung und mehr. Jetzt mit Ethyria deuten.",
      keywords:
        "Traumdeutung Auto, Autounfall im Traum, Auto fahren Traum Bedeutung, Traumdeutung Unfall",
      intro:
        "Das Auto im Traum repräsentiert fast immer den eigenen Lebensweg, die persönliche Antriebskraft und die Kontrolle über die eigene Richtung. Ein Autounfall hingegen signalisiert Kontrollverlust – eine der häufigsten Ängste im modernen Leben.",
      freud:
        "Freud sah im Autofahren die Kontrolle über den eigenen Körper und seine Triebe. Das Steuer steht für die bewusste Lenkung, während ein Kontrollverlust (Bremsen versagen, Steuer reagiert nicht) auf verdrängte Impulse hindeutet, die die Oberhand gewinnen.",
      jung: "Jung interpretierte das Auto als Ausdruck der Persona – des äußeren Bildes, das wir der Welt zeigen. Der Zustand des Autos spiegelt das Selbstbild: Ein glänzendes Auto steht für Selbstbewusstsein, ein beschädigtes für verletzte Identität. Wer fährt (du oder jemand anderes) zeigt, wer die Kontrolle über dein Leben hat.",
      spiritual:
        "Spirituell steht das Auto für die Reise der Seele durchs Leben. Ein Unfall kann ein Weckruf sein – die Aufforderung, innezuhalten und die eigene Richtung zu überprüfen. Islamische Traumdeuter sehen in einem Autounfall oft eine Warnung vor Nachlässigkeit auf dem Lebensweg.",
      variants: [
        "Selbst fahren mit Kontrolle – Selbstbestimmung, klarer Lebensweg",
        "Auto außer Kontrolle – Überforderung, fehlende Steuerung",
        "Beifahrer sein – jemand anderes bestimmt deinen Weg",
        "Autounfall – plötzliche Veränderung, Crash von Erwartungen",
        "Auto nicht finden – Orientierungslosigkeit, Identitätssuche",
      ],
    },
  },
  {
    slug: "nackt-sein",
    emoji: "😳",
    de: {
      title: "Traumdeutung Nackt sein",
      h1: "Traumdeutung: Nackt sein – Was bedeutet es?",
      metaDesc:
        "Nackt im Traum? Symbol für Verletzlichkeit oder Authentizität? KI-Traumdeutung nach Freud, Jung und spiritueller Sicht. Ethyria erklärt.",
      keywords:
        "Traumdeutung nackt, nackt im Traum, Traum Nacktheit Bedeutung, Traumdeutung Bloßstellung",
      intro:
        "Der Traum, nackt in der Öffentlichkeit zu stehen, gehört zu den bekanntesten Traumszenarien. Die Scham, die Verletzlichkeit, die panische Suche nach Deckung – diese Gefühle sind universell. Doch die Nacktheit im Traum hat tiefere Schichten als nur Peinlichkeit.",
      freud:
        "Freud verband Nacktheit im Traum mit der kindlichen Unschuld und dem Wunsch nach exhibitionistischer Freiheit. Gleichzeitig reflektiert die Scham im Traum die Unterdrückung dieser Impulse durch das Über-Ich. Der Traum zeigt den Konflikt zwischen dem Wunsch nach Authentizität und der Angst vor gesellschaftlicher Verurteilung.",
      jung: "Für Jung symbolisiert Nacktheit das wahre Selbst – befreit von Persona und sozialer Maske. Der Traum fordert dazu auf, sich authentisch zu zeigen. Die Reaktion der Traumfiguren auf die Nacktheit (Interesse, Gleichgültigkeit, Spott) zeigt, wie das Unterbewusstsein die eigene Verletzlichkeit bewertet.",
      spiritual:
        "Spirituelle Deutungen sehen in der Traumacktheit einen Ruf zur Authentizität und Transparenz. Es geht darum, Masken abzulegen und sich dem Leben so zu zeigen, wie man wirklich ist. In manchen Traditionen ist es ein Zeichen spiritueller Reinheit und Unschuld.",
      variants: [
        "Nackt in der Öffentlichkeit – Angst vor Entlarvung oder Urteil",
        "Nackt und niemand bemerkt es – die Angst ist unbegründet",
        "Teilweise unbekleidet – partielles Verborgensein in einem Bereich",
        "Nackt und stolz – Selbstakzeptanz, Freiheit, Authentizität",
        "Andere nackt sehen – Erkennen der wahren Natur anderer",
      ],
    },
  },
  {
    slug: "pruefung",
    emoji: "📝",
    de: {
      title: "Traumdeutung Prüfung",
      h1: "Traumdeutung: Prüfung & Versagen – Was bedeutet es?",
      metaDesc:
        "Traum von einer Prüfung oder Versagen? Symbol für Leistungsdruck und Selbstbewertung. KI-Analyse nach Freud, Jung & mehr. Ethyria erklärt.",
      keywords:
        "Traumdeutung Prüfung, Prüfung im Traum, Traum Versagen Bedeutung, Traumdeutung Examen",
      intro:
        "Der Prüfungstraum trifft selbst Menschen, die seit Jahrzehnten keine Prüfung mehr geschrieben haben. Die Panik, nicht gelernt zu haben, zu spät zu kommen oder den Stoff nicht zu kennen – dieses Traumszenario hat wenig mit Schule zu tun und viel mit Selbstbewertung.",
      freud:
        'Freud erkannte, dass Prüfungsträume paradoxerweise oft vor Situationen auftreten, die man im Wachleben gut bewältigen wird. Er interpretierte sie als Erinnerung an vergangene Erfolge trotz vermeintlichem Scheitern – das Unbewusste beruhigt durch die Erinnerung: "Du hast es damals geschafft."',
      jung: 'Jung sah in Prüfungsträumen die ständige Selbstevaluation des Individuationsprozesses. Der Traum fragt: "Werde ich meinem wahren Selbst gerecht?" Die Prüfung ist eine innere Bestandsaufnahme – nicht von Wissen, sondern von Authentizität und persönlichem Wachstum.',
      spiritual:
        "Spirituell werden Prüfungsträume als Seelen-Tests gesehen – die Überprüfung, ob du bereit bist für die nächste Stufe deiner Entwicklung. Sie können auch auf karmische Lektionen hindeuten, die wiederholt werden, bis sie verstanden sind.",
      variants: [
        "Prüfung nicht bestehen – Angst vor Unzulänglichkeit",
        "Zu spät zur Prüfung – Zeitdruck, verpasste Gelegenheiten",
        "Falsches Fach lernen – falsche Prioritäten im Leben",
        "Prüfung in fremder Sprache – Kommunikationsbarrieren",
        "Prüfung bestehen – Selbstbestätigung, verdientes Vertrauen",
      ],
    },
  },
  {
    slug: "haus-raeume",
    emoji: "🏠",
    de: {
      title: "Traumdeutung Haus & Räume",
      h1: "Traumdeutung: Haus & Räume – Was bedeutet es?",
      metaDesc:
        "Haus im Traum? Unbekannte Räume entdecken? Symbol für die eigene Psyche. KI-Traumdeutung nach Freud, Jung & mehr. Jetzt mit Ethyria analysieren.",
      keywords:
        "Traumdeutung Haus, Traum Haus Bedeutung, unbekannte Räume im Traum, Traumdeutung Zimmer",
      intro:
        "Das Haus im Traum ist eines der persönlichsten Symbole überhaupt – es repräsentiert die eigene Psyche. Jeder Raum, jedes Stockwerk, jeder verborgene Winkel steht für einen anderen Aspekt deiner Persönlichkeit und deines inneren Lebens.",
      freud:
        "Freud sah im Haus ein Symbol für den menschlichen Körper. Verschiedene Räume stehen für verschiedene Körperteile und Funktionen. Der Keller repräsentiert das Unbewusste, das Dachgeschoss den Intellekt. Verschlossene Türen deuten auf verdrängte Erinnerungen oder verbotene Wünsche.",
      jung: "Dies ist eines von Jungs berühmtesten Traumsymbolen. Er selbst träumte von einem Haus mit mehreren Stockwerken – vom modernen Obergeschoss (Bewusstsein) hinab zur mittelalterlichen Ebene (historisches Unbewusstes) bis zur Höhle (archaisches kollektives Unbewusstes). Jedes Stockwerk offenbart tiefere Schichten der Psyche.",
      spiritual:
        "Spirituelle Deutungen sehen im Traumhaus die Seele selbst. Neue Räume entdecken bedeutet, neue Fähigkeiten oder spirituelle Gaben zu entdecken. Der Zustand des Hauses zeigt den Zustand der inneren Welt: ein renoviertes Haus deutet auf Heilung, ein verfallenes auf Vernachlässigung des Seelenlebens.",
      variants: [
        "Unbekannte Räume entdecken – verborgene Potenziale, neue Seiten entdecken",
        "Haus renovieren – aktive Selbstverbesserung, innere Arbeit",
        "Verfallenes Haus – vernachlässigte Seelenbereiche",
        "Keller betreten – Konfrontation mit dem tiefen Unbewussten",
        "Kindheitshaus besuchen – Rückkehr zu Ur-Themen, Nostlagie, ungelöste Kindheitserfahrungen",
      ],
    },
  },
  {
    slug: "ex-partner",
    emoji: "💔",
    de: {
      title: "Traumdeutung Ex-Partner",
      h1: "Traumdeutung: Ex-Partner – Was bedeutet es?",
      metaDesc:
        "Traum vom Ex-Partner? Bedeutet selten, dass du ihn/sie zurückwillst. KI-Traumdeutung nach Freud, Jung & spiritueller Sicht. Ethyria erklärt.",
      keywords:
        "Traumdeutung Ex-Partner, Ex im Traum, Traum Ex-Freund Bedeutung, Traumdeutung alte Beziehung",
      intro:
        "Träume vom Ex-Partner gehören zu den emotional aufwühlendsten Traumarten. Sie lösen oft Verwirrung oder Schuldgefühle aus – besonders wenn man in einer neuen Beziehung ist. Doch diese Träume handeln selten von der früheren Beziehung selbst.",
      freud:
        "Freud sah in Ex-Partner-Träumen den Ausdruck unverarbeiteter Wünsche und verdrängter Konflikte aus der Beziehung. Das Unbewusste versucht, emotional offene Rechnungen zu begleichen. Es geht um die Triebdynamik, die in der Beziehung aktiviert wurde – nicht notwendigerweise um die Person selbst.",
      jung: "Jung interpretierte den Ex-Partner im Traum als Anima/Animus-Projektion – der Ex steht für Aspekte des weiblichen oder männlichen Prinzips, die noch nicht integriert wurden. Der Traum fordert auf, diese Qualitäten in sich selbst zu erkennen und zu entwickeln, anstatt sie in anderen zu suchen.",
      spiritual:
        "Spirituelle Deutungen sehen in Ex-Partner-Träumen oft karmische Verbindungen oder Seelenverträge, die noch aufgelöst werden müssen. Der Traum kann auch ein Test sein: Bist du wirklich weitergegangen? Oder gibt es noch energetische Fäden, die gelöst werden wollen?",
      variants: [
        "Mit dem Ex zusammen sein – Sehnsucht nach verlorenem Lebensgefühl",
        "Ex ignoriert dich – Verarbeitung von Zurückweisung",
        "Streit mit dem Ex – ungelöster Konflikt, der Abschluss sucht",
        "Ex ist mit jemand anderem – Eifersucht, Vergleich, Selbstwert",
        "Ex entschuldigt sich – Wunsch nach Abschluss und Frieden",
      ],
    },
  },
  {
    slug: "hunde-katzen",
    emoji: "🐾",
    de: {
      title: "Traumdeutung Hunde & Katzen",
      h1: "Traumdeutung: Hunde & Katzen – Was bedeutet es?",
      metaDesc:
        "Hund oder Katze im Traum? Treue, Unabhängigkeit oder Instinkt? KI-Traumdeutung nach Freud, Jung & spiritueller Sicht. Ethyria analysiert.",
      keywords:
        "Traumdeutung Hund, Traumdeutung Katze, Hund im Traum, Katze im Traum Bedeutung, Traumdeutung Tiere",
      intro:
        "Hunde und Katzen sind die häufigsten Tiere in unseren Träumen. Als unsere engsten tierischen Begleiter tragen sie starke symbolische Bedeutung: der Hund steht für Loyalität, Schutz und Instinkt – die Katze für Unabhängigkeit, Intuition und das Feminine.",
      freud:
        'Freud sah in Traumtieren den Ausdruck animalischer Triebe. Der Hund als "treuester Freund" symbolisiert die kontrollierte Triebhaftigkeit, während die Katze – unabhängig und unberechenbar – für unterdrückte weibliche Sexualität und verborgene Wünsche steht.',
      jung: "Jung interpretierte den Hund als Symbol für natürliche Instinkte und treue Begleitung auf dem Individuationsweg. Die Katze steht für das Mysteriöse, die Verbindung zur Schattenanima und intuitive Weisheit. Beide Tiere können als Seelenführer auftreten, die den Träumenden zu tieferer Selbsterkenntnis leiten.",
      spiritual:
        "In spirituellen Traditionen sind Hunde Wächter der Schwelle zwischen den Welten (griechisch: Zerberus, ägyptisch: Anubis). Katzen werden seit dem alten Ägypten als heilig verehrt – Hüterinnen der Nacht und des Unsichtbaren. Im Islam gelten Katzen als rein, während Hunde ambivalenter gesehen werden.",
      variants: [
        "Freundlicher Hund – Treue, Schutz, verlässliche Freundschaft",
        "Aggressiver Hund – Bedrohung, unterdrückte Wut, Treue-Bruch",
        "Schwarze Katze – Intuition, das Unbewusste, verborgenes Wissen",
        "Verlorenes Haustier – Verlust von Sicherheit oder einer Beziehung",
        "Viele Tiere gleichzeitig – überwältigende Instinkte oder Bedürfnisse",
      ],
    },
  },
];

// Create symbols directory
const dir = "symbols";
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

for (const sym of symbols) {
  const t = sym.de;
  const variantsHtml = t.variants
    .map((v) => {
      const [title, ...desc] = v.split(" – ");
      return `<li class="mb-3"><strong class="text-cyan-300">${title}</strong>${desc.length ? " – " + desc.join(" – ") : ""}</li>`;
    })
    .join("\n                    ");

  const html = `<!doctype html>
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="../assets/Ethyria_new_app_icon.png" type="image/png" />
    <link rel="apple-touch-icon" sizes="180x180" href="../assets/apple-touch-icon-180.png" />
    <link rel="manifest" href="/manifest.json" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-title" content="Ethyria" />
    <link rel="preload" href="../fonts/poppins_bold.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="../fonts/inter_regular.woff2" as="font" type="font/woff2" crossorigin />
    <title>${t.title} | Ethyria KI-Traumanalyse</title>
    <meta name="description" content="${t.metaDesc}" />
    <meta name="keywords" content="${t.keywords}" />
    <meta name="theme-color" content="#100c1f" />
    <meta name="robots" content="index,follow" />
    <link rel="canonical" href="https://ethyria.at/symbols/${sym.slug}.html" />
    <link rel="alternate" hreflang="de" href="https://ethyria.at/symbols/${sym.slug}.html" />
    <link rel="alternate" hreflang="x-default" href="https://ethyria.at/symbols/${sym.slug}.html" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="https://ethyria.at/symbols/${sym.slug}.html" />
    <meta property="og:title" content="${t.h1}" />
    <meta property="og:description" content="${t.metaDesc}" />
    <meta property="og:image" content="https://ethyria.at/assets/og-image-de.png" />
    <meta property="og:locale" content="de_DE" />
    <meta property="og:site_name" content="Ethyria" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${t.h1}" />
    <meta name="twitter:description" content="${t.metaDesc}" />

    <!-- JSON-LD: Article -->
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "${t.h1}",
        "description": "${t.metaDesc}",
        "url": "https://ethyria.at/symbols/${sym.slug}.html",
        "datePublished": "2026-04-13",
        "dateModified": "2026-04-13",
        "author": {
          "@type": "Organization",
          "name": "Ethyria",
          "url": "https://ethyria.at/"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Ethyria",
          "url": "https://ethyria.at/",
          "logo": "https://ethyria.at/assets/Ethyria_symbol.png"
        },
        "mainEntityOfPage": "https://ethyria.at/symbols/${sym.slug}.html",
        "inLanguage": "de",
        "keywords": "${t.keywords}"
      }
    </script>

    <!-- JSON-LD: BreadcrumbList -->
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Ethyria",
            "item": "https://ethyria.at/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Traumsymbole",
            "item": "https://ethyria.at/symbols/"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "${t.title}",
            "item": "https://ethyria.at/symbols/${sym.slug}.html"
          }
        ]
      }
    </script>

    <link rel="stylesheet" href="../style.css" />
    <link rel="stylesheet" href="../assets/tailwind.min.css" />
  </head>
  <body class="bg-[#100c1f] text-white min-h-screen">
    <!-- Breadcrumb Navigation -->
    <nav class="max-w-3xl mx-auto px-6 pt-6 text-sm text-gray-400" aria-label="Breadcrumb">
      <ol class="flex items-center gap-2">
        <li><a href="/" class="hover:text-cyan-400 transition-colors">Ethyria</a></li>
        <li aria-hidden="true">›</li>
        <li><a href="index.html" class="hover:text-cyan-400 transition-colors">Traumsymbole</a></li>
        <li aria-hidden="true">›</li>
        <li class="text-gray-300">${t.title}</li>
      </ol>
    </nav>

    <main class="max-w-3xl mx-auto px-6 py-12">
      <!-- Hero -->
      <header class="mb-12 text-center">
        <span class="text-6xl mb-6 block" aria-hidden="true">${sym.emoji}</span>
        <h1 class="text-4xl sm:text-5xl font-bold mb-4 leading-tight" style="font-family:Poppins,Arial,sans-serif;background:linear-gradient(90deg,#22d3ee 0%,#60a5fa 35%,#a78bfa 70%,#f0abfc 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">
          ${t.h1}
        </h1>
        <p class="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
          ${t.intro}
        </p>
      </header>

      <!-- Freud -->
      <section class="mb-10 p-6 rounded-2xl" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.10);">
        <h2 class="text-2xl font-bold mb-4" style="font-family:Poppins,Arial,sans-serif;color:#22d3ee;">
          🧠 Traumdeutung nach Freud
        </h2>
        <p class="text-gray-300 leading-relaxed">${t.freud}</p>
      </section>

      <!-- Jung -->
      <section class="mb-10 p-6 rounded-2xl" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.10);">
        <h2 class="text-2xl font-bold mb-4" style="font-family:Poppins,Arial,sans-serif;color:#60a5fa;">
          🔮 Traumdeutung nach Jung
        </h2>
        <p class="text-gray-300 leading-relaxed">${t.jung}</p>
      </section>

      <!-- Spiritual -->
      <section class="mb-10 p-6 rounded-2xl" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.10);">
        <h2 class="text-2xl font-bold mb-4" style="font-family:Poppins,Arial,sans-serif;color:#a78bfa;">
          ✨ Spirituelle & Islamische Deutung
        </h2>
        <p class="text-gray-300 leading-relaxed">${t.spiritual}</p>
      </section>

      <!-- Variants -->
      <section class="mb-10 p-6 rounded-2xl" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.10);">
        <h2 class="text-2xl font-bold mb-4" style="font-family:Poppins,Arial,sans-serif;background:linear-gradient(90deg,#22d3ee,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">
          🔄 Häufige Varianten
        </h2>
        <ul class="text-gray-300 leading-relaxed list-none space-y-1">
                    ${variantsHtml}
                  </ul>
      </section>

      <!-- CTA -->
      <section class="text-center py-12">
        <h2 class="text-2xl sm:text-3xl font-bold mb-4" style="font-family:Poppins,Arial,sans-serif;background:linear-gradient(90deg,#22d3ee,#60a5fa,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">
          Analysiere deinen Traum jetzt mit Ethyria
        </h2>
        <p class="text-gray-300 mb-6 max-w-lg mx-auto">
          5 Analyse-Perspektiven. KI-gestützt. Privat und verschlüsselt. Dein Traumtagebuch mit Bedeutung.
        </p>
        <a href="/" class="inline-block px-8 py-4 font-bold text-white rounded-2xl text-lg" style="font-family:Poppins,Arial,sans-serif;background:linear-gradient(135deg,#01bfff 0%,#0066ff 100%);box-shadow:0 6px 24px rgba(1,191,255,0.30);">
          ▸ Kostenlos starten
        </a>
      </section>

      <!-- Related Symbols -->
      <nav class="border-t border-white/10 pt-8">
        <h3 class="text-lg font-bold mb-4 text-gray-400">Verwandte Traumsymbole</h3>
        <div class="flex flex-wrap gap-3" id="related-symbols"></div>
      </nav>
    </main>

    <!-- Footer -->
    <footer class="text-center py-8 text-xs text-gray-500 border-t border-white/5">
      <p>Ethyria | Traumdeutung App mit KI · Traumtagebuch &amp; Traumanalyse (Android)</p>
      <p class="mt-1">
        <a href="https://ethyria.at" class="text-cyan-500 hover:underline">ethyria.at</a> |
        <a href="mailto:support@ethyria.at" class="text-cyan-500 hover:underline">support@ethyria.at</a>
      </p>
    </footer>

    <!-- Related symbols dynamic fill -->
    <script>
      (function () {
        var allSymbols = ${JSON.stringify(symbols.map((s) => ({ slug: s.slug, emoji: s.emoji, title: s.de.title })))};
        var current = '${sym.slug}';
        var container = document.getElementById('related-symbols');
        var others = allSymbols.filter(function (s) { return s.slug !== current; });
        // Shuffle and take 5
        for (var i = others.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var temp = others[i]; others[i] = others[j]; others[j] = temp;
        }
        others.slice(0, 5).forEach(function (s) {
          var a = document.createElement('a');
          a.href = '/symbols/' + s.slug + '.html';
          a.className = 'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm text-gray-300 hover:text-white transition-colors';
          a.style.cssText = 'background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.10);';
          a.textContent = s.emoji + ' ' + s.title;
          container.appendChild(a);
        });
      })();
    </script>

    <!-- Service Worker -->
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
          navigator.serviceWorker.register('/sw.js').catch(function () {});
        });
      }
    </script>
  </body>
</html>`;

  const filePath = path.join(dir, sym.slug + ".html");
  fs.writeFileSync(filePath, html, "utf8");
  console.log("Created: " + filePath);
}

console.log("\\nAll " + symbols.length + " symbol pages generated.");
