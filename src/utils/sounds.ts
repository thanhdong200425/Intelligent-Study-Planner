/**
 * Utility functions for playing timer sounds
 */

/**
 * Plays a single notification sound
 * Uses Web Audio API to generate a pleasant notification sound
 */
const playSingleSound = (
  audioContext: AudioContext,
  startTime: number
): void => {
  // Create oscillator for the sound
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  // Connect nodes
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Configure sound - pleasant notification tone (longer sound)
  oscillator.frequency.setValueAtTime(800, startTime);
  oscillator.frequency.setValueAtTime(600, startTime + 0.2);
  oscillator.frequency.setValueAtTime(700, startTime + 0.4);
  oscillator.type = 'sine';

  // Configure volume envelope (fade in and out) - longer duration
  const soundDuration = 0.8; // 0.8 seconds per sound
  gainNode.gain.setValueAtTime(0, startTime);
  gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
  gainNode.gain.linearRampToValueAtTime(0.3, startTime + soundDuration - 0.1);
  gainNode.gain.linearRampToValueAtTime(0, startTime + soundDuration);

  // Play the sound
  oscillator.start(startTime);
  oscillator.stop(startTime + soundDuration);
};

/**
 * Plays a notification sound when the timer ends
 * Repeats 3 times with delays between each sound
 */
export const playTimerEndSound = (): void => {
  try {
    // Create audio context
    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();

    const currentTime = audioContext.currentTime;
    const soundDuration = 0.8; // Duration of each sound
    const delayBetweenSounds = 0.3; // Delay between repetitions

    // Play the sound 3 times
    for (let i = 0; i < 3; i++) {
      const startTime = currentTime + i * (soundDuration + delayBetweenSounds);
      playSingleSound(audioContext, startTime);
    }
  } catch (error) {
    console.warn('Failed to play timer sound:', error);
    // Fallback: try using a simple beep if Web Audio API fails
    try {
      const playBeep = (index: number) => {
        const audio = new Audio(
          'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGWi77+efTRAMUKfj8LZjHAY4kdfyzHksBSR3x/DdkEAKFF606euoVRQKRp/g8r5sIQUrgc7y2Yk2CBlou+/nn00QDFCn4/C2YxwGOJHX8sx5LAUkd8fw3ZBAC'
        );
        audio.volume = 0.8;
        audio.play().catch(() => {
          // Ignore errors if audio can't play
        });
        if (index < 2) {
          setTimeout(() => playBeep(index + 1), 1100); // 0.8s sound + 0.3s delay
        }
      };
      playBeep(0);
    } catch (fallbackError) {
      // Silently fail if audio is not available
    }
  }
};
