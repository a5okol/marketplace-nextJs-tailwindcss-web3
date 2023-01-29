import { useEffect } from 'react';
import useSWR from 'swr';

const adminAddresses = {
  '0x86bb3329a3cae60c45ca17ce56c33b3faf8b6d7b0ee0801eeff027303d38e16d': true,
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
