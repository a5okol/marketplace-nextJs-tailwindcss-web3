import { useRouter } from 'next/router';

import { useWeb3 } from '@components/providers';
import { useAccount } from '@components/hooks/web3';
import { Button, ActiveLink } from '@components/ui/common';

const Navbar = () => {
  const { connect, isLoading, requireInstall } = useWeb3();
  const { account } = useAccount();
  const { pathname } = useRouter();

  const isConnectedMetamask = account.data ? (
    <Button hoverable={false} className="cursor-default">
      Metamask connected {account.isAdmin && ', Admin'}
    </Button>
  ) : (
    <Button onClick={connect}>Connect </Button>
  );

  const isInstalledMetamask = requireInstall ? (
    <Button
      onClick={() => window.open('https://metamask.io/download.html', '_blank')}
    >
      Install Metamask
    </Button>
  ) : (
    isConnectedMetamask
  );

  return (
    <section>
      <div className="relative pt-6 px-4 sm:px-6 lg:pl-8 lg:pr-0">
        <nav className="relative" aria-label="Global">
          <div className="flex flex-col xs:flex-row justify-between items-center">
            <div>
              <ActiveLink href="/">
                <a className="font-medium mr-8 hover:text-gray-900">Home</a>
              </ActiveLink>
              <ActiveLink href="/marketplace">
                <a className="font-medium mr-8 hover:text-gray-900">
                  Marketplace
                </a>
              </ActiveLink>
              <ActiveLink href="/blogs">
                <a className="font-medium mr-8 hover:text-gray-900">Blogs</a>
              </ActiveLink>
            </div>
            <div className="text-center">
              <ActiveLink href="/wishlist">
                <a className="font-medium sm:mr-8 mr-1 text-gray-500 hover:text-gray-900">
                  Wishlist
                </a>
              </ActiveLink>
              {isLoading ? (
                <Button onClick={connect} disabled={true}>
                  Loading...
                </Button>
              ) : (
                isInstalledMetamask
              )}
            </div>
          </div>
        </nav>
      </div>
      {account.data && !pathname.includes('/marketplace') && (
        <div className="flex justify-end pt-1 sm:px-6 lg:pl-8 lg:pr-0">
          <div className="text-white bg-indigo-600 rounded-md p-2">
            {account.data}
          </div>
        </div>
      )}
    </section>
  );
};

export default Navbar;
