import { Button } from '../ui/button';

export const MainErrorFallback = () => {
  return (
    <div>
      <h2>Ooops, something went wrong :(</h2>
      <Button className="mt-4" onClick={() => window.location.assign(window.location.origin)}>
        Refresh
      </Button>
    </div>
  );
};
