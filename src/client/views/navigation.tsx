import { PlayerIdentity } from "../../player";
import { url } from "../helpers";
import githubLogo from "./images/github-mark-white.svg";

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
        <div className="navbar-brand">
          <h1 className="h3 d-inline m-0">Coop Chess</h1>
          <span className="mx-3 user-select-none">&#8226;</span>
          <a href={url("/")}>Home</a>
          <span className="mx-3 user-select-none">&#8226;</span>
          <a className="github-logo" href="https://github.com/bgradin/coop-chess" target="_blank">
            <img src={githubLogo} alt="GitHub logo" />
          </a>
        </div>
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
