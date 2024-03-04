export function GenericErrorPage() {
  return (
    <div>
      <h2 className="mt-4 mb-3">Error</h2>
      <p>An unexpected error occurred.</p>
      <div className="text-center">
      <button className='btn btn-primary btn-lg mt-2' onclick={() => window.location.reload()}>Refresh page</button>
      </div>
    </div>
  );
}
