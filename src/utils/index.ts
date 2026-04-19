import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractOTP(text: string): string | null {
  if (!text) return null;
  const otpMatch = text.match(/\b(?:code|otp|pin|verification|verify)[\s:]*#?(\d{4,8})\b/i);
  if (otpMatch) return otpMatch[1];
  const fallback = text.match(/\b\d{4,8}\b/);
  return fallback ? fallback[0] : null;
}

export function extractConfirmationLink(html: string): string | null {
  if (!html) return null;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const links = Array.from(doc.querySelectorAll("a[href]"));

  const urlKeywords = ['verify', 'confirm', 'activate', 'validate', 'register', 'signup', 'email', 'token', 'account'];
  const textKeywords = ['activate', 'confirm', 'verify', 'validate', 'click here', 'get started', 'enable'];

  for (const link of links) {
    const href = link.getAttribute('href');
    const linkText = (link.textContent || '').toLowerCase().trim();

    if (!href || !href.startsWith('http')) continue;

    const urlLower = href.toLowerCase();
    const urlMatches = urlKeywords.some(kw => urlLower.includes(kw));
    const textMatches = textKeywords.some(kw => linkText.includes(kw));

    if (urlMatches || textMatches) {
      return href;
    }
  }

  return null;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
