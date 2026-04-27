interface DisplayProps {
  value: string;
  operation: string | null;
  isLoading?: boolean;
}

export function Display({ value, operation, isLoading }: DisplayProps) {
  return (
    <div className="bg-gray-900 rounded-lg p-6 text-right">
      {operation && (
        <div className="text-gray-400 text-sm mb-1 min-h-[1.25rem]">
          {operation}
        </div>
      )}
      <div className="text-white text-4xl font-mono min-h-[3rem] flex items-center justify-end">
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            <span className="text-xl">Processing...</span>
          </div>
        ) : (
          value
        )}
      </div>
    </div>
  );
}