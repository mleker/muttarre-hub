import { Link } from 'react-router-dom'
import logo from '../../assets/logo.svg';
import styles from './header.module.css';

export const Header = () => {
  return (
    <div className={styles.header}>
      <Link
        to={'/'}
        className={styles.headerLogo}
      >
        <img
          src={logo}
          alt="muttarre logo"
          width={500}
          height={100}
        />
      </Link>
    </div>
  );
}