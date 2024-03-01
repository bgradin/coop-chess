import { jsx, VNode } from "snabbdom";
import { Me } from '../auth';
import { Navigation } from '../navigation';
import { MaybeVNodes } from '../interfaces';
import { url } from '../routing';
import '../../scss/_nav.scss';

export default (navigation: Navigation, body: MaybeVNodes): VNode =>
  <body>
    { renderNavBar(navigation) }
    <div className='container'>
      { body }
    </div>
  </body>;

const renderNavBar = (navigation: Navigation) =>
  <header className='navbar navbar-expand-md navbar-dark bg-dark'>
    <div className='container'>
      <a className='navbar-brand' href={url('/')}>Coop Chess</a>
      <button
        className='navbar-toggler'
        type='button'
        aria-controls='navbarSupportedContent'
        aria-expanded={false}
        aria-label='Toggle navigation'
        data-bs-toggle='collapse'
        data-bs-target='#navbarSupportedContent'
      >
        <span className='navbar-toggler-icon'></span>
      </button>
      <ul className='navbar-nav'>{ navigation.auth.me ? userNav(navigation.auth.me) : anonNav() }</ul>
    </div>
  </header>;

const userNav = (me: Me) =>
  <li className='nav-item dropdown'>
    <a
      id='navbarDropdown'
      className='nav-link dropdown-toggle'
      href='#'
      role='button'
      aria-expanded={false}
      data-bs-toggle='dropdown'
    >
      { me.username }
    </a>
    <ul className='dropdown-menu' aria-labelledby='navbarDropdown'>
      <li>
        <a className='dropdown-item' href={url('/logout')}>Log out</a>
      </li>
    </ul>
  </li>;

const anonNav = () =>
  <li className='nav-item'>
    <a className='btn btn-primary text-nowrap' href={url('/login')}>Login with Lichess</a>
  </li>;
