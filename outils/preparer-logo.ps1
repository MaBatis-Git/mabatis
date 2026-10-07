# Détoure le logo MaBâtis (fond papier -> transparent) et crée la version pour fond sombre.
# Lancer depuis le dossier "site" : powershell -File outils\preparer-logo.ps1
Add-Type -AssemblyName System.Drawing
$site = Split-Path -Parent $PSScriptRoot
$src  = Join-Path (Split-Path -Parent $site) "branding\logo-fond-papier.jpg"
$img  = [System.Drawing.Bitmap]::FromFile($src)

# zone utile du logo dans l'image 1600 x 639
$crop = New-Object System.Drawing.Rectangle 270, 50, 1080, 520
$bmp  = New-Object System.Drawing.Bitmap $crop.Width, $crop.Height, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.DrawImage($img, (New-Object System.Drawing.Rectangle 0, 0, $crop.Width, $crop.Height), $crop, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose(); $img.Dispose()

$rect = New-Object System.Drawing.Rectangle 0, 0, $bmp.Width, $bmp.Height
$data = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadWrite, $bmp.PixelFormat)
$n = $data.Stride * $bmp.Height
$px = New-Object byte[] $n
[System.Runtime.InteropServices.Marshal]::Copy($data.Scan0, $px, 0, $n)
$dark = New-Object byte[] $n

# couleur du papier, puis alpha = distance au papier
$pb = 236; $pg = 242; $pr = 244
for ($i = 0; $i -lt $n; $i += 4) {
  $b = $px[$i]; $gr = $px[$i + 1]; $r = $px[$i + 2]
  $m = [Math]::Min($b, [Math]::Min($gr, $r))
  $a = (228 - $m) / 110.0
  if ($a -lt 0) { $a = 0 } elseif ($a -gt 1) { $a = 1 }
  if ($a -gt 0) {
    # retire la part de papier mélangée dans les pixels de bord
    $b2 = [Math]::Max(0, [Math]::Min(255, ($b - (1 - $a) * $pb) / $a))
    $g2 = [Math]::Max(0, [Math]::Min(255, ($gr - (1 - $a) * $pg) / $a))
    $r2 = [Math]::Max(0, [Math]::Min(255, ($r - (1 - $a) * $pr) / $a))
  } else { $b2 = 0; $g2 = 0; $r2 = 0 }
  $al = [byte]([Math]::Round($a * 255))
  $px[$i] = [byte]$b2; $px[$i + 1] = [byte]$g2; $px[$i + 2] = [byte]$r2; $px[$i + 3] = $al
  # version fond sombre : tout ce qui n'est pas vert devient blanc
  $isGreen = ($g2 -gt $r2 + 35) -and ($g2 -gt $b2 + 35)
  if ($isGreen) { $dark[$i] = [byte]$b2; $dark[$i + 1] = [byte]$g2; $dark[$i + 2] = [byte]$r2 }
  else { $dark[$i] = 255; $dark[$i + 1] = 255; $dark[$i + 2] = 255 }
  $dark[$i + 3] = $al
}
[System.Runtime.InteropServices.Marshal]::Copy($px, 0, $data.Scan0, $n)
$bmp.UnlockBits($data)
$bmp.Save((Join-Path $site "img\logo.png"), [System.Drawing.Imaging.ImageFormat]::Png)

$data = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadWrite, $bmp.PixelFormat)
[System.Runtime.InteropServices.Marshal]::Copy($dark, 0, $data.Scan0, $n)
$bmp.UnlockBits($data)
$bmp.Save((Join-Path $site "img\logo-clair.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Output "logo.png et logo-clair.png créés"
