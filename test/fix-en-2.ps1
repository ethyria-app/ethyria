$file = ".\test\index.test.html"
$c = [System.IO.File]::ReadAllText($file)

# Theory card footer: Archetypen -> Archetypes
$c = $c.Replace('Archetypen', 'Archetypes')

[System.IO.File]::WriteAllText($file, $c, [System.Text.UTF8Encoding]::new($false))
Write-Host "EN fix-2 done"
