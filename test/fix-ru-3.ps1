$file = ".\test\index.test.ru.html"
$c = [System.IO.File]::ReadAllText($file)
$CRLF = "`r`n"

# Freud card body: EN -> RU
$c = $c.Replace(
    '                  Unconscious desires, repressed conflicts, and drive nature' + $CRLF +
    '                  under the lens. The dream censor is decoded.',
    '                  Бессознательные желания, вытесненные конфликты и природа влечений' + $CRLF +
    '                  под лупой. Цензор сновидений расшифрован.'
)

# Jung card body: mixed EN/RU -> full RU
$c = $c.Replace(
    'Архетипы, shadow, anima, and the collective unconscious. The' + $CRLF +
    '                  path to individuation begins with the dream.',
    'Архетипы, тень, анима и коллективное бессознательное. Путь' + $CRLF +
    '                  к индивидуации начинается со сна.'
)

# BMA card body: EN -> RU
$c = $c.Replace(
    '                  Heart rate, HRV, and sleep phases from Health Connect flow' + $CRLF +
    '                  directly into the interpretation. An experimental approach' + $CRLF +
    '                  connecting body data with dream content.',
    '                  Пульс, ВСР и фазы сна из Health Connect напрямую' + $CRLF +
    '                  включаются в толкование. Экспериментальный подход,' + $CRLF +
    '                  связывающий данные тела с содержанием сна.'
)

[System.IO.File]::WriteAllText($file, $c, [System.Text.UTF8Encoding]::new($false))
Write-Host "RU fix-3 done"
