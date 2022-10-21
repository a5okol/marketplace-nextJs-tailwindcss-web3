import Image from 'next/image';

import { Loader } from '@components/ui/common';
import { useEthPrice, COURSE_PRICE } from '@components/hooks/useEthPrice';

const EthRates = () => {
  const { eth } = useEthPrice();

  return (
    <div className="flex flex-col xs:flex-row text-center pt-5">
      <div className="p-6 border drop-shadow rounded-md mr-2">
        <div className="flex items-center justify-center">
          {eth.data ? (
            <>
              <Image
                width="35"
                height="35"
                layout="fixed"
                alt="etheroum"
                src="/small-eth.webp"
              />
              <span className="text-xl font-bold">= {eth.data}$</span>
            </>
          ) : (
            <div className="w-full flex justify-center">
              <Loader size="md" />
            </div>
          )}
        </div>
        <p className="text-lg text-gray-500">Current eth Price</p>
      </div>
      <div className="p-6 border drop-shadow rounded-md">
        <div className="flex items-center justify-center">
          {eth.data ? (
            <>
              <span className="text-xl font-bold">{eth.perItem}</span>
              <Image
                width="35"
                height="35"
                layout="fixed"
                src="/small-eth.webp"
                alt="etherium per course"
              />
              <span className="text-xl font-bold">= {COURSE_PRICE}$</span>
            </>
          ) : (
            <div className="w-full flex justify-center">
              <Loader size="md" />
            </div>
          )}
        </div>
        <p className="text-lg text-gray-500">Price per course</p>
      </div>
    </div>
  );
};

export default EthRates;
