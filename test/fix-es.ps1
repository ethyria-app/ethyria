$file = ".\test\index.test.es.html"
$c = [System.IO.File]::ReadAllText($file)
$CRLF = "`r`n"

# --- Phone mockup labels ---
$c = $c.Replace('Traumtitel', 'T' + [char]0x00ED + 'tulo del Sue' + [char]0x00F1 + 'o')
$c = $c.Replace('Traumbeschreibung', 'Descripci' + [char]0x00F3 + 'n del Sue' + [char]0x00F1 + 'o')

# --- Module 02: Aktiv -> Activo ---
$c = $c.Replace('Aktiv ' + [char]0x2713, 'Activo ' + [char]0x2713)

# --- Module 03 h3: Emotional Echo -> Eco Emocional (CRLF-aware to avoid comment match) ---
$c = $c.Replace(
    '<h3 class="font-bold text-xl mb-2 ethyria-gradient-text">' + $CRLF + '                      Emotional Echo' + $CRLF + '                    </h3>',
    '<h3 class="font-bold text-xl mb-2 ethyria-gradient-text">' + $CRLF + '                      Eco Emocional' + $CRLF + '                    </h3>'
)

# --- Module 03 p: mixed EN+DE text -> Spanish ---
$oldMod03p = '                      "We hear what lies between the lines." Unser sentiment' + $CRLF +
             '                      tracking module visualizes the emotional dynamics of your' + $CRLF +
             '                      dream ' + [char]0x2014 + ' tension levels, resilience indicators, turning' + $CRLF +
             '                      points.'
$newMod03p = '                      "Escuchamos lo que hay entre l' + [char]0x00ED + 'neas." Nuestro m' + [char]0x00F3 + 'dulo de' + $CRLF +
             '                      seguimiento de sentimientos visualiza la din' + [char]0x00E1 + 'mica emocional' + $CRLF +
             '                      de tu sue' + [char]0x00F1 + 'o ' + [char]0x2014 + ' niveles de tensi' + [char]0x00F3 + 'n, indicadores de resiliencia,' + $CRLF +
             '                      puntos de inflexi' + [char]0x00F3 + 'n.'
$c = $c.Replace($oldMod03p, $newMod03p)

# --- Module 05 p: leftover EN fragment -> Spanish ---
$c = $c.Replace('not generic reading, but personal growth.', 'no lecturas gen' + [char]0x00E9 + 'ricas, sino crecimiento personal.')

# --- USP badge labels (DE leftovers) ---
$c = $c.Replace('Tiefe', 'Profundidad')
$c = $c.Replace('Wachstum', 'Crecimiento')
$c = $c.Replace('Einzigartig', [char]0x00DA + 'nico')
$c = $c.Replace('Vertrauen', 'Confianza')

# --- Theory card footers & headers (untranslated EN) ---
$c = $c.Replace('Entry Level', 'Nivel B' + [char]0x00E1 + 'sico')
$c = $c.Replace('Classical Psychoanalysis', 'Psicoan' + [char]0x00E1 + 'lisis Cl' + [char]0x00E1 + 'sico')
$c = $c.Replace('Depth Psychology', 'Psicolog' + [char]0x00ED + 'a Profunda')
$c = $c.Replace('Archetypen', 'Arquetipos')
$c = $c.Replace('Experience Mode', 'Modo Experiencial')

# --- BMA footer ---
$c = $c.Replace('Biometrics + AI ' + [char]0x00B7 + ' Experimental', 'Biometr' + [char]0x00ED + 'a + IA ' + [char]0x00B7 + ' Experimental')

[System.IO.File]::WriteAllText($file, $c, [System.Text.UTF8Encoding]::new($false))
Write-Host "ES fix done"
