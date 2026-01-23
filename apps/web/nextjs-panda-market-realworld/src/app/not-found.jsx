import Link from 'next/link';

import { paths } from '#/config/paths';

const NotFoundPage = () => {
  return (
    <div className="mt-52 pb-52 flex flex-col items-center font-semibold font-pretendard">
      <h1 className='text-4xl'>404 - Not Found</h1>
      <p className='text-2xl'>죄송합니다. 찾으시는 페이지가 존재하지 않습니다.</p>
      <Link
        className='bg-primary-100 hover:bg-primary-200 active:bg-primary-300 text-white px-3.5 py-4 rounded-full mt-10'
        href={paths.home.getHref()}
        replace
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;