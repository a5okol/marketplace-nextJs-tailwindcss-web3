import { useEthPrice } from '@components/hooks/useEthPrice';
import { useEffect, useState } from 'react';

const useCounter = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setInterval(() => {
      setCount((c) => c + 1);
    }, 1000);
  }, []);

  return count;
};

const SimpleComponent = () => {
  const { eth } = useEthPrice();
  return <h1>Simple Component - {eth.data}</h1>;
};

export default function HooksPage() {
  const { eth } = useEthPrice();

  return (
    <>
      <h1>Hello World - {eth.data}</h1>
      <SimpleComponent />
    </>
  );
}
