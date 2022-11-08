import { Breadcrumbs } from '@components/ui/common';
import { useAccount } from '@components/hooks/web3';
import { EthRates, WalletBar } from '@components/ui/web3';

export default function Header() {
  const LINKS = [
    {
      href: '/marketplace',
      value: 'Buy',
    },
    {
      href: '/marketplace/courses/owned',
      value: 'My Courses',
    },
    {
      href: '/marketplace/courses/managed',
      value: 'Manage Courses',
      requireAdmin: true,
    },
  ];
  const { account } = useAccount();

  return (
    <>
      <div className="pt-1">
        <WalletBar />
      </div>
      <EthRates />
      <div className="flex flex-row-reverse p-4 sm:px-6 lg:px-8">
        <Breadcrumbs isAdmin={account.isAdmin} items={LINKS} />
      </div>
    </>
  );
}
