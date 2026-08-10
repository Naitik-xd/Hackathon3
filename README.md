📍 StageMap
Discover What's Happening Near You

Built for HackDevengers 10 by Devengers | August 2026

Live Demo: https://na1t1k-hackathon3.vercel.app

The Problem

India has 640 districts. Event platforms serve only 8-10 metros. That means college fests in Bareilly, music nights in Haldwani, food festivals in Kichha, and startup pitches in Rudrapur get zero online visibility. Organizers rely on WhatsApp forwards and Instagram stories that disappear in 24 hours. Local talent performs to empty seats because no one knew the event existed. StageMap fixes that.

What is StageMap?

StageMap is a hyperlocal event discovery platform built for tier-2 and tier-3 India — where no other platform reaches. Anyone can post a free event. Anyone can discover what's happening nearby. No ticket fees. No metro bias. Just your city, alive.

"Other serves 8 cities. India has 640 districts. StageMap serves the rest."

Features

Discover Events — Browse local events by city and category
Map View — See events pinned on an interactive map
AI-Assisted Posting — Type a rough idea, Gemini structures it for you
Digital Entry Pass — QR code ticket for every RSVP
Save Events — Bookmark events for later
Community Reporting — Flag fake events, auto-review at 7+ reports
Admin Verification — Verified badge for trusted events
Auto-Expiry — Past events automatically hidden
Dark / Light Mode — Full theme toggle
Mobile Optimised — Works on mid-range Android devices

Tech Stack

Frontend: React + Vite + Tailwind CSS
Animations: Framer Motion
Build Tool: Antigravity
UI Design: Google Stitch
Auth: Supabase Google OAuth
Database: Supabase PostgreSQL
Storage: Supabase Storage
AI: Gemini 2.0 Flash via Supabase Edge Function
Map: Leaflet.js + OpenStreetMap
Deployment: Vercel

Security

All API keys stored in Vercel environment variables and Supabase secrets — never exposed in code. Security headers implemented via vercel.json including CSP, X-Frame-Options, X-Content-Type-Options and Referrer-Policy. Gemini API called via Supabase Edge Function only. noindex meta tag on all pages.


Map data © OpenStreetMap contributors

Disclaimer

This application was built solely for the HackDevengers 10 Hackathon organized by Devengers. It is a prototype and proof-of-concept only — not a real commercial product.

Built By

Naitik Agarwal
naitik.270810@outlook.com
na1t1k.vercel.app
