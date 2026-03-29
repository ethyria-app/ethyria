$file = "c:\Ethyria_LandingPage\test\index.test.ru.html"
$c = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

# ===== INSIGHT PATH HEADER =====
$c = $c.Replace('How it works', 'Как это работает')
$c = $c.Replace('The Insight Path:<br />'+"`r`n"+'              From Fragments to Clarity', 'Путь Инсайта:<br />'+"`r`n"+'              От Фрагментов к Ясности')
$c = $c.Replace('From raw dream to concrete growth impulse '+[char]0x2014+' in four precise steps.', 'От сырого опыта сна к конкретному импульсу роста — за четыре точных шага.')
$c = $c.Replace('Live example from the app', 'Живой пример из приложения')

# ===== PHONE MOCKUP — Dream Journal (3-line CRLF context, targets phone header only) =====
$c = $c.Replace('                      "'+"`r`n"+'                    >'+"`r`n"+'                      Dream Journal', '                      "'+"`r`n"+'                    >'+"`r`n"+'                      Дневник Снов')
$c = $c.Replace('March 26, 2026 '+[char]0xB7+' 7:14 AM', '26 марта 2026 '+[char]0xB7+' 7:14')
$c = $c.Replace('Traumtitel', 'Название Сна')
$c = $c.Replace('The House of a Thousand Doors', 'Дом Тысячи Дверей')
$c = $c.Replace('>'+[char]0x1F630+' Tense<', '>'+[char]0x1F630+' Напряжение<')
$c = $c.Replace('>'+[char]0x1F300+' Confusing<', '>'+[char]0x1F300+' Замешательство<')
$c = $c.Replace('>'+[char]0x2728+' Relief<', '>'+[char]0x2728+' Облегчение<')
$c = $c.Replace('Traumbeschreibung', 'Описание Сна')
$c = $c.Replace('Voice input available', 'Голосовой ввод доступен')
$c = $c.Replace('Type or speak '+[char]0x2014+' secure & encrypted', 'Печатайте или говорите — безопасно и зашифровано')
$c = $c.Replace('Start AI Analysis '+[char]0x2192, 'Начать ИИ-Анализ '+[char]0x2192)
$c = $c.Replace('How the AI processes your dream', 'Как ИИ обрабатывает ваш сон')

# ===== MODULE 01: Capture / Narrative Core =====
$c = $c.Replace('01 '+[char]0xB7+' Capture', '01 '+[char]0xB7+' Захват')
$c = $c.Replace('Narrative Core', 'Нарративное Ядро')
$c = $c.Replace('                      We transform your words into actionable data points. NLP'+"`r`n"+'                      identifies symbols, entities, and emotional anchor points'+"`r`n"+'                      in real time '+[char]0x2014+' while you are still typing.', '                      Мы превращаем ваши слова в действенные точки данных. НЛП определяет символы, сущности и эмоциональные якорные точки в реальном времени — пока вы ещё печатаете.')
$c = $c.Replace('NLP '+[char]0xB7+' Real-time Extraction', 'НЛП '+[char]0xB7+' Извлечение в реальном времени')

# Token text — CRLF-safe (avoids dreamText contamination)
$c = $c.Replace("I find myself in a`r`n                        <span", "Я нахожусь в`r`n                        <span")
$c = $c.Replace("… I can't find the`r`n                        <span", "… Я не могу найти`r`n                        <span")

# Token labels
$c = $c.Replace('>building<', '>здании<')
$c = $c.Replace('>room<', '>комнату<')
$c = $c.Replace('>barefoot<', '>босиком<')
$c = $c.Replace('>fog<', '>туман<')

# Tags
$c = $c.Replace('Symbol '+[char]0xD7+'3', 'Символ '+[char]0xD7+'3')
$c = $c.Replace('Emotion '+[char]0xD7+'2', 'Эмоция '+[char]0xD7+'2')
$c = $c.Replace('Conflict '+[char]0xD7+'1', 'Конфликт '+[char]0xD7+'1')

# ===== MODULE 02: Filtering / Perspective Matrix =====
$c = $c.Replace('02 '+[char]0xB7+' Filtering', '02 '+[char]0xB7+' Фильтрация')
$c = $c.Replace('Perspective Matrix', 'Матрица Перспектив')
$c = $c.Replace("                      You determine the psychological framework. The chosen`r`n                      Executable Prompt is dynamically injected "+[char]0x2014+" no compromise`r`n                      between methods, just precise focus.", '                      Вы определяете психологическую рамку. Выбранный Executable Prompt динамически вводится — никаких компромиссов между методами, только точный фокус.')
$c = $c.Replace('Aktiv '+[char]0x2713, 'Активно '+[char]0x2713)
$c = $c.Replace('Prompt "Jung: Shadow &amp; Mask" loaded '+[char]0x2014+' dynamic'+"`r`n"+'                      injection active', 'Промпт « Юнг: Тень &amp; Маска » загружен — динамическая инъекция активна')

# ===== MODULE 03: Resonance / Emotional Echo =====
$c = $c.Replace('03 '+[char]0xB7+' Resonance', '03 '+[char]0xB7+' Резонанс')
$c = $c.Replace('Emotional Echo', 'Эмоциональное Эхо')
$c = $c.Replace('"We hear what lies between the lines." Unser sentiment'+"`r`n"+'                      tracking module visualizes the emotional dynamics of your'+"`r`n"+'                      dream '+[char]0x2014+' tension levels, resilience indicators, turning'+"`r`n"+'                      points.', '«Мы слышим то, что стоит между строк.» Наш модуль отслеживания настроений визуализирует эмоциональную динамику вашего сна — уровни напряжения, показатели устойчивости, поворотные моменты.')
$c = $c.Replace('Emotional Load '+[char]0xB7+' Dream Progression', 'Эмоциональная Нагрузка '+[char]0xB7+' Прогрессия Сна')
$c = $c.Replace('Barefoot '+[char]0xB7+' 7.8', 'Босиком '+[char]0xB7+' 7.8')
$c = $c.Replace('Fog '+[char]0xB7+' 2.1', 'Туман '+[char]0xB7+' 2.1')
$c = $c.Replace([char]0x26A1+' Stress Peak: Barefoot Sequence', [char]0x26A1+' Пик Стресса: Эпизод Босиком')
$c = $c.Replace([char]0x2713+' Resilience: fast relaxation', [char]0x2713+' Устойчивость: быстрое расслабление')

# ===== MODULE 04: Synthesis / Archetype Decoding =====
$c = $c.Replace('04 '+[char]0xB7+' Synthesis', '04 '+[char]0xB7+' Синтез')
$c = $c.Replace('Archetype Decoding', 'Декодирование Архетипов')
$c = $c.Replace('                      The AI links symbols with your personal context. Each card'+"`r`n"+'                      maps a symbol '+[char]0x2014+' and reveals the scientific source behind'+"`r`n"+'                      it.', '                      ИИ связывает символы с вашим личным контекстом. Каждая карточка отображает символ — и показывает научный источник за ним.')
$c = $c.Replace([char]0x1F311+' Building / Labyrinth', [char]0x1F311+' Здание / Лабиринт')
$c = $c.Replace('Archetype: The Self (Jung) '+[char]0xB7+' Disorientation', 'Архетип: Самость (Юнг) '+[char]0xB7+' Дезориентация')
$c = $c.Replace([char]0x1F463+' Being Barefoot', [char]0x1F463+' Босые Ноги')
$c = $c.Replace('Social Shame / Vulnerability '+[char]0xB7+' Performance Pressure', 'Социальный Стыд / Уязвимость '+[char]0xB7+' Давление Достижений')
$c = $c.Replace('Dissolution of Control '+[char]0xB7+' Transition / Transformation', 'Утрата Контроля '+[char]0xB7+' Переход / Трансформация')
$c = $c.Replace('>10,247 Dreams<', '>10 247 Снов<')
$c = $c.Replace('Mapped to &gt;10,000 psychological symbol definitions', 'Сопоставление с &gt;10 000 психологических определений символов')

# ===== MODULE 05: Transformation / Actionable Insight =====
$c = $c.Replace('05 '+[char]0xB7+' Transformation', '05 '+[char]0xB7+' Трансформация')
$c = $c.Replace('Actionable Insight', 'Практический Инсайт')
$c = $c.Replace('                      The dream becomes an insight for your waking life.'+"`r`n"+'                      Generative AI synthesizes individual coaching impulses '+[char]0x2014+"`r`n"+'                      not generic reading, but personal growth.', '                      Сон становится инсайтом для вашей бодрствующей жизни. Генеративный ИИ синтезирует индивидуальные коучинг-импульсы — не общее чтение, а личностный рост.')
$c = $c.Replace('Daily Reflection Question', 'Ежедневный Вопрос для Размышления')
$c = $c.Replace('"In which area of your life are you currently searching'+"`r`n"+"                        for a 'space' you haven't found yet "+[char]0x2014+' and what is'+"`r`n"+'                        preventing you from opening the right door?"', '„В какой сфере вашей жизни вы сейчас ищете «пространство», которое ещё не нашли — и что мешает вам открыть нужную дверь?"')
$c = $c.Replace('>Shadow '+[char]0xB7+' Jung<', '>Тень '+[char]0xB7+' Юнг<')
$c = $c.Replace('>Performance Pressure<', '>Давление Достижений<')
$c = $c.Replace('>Transformation<', '>Трансформация<')
$c = $c.Replace('+ Compare Emotional History', '+ Сравнить Эмоциональную Историю')
$c = $c.Replace([char]0x1F4E4+' Export to Journal', [char]0x1F4E4+' Экспорт в Дневник')
$c = $c.Replace('"Knowledge that accompanies you through the day."', '"Знание, которое сопровождает вас весь день."')

[System.IO.File]::WriteAllText($file, $c, [System.Text.Encoding]::UTF8)
Write-Host "RU Part 3 done"
