export type ErrorProps = {
  errorMessage?: string | null;
};

export const FieldErrors = ({ errorMessage }: ErrorProps) => {
  if (!errorMessage) return null;

  return (
    <div role="alert" className="text-sm font-semibold text-red-500">
      {errorMessage}
    </div>
  );
};
