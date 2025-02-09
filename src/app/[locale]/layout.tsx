import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n.config';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

async function getLocaleMessages(locale: string) {
  try {
    return (await import(`@/messages/${locale}/common.json`)).default;
  } catch (error) {
    return {};
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getLocaleMessages(params.locale);

  if (!locales.includes(params.locale)) {
    notFound();
  }

  return (
    <html lang={params.locale}>
      <body>
        <NextIntlClientProvider locale={params.locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
