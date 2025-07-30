import Head from 'next/head'
import 'bootstrap/dist/css/bootstrap.min.css'
import Header from './Header'
import AppContext from '../components/common/AppContext'
import PrivateContent from '../components/common/PrivateContent'

export default function Layout({ children }) {

  return (
    <AppContext.Provider  value={{ }}>
      <div className="layout-Container">
        <Head>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header />
        <PrivateContent children= {children}/>
      </div>
    </AppContext.Provider>
  )
}