import { FiArrowUpRight } from 'react-icons/fi';
import { SUGGESTED_PROMPTS } from '../../utils/constants';

export default function SuggestedPrompts({ onSelect }) {
  return (
    <div className="wa-prompt-grid">
      {SUGGESTED_PROMPTS.map((prompt) => (
        <button
          key={prompt}
          type="button"
          className="wa-prompt-chip"
          onClick={() => onSelect(prompt)}
        >
          <FiArrowUpRight size={14} className="wa-prompt-chip-icon" />
          <span>{prompt}</span>
        </button>
      ))}
    </div>
  );
}
