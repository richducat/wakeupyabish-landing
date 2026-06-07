import { createHmac } from 'node:crypto'

import { BRAND, CARD_DEFAULTS } from './brand.js'

const SIZE_PRESETS = {
  square: { width: 1080, height: 1080 },
  portrait: { width: 1080, height: 1350 },
  story: { width: 1080, height: 1920 },
}

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function clampText(value, max) {
  if (!value) {
    return ''
  }

  const compact = String(value).replace(/\s+/g, ' ').trim()
  if (compact.length <= max) {
    return compact
  }

  return `${compact.slice(0, Math.max(0, max - 1)).trimEnd()}...`
}

function wrapText(value, maxCharsPerLine, maxLines) {
  const words = clampText(value, maxCharsPerLine * maxLines + maxLines * 4).split(' ')
  const lines = []
  let current = ''

  for (const word of words) {
    const next = current ? `${current} ${word}` : word
    if (next.length <= maxCharsPerLine || !current) {
      current = next
      continue
    }

    lines.push(current)
    current = word

    if (lines.length === maxLines) {
      current = ''
      break
    }
  }

  if (lines.length < maxLines && current) {
    lines.push(current)
  }

  return lines.slice(0, maxLines)
}

function encodePayload(payload) {
  return Buffer.from(JSON.stringify(payload)).toString('base64url')
}

function decodePayload(payload) {
  return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
}

function signPayload(payload, secret) {
  if (!secret) {
    return 'open'
  }

  return createHmac('sha256', secret).update(payload).digest('base64url')
}

export function buildCardUrl({ origin, payload, secret }) {
  const encoded = encodePayload(payload)
  const signature = signPayload(encoded, secret)
  const baseOrigin = origin || process.env.PUBLIC_SITE_URL || BRAND.siteUrl
  const url = new URL('/api/social/card', baseOrigin)
  url.searchParams.set('payload', encoded)
  url.searchParams.set('sig', signature)
  return url.toString()
}

export function readCardPayload({ payload, signature, secret }) {
  if (!payload) {
    throw new Error('Missing card payload.')
  }

  if (secret) {
    const expected = signPayload(payload, secret)
    if (signature !== expected) {
      throw new Error('Invalid card signature.')
    }
  }

  return decodePayload(payload)
}

export function createCardPayload(platform, post) {
  const size = SIZE_PRESETS[post.card?.size] ? post.card.size : 'square'

  return {
    platform,
    size,
    kicker: clampText(post.card?.kicker || CARD_DEFAULTS.kicker || 'SYSTEM OVERRIDE', 26),
    headline: clampText(post.card?.headline || 'WAKE UP', 52),
    subhead: clampText(
      post.card?.subhead || 'Default alarms had a good run. It is over now.',
      112,
    ),
    footer: clampText(post.card?.footer || BRAND.defaultCta, 38),
  }
}

export function renderCardSvg(payload) {
  const preset = SIZE_PRESETS[payload.size] || SIZE_PRESETS.square
  const headlineLines = wrapText(payload.headline || 'WAKE UP', 12, payload.size === 'story' ? 4 : 3)
  const subheadLines = wrapText(
    payload.subhead || 'Default alarms had a good run. It is over now.',
    payload.size === 'story' ? 24 : 28,
    payload.size === 'story' ? 5 : 4,
  )

  const headlineStartY = payload.size === 'story' ? 680 : 520
  const headlineLineHeight = payload.size === 'story' ? 122 : 112
  const subheadStartY = headlineStartY + headlineLines.length * headlineLineHeight + 80
  const subheadLineHeight = payload.size === 'story' ? 64 : 58

  const headline = headlineLines
    .map(
      (line, index) =>
        `<text x="112" y="${
          headlineStartY + index * headlineLineHeight
        }" fill="#ffffff" font-size="${
          payload.size === 'story' ? 108 : 96
        }" font-family="Arial, Helvetica, sans-serif" font-style="italic" font-weight="900">${escapeXml(
          line,
        )}</text>`,
    )
    .join('\n  ')

  const subhead = subheadLines
    .map(
      (line, index) =>
        `<text x="112" y="${
          subheadStartY + index * subheadLineHeight
        }" fill="#d7c7f9" font-size="${
          payload.size === 'story' ? 52 : 46
        }" font-family="Arial, Helvetica, sans-serif" font-weight="600">${escapeXml(
          line,
        )}</text>`,
    )
    .join('\n  ')

  const footerY = preset.height - 150
  const gridTop = preset.height * 0.72

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${preset.width}" height="${preset.height}" viewBox="0 0 ${preset.width} ${preset.height}" fill="none">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="${preset.width}" y2="${preset.height}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#11051f"/>
      <stop offset="0.58" stop-color="#1b0e34"/>
      <stop offset="1" stop-color="#050912"/>
    </linearGradient>
    <linearGradient id="pinkGlow" x1="0" y1="0" x2="${preset.width}" y2="${preset.height}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#fe00fe" stop-opacity="0.9"/>
      <stop offset="1" stop-color="#00f3ff" stop-opacity="0.85"/>
    </linearGradient>
    <filter id="softBlur" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="80"/>
    </filter>
    <pattern id="scanlines" width="8" height="8" patternUnits="userSpaceOnUse">
      <rect width="8" height="3" fill="rgba(255,255,255,0.04)"/>
    </pattern>
  </defs>

  <rect width="${preset.width}" height="${preset.height}" fill="url(#bg)"/>
  <circle cx="${preset.width - 190}" cy="180" r="220" fill="#fe00fe" opacity="0.18" filter="url(#softBlur)"/>
  <circle cx="170" cy="${preset.height - 220}" r="260" fill="#00f3ff" opacity="0.14" filter="url(#softBlur)"/>
  <rect width="${preset.width}" height="${preset.height}" fill="url(#scanlines)" opacity="0.26"/>

  <g opacity="0.26">
    <path d="M0 ${gridTop} H${preset.width}" stroke="#00f3ff" stroke-width="2"/>
    <path d="M0 ${gridTop + 80} H${preset.width}" stroke="#00f3ff" stroke-width="1.5"/>
    <path d="M0 ${gridTop + 160} H${preset.width}" stroke="#00f3ff" stroke-width="1.2"/>
    <path d="M0 ${gridTop + 240} H${preset.width}" stroke="#00f3ff" stroke-width="1"/>
    <path d="M140 ${gridTop - 30} V${preset.height}" stroke="#00f3ff" stroke-width="1.2"/>
    <path d="M300 ${gridTop - 60} V${preset.height}" stroke="#00f3ff" stroke-width="1"/>
    <path d="M520 ${gridTop - 90} V${preset.height}" stroke="#00f3ff" stroke-width="1"/>
    <path d="M760 ${gridTop - 60} V${preset.height}" stroke="#00f3ff" stroke-width="1"/>
    <path d="M940 ${gridTop - 20} V${preset.height}" stroke="#00f3ff" stroke-width="1.2"/>
  </g>

  <rect x="72" y="72" width="${preset.width - 144}" height="${preset.height - 144}" rx="28" stroke="url(#pinkGlow)" stroke-width="4"/>
  <rect x="92" y="92" width="240" height="48" rx="12" fill="#00f3ff" opacity="0.14"/>
  <text x="112" y="124" fill="#9efcff" font-size="24" font-family="Arial, Helvetica, sans-serif" font-weight="700" letter-spacing="5">${escapeXml(
    payload.kicker || 'SYSTEM OVERRIDE',
  )}</text>

  <text x="112" y="188" fill="#ebfaff" font-size="28" font-family="Arial, Helvetica, sans-serif" font-weight="700" letter-spacing="4">${escapeXml(
    BRAND.name.toUpperCase(),
  )}</text>
  ${headline}

  ${subhead}

  <rect x="112" y="${footerY - 52}" width="${preset.width - 224}" height="92" rx="18" fill="#fe00fe" opacity="0.16"/>
  <text x="144" y="${footerY}" fill="#ffb8f7" font-size="34" font-family="Arial, Helvetica, sans-serif" font-weight="800" letter-spacing="2">${escapeXml(
    payload.footer || BRAND.defaultCta,
  )}</text>

  <rect x="${preset.width - 190}" y="${preset.height - 190}" width="72" height="72" fill="#00f3ff"/>
  <rect x="${preset.width - 118}" y="${preset.height - 118}" width="72" height="72" fill="#fe00fe"/>
</svg>`
}
