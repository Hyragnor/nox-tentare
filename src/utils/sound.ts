import { ASSET_KEYS } from '../assetLoader';

let sfxVolume = 100;
let musicVolume = 100;

const songs: Phaser.Sound.BaseSound[] = [];
let songIndex: integer;

export function createSounds(context: Phaser.Scene): void {
    songs.push(context.sound.add(ASSET_KEYS.MUSIC_1, { volume: musicVolume / 100, loop: true }));
    songs.push(context.sound.add(ASSET_KEYS.MUSIC_2, { volume: musicVolume / 100, loop: true }));
    songs.push(context.sound.add(ASSET_KEYS.MUSIC_3, { volume: musicVolume / 100, loop: true }));
    songIndex = songs.length - 1;
}

export function playNextSong(): void {
    if (songs[songIndex].isPlaying) {
        songs[songIndex].stop();
    }
    songIndex = songIndex >= songs.length - 1 ? 0 : songIndex + 1;
    songs[songIndex].play();
}