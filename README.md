# RetratAI

RetratAI es una landing page/PoC orientada a comercializar retratos generados con IA. La aplicación simula el funnel completo: atrae con un hero persuasivo, muestra beneficios, evidencia resultados, describe planes y dispara conversiones. Detrás del UI se encuentran integraciones reales: Stripe para pagos y Replicate como backend de generación de imágenes, dejando listo el andamiaje para convertirlo en un producto monetizable.

https://github.com/user-attachments/assets/30543bcf-5115-4e3f-a293-55ac673bee35

## ✨ Características
- **Hero persuasivo** con headline y CTA principal.
- **Catálogo de beneficios** en tarjetas animadas.
- **Galería de ejemplos** responsive usando `next/image`.
- **Tabla de precios** con plan destacado y comparativa.
- **Llamado a la acción final** para convertir visitantes.
- Paleta de colores y tipografía consistentes con una marca de IA creativa.

## 🛠 Stack
- [Next.js 15 (App Router)](https://nextjs.org/)
- [React 19](https://react.dev/)
- [Tailwind CSS 3](https://tailwindcss.com/)
- [Stripe](https://stripe.com/) (intento de pago y suscripciones)
- [Replicate](https://replicate.com/) (API para generar los retratos)

## 🚀 Puesta en marcha
```bash
npm install
npm run dev
# http://localhost:3000
```

### Scripts disponibles
| Script | Descripción |
|--------|-------------|
| `npm run dev` | Arranca el servidor de desarrollo (Turbopack). |
| `npm run build` | Genera el build de producción. |
| `npm run start` | Sirve la aplicación ya compilada. |
| `npm run lint` | Ejecuta ESLint con la configuración de Next.js. |

## 📁 Estructura
```
src/
 └── app/
     ├── layout.tsx   # Layout raíz
     └── page.tsx     # Landing page completa
public/
 └── images/         # Assets y favicon
```

## 🧭 Personalización
- Sustituye los textos del Hero, beneficios y precios en `src/app/page.tsx`.
- Reemplaza las imágenes `placehold.co` por previews generadas con tu propio modelo.
- Actualiza los metadatos en `src/app/layout.tsx` para SEO/OG.
- Ajusta colores y fuentes en `tailwind.config.ts` si deseas un branding diferente.

## 🗺 Roadmap sugerido
- Integrar formulario/captura de lead (Beehiiv, Mailchimp o API propia).
- Componentizar secciones para reutilizarlas en variantes de campaña.
- Añadir animaciones con Framer Motion.
- Incluir testimonios o casos de uso.

## 📄 Licencia
MIT © Rainier Alejandro
