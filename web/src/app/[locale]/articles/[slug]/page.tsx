import { ChevronRightLinearIcon } from '@/components/icons';
import { Link } from '@nextui-org/react';
import NextLink from 'next/link';

export const generateMetadata = ({ params }: { params: { slug: string } }) => {
  return {
    title: 'Article Not Available',
    description:
      'This article is temporarily unavailable while we update our content system.'
  };
};

const PostLayout = ({ params }: { params: { slug: string } }) => {
  return (
    <article className='w-full flex flex-col justify-start items-center prose prose-neutral'>
      <div className='w-full max-w-4xl'>
        <div className='flex'>
          <div className='flex grow'>
            <Link
              isBlock
              as={NextLink}
              className='text-default-500 hover:text-default-900 justify-start mb-2'
              color='foreground'
              href='/articles'
              size='md'
            >
              <ChevronRightLinearIcon
                className='rotate-180 inline-block mr-1'
                size={15}
              />
              Back to articles
            </Link>
          </div>
        </div>

        <div className='text-center py-12'>
          <h1 className='text-3xl font-bold mb-4'>Article Not Available</h1>
          <p className='text-default-500 mb-6'>
            This article is temporarily unavailable while we update our content
            delivery system.
          </p>
          <p className='text-sm text-default-400'>
            We&apos;re working on improving our content system. Please check
            back later!
          </p>
        </div>
      </div>
    </article>
  );
};

export default PostLayout;
