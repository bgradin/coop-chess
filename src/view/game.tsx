import { jsx } from "snabbdom";
import { Color } from 'chessground/types';
import { opposite } from 'chessground/util';
import { GameCtrl } from '../game';
import { Renderer } from '../interfaces';
import { clockContent } from './clock';
import '../../scss/_game.scss';
import { renderBoard, renderPlayer } from './board';

export const renderGame: (ctrl: GameCtrl) => Renderer = ctrl => _ =>
  <div
    className={`game-page game-page--${ctrl.game.id}`}
    $hook={{
      destroy: ctrl.onUnmount
    }}
  >
    { renderGamePlayer(ctrl, opposite(ctrl.pov)) }
    { renderBoard(ctrl) }
    { renderGamePlayer(ctrl, ctrl.pov) }
    { ctrl.playing() ? renderButtons(ctrl) : renderState(ctrl) }
  </div>;

const renderButtons = (ctrl: GameCtrl) =>
  <div className='btn-group mt-4'>
    <button
      className='btn btn-secondary'
      disabled={!ctrl.playing()}
      onclick={ctrl.resign}
    >
      { ctrl.chess.fullmoves > 1 ? 'Resign' : 'Abort' }
    </button>
  </div>;

const renderState = (ctrl: GameCtrl) => <div className='game-page__state'>{ ctrl.game.state.status }</div>;

const renderGamePlayer = (ctrl: GameCtrl, color: Color) => {
  const p = ctrl.game[color];
  const clock = clockContent(
    ctrl.timeOf(color),
    color == ctrl.chess.turn && ctrl.chess.fullmoves > 1 && ctrl.playing() ? ctrl.lastUpdateAt - Date.now() : 0
  );
  return renderPlayer(ctrl, color, clock, p.name, p.title, p.rating, p.aiLevel);
};