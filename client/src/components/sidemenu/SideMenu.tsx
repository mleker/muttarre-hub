import { Link } from 'react-router-dom'
import styles from './sidemenu.module.css';

export const SideMenu = () => {
  return (
    <div className={styles.sidemenu}>
      <Link
        to={'/profile'}
        className='sidemenu-item'
      >
        profile
      </Link>
      <Link
        to={'/artworks'}
        className='sidemenu-item'>
        artworks
      </Link>
    </div>
  )
}