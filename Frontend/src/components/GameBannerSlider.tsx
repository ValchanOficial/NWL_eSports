import { useState } from 'react';

import { useKeenSlider } from "keen-slider/react";
import 'keen-slider/keen-slider.min.css';

import { GameBanner, GameBannerProps } from './GameBanner';
import { Arrow } from './Arrow';

export interface GameBannerSliderProps {
    games: GameBannerProps[];
}

export function GameBannerSlider({ games }: GameBannerSliderProps) {
    const [loaded, setLoaded] = useState(false);
    const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
        {
            initial: 0,
            loop: true,
            created() {
                setLoaded(true);
            },
            slides: {
                perView: 6,
                spacing: 16
            }
        },
        []
    );

    return (
        <div className='relative w-full'>
            <div ref={sliderRef} className="keen-slider grid grid-cols-6 mt-16 ">
                {games.length > 0 && games.map((data) => (
                    <GameBanner key={data.id} {...data} />
                ))}
            </div>

            {loaded && instanceRef.current && (
                <>
                    <Arrow
                        left
                        onClick={(e) => e.stopPropagation() || instanceRef.current?.prev()}
                    />
                    <Arrow
                        onClick={(e) => e.stopPropagation() || instanceRef.current?.next()}
                    />
                </>
            )}
        </div>
    )
}