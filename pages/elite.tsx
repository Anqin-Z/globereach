import { useContext, useEffect, useMemo } from 'react'
import { DimensionsContext } from '../logic/context/DimensionsContext'
import Head from 'next/head'

interface EliteMember {
  name: string
  passports: string[]
  worldAccess: number
  image: string | null
}

const eliteData: EliteMember[] = [
  { name: 'Elon Musk', passports: ['South Africa', 'Canada', 'United States'], worldAccess: 83.4, image: null },
  { name: 'Cristiano Ronaldo', passports: ['Portugal'], worldAccess: 75.2, image: null },
  { name: 'Lionel Messi', passports: ['Argentina', 'Spain'], worldAccess: 78.1, image: null },
  { name: 'Novak Djokovic', passports: ['Serbia', 'Monaco'], worldAccess: 72.5, image: null },
  { name: 'Rihanna', passports: ['Barbados', 'United States'], worldAccess: 79.8, image: null },
  { name: 'Nicole Kidman', passports: ['Australia', 'United States'], worldAccess: 82.3, image: null },
  { name: 'Keanu Reeves', passports: ['Canada', 'United States'], worldAccess: 81.0, image: null },
  { name: 'Shakira', passports: ['Colombia', 'Spain'], worldAccess: 77.6, image: null },
  { name: 'Natalie Portman', passports: ['Israel', 'United States'], worldAccess: 80.5, image: null },
  { name: 'Arnold Schwarzenegger', passports: ['Austria', 'United States'], worldAccess: 83.1, image: null },
  { name: 'Charlize Theron', passports: ['South Africa', 'United States'], worldAccess: 81.7, image: null },
  { name: 'Salma Hayek', passports: ['Mexico', 'United States', 'France'], worldAccess: 84.2, image: null },
]

interface Props {
  setSelectorLoad: Function
}

const Elite: React.FC<Props> = ({ setSelectorLoad }) => {

  useEffect(() => {
    setSelectorLoad(false)
  }, [])

  const dimensions = useContext(DimensionsContext)

  const isDesktop = useMemo(() => {
    return dimensions.width > 800
  }, [dimensions.width])

  const sortedData = useMemo(() => {
    return [...eliteData].sort((a, b) => b.worldAccess - a.worldAccess)
  }, [])

  const circumference = 2 * Math.PI * 54

  return (
    <>
      <Head>
        <title>GlobeReach - The Elite</title>
        <meta name="viewport" content="width=device-width, user-scalable=no"></meta>
        <link rel="shortcut icon" href="/favicon.png" />
      </Head>
      <div className={'elitePageContainer'}>
        <style jsx>{`
          .elitePageContainer {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            min-height: 100vh;
            background-color: #0F1420;
            padding-top: 80px;
            padding-bottom: 60px;
            box-sizing: border-box;
          }
          .eliteHeader {
            text-align: center;
            margin-bottom: 40px;
            padding: 0 20px;
          }
          .eliteTitle {
            font-size: ${isDesktop ? '48px' : '32px'};
            font-weight: 700;
            color: #FFFFFF;
            margin: 0 0 12px 0;
            letter-spacing: -0.5px;
          }
          .eliteTitleAccent {
            color: #00D4AA;
          }
          .eliteSubtitle {
            font-size: ${isDesktop ? '18px' : '14px'};
            color: #8892A4;
            margin: 0;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
            line-height: 1.5;
          }
          .eliteGrid {
            display: grid;
            grid-template-columns: ${isDesktop ? 'repeat(2, 1fr)' : '1fr'};
            gap: 20px;
            max-width: 1100px;
            margin: 0 auto;
            padding: 0 ${isDesktop ? '40px' : '16px'};
          }
          .eliteCard {
            background: linear-gradient(145deg, #1A2235 0%, #151C2C 50%, #121828 100%);
            border: 1px solid rgba(0, 212, 170, 0.08);
            border-radius: 16px;
            padding: ${isDesktop ? '28px 32px' : '20px'};
            display: flex;
            align-items: center;
            gap: ${isDesktop ? '24px' : '16px'};
            transition: border-color 0.2s ease, transform 0.2s ease;
          }
          .eliteCard:hover {
            border-color: rgba(0, 212, 170, 0.25);
            transform: translateY(-2px);
          }
          .eliteRank {
            font-size: ${isDesktop ? '28px' : '22px'};
            font-weight: 700;
            color: #2A3550;
            min-width: ${isDesktop ? '40px' : '30px'};
            text-align: center;
            font-family: monospace;
          }
          .eliteCardTop3 .eliteRank {
            color: #00D4AA;
          }
          .eliteInfo {
            flex: 1;
            min-width: 0;
          }
          .eliteName {
            font-size: ${isDesktop ? '22px' : '17px'};
            font-weight: 600;
            color: #FFFFFF;
            margin: 0 0 10px 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .elitePassports {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
          }
          .elitePassportPill {
            background-color: rgba(0, 212, 170, 0.1);
            color: #00D4AA;
            font-size: ${isDesktop ? '12px' : '11px'};
            padding: 4px 12px;
            border-radius: 20px;
            border: 1px solid rgba(0, 212, 170, 0.2);
            white-space: nowrap;
          }
          .eliteAccessContainer {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }
          .eliteCircleWrap {
            position: relative;
            width: ${isDesktop ? '120px' : '90px'};
            height: ${isDesktop ? '120px' : '90px'};
          }
          .eliteCircleSvg {
            transform: rotate(-90deg);
            width: 100%;
            height: 100%;
          }
          .eliteCircleBg {
            fill: none;
            stroke: #1E2840;
            stroke-width: 8;
          }
          .eliteCircleProgress {
            fill: none;
            stroke: #00D4AA;
            stroke-width: 8;
            stroke-linecap: round;
            transition: stroke-dashoffset 0.5s ease;
          }
          .elitePercentLabel {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
          }
          .elitePercentValue {
            font-size: ${isDesktop ? '22px' : '16px'};
            font-weight: 700;
            color: #00D4AA;
            display: block;
            line-height: 1.2;
          }
          .elitePercentSign {
            font-size: ${isDesktop ? '11px' : '9px'};
            color: #8892A4;
            display: block;
          }
        `}</style>
        <div className={'eliteHeader'}>
          <h1 className={'eliteTitle'}>The <span className={'eliteTitleAccent'}>Elite</span></h1>
          <p className={'eliteSubtitle'}>
            Celebrities and public figures ranked by the percentage of the world they can access with their passports.
          </p>
        </div>
        <div className={'eliteGrid'}>
          {sortedData.map((member, index) => {
            const rank = index + 1
            const dashOffset = circumference - (member.worldAccess / 100) * circumference
            return (
              <div key={member.name} className={`eliteCard ${rank <= 3 ? 'eliteCardTop3' : ''}`}>
                <div className={'eliteRank'}>
                  {String(rank).padStart(2, '0')}
                </div>
                <div className={'eliteInfo'}>
                  <h2 className={'eliteName'}>{member.name}</h2>
                  <div className={'elitePassports'}>
                    {member.passports.map((passport) => (
                      <span key={passport} className={'elitePassportPill'}>{passport}</span>
                    ))}
                  </div>
                </div>
                <div className={'eliteAccessContainer'}>
                  <div className={'eliteCircleWrap'}>
                    <svg className={'eliteCircleSvg'} viewBox="0 0 120 120">
                      <circle className={'eliteCircleBg'} cx="60" cy="60" r="54" />
                      <circle
                        className={'eliteCircleProgress'}
                        cx="60"
                        cy="60"
                        r="54"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                      />
                    </svg>
                    <div className={'elitePercentLabel'}>
                      <span className={'elitePercentValue'}>{member.worldAccess}</span>
                      <span className={'elitePercentSign'}>% world access</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default Elite
