import { unstable_setRequestLocale } from 'next-intl/server';

interface Props {
  params: { locale: string };
}

export default function ArticlesPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);

  return (
    <div className='w-full lg:px-16 mt-12'>
      <div className='text-center'>
        <h1 className='mb-2 font-bold text-4xl'>Personality Articles</h1>
        <h5 className='text-default-500 text-lg'>
          Articles temporarily unavailable - content system being updated
        </h5>
        <p className='mt-4 text-sm text-default-400'>
          We&apos;re working on improving our content delivery system. Please
          check back later!
        </p>
      </div>
    </div>
  );
}
