import { VNode } from "snabbdom";
import { PlayerIdentity } from "../../player";
import { Navigation } from "./navigation";

interface ApplicationProps {
  identity?: PlayerIdentity;
  children?: VNode | VNode[];
}

export function Application(
  {
    identity,
    children,
  }: ApplicationProps,
) {
  return (
    <body>
      <Navigation identity={identity} />
      <div className="container">
        { children }
      </div>
    </body>
  );
}
