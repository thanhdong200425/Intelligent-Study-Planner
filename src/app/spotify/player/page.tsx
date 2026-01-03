'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Button } from '@heroui/react';
import { ArrowLeft } from 'lucide-react';
import { SpotifyPlayer } from '@/components/spotify/SpotifyPlayer';

export default function SpotifyPlayerPage() {
  const router = useRouter();
  const { isConnected } = useSelector((state: RootState) => state.spotify);

  if (!isConnected) {
    return (
      <div className='min-h-screen bg-gray-50 p-8'>
        <div className='max-w-4xl mx-auto'>
          <div className='bg-white border border-gray-100 rounded-2xl p-8 text-center'>
            <h1 className='text-2xl font-bold text-neutral-950 mb-4'>
              Not Connected
            </h1>
            <p className='text-gray-600 mb-6'>
              Please connect to Spotify first to use the music player.
            </p>
            <Button
              className='bg-black text-white'
              onPress={() => router.push('/')}
            >
              Go to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='mb-6 flex items-center gap-4'>
          <Button
            isIconOnly
            variant='flat'
            className='bg-white border border-gray-200'
            onPress={() => router.push('/')}
          >
            <ArrowLeft className='w-5 h-5' />
          </Button>
          <h1 className='text-2xl font-bold text-neutral-950'>
            Spotify Music Player
          </h1>
        </div>

        {/* Player */}
        <SpotifyPlayer />

        {/* Instructions */}
        <div className='mt-6 bg-white border border-gray-100 rounded-2xl p-6'>
          <h2 className='text-lg font-semibold text-neutral-950 mb-3'>
            How to use
          </h2>
          <div className='space-y-3 text-sm text-gray-600'>
            <div>
              <h3 className='font-medium text-neutral-950 mb-1'>
                Play Music Through Web Player
              </h3>
              <ol className='list-decimal list-inside space-y-1 ml-2'>
                <li>Open Spotify on your phone or computer</li>
                <li>Start playing any song, album, or playlist</li>
                <li>
                  Click the "Connect to a device" icon (looks like a screen with
                  a speaker)
                </li>
                <li>Select "StudyGo Web Player" from the list</li>
                <li>Control playback from this page or your Spotify app</li>
              </ol>
            </div>

            <div className='border-t border-gray-100 pt-3'>
              <h3 className='font-medium text-neutral-950 mb-1'>
                Requirements
              </h3>
              <ul className='list-disc list-inside space-y-1 ml-2'>
                <li>Spotify Premium account is required</li>
                <li>Keep this browser tab open to maintain the connection</li>
                <li>
                  The player will appear as "StudyGo Web Player" in your Spotify
                  devices
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
