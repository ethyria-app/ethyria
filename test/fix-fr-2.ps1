$file = ".\test\index.test.fr.html"
$c = [System.IO.File]::ReadAllText($file)

# Phone mockup labels (DE leftovers)
$c = $c.Replace('Traumtitel', 'Titre du R' + [char]0x00EA + 've')
$c = $c.Replace('Traumbeschreibung', 'Description du R' + [char]0x00EA + 've')

# Theory card footers & headers (untranslated EN)
$c = $c.Replace('Entry Level', 'D' + [char]0x00E9 + 'butant')
$c = $c.Replace('Classical Psychoanalysis', 'Psychanalyse Classique')
$c = $c.Replace('Depth Psychology', 'Psychologie des profondeurs')
$c = $c.Replace('Archetypen', 'Arch' + [char]0x00E9 + 'types')
$c = $c.Replace('Experience Mode', 'Mode Exp' + [char]0x00E9 + 'rientiel')

# BMA footer (untranslated EN)
$c = $c.Replace('Biometrics + AI ' + [char]0x00B7 + ' Experimental', 'Biom' + [char]0x00E9 + 'trie + IA ' + [char]0x00B7 + ' Exp' + [char]0x00E9 + 'rimental')

[System.IO.File]::WriteAllText($file, $c, [System.Text.UTF8Encoding]::new($false))
Write-Host "FR fix-2 done"
