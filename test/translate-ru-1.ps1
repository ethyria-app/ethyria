$file = "c:\Ethyria_LandingPage\test\index.test.ru.html"
$c = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

# HTML lang
$c = $c.Replace('<html lang="en">', '<html lang="ru">')

# Title
$c = $c.Replace('Ethyria | AI Dream Interpretation &amp; Visual Dream Journal</title>', 'Ethyria | Ваши Сны как Визуальная Реальность</title>')

# Meta description (HTML-encoded &amp;)
$c = $c.Replace('Ethyria transforms your dreams into deep insights and AI-generated artworks. Dream interpretation based on Jung &amp; Freud, 5 analysis modes, visual dream journal.', 'Ethyria превращает ваши сны в глубокие инсайты и произведения искусства, созданные ИИ. Толкование снов по Юнгу и Фрейду, 5 режимов анализа и визуальный дневник снов.')

# Canonical URL
$c = $c.Replace('<link rel="canonical" href="https://ostyles.github.io/ethyria/" />', '<link rel="canonical" href="https://ostyles.github.io/ethyria/index.ru.html" />')

# OG image (covers og:image, twitter:image, JSON-LD image)
$c = $c.Replace('og-image-en.png', 'og-image-ru.png')

# OG & Twitter title
$c = $c.Replace('content="Ethyria | AI Dream Interpretation &amp; Visual Dream Journal"', 'content="Ethyria | Ваши Сны как Визуальная Реальность"')

# OG description
$c = $c.Replace('property="og:description"'+"`r`n"+'      content="Ethyria transforms your dreams into deep insights and AI-generated artworks. Dream interpretation based on Jung &amp; Freud, 5 analysis modes, visual dream journal."', 'property="og:description"'+"`r`n"+'      content="Ethyria превращает ваши сны в глубокие инсайты и произведения искусства, созданные ИИ. Толкование снов по Юнгу и Фрейду, 5 режимов анализа и визуальный дневник снов."')

# OG URL
$c = $c.Replace('property="og:url" content="https://ostyles.github.io/ethyria/"', 'property="og:url" content="https://ostyles.github.io/ethyria/index.ru.html"')

# OG image:alt
$c = $c.Replace('content="Ethyria app preview for AI dream interpretation and dream journaling"', 'content="Превью приложения Ethyria для ИИ-анализа снов и дневника снов"')

# OG locale
$c = $c.Replace('content="en_US"', 'content="ru_RU"')

# Twitter description
$c = $c.Replace('content="Ethyria transforms your dreams into deep insights and AI-generated artworks."', 'content="Ethyria превращает ваши сны в глубокие инсайты и произведения искусства, созданные ИИ."')

# Language switcher — move is-active from EN to RU
$c = $c.Replace('alt="EN" class="language-flag is-active"', 'alt="EN" class="language-flag"')
$c = $c.Replace('alt="RU" class="language-flag"', 'alt="RU" class="language-flag is-active"')

# JSON-LD WebPage — name, description, inLanguage (no HTML entities in JSON)
$c = $c.Replace('"name": "Ethyria | AI Dream Interpretation & Visual Dream Journal"', '"name": "Ethyria | Ваши Сны как Визуальная Реальность"')
$c = $c.Replace('"description": "Ethyria transforms your dreams into deep insights and AI-generated artworks. Dream interpretation based on Jung & Freud, 5 analysis modes, visual dream journal."', '"description": "Ethyria превращает ваши сны в глубокие инсайты и произведения искусства, созданные ИИ. Толкование снов по Юнгу и Фрейду, 5 режимов анализа и визуальный дневник снов."')
$c = $c.Replace('"inLanguage": "en"', '"inLanguage": "ru"')
$c = $c.Replace('"name": "AI dream interpretation and dream journaling"', '"name": "ИИ-анализ снов и дневник снов"')

# JSON-LD MobileApp name
$c = $c.Replace('"name": "Ethyria – Dream Interpretation & Dream Journal"', '"name": "Ethyria – Толкование Снов и Дневник Снов"')

# Hero badge
$c = $c.Replace('NEW - BECOME A BETA TESTER NOW', 'НОВОЕ - СТАНЬТЕ БЕТА-ТЕСТЕРОМ')

# h1 line 1
$c = $c.Replace('Don'+[char]0x0027+'t just dream. <br />', 'Не просто мечтай. <br />')

# h1 span
$c = $c.Replace('>See them.<', '>Увидь это.<')

# Hero subtitle (3 lines, 10-space indent)
$c = $c.Replace('Ethyria transforms your dreams into deep insights and unique visual'+"`r`n"+'          artworks. Cutting-edge AI interprets your subconscious from five'+"`r`n"+'          distinct perspectives '+[char]0x2014+' grounded in psychology.', 'Ethyria превращает ваши сны в глубокие открытия и уникальные визуальные работы. Передовой ИИ исследует ваше подсознание с пяти разных точек зрения.')

# Floating CTA
$c = $c.Replace('Be among the First 100 '+[char]0x2192, 'Будьте среди первых 100 '+[char]0x2192)

[System.IO.File]::WriteAllText($file, $c, [System.Text.Encoding]::UTF8)
Write-Host "RU Part 1 done"
