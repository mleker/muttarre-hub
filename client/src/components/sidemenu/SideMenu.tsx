import { Link } from 'react-router-dom'
import styles from './sidemenu.module.css';

export const SideMenu = () => {
  // if 'artworks' route is on then css class 'active' will be added to the link
  // if 'profile' route is on then css class 'active' will be added to the link
  const path = window.location.pathname;

  return (
    <div className={styles.sidemenu}>
      <Link
        to={'/profile'}
        className={`${styles.sidemenuItem} ${path === '/profile' ? styles.active : ''}`}
      >
        profile
      </Link>
      <Link
        to={'/artworks'}
        className={`${styles.sidemenuItem} ${path === '/artworks' || path === '/' ? styles.active : ''}`}
      >
        artworks
      </Link>
    </div>
  )
}