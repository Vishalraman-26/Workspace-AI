import { SUGGESTED_PROMPTS } from '../../utils/constants';

export default function SuggestedPrompts({ onSelect }) {
  return (
    <div className="d-flex flex-wrap gap-2 justify-content-center">
      {SUGGESTED_PROMPTS.map((prompt) => (
        <button
          key={prompt}
          type="button"
          className="wa-prompt-chip"
          onClick={() => onSelect(prompt)}
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
