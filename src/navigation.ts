import { Auth } from './auth';
import { GameCtrl } from './game2';
import { Page } from './interfaces';
import OngoingGames from './ongoingGames';

export class Navigation {
  auth: Auth = new Auth();
  page: Page = 'home';
  games = new OngoingGames();
  game?: GameCtrl;

  constructor(readonly redraw: () => void) {}

  openHome = async () => {
    this.page = 'home';
    if (this.auth.me) {
      this.games.empty();
    }
    this.redraw();
  };

  openGame = async (id: string) => {
    this.page = 'game';
    this.game = undefined;
    this.redraw();
    this.game = await GameCtrl.open(this, id);
    this.redraw();
  };

  startGame = async (minutes: number, increment: number) => {
    
  };
}