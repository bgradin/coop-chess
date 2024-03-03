import { PlayerIdentity } from "../../player";
import { url } from "../routing";

interface NavigationProps {
  identity?: PlayerIdentity
}

export function Navigation(
  {
    identity,
  }: NavigationProps
) {
  return (
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
        <ul className='navbar-nav'>
          {
            identity
              ? <AuthenticatedNavItem identity={identity} />
              : <UnauthenticatedNavItem />
          }
        </ul>
      </div>
    </header>
  );
}

interface AuthenticatedNavItemProps {
  identity: PlayerIdentity
}


function AuthenticatedNavItem(
  {
    identity,
  }: AuthenticatedNavItemProps
) {
  return (
    <li className='nav-item dropdown'>
      <a
        id='navbarDropdown'
        className='nav-link dropdown-toggle'
        href='#'
        role='button'
        aria-expanded={false}
        data-bs-toggle='dropdown'
      >
        { identity.username }
      </a>
      <ul className='dropdown-menu' aria-labelledby='navbarDropdown'>
        <li>
          <a className='dropdown-item' href={url('/logout')}>Log out</a>
        </li>
      </ul>
    </li>
  );
}

function UnauthenticatedNavItem() {
  return (
    <li className='nav-item'>
      <a className='btn btn-primary text-nowrap' href={url('/login')}>Login with Lichess</a>
    </li>
  );
}
