$file = "c:\Ethyria_LandingPage\test\index.test.ru.html"
$c = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

# ===== BETA SECTION =====
$c = $c.Replace('Beta '+[char]0x2014+' Limited Access', 'Бета — Ограниченный Доступ')
$c = $c.Replace('Become part of the<br /><span class="ethyria-gradient-text"'+"`r`n"+'              >Ethyria Dream Community!</span', 'Станьте частью<br /><span class="ethyria-gradient-text"'+"`r`n"+'              >сообщества сновидцев Ethyria!</span')
$c = $c.Replace('Your dreams. Scientifically decoded.', 'Ваши сны. Научно расшифрованы.')
$c = $c.Replace('            We are looking for pioneers who want to shape the future of digital'+"`r`n"+'            dream analysis with us. As a thank-you for your early trust, we give'+"`r`n"+'            you full access to our technology.', '            Мы ищем 100 первопроходцев, которые вместе с нами создадут будущее цифрового анализа снов. В благодарность за ваше раннее доверие мы даем вам полный доступ к нашей технологии.')
$c = $c.Replace('<span class="ethyria-gradient-text">Your Starter Package:</span>', '<span class="ethyria-gradient-text">Ваш стартовый пакет:</span>')
$c = $c.Replace('30 days of Ethyria Premium for free.', '30 дней Ethyria Premium бесплатно.')
$c = $c.Replace('All analysis features &amp; tools included.', 'Все функции анализа и инструменты PaaS включены.')
$c = $c.Replace('No subscription, no catch, full transparency.', 'Без подписки, без подвоха, полная прозрачность.')
# "Secure another free month" span (unique text content, 16-space CRLF line)
$c = $c.Replace('                >Secure another free month:</span', '                >Получите еще один бесплатный месяц:</span')
$c = $c.Replace('              We will unlock another 30 days of Premium if you briefly support'+"`r`n"+'              us after your test:', '              Мы откроем вам еще 30 дней Premium, если после теста вы коротко нас поддержите:')
$c = $c.Replace('Send us a short review of your experience.', 'Отправьте нам короткий отзыв о вашем опыте.')
$c = $c.Replace('Complete our 2-minute questionnaire.', 'Заполните нашу 2-минутную анкету.')
$c = $c.Replace("            Enter your email address here and you'll receive your exclusive`r`n            download link in your personal inbox.", '            Введите здесь свой адрес электронной почты, и вы получите эксклюзивную ссылку для скачивания в свой личный почтовый ящик.')
$c = $c.Replace('>Email Address<', '>Адрес электронной почты<')
$c = $c.Replace('placeholder="your@email.com"', 'placeholder="ваш@email.com"')
$c = $c.Replace('>Claim Access '+[char]0x2192+'<', '>Получить доступ '+[char]0x2192+'<')
$c = $c.Replace('Worth '+[char]0x20AC+'7.99 per month', 'На сумму 7,99 '+[char]0x20AC+' в месяц')
$c = $c.Replace('No credit card required', 'Кредитная карта не требуется')
$c = $c.Replace('100% free until the end of the'+"`r`n"+'              trial period', '100 % бесплатно до окончания пробного периода')
$c = $c.Replace('Bald auch im Google Play Store free.', 'Скоро также в Google Play Store.')

# ===== FAQ SECTION =====
$c = $c.Replace('Frequently Asked'+"`r`n"+'              <span class="ethyria-gradient-text">Questions</span>', 'Часто задаваемые <span class="ethyria-gradient-text">вопросы</span>')
$c = $c.Replace('Transparent answers about pricing, privacy, AI dream analysis, and'+"`r`n"+'              device availability.', 'Прозрачные ответы о цене, конфиденциальности, ИИ-анализе снов и доступности устройств.')

# Q1
$c = $c.Replace('Is Ethyria really free?', 'Ethyria действительно бесплатна?')
$c = $c.Replace('                Yes. You can use Ethyria for free. Optional in-app purchases'+"`r`n"+'                unlock additional premium features like PDF exports and extended'+"`r`n"+'                analyses.', '                Да. Приложением можно пользоваться бесплатно, а премиум-возможности открываются через опциональные встроенные покупки.')

# Q2
$c = $c.Replace('How safe is my dream data?', 'Насколько безопасны мои данные о снах?')
$c = $c.Replace('                Your privacy comes first. Your dream data stays on your device '+[char]0x2014+"`r`n"+'                no cloud required, no tracking.', '                Ваша конфиденциальность — наш приоритет. Все данные о снах остаются на вашем устройстве — без облака, без отслеживания данных.')

# Q3
$c = $c.Replace('How does the AI dream analysis work?', 'Как работает ИИ-анализ снов?')
$c = $c.Replace('                Ethyria uses advanced AI to identify symbols, emotional themes,'+"`r`n"+'                and recurring patterns using psychological approaches based on'+"`r`n"+'                Jung and Freud.', '                Ethyria использует продвинутые модели ИИ для интерпретации ваших снов на основе психологических методов К.Г. Юнга и Зигмунда Фрейда.')

# Q4
$c = $c.Replace('Which analysis modes does Ethyria offer?', 'Какие режимы анализа предлагает Ethyria?')
$c = $c.Replace('                Ethyria offers five analysis perspectives: General'+"`r`n"+'                Interpretation, Freudian Psychoanalysis, Jungian Analytical'+"`r`n"+'                Psychology, Spiritual Reflection, and Biosynchronous Analysis.', '                Ethyria предлагает 5 перспектив анализа: Символический Анализ, Эмоциональный Профиль, Распознавание Паттернов, Научная Классификация и Общий Синтез.')

# Q5
$c = $c.Replace('Which devices is Ethyria available on?', 'На каких устройствах доступна Ethyria?')
$c = $c.Replace('                Ethyria is currently available for Android. An iOS version is in'+"`r`n"+'                development.', '                Сейчас Ethyria доступна на Android. Версия для iOS находится в разработке.')

# ===== DISCOVERABILITY SECTION =====
$c = $c.Replace('Entdecken', 'Поисковое намерение')
$c = $c.Replace('More than a'+"`r`n"+'              <span class="ethyria-gradient-text">Dream Journal</span>', 'Больше, чем просто'+"`r`n"+'              <span class="ethyria-gradient-text">дневник снов</span>')
$c = $c.Replace('              Ethyria brings together AI dream interpretation, a private dream'+"`r`n"+'              journal, psychology-informed analysis, and visual dream insights'+"`r`n"+'              in one Android app.', '              Ethyria объединяет ИИ-толкование снов, приватный дневник, анализ с опорой на психологию и визуальные интерпретации в одном Android-приложении.')

# Article 1
$c = $c.Replace('Dream interpretation with real depth', 'Приложение для толкования снов с глубоким анализом')
$c = $c.Replace('                Ethyria turns symbols, emotions, and recurring patterns into'+"`r`n"+'                nuanced AI readings instead of vague generalities.', '                Ethyria превращает символы, эмоции и повторяющиеся паттерны в интерпретации с помощью ИИ, а не в расплывчатые общие формулировки.')

# Article 2
$c = $c.Replace('Private dream journal for Android', 'Приватный дневник снов для Android')
$c = $c.Replace('                Record dreams, spot recurring themes, and build a structured'+"`r`n"+'                dream journal with visualizations and export options.', '                Записывайте сны, отслеживайте повторяющиеся темы и ведите структурированный дневник с визуализацией и экспортом.')

# Article 3
$c = $c.Replace('Psychology-based analysis modes', 'Режимы анализа на основе психологии')
$c = $c.Replace('                Explore multiple interpretation perspectives inspired by Jung,'+"`r`n"+'                Freud, symbolic dream interpretation, emotional patterns, and'+"`r`n"+'                scientific framing.', '                Изучайте сон с разных точек зрения, вдохновлённых Юнгом, Фрейдом, символическим толкованием, эмоциональными паттернами и более научным подходом.')

# Article 4
$c = $c.Replace('Patterns, statistics, and visual insights', 'Паттерны, статистика и визуальные инсайты')
$c = $c.Replace('                Discover recurring symbols, emotional shifts, and sleep-related'+"`r`n"+'                patterns through a clear, visual analysis workflow.', '                Отслеживайте повторяющиеся символы, эмоциональные сдвиги и связанные со сном паттерны в современном и наглядном анализе.')

# ===== JS CONFIG =====
$c = $c.Replace('locale: "en"', 'locale: "ru"')
$c = $c.Replace('sourcePage: "index.test.html"', 'sourcePage: "index.test.ru.html"')
$c = $c.Replace('"Your email was added successfully. Check your inbox for the download link."', '"Ваш email успешно добавлен. Проверьте входящие сообщения."')
$c = $c.Replace('"This email is already on the list. Please check your inbox."', '"Этот email уже есть в списке. Проверьте входящие сообщения."')
$c = $c.Replace('"Your email was saved, but the automatic email could not be sent yet."', '"Ваш email сохранён, но автоматическое письмо пока не отправлено."')
$c = $c.Replace('"Please enter a valid email address."', '"Пожалуйста, введите корректный email."')
$c = $c.Replace('"Saving your spot..."', '"Сохраняем вашу заявку..."')
$c = $c.Replace('"We could not save your email right now. Please try again in a moment."', '"Сейчас не удалось сохранить ваш email. Попробуйте ещё раз через минуту."')
$c = $c.Replace('"Signup is not live yet. Add the Apps Script URL first."', '"Форма ещё не активна. Сначала добавьте URL Apps Script."')
$c = $c.Replace('"buttonIdle: \"Claim Access '+[char]0x2192+'\"', '"buttonIdle: \"Получить доступ '+[char]0x2192+'\"')
$c = $c.Replace('buttonIdle: "Claim Access '+[char]0x2192+'"', 'buttonIdle: "Получить доступ '+[char]0x2192+'"')
$c = $c.Replace('buttonLoading: "Saving..."', 'buttonLoading: "Отправка..."')

# ===== DREAM TEXT (typewriter) =====
$c = $c.Replace('"I find myself in a vast, light-flooded building that resembles a mix of a museum and an old train station. I know I have an important appointment, but I can'+[char]0x27+'t find the right room. Everywhere there are doors of dark wood, behind which soft murmuring can be heard.\n\nSuddenly I notice that I'+[char]0x27+'m barefoot '+[char]0x2014+' which feels strangely uncomfortable. I open a door and stand in dense, blue fog. There: an empty desk. I feel relieved, even though I haven'+[char]0x27+'t reached my goal yet..."', '"Я оказываюсь в огромном, залитом светом здании, напоминающем смесь музея и старого вокзала. Я знаю, что у меня важная встреча, но не могу найти нужную комнату. Повсюду двери из тёмного дерева, за которыми слышны тихие шёпоты.\n\nВдруг я замечаю, что я босиком — и это почему-то неприятно. Я открываю дверь и оказываюсь в густом голубом тумане. Там: пустой письменный стол. Я чувствую облегчение, хотя ещё не достиг своей цели..."')

# ===== JSON-LD FAQ =====
$c = $c.Replace('"name": "Is Ethyria really free?"', '"name": "Ethyria действительно бесплатна?"')
$c = $c.Replace('"text": "Yes. You can use Ethyria for free. Optional in-app purchases unlock additional premium features like PDF exports and extended analyses."', '"text": "Да, приложением можно пользоваться бесплатно, а премиум-функции доступны через встроенные покупки."')
$c = $c.Replace('"name": "How safe is my dream data?"', '"name": "Насколько безопасны мои данные о снах?"')
$c = $c.Replace('"text": "Your privacy comes first. Your dream data stays on your device '+[char]0x2014+' no cloud required, no tracking."', '"text": "Ваша конфиденциальность — наш приоритет. Все данные о снах остаются на вашем устройстве — без облака, без отслеживания данных."')
$c = $c.Replace('"name": "How does the AI dream analysis work?"', '"name": "Как работает ИИ-анализ снов?"')
$c = $c.Replace('"text": "Ethyria uses advanced AI to identify symbols, emotional themes, and recurring patterns using psychological approaches based on Jung and Freud."', '"text": "Ethyria использует продвинутые модели ИИ для интерпретации ваших снов на основе психологических методов К.Г. Юнга и Зигмунда Фрейда."')
$c = $c.Replace('"name": "Which analysis modes does Ethyria offer?"', '"name": "Какие режимы анализа предлагает Ethyria?"')
$c = $c.Replace('"text": "Ethyria offers five analysis perspectives: General Interpretation, Freudian Psychoanalysis, Jungian Analytical Psychology, Spiritual Reflection, and Biosynchronous Analysis."', '"text": "Ethyria предлагает 5 перспектив анализа: Символический Анализ, Эмоциональный Профиль, Распознавание Паттернов, Научная Классификация и Общий Синтез."')
$c = $c.Replace('"name": "Which devices is Ethyria available on?"', '"name": "На каких устройствах доступна Ethyria?"')
$c = $c.Replace('"text": "Ethyria is currently available for Android. An iOS version is in development."', '"text": "Ethyria в настоящее время доступна для Android. Версия для iOS находится в разработке."')

[System.IO.File]::WriteAllText($file, $c, [System.Text.Encoding]::UTF8)
Write-Host "RU Part 5 done"
