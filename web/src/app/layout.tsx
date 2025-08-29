import { fontSans } from '@/config/fonts';
import '@/styles/globals.css';
import clsx from 'clsx';

export const metadata = {
  title: 'Big Five Personality Test - API Documentation',
  description:
    'Beautiful API documentation for Big Five personality assessments'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={clsx(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
