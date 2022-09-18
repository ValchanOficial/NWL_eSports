import { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import axios from 'axios';

import { GameBanner, GameBannerProps } from './components/GameBanner';
import { CreateAdBanner } from './components/CreateAdBanner';
import { CreateAdModal } from './components/CreateAdModal';

import Logo from './assets/logo.svg';
import './styles/main.css';

export interface Game {
  id: string;
  title: string;
  bannerUrl: string;
  _count: {
    ads: number;
  }
}

function App() {
  const [games, setGames] = useState<GameBannerProps[]>([])

  useEffect(() => {
    axios('http://localhost:3333/games')
      .then(({ data }) => {
        const games = data.map((game: Game) => ({
          id: game.id,
          title: game.title,
          bannerUrl: game.bannerUrl,
          adsCount: game._count.ads
        }))
        setGames(games)
      })
  }, [])

  return (
    <div className='max-w-[1344px] mx-auto flex flex-col items-center my-20'>
      <img src={Logo} alt='Logo NLW eSports' />
      <h1 className='text-6xl text-white font-black mt-20'>Seu <span className='bg-nlw-gradient text-transparent bg-clip-text'>duo</span> está aqui.</h1>

      <div className='grid grid-cols-6 gap-6 mt-16'>
        {games.length > 0 && games.map((data) => (
          <GameBanner key={data.id} {...data} />
        ))}
      </div>

      <Dialog.Root>
        <CreateAdBanner />
        <CreateAdModal />
      </Dialog.Root>

    </div>
  )
}

export default App
