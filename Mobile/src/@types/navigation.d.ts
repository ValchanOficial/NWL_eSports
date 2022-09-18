export interface GameParams {
    id: string,
    title: string,
    adsCount: string,
    bannerUrl: string,
}

export declare global {
    namespace ReactNavigation {
        interface RootParamList {
            home: undefined,
            game: GameParams
        }
    }
}