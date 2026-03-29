$file = "c:\Ethyria_LandingPage\test\index.test.ru.html"
$c = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

# ===== VISION SECTION =====
$c = $c.Replace('Creative Modes', 'Творческие Режимы')
$c = $c.Replace('Choose from three generative modes and transform your dream into a'+"`r`n"+'            visual memory.', 'Выберите один из трёх генеративных режимов и превратите сон в визуальный образ.')

# Dream Symbol card
$c = $c.Replace('<h3 class="text-2xl font-bold mb-4">Dream Symbol</h3>', '<h3 class="text-2xl font-bold mb-4">Символ Сна</h3>')
$c = $c.Replace('alt="AI-generated dream symbol artwork"', 'alt="Символ Сна '+[char]0x2013+' Ethyria Vision"')
$c = $c.Replace('Focus on the strongest symbol of your dream. Ethyria isolates the'+"`r`n"+'              image your subconscious keeps returning to.', 'Выделите самый сильный символ сна. Ethyria фокусируется на том, что ваше подсознание выводит на первый план.')

# Dream Emotion card
$c = $c.Replace('<h3 class="text-2xl font-bold mb-4">Dream Emotion</h3>', '<h3 class="text-2xl font-bold mb-4">Эмоция Сна</h3>')
$c = $c.Replace('alt="AI-generated dream emotion artwork"', 'alt="Эмоция Сна '+[char]0x2013+' Ethyria Vision"')
$c = $c.Replace('We translate the emotional mood of your dream into abstract color'+"`r`n"+'              worlds, atmosphere, and flowing forms.', 'Мы переводим эмоциональный тон сна в абстрактный цвет, атмосферу и плавные формы.')

# Full Dream card
$c = $c.Replace('<h3 class="text-2xl font-bold mb-4">Full Dream</h3>', '<h3 class="text-2xl font-bold mb-4">Сон целиком</h3>')
$c = $c.Replace('alt="AI-generated full dream scene"', 'alt="Сон целиком '+[char]0x2013+' Ethyria Vision"')
$c = $c.Replace('The complete scene. Ethyria turns the full narrative of your dream'+"`r`n"+'              into a cohesive visual composition you can step back into.', 'Полная картина. Ethyria превращает весь сюжет сна в цельную визуальную композицию, к которой можно вернуться.')

# ===== USP SECTION =====
$c = $c.Replace('Why Ethyria is Different', 'Чем Ethyria отличается')
$c = $c.Replace('Science meets <br /><span class="ethyria-gradient-text"'+"`r`n"+'                >Intuition.</span', 'Наука встречает <br /><span class="ethyria-gradient-text"'+"`r`n"+'                >Интуицию.</span')
$c = $c.Replace("Five reasons Ethyria isn't just another dream interpretation app "+[char]0x2014+"`r`n"+'              but a real tool to explore your subconscious.', 'Пять причин, почему Ethyria — не просто очередное приложение для толкования снов, а первый по-настоящему полезный инструмент для изучения собственного подсознания.')

# USP 01 — Exklusiv (DE leftover)
$c = $c.Replace('Exklusiv', 'Эксклюзив')
$c = $c.Replace('Biosynchronous Multimodal Analysis', 'Биосинхронный Мультимодальный Анализ')
$c = $c.Replace('                  No other app connects heart rate, sleep phases, and dream'+"`r`n"+'                  content into a single analysis. Ethyria reads your body '+[char]0x2014+' and'+"`r`n"+'                  your dream '+[char]0x2014+' at the same time. An experimental approach,'+"`r`n"+'                  unique to Ethyria.', '                  Ни одно другое приложение не связывает частоту пульса, фазы сна и содержание сна в едином анализе. Ethyria читает ваше тело — и ваш сон — одновременно.')

# USP 02 — Tiefe (DE leftover)
$c = $c.Replace('Tiefe', 'Глубина')
$c = $c.Replace('5 Perspectives '+[char]0x2014+' Multi-layered Insight', '5 Перспектив — одна истина')
$c = $c.Replace('                  Freud, Jung, general, spiritual, biosynchronous '+[char]0x2014+' not as a'+"`r`n"+'                  choice alone, but as complementary layers. Your dream is'+"`r`n"+'                  illuminated from multiple angles simultaneously.', '                  Фрейд, Юнг, общий, духовный, биосинхронный — не как выбор, а как слои. Ваш сон освещается пятью линзами одновременно, ИИ синтезирует результат.')

# USP 03 — Wachstum (DE leftover)
$c = $c.Replace('Wachstum', 'Рост')
$c = $c.Replace('Recognize Your Own Patterns', 'Вы распознаёте паттерны — не мы')
$c = $c.Replace('                  Ethyria stores every analysis and shows you over weeks which'+"`r`n"+'                  archetypes and emotions recur '+[char]0x2014+' for a deeper'+"`r`n"+'                  self-understanding over time.', '                  Ethyria сохраняет каждый анализ и показывает вам через недели, какие архетипы и эмоции повторяются — чтобы вы знали себя лучше.')

# USP 04 — Einzigartig (DE leftover)
$c = $c.Replace('Einzigartig', 'Уникально')
$c = $c.Replace('Your Dream as Art', 'Ваш Сон как Искусство')
$c = $c.Replace('                  AI-generated images that depict your dream as symbol, emotion,'+"`r`n"+'                  or full scene '+[char]0x2014+' no filter, no template. A work of art that'+"`r`n"+'                  exists only once: for you.', '                  Изображения, сгенерированные ИИ, которые изображают ваш сон как символ, эмоцию или общую сцену — без фильтров, без шаблонов. Произведение искусства, которое существует лишь раз: для вас.')

# USP 05 — Vertrauen (DE leftover)
$c = $c.Replace('Vertrauen', 'Доверие')
$c = $c.Replace('Your Data. Only Yours.', 'Ваши Данные. Только Ваши.')
$c = $c.Replace('                  Your dream journal stays encrypted, local, and never used for'+"`r`n"+'                  training. What you experience at night is the most private'+"`r`n"+'                  thing there is '+[char]0x2014+' we treat it that way.', '                  Ваш дневник снов остаётся зашифрованным, локальным и никогда не используется для обучения. То, что вы переживаете ночью — самое личное, что есть — мы относимся к этому именно так.')

# ===== EXPORT SECTION =====
$c = $c.Replace('Premium Feature', 'Премиум-функция')
$c = $c.Replace('Export your insights<br />'+"`r`n"+'              <span class="ethyria-gradient-text">as a PDF document</span>', 'Экспортируйте свои инсайты<br />'+"`r`n"+'              <span class="ethyria-gradient-text">в PDF-документ</span>')
$c = $c.Replace('PDF export is a premium feature. Export your analyses as a'+"`r`n"+'            professionally designed PDF '+[char]0x2014+' at any time.', 'Экспорт в PDF — это премиум-функция. Экспортируйте свои анализы в виде профессионально оформленного PDF в любое время.')

# Analysis Export card
$c = $c.Replace('<h3 class="text-xl font-bold">Analysis Export</h3>', '<h3 class="text-xl font-bold">Экспорт Анализа</h3>')
$c = $c.Replace('Complete Interpretation as PDF', 'Полная Интерпретация в PDF')
$c = $c.Replace('Export each AI analysis as a professionally designed PDF'+"`r`n"+'                      document. This feature is premium and not available for'+"`r`n"+'                      free.', 'Экспортируйте каждый ИИ-анализ как профессионально оформленный PDF-документ. Эта функция премиум и недоступна бесплатно.')

# Statistics Export card
$c = $c.Replace('<h3 class="text-xl font-bold">Statistics Export</h3>', '<h3 class="text-xl font-bold">Экспорт Статистики</h3>')
$c = $c.Replace('Monthly &amp; Annual Report as PDF', 'Месячный и Годовой Отчёт в PDF')
$c = $c.Replace('Receive automatically generated summaries as PDF. This'+"`r`n"+'                      feature is premium and not available for free.', 'Получайте автоматически созданные сводки в формате PDF. Эта функция премиум и недоступна бесплатно.')

# Export trust bar
$c = $c.Replace('Your data only leaves the device on your command', 'Данные покидают устройство только по вашей команде')
$c = $c.Replace('Full data download at any time', 'Полная загрузка данных в любое время')

[System.IO.File]::WriteAllText($file, $c, [System.Text.Encoding]::UTF8)
Write-Host "RU Part 4 done"
