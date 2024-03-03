import page from "page";

export const BASE_PATH = location.pathname.replace(/\/$/, '');

export const url = (path: string) => `${BASE_PATH}${path}`;
export const href = (path: string) => ({ href: url(path) });

export interface RouteHandler {
  openHomePage: () => void;
  login: () => void;
  logout: () => void;
  openGame: (id: string) => void;
  open404Page: () => void;
}

export enum Routes {
  Home = "/",
  Login = "/login",
  Logout = "/logout",
  Game = "/game/:id",
  NotFound = "*",
}

export function initRouting(handler: RouteHandler) {
  page.base(BASE_PATH);
  page(Routes.Home, async ctx => {
    // Remove auth token if it exists
    if (ctx.querystring.includes("code=liu_")) {
      history.pushState({}, "", BASE_PATH || "/");
    }

    handler.openHomePage();
  });
  page(Routes.Login, async _ => {
    handler.login();
  });
  page(Routes.Logout, async _ => {
    handler.logout();
  });
  page(Routes.Game, ctx => {
    handler.openGame(ctx.params.id);
  });
  page(Routes.NotFound, _ => {
    handler.open404Page();
  });
  page({ hashbang: true });
}
