'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Button } from '@heroui/react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

// Extend Window interface for Spotify SDK
declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: any;
  }
}

interface SpotifyPlayerProps {
  onPlayerReady?: (deviceId: string) => void;
}

interface PlayerState {
  paused: boolean;
  position: number;
  duration: number;
  track_window: {
    current_track: {
      name: string;
      artists: Array<{ name: string }>;
      album: {
        name: string;
        images: Array<{ url: string }>;
      };
    };
  };
}

export const SpotifyPlayer: React.FC<SpotifyPlayerProps> = ({
  onPlayerReady,
}) => {
  const { accessToken } = useSelector((state: RootState) => state.spotify);
  const [player, setPlayer] = useState<any>(null);
  const [deviceId, setDeviceId] = useState<string>('');
  const [playerState, setPlayerState] = useState<PlayerState | null>(null);
  const [isReady, setIsReady] = useState(false);
  const playerInitialized = useRef(false);

  // Load Spotify SDK
  useEffect(() => {
    if (!accessToken) return;

    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      if (playerInitialized.current) return;
      playerInitialized.current = true;

      const spotifyPlayer = new window.Spotify.Player({
        name: 'StudyGo Web Player',
        getOAuthToken: (cb: (token: string) => void) => {
          cb(accessToken);
        },
        volume: 0.5,
      });

      // Error handling
      spotifyPlayer.addListener(
        'initialization_error',
        ({ message }: { message: string }) => {
          console.error('Initialization error:', message);
        }
      );

      spotifyPlayer.addListener(
        'authentication_error',
        ({ message }: { message: string }) => {
          console.error('Authentication error:', message);
        }
      );

      spotifyPlayer.addListener(
        'account_error',
        ({ message }: { message: string }) => {
          console.error('Account error:', message);
        }
      );

      spotifyPlayer.addListener(
        'playback_error',
        ({ message }: { message: string }) => {
          console.error('Playback error:', message);
        }
      );

      // Ready
      spotifyPlayer.addListener(
        'ready',
        ({ device_id }: { device_id: string }) => {
          console.log('Ready with Device ID', device_id);
          setDeviceId(device_id);
          setIsReady(true);
          onPlayerReady?.(device_id);
        }
      );

      // Not Ready
      spotifyPlayer.addListener(
        'not_ready',
        ({ device_id }: { device_id: string }) => {
          console.log('Device ID has gone offline', device_id);
          setIsReady(false);
        }
      );

      // Player state changed
      spotifyPlayer.addListener('player_state_changed', (state: PlayerState) => {
        if (!state) return;
        setPlayerState(state);
      });

      spotifyPlayer.connect();
      setPlayer(spotifyPlayer);
    };

    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, [accessToken, onPlayerReady]);

  const togglePlay = () => {
    if (player) {
      player.togglePlay();
    }
  };

  const skipToPrevious = () => {
    if (player) {
      player.previousTrack();
    }
  };

  const skipToNext = () => {
    if (player) {
      player.nextTrack();
    }
  };

  if (!accessToken) {
    return (
      <div className='flex items-center justify-center p-8'>
        <p className='text-gray-500'>
          Please connect to Spotify to use the player.
        </p>
      </div>
    );
  }

  return (
    <div className='bg-white border border-gray-100 rounded-2xl p-6'>
      {/* Player Status */}
      <div className='mb-6'>
        <h2 className='text-lg font-bold text-neutral-950 mb-2'>
          Spotify Player
        </h2>
        {!isReady && (
          <p className='text-sm text-gray-500'>Connecting to Spotify...</p>
        )}
        {isReady && !playerState && (
          <div className='text-sm text-gray-500'>
            <p className='mb-2'>Player is ready! To play music:</p>
            <ol className='list-decimal list-inside space-y-1'>
              <li>Open Spotify on your phone or desktop</li>
              <li>Start playing any track</li>
              <li>Tap the "Connect to a device" icon</li>
              <li>Select "StudyGo Web Player"</li>
            </ol>
          </div>
        )}
      </div>

      {/* Current Track */}
      {playerState && (
        <div className='mb-6'>
          <div className='flex items-center gap-4 mb-4'>
            {playerState.track_window.current_track.album.images[0] && (
              <img
                src={playerState.track_window.current_track.album.images[0].url}
                alt='Album art'
                className='w-20 h-20 rounded-lg'
              />
            )}
            <div className='flex-1 min-w-0'>
              <h3 className='text-base font-semibold text-neutral-950 truncate'>
                {playerState.track_window.current_track.name}
              </h3>
              <p className='text-sm text-gray-600 truncate'>
                {playerState.track_window.current_track.artists
                  .map(artist => artist.name)
                  .join(', ')}
              </p>
              <p className='text-xs text-gray-500 truncate'>
                {playerState.track_window.current_track.album.name}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className='mb-4'>
            <div className='w-full h-1 bg-gray-200 rounded-full overflow-hidden'>
              <div
                className='h-full bg-black transition-all'
                style={{
                  width: `${(playerState.position / playerState.duration) * 100}%`,
                }}
              />
            </div>
            <div className='flex justify-between text-xs text-gray-500 mt-1'>
              <span>{formatTime(playerState.position)}</span>
              <span>{formatTime(playerState.duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className='flex items-center justify-center gap-4'>
            <Button
              isIconOnly
              variant='flat'
              className='bg-gray-100 hover:bg-gray-200'
              onPress={skipToPrevious}
            >
              <SkipBack className='w-5 h-5' />
            </Button>

            <Button
              isIconOnly
              size='lg'
              className='bg-black text-white w-12 h-12'
              onPress={togglePlay}
            >
              {playerState.paused ? (
                <Play className='w-6 h-6' />
              ) : (
                <Pause className='w-6 h-6' />
              )}
            </Button>

            <Button
              isIconOnly
              variant='flat'
              className='bg-gray-100 hover:bg-gray-200'
              onPress={skipToNext}
            >
              <SkipForward className='w-5 h-5' />
            </Button>
          </div>
        </div>
      )}

      {/* Device Info */}
      {isReady && (
        <div className='border-t border-gray-100 pt-4'>
          <p className='text-xs text-gray-500'>
            Device ID: <span className='font-mono'>{deviceId}</span>
          </p>
        </div>
      )}
    </div>
  );
};

// Helper function to format time
function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}
