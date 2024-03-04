import { Game } from '../../game';
import { url } from '../helpers';
import { Lobby } from '../lobby';

interface AuthenticatedHomePageProps {
  lobby: Lobby
}

export function AuthenticatedHomePage(
  {
    lobby,
  }: AuthenticatedHomePageProps
) {
  return (
    <div>
      <About />
      <Rules />
      <div className='btn-group mt-5'>
        <button className='btn btn-outline-primary btn-lg' type='button' onclick={lobby.createGame}>
          Create game
        </button>
        <button className='btn btn-outline-primary btn-lg' type='button' onclick={lobby.joinGame}>
          Join game
        </button>
      </div>
      <h2 className='mt-5'>Active games</h2>
      <div className='games'>
        <ActiveGames games={lobby.games} />
      </div>
    </div>
  );
}

export function UnauthenticatedHomePage() {
  return (
    <div className='login text-center'>
      <About />
      <a className='btn btn-primary btn-lg mt-2' href={url('/login')}>Login with Lichess</a>
    </div>
  );
}

interface ActiveGamesProps {
  games: Game[];
}

function ActiveGames(
  {
    games,
  }: ActiveGamesProps
) {
  return games.length ? <p>{ games.length } active games.</p> : <p>No active games.</p>;
}

function About() {
  return (
    <div className='about'>
      <p>
        Cooperative chess is a variant of chess that aims to replace one-on-one competition with group collaboration, so that everyone can discover the beauty that can be found within a chess game.
      </p>
    </div>
  );
}

function Rules() {
  return (
    <div className='rules'>
      <h2 className='mt-3 mb-3'>Rules</h2>
      <ol>
        <li>
          <p>The game can be played by any number of people.</p>
        </li>
        <li>
          <p>You collectively play both sides of the board.</p>
        </li>
        <li>
          <p>Pieces are randomized to prevent opening theory.</p>
        </li>
        <li>
          <p>The goal of the game is to draw.</p>
        </li>
        <li>
          <p>You play against the computer, which will try to make the game decisive by interposing a move if your move would lose too much of a lead for one side.</p>
        </li>
      </ol>
    </div>
  );
}
