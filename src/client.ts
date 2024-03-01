import { init, attributesModule, classModule, datasetModule, eventListenersModule, propsModule } from 'snabbdom';
import { Navigation } from './navigation';
import view, { loadingBody } from './view/app';
import '../scss/_bootstrap.scss';
import '../scss/style.scss';
import '../node_modules/bootstrap/js/dist/dropdown.js';
import '../node_modules/bootstrap/js/dist/collapse.js';
import routing from './routing';

export default async function (element: HTMLElement) {
  const patch = init([
    attributesModule,
    classModule,
    datasetModule,
    eventListenersModule,
    propsModule,
  ]);

  const navigation = new Navigation(redraw);

  let vnode = patch(element, loadingBody());

  function redraw() {
    vnode = patch(vnode, view(navigation));
  }

  await navigation.auth.init();
  routing(navigation);
}