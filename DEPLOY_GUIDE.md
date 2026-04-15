# Deploying childtherapist.in on Vercel — Step by Step

## Prerequisites
- A GitHub account (free) — https://github.com/signup
- A Vercel account (free) — https://vercel.com/signup (sign up with GitHub)
- Git installed on your computer
- Node.js 18+ installed — https://nodejs.org

---

## Step 1: Set Up the Project Locally

```bash
# Create a folder and copy the project files into it
# (You already have the project files from this chat)

cd childtherapist-site

# Install dependencies
npm install

# Test locally
npm run dev
# Opens at http://localhost:5173 — check if everything looks good
```

## Step 2: Push to GitHub

```bash
# Initialize git
git init
git add .
git commit -m "Initial commit: childtherapist.in landing page"

# Create a new repository on GitHub:
# Go to https://github.com/new
# Name it: childtherapist-site
# Keep it private
# DON'T initialize with README

# Connect and push
git remote add origin https://github.com/YOUR_USERNAME/childtherapist-site.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy on Vercel (Free)

1. Go to **https://vercel.com/new**
2. Click **"Import Git Repository"**
3. Select your `childtherapist-site` repo
4. Vercel auto-detects Vite — settings should be:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click **"Deploy"**
6. Wait 30–60 seconds — your site is live! 🎉

Vercel gives you a URL like: `childtherapist-site.vercel.app`

## Step 4: Connect Your Custom Domain

1. In Vercel dashboard → your project → **Settings** → **Domains**
2. Add: `childtherapist.in`
3. Also add: `www.childtherapist.in`
4. Vercel will show you DNS records to configure

### DNS Configuration (on GoDaddy or wherever you bought the domain):

**For childtherapist.in (root domain):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www.childtherapist.in:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

5. Wait 5–30 minutes for DNS propagation
6. Vercel auto-provisions SSL (HTTPS) — free!
7. Your site is live at **https://childtherapist.in** 🚀

## Step 5: Set Up Analytics (Free)

Vercel gives you free analytics:
1. Project → **Analytics** tab → Enable
2. Also add Google Analytics:
   - Create a GA4 property at https://analytics.google.com
   - Add the tracking script to `index.html` before `</head>`

## Step 6: Auto-Deploy on Every Push

This is already set up! Every time you push to the `main` branch on GitHub, Vercel automatically rebuilds and deploys. No manual steps needed.

```bash
# Make a change, then:
git add .
git commit -m "Updated pricing section"
git push
# Vercel deploys automatically in ~30 seconds
```

---

## What's Free on Vercel

| Feature | Free Tier |
|---|---|
| Deployments | Unlimited |
| Bandwidth | 100 GB/month |
| Custom domains | Unlimited |
| SSL certificates | Auto, free |
| Serverless functions | 100 GB-hours/month |
| Analytics | Basic (free) |
| Team members | 1 (personal) |

This is MORE than enough for your initial launch and well into your growth phase.

---

## Recommended Next Steps After Deployment

1. **Google Search Console** — Submit sitemap at https://search.google.com/search-console
2. **Google My Business** — Register "ChildTherapist.in" as a business
3. **Social links** — Update Instagram/LinkedIn bios with your live URL
4. **WhatsApp Business** — Add the website link to your WhatsApp profile
5. **Test on mobile** — Check on Android + iOS browsers
6. **Page speed** — Run https://pagespeed.web.dev to check performance

---

## Project Structure

```
childtherapist-site/
├── index.html          ← Main HTML (SEO meta tags, fonts, responsive CSS)
├── package.json        ← Dependencies
├── vite.config.js      ← Vite configuration
├── public/             ← Static assets (add logo, images here)
└── src/
    ├── main.jsx        ← React entry point
    └── App.jsx         ← Full landing page component
```

---

*Deployment guide for Anand | childtherapist.in | April 2026*
