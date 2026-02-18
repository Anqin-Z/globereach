import { useEffect, MutableRefObject } from 'react'
import Head from 'next/head'
import Link from 'next/link'
interface Props {
  setSelectorLoad:Function;
}

const Blog:React.FC<Props> = ({ setSelectorLoad }) => {

  useEffect(() => {
    setSelectorLoad(false)
  }, [])

  return (
    <>
    <Head>
			<title>{'GlobeReach - Blog'}</title>
			<meta name='viewport' content='width=device-width, user-scalable=no'></meta>
			<link rel='shortcut icon' href='/favicon.png' />
		</Head>
    <div className={'container'}>
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          margin-top: 70px;
          align-items: center;
          color: #E8ECF1;
          padding: 0 20px;
        }
        h2 {
          margin: 0px;
          color: #00D4AA;
          transition: color 0.2s ease;
        }
        h2:hover {
          color: #00F0C0;
        }
        .article {
          width: 200px;
          height: 100px;
        }
        .item {
          width: 200px;
          height: 100px;
        }
        .date {
          font-weight: bold;
          font-size: .75rem;
          color: rgba(255,255,255,0.5);
        }
        .article-list {
          white-space: normal;
          list-style: none;
          max-width: 700px;
        }
      `}</style>
      <ul className='article-list'>
        <li>
          <Link href={'/blog/easiestcitizenship'}><h2>{'Which country is the easiest to naturalize in?'}</h2></Link>
          <div>
            <time className={'date'}>{'Jan 5, 2025 '}</time>
              <small><time>{'(updated Jan 5, 2025 - 18:45 UTC) '}</time></small>
            <span>{' • '}</span>
            <span>{'7 minutes to read'}</span>
            <span>{' • '}</span>
            <span></span>
            <span>{'by '}<Link href={'https://github.com/ChengCPU'}>{'CCPU'}</Link></span>
          </div>
            <span><strong>{'a good starting resource for anyone wanting a second passport'}</strong></span>
        </li>
      </ul>
    </div>
    </>
  )
}

export default Blog