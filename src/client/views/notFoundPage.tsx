import { url } from "../helpers";

export function NotFoundPage() {
  return (
    <div>
      <h2 className="mt-4 mb-3">Page not found.</h2>
      <a className='btn btn-primary btn-lg mt-2' href={url("/")}>Homepage</a>
    </div>
  );
}
