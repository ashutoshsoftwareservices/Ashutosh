/* ==========================================================================
   WEB AUDIO API FUTURISTIC UI SOUND SYNTHESIZER
   ========================================================================== */

(function () {
  let audioCtx = null;
  let isMuted = false;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
  }

  function playTone(freq, type = 'sine', duration = 0.08, gainVal = 0.05) {
    if (isMuted || !audioCtx) return;
    try {
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      
      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Audio play exception:', e);
    }
  }

  window.SoundFX = {
    click: function () {
      initAudio();
      playTone(800, 'sine', 0.05, 0.04);
      setTimeout(() => playTone(1200, 'sine', 0.04, 0.03), 40);
    },
    hover: function () {
      initAudio();
      playTone(440, 'triangle', 0.03, 0.015);
    },
    modeSwitch: function () {
      initAudio();
      playTone(300, 'sine', 0.1, 0.06);
      setTimeout(() => playTone(600, 'sine', 0.1, 0.05), 60);
      setTimeout(() => playTone(900, 'sine', 0.12, 0.04), 120);
    },
    success: function () {
      initAudio();
      playTone(523.25, 'sine', 0.1, 0.05); // C5
      setTimeout(() => playTone(659.25, 'sine', 0.1, 0.05), 80); // E5
      setTimeout(() => playTone(783.99, 'sine', 0.15, 0.05), 160); // G5
      setTimeout(() => playTone(1046.50, 'sine', 0.25, 0.06), 240); // C6
    },
    toggleMute: function () {
      isMuted = !isMuted;
      return isMuted;
    },
    isMuted: function () {
      return isMuted;
    }
  };

  // Add click listener to enable Web Audio Context on first interaction
  window.addEventListener('click', function () {
    initAudio();
  }, { once: true });
})();
