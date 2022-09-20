import { CaretLeft, CaretRight } from "phosphor-react";

export function Arrow(props: { left?: boolean; onClick: (e: any) => void }) {
    return (
        <>
            {props.left ?
                <CaretLeft
                    size={30}
                    onClick={props.onClick}
                    color='#A1A1AA'
                    className='absolute -left-9 top-1/2 cursor-pointer'
                /> :
                <CaretRight
                    size={30}
                    onClick={props.onClick}
                    color='#A1A1AA'
                    className='absolute left-auto -right-9 top-1/2 cursor-pointer'
                />
            }
        </>
    );
}