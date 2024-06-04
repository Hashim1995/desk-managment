import React from 'react';
import { Select } from 'antd';

import AzeIcon from '@/assets/images/azerbaijan.png';
import EngIcon from '@/assets/images/united-kingdom.png';

/**
 * @component
 * @example
 * ```jsx
 * import LanguageSelector from './LanguageSelector';
 *
 * function MyComponent() {
 *   const [selectedLanguage, setSelectedLanguage] = useState('az');
 *
 *   const handleLanguageChange = (newLang) => {
 *     setSelectedLanguage(newLang);
 *   };
 *
 *   return (
 *     <div>
 *       <LanguageSelector selectedLanguage={selectedLanguage} onLanguageChange={handleLanguageChange} />
 *     </div>
 *   );
 * }
 * ```
 *
 * Renders a language selection dropdown component using Ant Design's `Select` component.
 *
 * @prop {string} selectedLanguage - The currently selected language code (e.g., "az", "en").
 * @prop {function(string): void} onLanguageChange - Callback function to be invoked when the user selects a new language. The function is passed the newly selected language code.
 *
 * @returns {JSX.Element} The rendered language selection dropdown component.
 */

interface Language {
  value: string;
  label: string;
  icon?: string;
}

const languages: Language[] = [
  { value: 'az', label: 'Az', icon: AzeIcon },
  { value: 'en', label: 'En', icon: EngIcon }
];

interface LanguageSelectorProps {
  selectedLanguage: string;
  // eslint-disable-next-line no-unused-vars
  onLanguageChange: (newlang: string) => void;
}

function LanguageSelector({
  selectedLanguage,
  onLanguageChange
}: LanguageSelectorProps) {
  return (
    <div className="flex items-center">
      <Select
        value={selectedLanguage}
        onChange={onLanguageChange}
        className={'flex items-center p-2'}
        style={{ width: '85px' }}
      >
        {languages.map(language => (
          <Select.Option key={language.value} value={language.value}>
            <div className="flex items-center gap-x-1">
              <img
                src={language.icon}
                alt={language.label}
                width={20}
                height={20}
              />
              {language.label}
            </div>
          </Select.Option>
        ))}
      </Select>
    </div>
  );
}

export default LanguageSelector;
