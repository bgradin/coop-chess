import { Chessground } from 'chessground';
import { Navigation } from '../navigation';
import { Game, Renderer } from '../interfaces';
import OngoingGames from '../ongoingGames';
import { url } from '../routing';

export const renderHome: Renderer = navigation => (navigation.auth.me ? userHome(navigation) : anonHome());

const userHome = (navigation: Navigation) =>
  <div>
    { renderAbout() }
    { renderRules() }
    <div className='btn-group mt-5'>
      <button className='btn btn-outline-primary btn-lg' type='button' onclick={() => { alert('New game!') }}>
        Start a new game
      </button>
      <button className='btn btn-outline-primary btn-lg' type='button' onclick={() => {}}>
        Join an existing game
      </button>
    </div>
    <h2 className='mt-5'>Active games</h2>
    <div className='games'>
      { renderGames(navigation.games) }
    </div>
  </div>;

const renderGames = (ongoing: OngoingGames) =>
  ongoing.games.length ? ongoing.games.map(renderGameWidget) : <p>No active games.</p>;

const renderGameWidget = (game: Game) =>
  <a
    className={`game-widget text-decoration-none game-widget--${game.id}`}
    href={url(`/game/${game.gameId}`)}
  >
    <span className='game-widget__opponent'>
      <span className='game-widget__opponent__name'>{game.opponent.username || 'Anon'}</span>
      { game.opponent.rating && <span className='game-widget__opponent__rating'>{ game.opponent.rating }</span> }
    </span>
    <span
      className='game-widget__board cg-wrap'
      $hook={{
        insert(vnode) {
          const el = vnode.elm as HTMLElement;
          Chessground(el, {
            fen: game.fen,
            orientation: game.color,
            lastMove: game.lastMove.match(/.{1,2}/g),
            viewOnly: true,
            movable: { free: false },
            drawable: { visible: false },
            coordinates: false,
          });
        }
      }}
    >
    </span>
  </a>;

const anonHome = () =>
  <div className='login text-center'>
    { renderAbout() }
    <a className='btn btn-primary btn-lg mt-2' href={url('/login')}>Login with Lichess</a>
  </div>;

const renderAbout = () =>
  <div className='about'>
    <p>
      Cooperative chess is a variant of chess that aims to replace one-on-one competition with group collaboration, so that everyone can discover the beauty that can be found within a chess game.
    </p>
  </div>;

const renderRules = () =>
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
  </div>;
