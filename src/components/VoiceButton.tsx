interface VoiceButtonProps {
  isListening: boolean
  isSupported: boolean
  onToggle: () => void
}

export function VoiceButton({ isListening, isSupported, onToggle }: VoiceButtonProps) {
  if (!isSupported) {
    return (
      <button
        disabled
        className="flex-1 bg-gray-300 text-gray-500 py-3 px-4 rounded-xl font-medium cursor-not-allowed"
        aria-label="Voice not supported"
      >
        Voice Not Available
      </button>
    )
  }

  return (
    <button
      onClick={onToggle}
      className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        isListening
          ? 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 animate-pulse'
          : 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500'
      }`}
      aria-label={isListening ? 'Stop listening' : 'Start voice input'}
    >
      {isListening ? (
        <span className="flex items-center justify-center gap-2">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
          Listening...
        </span>
      ) : (
        'Voice'
      )}
    </button>
  )
}