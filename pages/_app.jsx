import Layout from '../layouts/Layout'
import '../styles/globals.css'
import 'sweetalert2/dist/sweetalert2.min.css';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';
import { appWithTranslation } from 'next-i18next';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

function App({ Component, pageProps }) {
  const router = useRouter();
  useEffect(() => {
    i18n.changeLanguage(router.locale);
  }, [router.locale]); 
  return (
   <I18nextProvider i18n={i18n}>
      <SessionProvider session={pageProps.session}>
        <Layout>
          <Component {...pageProps}/>
        </Layout>
      </SessionProvider>
    </I18nextProvider>
  )
}

export default appWithTranslation(App); 