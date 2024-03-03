import { HttpClient, OAuth2AuthCodePKCE } from '@bity/oauth2-auth-code-pkce';
import { BASE_PATH } from './routing';
import { PlayerIdentity } from '../player';

export const lichessHost = 'https://lichess.org';
export const scopes = ['board:play'];
export const clientId = 'coop-chess';
export const clientUrl = `${location.protocol}//${location.host}${BASE_PATH || '/'}`;

export class Auth {
  oauth = new OAuth2AuthCodePKCE({
    authorizationUrl: `${lichessHost}/oauth`,
    tokenUrl: `${lichessHost}/api/token`,
    clientId,
    scopes,
    redirectUrl: clientUrl,
    onAccessTokenExpiry: refreshAccessToken => refreshAccessToken(),
    onInvalidGrant: console.warn,
  });
  identity?: PlayerIdentity;
  client?: HttpClient;

  async init() {
    try {
      const accessContext = await this.oauth.getAccessToken();
      if (accessContext) await this.authenticate();
    } catch (err) {
      console.error(err);
    }
    if (!this.identity) {
      try {
        const hasAuthCode = await this.oauth.isReturningFromAuthServer();
        if (hasAuthCode) await this.authenticate();
      } catch (err) {
        console.error(err);
      }
    }
  }

  async login() {
    await this.oauth.fetchAuthorizationCode();
  }

  async logout() {
    if (this.identity) {
      await this.client?.(`${lichessHost}/api/token`, { method: 'DELETE' });
    }
    localStorage.clear();
    this.identity = undefined;
  }

  private authenticate = async () => {
    const client = this.oauth.decorateFetchHTTPClient(window.fetch);
    const res = await client(`${lichessHost}/api/account`);
    this.client = client;
    const response = {
      ...(await res.json()),
    };
    if (response.error) {
      throw response.error;
    }

    this.identity = response;
  };

  fetchBody = async (path: string, config: any = {}) => {
    const res = await this.fetchResponse(path, config);
    const body = await res.json();
    return body;
  };

  private fetchResponse = async (path: string, config: any = {}) => {
    const res = await (this.client || window.fetch)(`${lichessHost}${path}`, config);
    if (res.error || !res.ok) {
      const err = `${res.error} ${res.status} ${res.statusText}`;
      alert(err);
      throw err;
    }
    return res;
  };
}