import { Navbar, Footer } from '@components/ui/common';
import { Web3Provider } from '@components/providers';

const BaseLayout = ({ children }) => {
  return (
    // The way how we can load scripts
    // import Script from 'next/script';

    //  <Script
    //   src="/js/truffle-contract.js"
    //   strategy="beforeInteractive" // allow load script before Web3Provider
    // />
    <Web3Provider>
      <div className="max-w-7xl mx-auto px-4">
        <Navbar />
        <div className="fit">{children}</div>
      </div>
      <Footer />
    </Web3Provider>
  );
};

export default BaseLayout;
