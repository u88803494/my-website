interface ErrorMessageProps {
  error: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => (
  <div className="rounded-lg border border-red-200 bg-red-50 p-4">
    <div className="flex items-center gap-2">
      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500">
        <span className="text-sm text-white">!</span>
      </div>
      <span className="text-red-800">{error}</span>
    </div>
  </div>
);

export default ErrorMessage;
