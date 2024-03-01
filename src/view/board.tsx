import { Chessground } from 'chessground';
import { Color } from 'chessops';
import { jsx, VNode } from 'snabbdom';
import { BoardCtrl } from '../game';

export const renderBoard = (ctrl: BoardCtrl) =>
  <div className='game-page__board'>
    <div
      className='cg-wrap'
      $hook={{
        insert(vnode) {
          ctrl.setGround(Chessground(vnode.elm as HTMLElement, ctrl.chessgroundConfig()));
        },
      }}
    >
      loading...
    </div>
  </div>;

export const renderPlayer = (
  ctrl: BoardCtrl,
  color: Color,
  clock: VNode,
  name: string,
  title?: string,
  rating?: number,
  aiLevel?: number
) => 
  <div className={`game-page__player ${ctrl.chess.turn == color && 'turn'}`}>
    <div className='game-page__player__user'>
      { title && <span className='game-page__player__user__title display-5'>{ title }</span> }
      <span className='game-page__player__user__name display-5'>{ aiLevel ? `Stockfish level ${aiLevel}` : name || 'Anon' }</span>
      <span className='game-page__player__user__rating'>{ rating || '' }</span>
    </div>
    <div className='game-page__player__clock display-6'>{ clock }</div>
  </div>;
