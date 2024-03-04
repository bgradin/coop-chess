import { ErrorNoAuthCode, HttpClient, OAuth2AuthCodePKCE } from '@bity/oauth2-auth-code-pkce';
import { BASE_PATH } from './constants';
import { PlayerIdentity } from '../player';

export const lichessHost = 'https://lichess.org';
export const scopes = [];
export const clientId = 'coop-chess';
export const clientUrl = `${location.protocol}//${location.host}${BASE_PATH || '/'}`;

export enum AuthEvents {
  Authenticated = "auth",
  Unauthenticated = "unauth",
}

export class Auth extends EventTarget {
  identity?: PlayerIdentity;
  loading: boolean = true;
  #oauth = new OAuth2AuthCodePKCE({
    authorizationUrl: `${lichessHost}/oauth`,
    tokenUrl: `${lichessHost}/api/token`,
    clientId,
    scopes,
    redirectUrl: clientUrl,
    onAccessTokenExpiry: refreshAccessToken => refreshAccessToken(),
    onInvalidGrant: console.warn,
  });
  #client?: HttpClient;
  #init?: Promise<void>;

  async init() {
    if (!this.#init) {
      this.#init = (async () => {
        try {
          const accessContext = await this.#oauth.getAccessToken();
          if (accessContext) {
            await this.#authenticate();
          }
        } catch (err) {
          if (!(err instanceof ErrorNoAuthCode)) {
            console.error(err);
            throw err;
          }
        }
  
        if (!this.identity) {
          try {
            const hasAuthCode = await this.#oauth.isReturningFromAuthServer();
            if (hasAuthCode) {
              // Remove auth token if it exists
              if (window.location.search.includes("code=liu_")) {
                history.pushState({}, "", BASE_PATH || "/");
              }

              await this.#authenticate();
            } else {
              this.loading = false;
            }
          } catch (err) {
            console.error(err);
            throw err;
          }
        }
      })();
    }

    return this.#init;
  }

  async login() {
    await this.#oauth.fetchAuthorizationCode();
  }

  async logout() {
    if (this.identity) {
      await this.#client?.(`${lichessHost}/api/token`, { method: 'DELETE' });
    }
    localStorage.clear();
    this.identity = undefined;
    this.dispatchEvent(new Event(AuthEvents.Unauthenticated));
  }

  async #authenticate() {
    const client = this.#oauth.decorateFetchHTTPClient(window.fetch);
    const res = await client(`${lichessHost}/api/account`);
    this.#client = client;
    const response = {
      ...(await res.json()),
    };
    if (response.error) {
      throw response.error;
    }

    this.identity = response;
    this.dispatchEvent(new Event(AuthEvents.Authenticated))
  };
}