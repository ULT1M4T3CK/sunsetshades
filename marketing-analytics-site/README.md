# Marketing Analytics Specialist Website

A lightweight, responsive single-page website tailored for a marketing analytics specialist, with built-in consent management and placeholders for major tags (GTM/GA4, Meta Pixel, LinkedIn Insight Tag, TikTok Pixel, and optional Google Ads).

## Quick start

- Serve locally (already running in Cursor): http://127.0.0.1:8000
- Or run your own: from this directory, run a static server, e.g. `python3 -m http.server 8000`

## Configure your tracking IDs

Open `index.html` and update `window.ANALYTICS_CONFIG` near the top:

```html
<script>
  window.ANALYTICS_CONFIG = {
    gtmId: "GTM-XXXXXXX",      // Use GTM, or...
    gaMeasurementId: "G-XXXX", // ...use GA4 direct if not using GTM
    metaPixelId: "",
    linkedinPartnerId: "",
    tiktokPixelId: "",
    googleAdsId: ""
  };
</script>
```

- If using GTM, leave `gaMeasurementId` empty and configure GA4/Ads within GTM.
- If not using GTM, set `gaMeasurementId` (and optionally `googleAdsId`).
- Meta, LinkedIn, and TikTok pixels will only load if consent is granted and the corresponding ID is provided.

## Consent Mode v2

- Defaults are set to deny non-essential categories until the user accepts or customizes.
- The banner appears on first visit; preferences can be changed via the footer link.
- Consent updates are sent to Google via `gtag('consent', 'update', ...)`.

## Customize content and branding

- Text/content: edit `index.html`
- Styles/theme: edit `styles.css`
- Logo/Favicon/OG image: replace files in `assets/`
- Contact email and scheduling: search for `hello@example.com` and `data-calendly` in `index.html`.

## Deployment

- Any static host works (Netlify, Vercel, GitHub Pages, S3/CloudFront). Upload the contents of this folder.
- Ensure your domain is set in `og:url` in `index.html`.

## Notes

- The GTM noscript iframe in `index.html` is a placeholder. When you add a real GTM ID, it will function for users with JS disabled.
- If you require loading GTM before consent (for modeled conversions with Consent Mode), move the GTM bootstrap into the `<head>` and rely on Consent Mode defaults already present.