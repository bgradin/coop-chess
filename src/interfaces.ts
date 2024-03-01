import { VNode } from 'snabbdom';
import { Navigation } from './navigation';

export type Page = 'home' | 'game' | 'seek' | 'challenge';

export type MaybeVNodes = VNode[] | VNode;
export type Renderer = (navigation: Navigation) => MaybeVNodes;

export interface Game {
  [key: string]: any;
}