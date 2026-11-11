/* =========================================================
   📖 AESTHETIC DIGITAL SCRAPBOOK & BINDER DIARY - JAVASCRIPT
   Walkman Mixtape, Rubber Stamps, Audio Synth & Photo Uploads
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------
  // 1. WEB AUDIO API - TACTILE SCRAPBOOK SOUND EFFECTS
  // --------------------------------------------------------
  let audioCtx = null;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Realistic Rubber Stamp "Thud & Click"
  function playStampSound() {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.1);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);

      // Secondary paper snap noise
      setTimeout(() => {
        const snapOsc = ctx.createOscillator();
        const snapGain = ctx.createGain();
        snapOsc.type = 'sine';
        snapOsc.frequency.setValueAtTime(800, ctx.currentTime);
        snapOsc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);
        snapGain.gain.setValueAtTime(0.2, ctx.currentTime);
        snapGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        snapOsc.connect(snapGain);
        snapGain.connect(ctx.destination);
        snapOsc.start();
        snapOsc.stop(ctx.currentTime + 0.08);
      }, 35);
    } catch (e) {}
  }

  // Camera Shutter Snap Sound
  function playCameraClick() {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.06);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch (e) {}
  }


  // --------------------------------------------------------
  // 2. RETRO CASSETTE WALKMAN / LOFI MIXTAPE ENGINE
  // --------------------------------------------------------
  let isPlayingTape = false;
  let tapeTimer = null;
  const walkmanWidget = document.getElementById('walkmanWidget');
  const walkmanToggleBtn = document.getElementById('walkmanToggleBtn');
  const walkmanIcon = document.getElementById('walkmanIcon');
  const spoolLeft = document.getElementById('spoolLeft');
  const spoolRight = document.getElementById('spoolRight');
  const powerLed = document.getElementById('powerLed');
  const walkmanStatusText = document.getElementById('walkmanStatusText');

  // Cozy Lo-Fi Music Box Melody Notes
  const lofiMelody = [
    523.25, 659.25, 783.99, 880.00,
    1046.50, 880.00, 783.99, 659.25,
    587.33, 523.25, 659.25, 783.99,
    880.00, 659.25, 587.33, 523.25
  ];
  let tapeIndex = 0;

  function playTapeNote() {
    if (!isPlayingTape) return;

    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Subtle tape flutter/vibrato
      const baseFreq = lofiMelody[tapeIndex % lofiMelody.length];
      tapeIndex++;

      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(baseFreq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.07, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.7);
    } catch (e) {}

    tapeTimer = setTimeout(playTapeNote, 370);
  }

  function toggleTape() {
    getAudioContext();
    isPlayingTape = !isPlayingTape;

    if (isPlayingTape) {
      spoolLeft.classList.add('spinning');
      spoolRight.classList.add('spinning');
      powerLed.classList.add('active');
      walkmanIcon.classList.remove('fa-play');
      walkmanIcon.classList.add('fa-pause');
      walkmanStatusText.textContent = 'PLAYING MIXTAPE...';
      walkmanStatusText.style.color = '#10b981';
      playTapeNote();
    } else {
      spoolLeft.classList.remove('spinning');
      spoolRight.classList.remove('spinning');
      powerLed.classList.remove('active');
      walkmanIcon.classList.remove('fa-pause');
      walkmanIcon.classList.add('fa-play');
      walkmanStatusText.textContent = 'TAPE STOPPED';
      walkmanStatusText.style.color = '#38bdf8';
      if (tapeTimer) clearTimeout(tapeTimer);
    }
  }

  walkmanToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleTape();
  });
  walkmanWidget.addEventListener('click', toggleTape);


  // --------------------------------------------------------
  // 3. TOAST NOTIFICATION UTILITY
  // --------------------------------------------------------
  const scrapToast = document.getElementById('scrapToast');
  const toastStampIcon = document.getElementById('toastStampIcon');
  const toastStampText = document.getElementById('toastStampText');
  let toastTimeout = null;

  function showScrapToast(icon, text) {
    toastStampIcon.textContent = icon;
    toastStampText.textContent = text;
    scrapToast.classList.add('show');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      scrapToast.classList.remove('show');
    }, 2400);
  }


  // --------------------------------------------------------
  // 4. PHOTO UPLOADS (JIHAN & SERIN SAVED INDIVIDUALLY)
  // --------------------------------------------------------
  // Jihan Photo Upload
  const jihanScrapUpload = document.getElementById('jihanScrapUpload');
  const jihanScrapImg = document.getElementById('jihanScrapImg');
  const savedJihanPhoto = localStorage.getItem('jihan_scrap_photo');
  if (savedJihanPhoto) {
    jihanScrapImg.src = savedJihanPhoto;
  }

  jihanScrapUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      playCameraClick();
      const reader = new FileReader();
      reader.onload = function(evt) {
        jihanScrapImg.src = evt.target.result;
        try {
          localStorage.setItem('jihan_scrap_photo', evt.target.result);
        } catch (err) {}
        showScrapToast('📸', 'Foto polaroid Jihan berhasil ditempel di scrapbook!');
      };
      reader.readAsDataURL(file);
    }
  });

  // Serin Photo Upload
  const serinScrapUpload = document.getElementById('serinScrapUpload');
  const serinScrapImg = document.getElementById('serinScrapImg');
  const savedSerinPhoto = localStorage.getItem('serin_scrap_photo');
  if (savedSerinPhoto) {
    serinScrapImg.src = savedSerinPhoto;
  }

  serinScrapUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      playCameraClick();
      const reader = new FileReader();
      reader.onload = function(evt) {
        serinScrapImg.src = evt.target.result;
        try {
          localStorage.setItem('serin_scrap_photo', evt.target.result);
        } catch (err) {}
        showScrapToast('📸', 'Foto polaroid Serin berhasil ditempel di scrapbook!');
      };
      reader.readAsDataURL(file);
    }
  });


  // --------------------------------------------------------
  // 5. INTERACTIVE RUBBER STAMP BUTTONS (BURST ANIMATION)
  // --------------------------------------------------------
  function triggerStampBurst(x, y, items) {
    const count = 22;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'flying-stamp-particle';
      p.textContent = items[Math.floor(Math.random() * items.length)];

      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const distance = Math.random() * 120 + 70;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance - 40;
      const txEnd = tx * 1.3;
      const rot = `${(Math.random() - 0.5) * 90}deg`;

      p.style.setProperty('--tx', `${tx}px`);
      p.style.setProperty('--ty', `${ty}px`);
      p.style.setProperty('--tx-end', `${txEnd}px`);
      p.style.setProperty('--rot', rot);

      p.style.left = `${x}px`;
      p.style.top = `${y}px`;

      document.body.appendChild(p);

      setTimeout(() => {
        p.remove();
      }, 1200);
    }
  }

  // Jihan Stamp
  const btnStampJihan = document.getElementById('btnStampJihan');
  const jihanStampCount = document.getElementById('jihanStampCount');
  let jihanCount = parseInt(localStorage.getItem('jihan_scrap_stamps') || '480', 10);
  jihanStampCount.textContent = jihanCount.toLocaleString('id-ID');

  const jihanParticles = ['💮', '💙', '☁️', '🧋', '🌶️', '😴', '✨'];
  const jihanStampMessages = [
    'Cap cinta tertempel di memo Jihan! 😴💙',
    'Seblak ekstra pedas untuk ratu rebahan! 🌶️✨',
    'Certified Pro Rebahan: 100% Sah! ☁️💤',
    'Introvert power! Jihan memang yang paling chill! 🫧💙'
  ];

  btnStampJihan.addEventListener('click', () => {
    playStampSound();
    jihanCount++;
    jihanStampCount.textContent = jihanCount.toLocaleString('id-ID');
    localStorage.setItem('jihan_scrap_stamps', jihanCount.toString());

    const rect = btnStampJihan.getBoundingClientRect();
    triggerStampBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, jihanParticles);

    const msg = jihanStampMessages[Math.floor(Math.random() * jihanStampMessages.length)];
    showScrapToast('💙', msg);
  });

  // Serin Stamp
  const btnStampSerin = document.getElementById('btnStampSerin');
  const serinStampCount = document.getElementById('serinStampCount');
  let serinCount = parseInt(localStorage.getItem('serin_scrap_stamps') || '520', 10);
  serinStampCount.textContent = serinCount.toLocaleString('id-ID');

  const serinParticles = ['💮', '💖', '🌸', '🎀', '🎤', '🍵', '💸', '✨'];
  const serinStampMessages = [
    'Cap cinta tertempel di memo Serin! 🌸💕',
    'Cemungut! Calon miliader sukses kesayangan! 💸👑',
    'Lagu manis Serin bergema di buku harian! 🎤✨',
    'Matcha hangat & limpahan cinta untuk Serin! 🍵💖'
  ];

  btnStampSerin.addEventListener('click', () => {
    playStampSound();
    serinCount++;
    serinStampCount.textContent = serinCount.toLocaleString('id-ID');
    localStorage.setItem('serin_scrap_stamps', serinCount.toString());

    const rect = btnStampSerin.getBoundingClientRect();
    triggerStampBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, serinParticles);

    const msg = serinStampMessages[Math.floor(Math.random() * serinStampMessages.length)];
    showScrapToast('🌸', msg);
  });

});
