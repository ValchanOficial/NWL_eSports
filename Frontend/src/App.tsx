import { MagnifyingGlassPlus } from 'phosphor-react';
import './styles/main.css';
import Logo from './assets/logo.svg';

const games = [
  {
    id: 1,
    name: 'League of Legends',
    img: '/game-1.png',
  },
  {
    id: 2,
    name: 'World of Warcraft',
    img: '/game-2.png',
  },
  {
    id: 3,
    name: 'Dota 2',
    img: '/game-3.png',
  },
  {
    id: 4,
    name: 'Counter Strike: Global Offensive',
    img: '/game-4.png',
  },
  {
    id: 5,
    name: 'Apex Legends',
    img: '/game-5.png',
  },
  {
    id: 6,
    name: 'Fortnite',
    img: '/game-6.png',
  }
]

function App() {
  return (
    <div className='max-w-[1344px] mx-auto flex flex-col items-center my-20'>
      <img src={Logo} alt='Logo NLW eSports' />
      <h1 className='text-6xl text-white font-black mt-20'>Seu <span className='bg-nlw-gradient text-transparent bg-clip-text'>duo</span> está aqui.</h1>

      <div className='grid grid-cols-6 gap-6 mt-16'>
        {games.map(({ id, img, name }) => (
          <a key={id} className="relative rounded-lg overflow-hidden" href="#">
            <img src={img} alt={name} />
            <div className='w-full pt-16 pb-4 px-4 bg-game-gradient absolute bottom-0 left-0 right-0'>
              <strong className='font-bold text-white'>{name}</strong>
              <span className='text-sm text-zinc-300 block'>4 anúncios</span>
            </div>
          </a>
        ))}
      </div>

      <div className='pt-1 mt-8 bg-nlw-gradient self-stretch rounded-lg overflow-hidden'>
        <div className='bg-[#2A2634] py-6 px-6 rounded-t-md flex justify-between items-center'>
          <div>
            <strong className='text-2xl text-white font-black block'>Não encontrou o seu duo?</strong>
            <span className='text-zinc-400 block'>Publique um anúncio para encontrar novos players!</span>
          </div>
          <button className='py-3 px-4 bg-violet-500 text-white rounded hover:bg-violet-600 flex items-center gap-3'>
            <MagnifyingGlassPlus size={24} /> Publicar anúncio
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
