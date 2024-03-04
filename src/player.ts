export interface PlayerIdentity {
  id: string;
  username: string;
}

export interface Player {
  active: boolean;
  identity: PlayerIdentity;
}
