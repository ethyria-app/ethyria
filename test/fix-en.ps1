$file = "c:\Ethyria_LandingPage\test\index.test.html"
$c = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

# ===== PHONE MOCKUP — DE labels missed in scripts 1-3 =====
# Traumtitel (dream title label, 20-space indent in the div)
$c = $c.Replace("`r`n                    Traumtitel`r`n                  </div>", "`r`n                    Dream Title`r`n                  </div>")

# Traumbeschreibung (dream description label, preceded by </span>)
$c = $c.Replace("</span>`r`n                    Traumbeschreibung`r`n                  </div>", "</span>`r`n                    Dream Description`r`n                  </div>")

# ===== MODULE 02 — Aktiv ✓ (DE leftover in PaaS grid mockup) =====
$c = $c.Replace("Aktiv "+[char]0x2713, "Active "+[char]0x2713)

# ===== MODULE 03 — Unser sentiment (partial DE leftover in paragraph) =====
$c = $c.Replace("Unser sentiment", "Our sentiment")

# ===== USP LABELS — multi-line HTML, >X< pattern failed in translate-en-3.ps1 =====
# USP 02: Tiefe
$c = $c.Replace("`r`n                  Tiefe`r`n                </div>", "`r`n                  Depth`r`n                </div>")

# USP 03: Wachstum
$c = $c.Replace("`r`n                  Wachstum`r`n                </div>", "`r`n                  Growth`r`n                </div>")

# USP 04: Einzigartig
$c = $c.Replace("`r`n                  Einzigartig`r`n                </div>", "`r`n                  Unique`r`n                </div>")

# USP 05: Vertrauen
$c = $c.Replace("`r`n                  Vertrauen`r`n                </div>", "`r`n                  Trust`r`n                </div>")

# ===== BETA — Google Play line (free. contamination from earlier script run) =====
$c = $c.Replace("Bald auch im Google Play Store free.", "Coming soon to the Google Play Store.")

# ===== DISCOVERABILITY EYEBROW — multi-line <p> tag =====
$c = $c.Replace("`r`n              Entdecken`r`n            </p>", "`r`n              Search Intent`r`n            </p>")

[System.IO.File]::WriteAllText($file, $c, [System.Text.Encoding]::UTF8)
Write-Host "EN fix done"
