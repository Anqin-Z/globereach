import Image from 'next/image'
import Link from 'next/link'
import logo from '../public/globereach-logo.svg'

const GlobeReachLogo:React.FC = () => {
  return (
    <div className={'container'}>
      <style jsx>{`
        .container {
          top:3px;
          left:20px;
          position: absolute;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }
        .brand {
          color: #00D4AA;
          font-size: 16px;
          font-weight: 700;
          letter-spacing: 1px;
          text-decoration: none;
          white-space: nowrap;
        }
      `}</style>
      <Link href='/' style={{display:'flex',alignItems:'center',gap:'8px',textDecoration:'none'}}>
        <Image height={34} width={34} src={logo} alt={'GlobeReach'}/>
        <span className={'brand'}>GlobeReach</span>
      </Link>
    </div>
  )
}

export default GlobeReachLogo