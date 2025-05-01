export interface Player {
    playVideo(): void;
    pauseVideo(): void;
    stopVideo(): void;
    loadVideoById(options: { videoId: string; startSeconds?: number }): void;
    destroy(): void;
    getPlayerState(): number;
    setVolume(volume: number): void;
}

export interface PlayerEvent {
    // Player event
    target: Player;
    data: number;
}

export interface PlayerConfig {
    videoId: string;
    playerVars?: {
        autoplay?: number;
        controls?: number;
        disablekb?: number;
        enablejsapi?: number;
        origin?: string;
        host?: string;
        playsinline?: number;
        modestbranding?: number;
        fs?: number;
        rel?: number;
        showinfo?: number;
        iv_load_policy?: number;
        cc_load_policy?: number;
    };
    events?: {
        onReady?: (event: PlayerEvent) => void;
        onStateChange?: (event: PlayerEvent) => void;
        onError?: (event: PlayerEvent) => void;
    };
}