import type { Metadata, Viewport } from 'next';
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { NavigationProgress } from '@/components/common/NavigationProgress';
import { getDefaultMetadata } from '@/lib/seo';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants';
import { routing } from '@/i18n/routing';
import { Locale } from '@/i18n/config';
import { PwaInstallPrompt } from '@/components/pwa/PwaInstallPrompt';
import { ServiceWorkerRegister } from '@/components/pwa/ServiceWorkerRegister';
import '../globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'optional', preload: false });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-plus-jakarta', display: 'swap', weight: ['600', '700'] });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'optional', weight: ['400'], preload: false });

export const metadata: Metadata = getDefaultMetadata();

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/toolsarena-logo.png`,
  description: SITE_DESCRIPTION,
  sameAs: [
    'https://x.com/toolsarena',
    'https://github.com/mukeshmaddheshiya',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    url: `${SITE_URL}/contact`,
    availableLanguage: ['English', 'Hindi', 'Nepali'],
  },
  founder: {
    '@type': 'Person',
    name: 'Mukesh Maddheshiya',
    image: `${SITE_URL}/mukesh-developer-toolsarena.png`,
    jobTitle: 'Full Stack Developer & Founder',
    url: `${SITE_URL}`,
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const saved = localStorage.getItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (saved === 'dark' || (!saved && prefersDark)) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      </head>
      <body className={`${inter.variable} ${plusJakarta.variable} ${jetbrainsMono.variable} min-h-screen flex flex-col`}>
        <NextIntlClientProvider messages={messages}>
          <NavigationProgress />
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <PwaInstallPrompt />
          <ServiceWorkerRegister />
        </NextIntlClientProvider>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-31BJJP8M9X" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-31BJJP8M9X');
          `}
        </Script>
      </body>
    </html>
  );
}
