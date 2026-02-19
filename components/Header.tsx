import { useMemo, useContext } from 'react'
import { DimensionsContext } from '../logic/context/DimensionsContext'
import { Stack, createTheme, ThemeProvider } from '@mui/material'
import GlobeReachLogo from './GithubLogo'
import Link from 'next/link'
import { useRouter } from 'next/router'
import LanguageSelect from './LanguageSelect'
const headerEN:string[] = ['Map','Rank','The Elite','Blog','FAQ']
const headerES:string[] = ['Mapa','Rango','La Élite','Blog','FAQ']
const headerPT:string[] = ['Mapa','Classe','A Elite','Blog','FAQ']
const headerFR:string[] = ['Carte','Rang','L\'Élite','Blog','FAQ']
const headerHR:string[] = ['Karta','Rang','Elita','Blog','FAQ']
interface Props {
  language:string;
  setLanguage:Function;
  panzoomReset:boolean;
  setPanzoomReset:Function;
}

const theme = createTheme({
  components: {
    MuiButton: {
      defaultProps: {
        disableRipple: true,
        disableElevation: true,
      },
    },
  }
})

const Header:React.FC<Props> = ({ language, setLanguage }) => {

  const dimensions:{width:number;height:number} = useContext(DimensionsContext)

  const router = useRouter()
  const { pathname } = useMemo(() => { return router }, [router])

  const languageCaculation = useMemo(() => {
    switch(language) {
      case '🇬🇧EN': return headerEN
      case '🇪🇸ES': return headerES
      case '🇵🇹PT': return headerPT
      case '🇫🇷FR': return headerFR
      case '🇭🇷HR': return headerHR
    }
  }, [language])

  return (
    <div className={'container'}>
      <style jsx>{`
        .container {
          align-content: space-around;
          padding: 0 0.5rem;
          padding-top: 4px;
          padding-bottom: 4px;
          display: flex;
          align-items: center;
          justify-content: ${dimensions.width > 800 ? 'center' : 'left'};
          position: fixed;
          left: 0px;
          top: 0px;
          height: 44px;
          width: 100%;
          background: linear-gradient(135deg, #0A0F1C 0%, #131B2E 100%);
          z-index: 2;
          border-bottom: 1px solid rgba(0,212,170,0.15);
        }
        .header-btn {
          display: inline-block;
          padding: 6px 16px;
          border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.8);
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.3px;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .header-btn:hover {
          background: rgba(0,212,170,0.1);
          border-color: rgba(0,212,170,0.4);
          color: #00D4AA;
        }
        .header-btn.active {
          background: rgba(0,212,170,0.15);
          border-color: #00D4AA;
          color: #00D4AA;
          font-weight: 600;
        }
      `}</style>
      <ThemeProvider theme={theme}>
        <Stack direction="row" spacing={1.5}>
          {dimensions.width > 800 && <GlobeReachLogo />}
          <Link href='/'><span className={`header-btn${pathname === '/' ? ' active' : ''}`}>{languageCaculation[0]}</span></Link>
          <Link href='/rank'><span className={`header-btn${pathname.includes('/rank') ? ' active' : ''}`}>{languageCaculation[1]}</span></Link>
          <Link href='/elite'><span className={`header-btn${pathname.includes('/elite') ? ' active' : ''}`}>{languageCaculation[2]}</span></Link>
          <Link href='/blog'><span className={`header-btn${pathname.includes('/blog') ? ' active' : ''}`}>{languageCaculation[3]}</span></Link>
          {dimensions.width > 800 && <Link href='/faq'><span className={`header-btn${pathname.includes('/faq') ? ' active' : ''}`}>{languageCaculation[4]}</span></Link>}
          <LanguageSelect
            language={language}
            setLanguage={setLanguage}
          />
        </Stack>
      </ThemeProvider>
    </div>
  )
}

export default Header
