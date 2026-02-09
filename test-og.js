#!/usr/bin/env node
/**
 * OG Image Test Script
 * Verifies all pages use AqaarGate logo (new-logo.png) for Open Graph
 *
 * Usage: npm run test:og
 * Requires dev server running. Set BASE_URL if not on port 3004:
 *   BASE_URL=http://localhost:3004 node test-og.js
 */
const PAGES = [
  '/en',
  '/ar',
  '/en/property-list',
  '/en/about-us',
  '/en/contact',
  '/en/agents',
  '/en/blog-grid',
  '/en/faq',
  '/en/career',
  '/en/privacy-policy',
  '/en/property-detail/698857b8980fb449f097d8a3',
];

const OG_LOGO = 'new-logo.png';
const BASE = process.env.BASE_URL || 'http://localhost:3004';

async function fetchPage(path) {
  const url = BASE + path;
  const res = await fetch(url);
  if (!res.ok) return { path, status: res.status, error: `HTTP ${res.status}` };
  const html = await res.text();
  return { path, status: res.status, html };
}

function extractOG(html) {
  const result = { ogImage: null, twitterImage: null, ogTitle: null, ogDesc: null };
  const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
  const twitterMatch = html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i);
  const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:title["']/i);
  const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:description["']/i);
  if (ogImageMatch) result.ogImage = ogImageMatch[1];
  if (twitterMatch) result.twitterImage = twitterMatch[1];
  if (ogTitleMatch) result.ogTitle = ogTitleMatch[1];
  if (ogDescMatch) result.ogDesc = ogDescMatch[1];
  return result;
}

async function main() {
  console.log('=== AqaarGate OG Image Test ===\n');
  let passed = 0;
  let failed = 0;

  for (const path of PAGES) {
    try {
      const { path: p, status, html, error } = await fetchPage(path);
      if (error) {
        console.log(`❌ ${p}: ${error}`);
        failed++;
        continue;
      }
      const og = extractOG(html);
      const hasLogo = (og.ogImage && og.ogImage.includes(OG_LOGO)) || (og.twitterImage && og.twitterImage.includes(OG_LOGO));
      const imageSource = og.ogImage || og.twitterImage || 'N/A';
      
      if (hasLogo) {
        console.log(`✅ ${p}`);
        console.log(`   OG Image: ${imageSource.substring(0, 80)}...`);
        if (og.ogTitle) console.log(`   Title: ${og.ogTitle.length > 80 ? og.ogTitle.substring(0, 77) + '...' : og.ogTitle}`);
        if (og.ogDesc) console.log(`   Desc: ${og.ogDesc.length > 80 ? og.ogDesc.substring(0, 77) + '...' : og.ogDesc} (${og.ogDesc.length} chars)`);
        passed++;
      } else {
        console.log(`❌ ${p} - Logo not found in OG`);
        console.log(`   Image: ${imageSource}`);
        failed++;
      }
      console.log('');
    } catch (err) {
      console.log(`❌ ${path}: ${err.message}\n`);
      failed++;
    }
  }

  console.log('--- Summary ---');
  console.log(`Passed: ${passed}/${PAGES.length}`);
  console.log(`Failed: ${failed}/${PAGES.length}`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
