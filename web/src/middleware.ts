import createMiddleware from 'next-intl/middleware';
import { locales } from './config/site';
import { localePrefix } from './navigation';

export default createMiddleware({
  locales,
  localePrefix,
  defaultLocale: 'en'
});

export const config = {
  // Match only internationalized pathnames, exclude API routes and docs
  matcher: [
    '/',
    '/(en|ar|de|es|fr|id|it|no|pt|sv|uk|da|fi|hi|is|ja|pl|ru|th|zh)/:path*',
    '/((?!api|docs|_next|_vercel|.*\\..*).*)'
  ]
};
