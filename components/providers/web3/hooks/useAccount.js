import { useEffect } from 'react';
import useSWR from 'swr';

const adminAddresses = {
  '0x21a5c5c6255e4a02db40617b460d14c299530e3559e786ffda6f9b1690839446': true,
};

export const handler = (web3, provider) => () => {
  const { data, mutate, ...rest } = useSWR(
    () => (web3 ? 'web3/accounts' : null),
    async () => {
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      if (!account) {
        throw new Error(
          'Cannot retreive an account. Please refresh the browser.'
        );
      }

      return account;
    }
  );

  useEffect(() => {
    const mutator = (accounts) => mutate(accounts[0] ?? null);
    provider?.on('accountsChanged', mutator);
    return () => {
      provider?.removeListener('accountsChanged', mutator);
    };
  }, [provider]);

  return {
    data,
    isAdmin: (data && adminAddresses[web3.utils.keccak256(data)]) ?? false,
    mutate,
    ...rest,
  };
};
