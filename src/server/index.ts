import { Server as SocketServer } from 'socket.io';
import { Lobby } from './lobby';
import { Session, SessionEvents } from './session';
import { Game } from '../game';
import { Events } from '../events';
import { PlayerIdentity } from '../player';
import { validateDto } from './validation';

const PORT = 3000;
const PRODUCTION_ORIGIN = "http://chess.gradinware.com";
const LOCALHOST_ORIGIN = "http://localhost";

const io = new SocketServer({
  cors: {
    origin: process.env.PRODUCTION ? PRODUCTION_ORIGIN : LOCALHOST_ORIGIN,
  }
});
const lobby = new Lobby(
  (game: Game) => {
    io.to(game.id).emit(Events.GameUpdated, game);
  }
);

class Server {
  #io: SocketServer;
  #sessions: Session[] = [];

  constructor() {
    this.#io = new SocketServer();

    this.#registerEvents();
  }

  #endSession(session: Session) {
    const index = this.#sessions.indexOf(session);
    if (index !== -1) {
      this.#sessions.splice(index, 1);
    }
  }

  #registerEvents() {
    io.on("connection", (socket) => {
      socket.emit(Events.Identify, (id: PlayerIdentity) => {
        if (!validateDto(id, "PlayerIdentityDto")) {
          socket.emit(Events.Error);
        } else {
          const session = new Session(socket, lobby, id);
          this.#sessions.push(session);

          session.on(SessionEvents.Close, () => this.#endSession(session));
        }
      });
    });
  }

  run() {
    this.#io.listen(PORT);
  }
}

const server = new Server();
server.run();
