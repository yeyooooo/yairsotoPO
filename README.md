# Yair Soto

Portafolio audiovisual listo para Vercel.

## Reels

La forma recomendada para agregar reels:

- Formato: `.mp4` H.264, 1080p.
- Peso ideal: 10-40 MB por reel.
- Ubicación: `assets/reels/`.
- Conexión: actualizar `REELS` en `script.js` con la ruta del video y su poster.

Para videos grandes o máxima calidad de streaming, usar Vimeo, YouTube no listado, Cloudinary o Vercel Blob y poner la URL en `REELS`.

## Vercel

Build and Output Settings:

- Framework Preset: `Other`
- Root Directory: `./`
- Build Command: vacío
- Output Directory: `.`
- Install Command: vacío
