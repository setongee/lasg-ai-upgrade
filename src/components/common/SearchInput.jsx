import { Xmark } from 'iconoir-react';
import { useState } from 'react';

const SearchInput = ({
  placeholder = 'Search...',
  value,
  onChange,
  className = '',
  inputClassName = '',
  showClear = true,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative h-full ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        className={`py-[15px] pl-[45px] pr-[40px] rounded-[5px] w-full bg-[#f5f5f5] text-[14px] h-full focus:outline-none focus:ring-1 focus:ring-[#27ae60] focus:border-transparent transition-all duration-200 ${inputClassName}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <svg
        className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
          isFocused ? 'text-[#27ae60]' : 'text-gray-400'
        }`}
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      
      {showClear && value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
          aria-label="Clear search"
          type="button"
        >
          <Xmark width={16} height={16} />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
