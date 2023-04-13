import Link from 'next/link';

import cn from 'lib/classnames';

// import RufijiImage from './images/rufiji.jpg';
// import SaloumImage from './images/saloum.jpg';
// import Worldwide from './images/worldwide.jpg';

// const bgImages = {
//   '0edd0ebb-892b-5774-8ce5-08e0ba7136b1': RufijiImage,
//   '4a79230b-7ecb-58ae-ba0d-0f57faa2a104': SaloumImage,
// };

const HighlightedPlaces = () => {
  return (
    <div className="flex w-full flex-1 space-x-2">
      <Link href="" className="flex-1">
        <div
          key={'currentLocation.id'}
          className="h-52 w-full flex-1 rounded-[20px] bg-[url('/images/highlighted-places/worldwide.jpg')] bg-cover bg-center"
        >
          <h3 className="flex h-full items-end justify-center pb-4 text-end font-sans text-sm font-bold text-white">
            Worldwide
          </h3>
        </div>
      </Link>
      <Link href="" className="flex-1">
        <div
          key={'currentLocation.id'}
          className="h-52 w-full flex-1 rounded-[20px] bg-[url('/images/highlighted-places/rufiji.jpg')] bg-cover bg-center"
        >
          <h3 className="flex h-full items-end justify-center pb-4 text-end font-sans text-sm font-bold text-white">
            Worldwide
          </h3>
        </div>
      </Link>
      <Link href="" className="flex-1">
        <div
          key={'currentLocation.id'}
          className="h-52 w-full flex-1 rounded-[20px] bg-[url('/images/highlighted-places/saloum.png')] bg-cover bg-center"
        >
          <h3 className="flex h-full items-end justify-center pb-4 text-end font-sans text-sm font-bold text-white">
            Worldwide
          </h3>
        </div>
      </Link>
    </div>
  );
};

export default HighlightedPlaces;
