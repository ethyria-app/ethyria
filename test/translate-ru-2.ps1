$file = "c:\Ethyria_LandingPage\test\index.test.ru.html"
$c = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

# ===== SCREENSHOTS SECTION =====
$c = $c.Replace('THE APP', 'В Приложении')
$c = $c.Replace('>Experience <span class="ethyria-gradient-text">Ethyria</span>', '>Откройте <span class="ethyria-gradient-text">Ethyria</span>')
$c = $c.Replace('Three real screens from the app '+[char]0x2014+' Analysis, Community, and'+"`r`n"+'            Statistics.', 'Три реальных экрана приложения — Анализ, Сообщество и Статистика.')

# Analysis card
$c = $c.Replace('Dream Analysis', 'Анализ Снов')
$c = $c.Replace('src="../assets/analysis.jpg"', 'src="../assets/analysis_ru.jpg"')
$c = $c.Replace('alt="Ethyria Analysis Screen with AI dream interpretation"', 'alt="Экран анализа Ethyria"')
$c = $c.Replace('Choose your analysis type and receive a deep AI interpretation'+"`r`n"+'              based on Freud, Jung, or biosynchronous methods.', 'Выберите тип анализа и получите глубокую ИИ-интерпретацию на основе Фрейда, Юнга или биосинхронных методов.')

# Aether card
$c = $c.Replace('<h3 class="text-2xl font-bold">Aether</h3>', '<h3 class="text-2xl font-bold">Эфир</h3>')
$c = $c.Replace('src="../assets/ether.jpg"', 'src="../assets/ether_ru.jpg"')
$c = $c.Replace('alt="Ethyria Aether community screen"', 'alt="Сообщество Эфир Ethyria"')
$c = $c.Replace('Explore global dream trends and dive into a growing community'+"`r`n"+'              of dreamers.', 'Откройте мировые тренды сновидений и погрузитесь в растущее сообщество сновидцев.')

# Statistics card
$c = $c.Replace('<h3 class="text-2xl font-bold">Statistics</h3>', '<h3 class="text-2xl font-bold">Статистика</h3>')
$c = $c.Replace('src="../assets/statistic.jpg"', 'src="../assets/statistic_ru.jpg"')
$c = $c.Replace('alt="Ethyria Statistics Screen"', 'alt="Статистика Ethyria"')
$c = $c.Replace('Understand your sleep patterns through detailed evaluations and'+"`r`n"+'              unlock your subconscious.', 'Поймите свои паттерны сна через детальные оценки и откройте своё подсознание.')

# ===== 5 PERSPECTIVES SECTION =====
$c = $c.Replace('Interpretation Layers', 'Слои Интерпретации')
$c = $c.Replace('5 <span class="ethyria-gradient-text">Analysis</span> Perspectives', '5 <span class="ethyria-gradient-text">Перспектив</span> Анализа')
$c = $c.Replace('Each dream demands its own angle of reflection. Our AI interprets'+"`r`n"+'            your dreams through five different methods.', 'Каждый сон требует своего угла зрения. Наш ИИ интерпретирует ваши сны с помощью пяти разных методов.')

# Card 1 — General
$c = $c.Replace('>General<', '>Общий<')
$c = $c.Replace('General Interpretation', 'Общее Толкование')
$c = $c.Replace('Wide, deep, and unbiased. The AI analyzes symbols, emotions, and'+"`r`n"+'              narrative structure of your dream without a school preference.', 'Широкое, глубокое и непредвзятое. ИИ анализирует символы, эмоции и нарративную структуру вашего сна без привязки к школе.')
$c = $c.Replace('Entry Level', 'Начальный Уровень')

# Card 2 — Freud
$c = $c.Replace('Classical Psychoanalysis', 'Классический психоанализ')
$c = $c.Replace('Unconscious desires, repressed conflicts, and drives under the'+"`r`n"+'              microscope. The dream censor decoded.', 'Бессознательные желания, вытесненные конфликты и влечения под пристальным вниманием. Цензор сна расшифрован.')
$c = $c.Replace('Depth Psychology', 'Глубинная Психология')

# Card 3 — Jung
$c = $c.Replace('Analytical Psychology', 'Аналитическая Психология')
$c = $c.Replace('Archetypes, shadow, anima, and the collective unconscious. The path'+"`r`n"+'              to individuation starts with the dream.', 'Архетипы, тень, анима и коллективное бессознательное. Путь к индивидуации начинается со сна.')
$c = $c.Replace('Archetypes', 'Архетипы')

# Card 4 — Spiritual
$c = $c.Replace('>Spiritual<', '>Духовный<')
$c = $c.Replace('Spiritual Reflection', 'Духовное Толкование')
$c = $c.Replace('Messages from the soul, cosmic signs, and energy patterns. Your'+"`r`n"+'              dream as a mirror of inner truth.', 'Послания души, космические знаки и энергетические паттерны. Ваш сон как зеркало внутренней правды.')
$c = $c.Replace('Soul &amp; Cosmos', 'Душа и Космос')

# Card 5 — BMA
$c = $c.Replace('Biosynchronous Analysis', 'Биосинхронный Анализ')
$c = $c.Replace('Heart rate, HRV, and sleep phases from Health Connect flow directly'+"`r`n"+'              into the interpretation. Body and dream as one.', 'Частота пульса, ВСР и фазы сна из Health Connect поступают напрямую в интерпретацию. Тело и сон как одно целое.')
$c = $c.Replace('Biometrics + AI', 'Биометрия + ИИ')

[System.IO.File]::WriteAllText($file, $c, [System.Text.Encoding]::UTF8)
Write-Host "RU Part 2 done"
