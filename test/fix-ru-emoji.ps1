$file = "c:\Ethyria_LandingPage\test\index.test.ru.html"
$c = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

# Emoji outside BMP — use ConvertFromUtf32() instead of [char]
$emoji_tense     = [char]::ConvertFromUtf32(0x1F630)  # 😰
$emoji_confusing = [char]::ConvertFromUtf32(0x1F300)  # 🌀
$emoji_building  = [char]::ConvertFromUtf32(0x1F311)  # 🌑
$emoji_barefoot  = [char]::ConvertFromUtf32(0x1F463)  # 👣
$emoji_export    = [char]::ConvertFromUtf32(0x1F4E4)  # 📤

$c = $c.Replace('>'+$emoji_tense+' Tense<',      '>'+$emoji_tense+' Напряжение<')
$c = $c.Replace('>'+$emoji_confusing+' Confusing<', '>'+$emoji_confusing+' Замешательство<')
$c = $c.Replace($emoji_building+' Building / Labyrinth', $emoji_building+' Здание / Лабиринт')
$c = $c.Replace($emoji_barefoot+' Being Barefoot',  $emoji_barefoot+' Босые Ноги')
$c = $c.Replace($emoji_export+' Export to Journal', $emoji_export+' Экспорт в Дневник')

[System.IO.File]::WriteAllText($file, $c, [System.Text.Encoding]::UTF8)
Write-Host "RU emoji fix done"
