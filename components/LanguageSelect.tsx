import { useCallback } from 'react'

interface Props {
  language: string;
  setLanguage: Function;
}

const languageArray: string[] = ['🇬🇧EN','🇪🇸ES','🇵🇹PT','🇫🇷FR','🇭🇷HR']

const LanguageSelect: React.FC<Props> = ({ language, setLanguage }) => {

  const handleChange = (event) => {
    setLanguage(event.target.value)
  }

  const renderOptions: Function = useCallback((languageArray: string[]) => {
    return languageArray.map(language =>
      <option key={language} value={language}>{language}</option>
    )
  }, [language])

  return (
    <div className="select-container">
      <select className="language-select" value={language} onChange={handleChange}>
        {renderOptions(languageArray)}
      </select>
      <style jsx>{`
        .select-container {
          height:30px;
          top:8px;
          right:25px;
          position: absolute;
        }
        .language-select {
          height: 30px;
          padding: 5px;
          background-color: #0A0F1C;
          color: rgba(255,255,255,0.8);
          border: 1px solid rgba(0,212,170,0.3);
          border-radius: 5px;
          font-size: 14px;
          appearance: none;
          background-position-x: calc(100% - 10px);
          background-position-y: center;
          transition: border-color 0.2s ease;
        }
        .language-select:hover {
          border-color: #00D4AA;
        }
        .language-select:focus {
          outline: none;
          border-color: #00D4AA;
        }
      `}</style>
    </div>
  )
}

export default LanguageSelect