# Découpe les planches de croquis (pictos, traits) générées sur muapi : fond blanc -> transparent,
# recadrage au plus près, puis enregistrement en PNG dans img\croquis.
# Lancer : powershell -File outils\preparer-croquis.ps1
Add-Type -AssemblyName System.Drawing
$site = Split-Path -Parent $PSScriptRoot
$src  = Join-Path $site "textures-source"
$out  = Join-Path $site "img\croquis"
New-Item -ItemType Directory -Force $out | Out-Null

function Decoupe($bmpSrc, [int]$x, [int]$y, [int]$w, [int]$h, [string]$nom, [int]$max, [bool]$dejaTransparent) {
  $cell = New-Object System.Drawing.Bitmap $w, $h, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($cell)
  $g.DrawImage($bmpSrc, (New-Object System.Drawing.Rectangle 0, 0, $w, $h), (New-Object System.Drawing.Rectangle $x, $y, $w, $h), [System.Drawing.GraphicsUnit]::Pixel)
  $g.Dispose()
  $rect = New-Object System.Drawing.Rectangle 0, 0, $w, $h
  $d = $cell.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadWrite, $cell.PixelFormat)
  $n = $d.Stride * $h; $px = New-Object byte[] $n
  [System.Runtime.InteropServices.Marshal]::Copy($d.Scan0, $px, 0, $n)
  $x0 = $w; $y0 = $h; $x1 = -1; $y1 = -1
  for ($j = 0; $j -lt $h; $j++) {
    $row = $j * $d.Stride
    for ($i = 0; $i -lt $w; $i++) {
      $k = $row + $i * 4
      # bord de la case : on l'efface (le découpage y laisse un liseré)
      if ($i -lt 4 -or $j -lt 4 -or $i -gt $w - 5 -or $j -gt $h - 5) { $px[$k + 3] = 0; continue }
      if ($dejaTransparent) { $al = $px[$k + 3] }
      else {
        $b = $px[$k]; $gr = $px[$k + 1]; $r = $px[$k + 2]
        $m = [Math]::Min($b, $r)
        $a = (246 - $m) / 170.0
        if ($a -lt 0.04) { $a = 0 } elseif ($a -gt 1) { $a = 1 }
        if ($a -gt 0) {
          $px[$k]     = [byte][Math]::Max(0, [Math]::Min(255, ($b  - (1 - $a) * 255) / $a))
          $px[$k + 1] = [byte][Math]::Max(0, [Math]::Min(255, ($gr - (1 - $a) * 255) / $a))
          $px[$k + 2] = [byte][Math]::Max(0, [Math]::Min(255, ($r  - (1 - $a) * 255) / $a))
        }
        $al = [byte][Math]::Round($a * 255); $px[$k + 3] = $al
      }
      if ($al -gt 40) { if ($i -lt $x0) { $x0 = $i }; if ($i -gt $x1) { $x1 = $i }; if ($j -lt $y0) { $y0 = $j }; if ($j -gt $y1) { $y1 = $j } }
    }
  }
  [System.Runtime.InteropServices.Marshal]::Copy($px, 0, $d.Scan0, $n)
  $cell.UnlockBits($d)
  if ($x1 -lt 0) { $cell.Dispose(); Write-Output "vide : $nom"; return }
  $p = 6
  $x0 = [Math]::Max(0, $x0 - $p); $y0 = [Math]::Max(0, $y0 - $p); $x1 = [Math]::Min($w - 1, $x1 + $p); $y1 = [Math]::Min($h - 1, $y1 + $p)
  $tw = $x1 - $x0 + 1; $th = $y1 - $y0 + 1
  $k2 = [Math]::Min(1.0, $max / [Math]::Max($tw, $th))
  $fw = [int][Math]::Round($tw * $k2); $fh = [int][Math]::Round($th * $k2)
  $fin = New-Object System.Drawing.Bitmap $fw, $fh, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($fin); $g.InterpolationMode = "HighQualityBicubic"
  $g.DrawImage($cell, (New-Object System.Drawing.Rectangle 0, 0, $fw, $fh), (New-Object System.Drawing.Rectangle $x0, $y0, $tw, $th), [System.Drawing.GraphicsUnit]::Pixel)
  $g.Dispose(); $cell.Dispose()
  $fin.Save((Join-Path $out "$nom.png"), [System.Drawing.Imaging.ImageFormat]::Png); $fin.Dispose()
  Write-Output "$nom : $fw x $fh"
}

# planches de pictos : grille 3 x 3
$planches = @{
  "pictos-a.png" = @("maison","loupe","maisons","camera","megaphone","oeil","agenda","feuille","cube")
  "pictos-b.png" = @("terrain","grange","piece","horloge","cle","montagne","poignee","repere","fleche")
}
foreach ($f in $planches.Keys) {
  $img = [System.Drawing.Bitmap]::FromFile((Join-Path $src $f))
  $cw = [int]($img.Width / 3); $ch = [int]($img.Height / 3)
  for ($i = 0; $i -lt 9; $i++) { Decoupe $img (($i % 3) * $cw) ([Math]::Floor($i / 3) * $ch) $cw $ch $planches[$f][$i] 320 $false }
  $img.Dispose()
}

# traits de soulignement : 4 bandes horizontales
$img = [System.Drawing.Bitmap]::FromFile((Join-Path $src "traits.png"))
$bandes = @(@(140,350,"trait-epais"), @(540,200,"trait-fin"), @(800,240,"trait-effile"), @(1100,320,"trait-double"))
foreach ($b in $bandes) { Decoupe $img 0 $b[0] $img.Width $b[1] $b[2] 1400 $false }
$img.Dispose()

# le petit carré hachuré : repris tel quel dans le logo
$logo = [System.Drawing.Bitmap]::FromFile((Join-Path $site "img\logo.png"))
Decoupe $logo 984 330 94 100 "carre" 120 $true
$logo.Dispose()
