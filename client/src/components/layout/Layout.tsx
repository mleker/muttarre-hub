import { SideMenu } from '../sidemenu/SideMenu';
import { Header } from '../header/Header';
import { ReactNode } from 'react';
import styles from './layout.module.css';

export const Layout = ({ children }: { children: ReactNode }) => (
  <>
    <Header />
    <div className={styles.layout}>
      <div className={styles.layoutLeft}>
        <SideMenu />
      </div>
      <div className={styles.layoutRight}>
        {children}
      </div>
    </div>
  </>
)