import '@styles/globals.css';

import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

const Noop = ({ children }) => <>{children}</>;

function MyApp({ Component, pageProps }) {
  const Layout = Component.Layout ?? Noop;

  return (
    <Layout>
      <ToastContainer />
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
