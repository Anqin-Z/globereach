import { useMemo, useContext } from 'react'
import { DimensionsContext } from '../logic/context/DimensionsContext'
import { Stack, createTheme, ThemeProvider } from '@mui/material'
import GlobeReachLogo from './GithubLogo'
import Link from 'next/link'
import { useRouter } from 'next/router'
import LanguageSelect from './LanguageSelect'
const headerEN:string[] = ['map','rank','visa','the elite','blog','faq']
const headerES:string[] = ['mapa','rango','visado','la élite','blog','faq']
const headerPT:string[] = ['mapa','classe','visado','a elite','blog','faq']
const headerFR:string[] = ['carte','rang','visa','l\'élite','blog','faq']
const headerHR:string[] = ['karta','rang','viza','elita','blog','faq']
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
        .map {
          ${(pathname === '/') && 'color: #00D4AA !important; font-weight: 600;'}
        }
        .rank {
          ${(pathname.includes('/rank')) && 'color: #00D4AA !important; font-weight: 600;'}
        }
        .visapolicy {
          ${(pathname.includes('/visapolicy')) && 'color: #00D4AA !important; font-weight: 600;'}
        }
        .elite {
          ${(pathname.includes('/elite')) && 'color: #00D4AA !important; font-weight: 600;'}
        }
        .blog {
          ${(pathname.includes('/blog')) && 'color: #00D4AA !important; font-weight: 600;'}
        }
        .faq {
          ${(pathname.includes('/faq')) && 'color: #00D4AA !important; font-weight: 600;'}
        }
        p {
          color: rgba(255,255,255,0.8);
          text-decoration: none;
          font-size: 14px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          transition: color 0.2s ease;
        }
        p:visited {
          color: rgba(255,255,255,0.8);
          text-decoration: none;
        }
        p:hover {
          color: #00D4AA;
          text-decoration: none;
        }
      `}</style>
      <ThemeProvider theme={theme}>
        <Stack direction="row" spacing={1.5}>
          {dimensions.width > 800 && <GlobeReachLogo />}
          <Link href='/'><p className={'map'}>{'/' + languageCaculation[0] + '/'}</p></Link>
          <Link href='/rank'><p className={'rank'}>{'/' + languageCaculation[1] + '/'}</p></Link>
          <Link href='/visapolicy'><p className={'visapolicy'}>{'/' + languageCaculation[2] + '/'}</p></Link>
          <Link href='/elite'><p className={'elite'}>{'/' + languageCaculation[3] + '/'}</p></Link>
          <Link href='/blog'><p className={'blog'}>{'/' + languageCaculation[4] + '/'}</p></Link>
          {dimensions.width > 800 && <Link href='/faq'><p className={'faq'}>{'/' + languageCaculation[5] + '/'}</p></Link>}
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
