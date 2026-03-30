$file = ".\test\index.test.ru.html"
$c = [System.IO.File]::ReadAllText($file)

# Theory card footer: Archetypen -> Архетипы
$c = $c.Replace('Archetypen', 'Архетипы')

# Spiritual card footer: Experience Mode -> Режим Опыта
$c = $c.Replace('Experience Mode', 'Режим Опыта')

# BMA footer: fix remaining EN "Experimental" -> Экспериментально
$c = $c.Replace('Биометрия + ИИ ' + [char]0x00B7 + ' Experimental', 'Биометрия + ИИ ' + [char]0x00B7 + ' Экспериментально')

[System.IO.File]::WriteAllText($file, $c, [System.Text.UTF8Encoding]::new($false))
Write-Host "RU fix-2 done"
