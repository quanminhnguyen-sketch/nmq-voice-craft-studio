/**
 * Nguyễn Minh Quân VoiceCraft Studio - Frontend Logic
 * Full-featured controller for TTS synthesis, custom audio player, voice filters, and themes.
 */

(function () {
  'use strict';

  // API Base URL (relative path works for both development and production)
  const API_BASE = '';

  // State Management
  const state = {
    voices: [],
    featuredVoices: [],
    selectedVoiceId: 'vi-VN-HoaiMyNeural',
    currentAudioUrl: null,
    currentAudioBlob: null,
    history: [],
    langFilter: 'all',
    genderFilter: 'all',
    previewAudio: null,
  };

  // Sample Texts
  const SAMPLES = {
    intro: 'Chào mừng bạn đến với Nguyễn Minh Quân VoiceCraft Studio! Đây là giải pháp chuyển đổi văn bản thành giọng nói AI thông minh với âm thanh tự nhiên, mượt mà và hoàn toàn miễn phí. Hãy thử chọn các giọng đọc khác nhau và lắng nghe điều kỳ diệu!',
    news: 'Bản tin hôm nay: Thị trường công nghệ chứng kiến bước tiến vượt bậc của trí tuệ nhân tạo tạo sinh. Các mô hình tổng hợp âm thanh giọng nói hiện đại đã đạt độ tự nhiên tiệm cận giọng người thật, mang đến tiềm năng ứng dụng to lớn trong giáo dục và truyền thông.',
    story: 'Chiều thu buông xuống trên mặt hồ phẳng lặng như gương. Những chiếc lá vàng khẽ chao liệng trong làn gió mát lành, gợi nhớ về một miền ký ức tuổi thơ êm đềm bên dòng sông quê hương.',
    en: 'Welcome to Nguyen Minh Quan VoiceCraft Studio! Experience the power of studio-quality neural speech synthesis. Transform articles, stories, and videos with crystal-clear voices across multiple accents and languages.'
  };

  // DOM Elements
  const el = {
    themeToggle: document.getElementById('theme-toggle'),
    themeIconSun: document.getElementById('theme-icon-sun'),
    themeIconMoon: document.getElementById('theme-icon-moon'),
    backendStatusPill: document.getElementById('backend-status-pill'),
    backendStatusText: document.getElementById('backend-status-text'),
    
    textInput: document.getElementById('text-input'),
    charCount: document.getElementById('char-count'),
    wordCount: document.getElementById('word-count'),
    estDuration: document.getElementById('est-duration'),
    btnPaste: document.getElementById('btn-paste-text'),
    btnClear: document.getElementById('btn-clear-text'),

    voiceSelect: document.getElementById('voice-select'),
    voiceCountBadge: document.getElementById('voice-count-badge'),
    voiceFlagAvatar: document.getElementById('voice-flag-avatar'),
    voiceInfoName: document.getElementById('voice-info-name'),
    voiceInfoGender: document.getElementById('voice-info-gender'),
    voiceInfoDesc: document.getElementById('voice-info-desc'),
    btnPreviewVoice: document.getElementById('btn-preview-voice'),

    rateSlider: document.getElementById('rate-slider'),
    rateBadge: document.getElementById('rate-badge'),
    resetRate: document.getElementById('reset-rate'),

    pitchSlider: document.getElementById('pitch-slider'),
    pitchBadge: document.getElementById('pitch-badge'),
    resetPitch: document.getElementById('reset-pitch'),

    volSlider: document.getElementById('vol-slider'),
    volBadge: document.getElementById('vol-badge'),
    resetVol: document.getElementById('reset-vol'),

    btnGenerate: document.getElementById('btn-generate'),
    generateBtnText: document.getElementById('generate-btn-text'),
    generateIcon: document.getElementById('generate-icon'),
    generateSpinner: document.getElementById('generate-spinner'),

    nativeAudio: document.getElementById('native-audio'),
    btnPlayPause: document.getElementById('btn-play-pause'),
    iconPlay: document.getElementById('icon-play'),
    iconPause: document.getElementById('icon-pause'),
    seekBar: document.getElementById('seek-bar'),
    timeCurrent: document.getElementById('time-current'),
    timeTotal: document.getElementById('time-total'),
    btnReplay5: document.getElementById('btn-replay-5'),
    btnForward5: document.getElementById('btn-forward-5'),
    playbackSpeedSelect: document.getElementById('playback-speed-select'),
    btnDownload: document.getElementById('btn-download'),
    soundWaveAnim: document.getElementById('sound-wave-anim'),
    playerTitle: document.getElementById('player-title'),
    playerSubtitle: document.getElementById('player-subtitle'),

    historyList: document.getElementById('history-list'),
    historyEmpty: document.getElementById('history-empty'),
    btnClearHistory: document.getElementById('btn-clear-history'),
    toastContainer: document.getElementById('toast-container'),
  };

  // 1. Theme Toggle & Initialization
  function initTheme() {
    const saved = localStorage.getItem('voicecraft_theme') || 'dark';
    applyTheme(saved);

    el.themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.classList.contains('dark');
      applyTheme(isDark ? 'light' : 'dark');
    });
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      el.themeIconSun.classList.remove('hidden');
      el.themeIconMoon.classList.add('hidden');
    } else {
      document.documentElement.classList.remove('dark');
      el.themeIconSun.classList.add('hidden');
      el.themeIconMoon.classList.remove('hidden');
    }
    localStorage.setItem('voicecraft_theme', theme);
  }

  // 2. Toast Notifications
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>';
    } else if (type === 'error') {
      iconSvg = '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>';
    } else {
      iconSvg = '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';
    }

    toast.innerHTML = `${iconSvg}<span>${message}</span>`;
    el.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // 3. Text Input & Stats Calculation
  function updateTextStats() {
    const text = el.textInput.value || '';
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    
    el.charCount.textContent = chars.toLocaleString();
    el.wordCount.textContent = words.toLocaleString();

    // Calculation: average 150 words per minute, speed adjusted
    const ratePercent = parseInt(el.rateSlider.value, 10);
    const speedFactor = (100 + ratePercent) / 100;
    const seconds = words > 0 ? Math.ceil((words / (2.5 * speedFactor))) : 0;
    
    if (seconds >= 60) {
      const mins = Math.floor(seconds / 60);
      const remSecs = seconds % 60;
      el.estDuration.textContent = `~${mins}m ${remSecs}s`;
    } else {
      el.estDuration.textContent = `~${seconds}s`;
    }
  }

  function initTextActions() {
    el.textInput.addEventListener('input', updateTextStats);

    // Clear Button
    el.btnClear.addEventListener('click', () => {
      el.textInput.value = '';
      el.textInput.focus();
      updateTextStats();
      showToast('Đã xóa nội dung văn bản', 'info');
    });

    // Paste Button
    el.btnPaste.addEventListener('click', async () => {
      try {
        const text = await navigator.clipboard.readText();
        if (text) {
          el.textInput.value = text;
          updateTextStats();
          showToast('Đã dán nội dung từ Clipboard', 'success');
        } else {
          showToast('Bộ nhớ tạm trống', 'info');
        }
      } catch (err) {
        showToast('Không thể đọc Clipboard (Vui lòng dán thủ công bằng Ctrl+V)', 'error');
      }
    });

    // Sample Text Chips
    document.querySelectorAll('.sample-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const type = chip.getAttribute('data-type');
        if (SAMPLES[type]) {
          el.textInput.value = SAMPLES[type];
          updateTextStats();
          showToast(`Đã tải mẫu: ${chip.textContent.trim()}`, 'success');
          
          // Auto switch voice if sample is English
          if (type === 'en') {
            selectVoiceById('en-US-JennyNeural');
          } else {
            selectVoiceById('vi-VN-HoaiMyNeural');
          }
        }
      });
    });
  }

  // 4. Voice Catalog & Filters
  async function loadVoices() {
    try {
      const res = await fetch(`${API_BASE}/api/voices`);
      if (!res.ok) throw new Error('Không thể nạp danh sách giọng đọc');
      const data = await res.json();
      state.featuredVoices = data.featured || [];
      state.voices = data.all || [];

      renderVoiceOptions();
      updateSelectedVoiceCard();
      el.voiceCountBadge.textContent = `${state.voices.length} giọng sẵn sàng`;
    } catch (err) {
      console.error(err);
      el.voiceCountBadge.textContent = 'Mặc định (Offline)';
    }
  }

  function getFilteredVoices() {
    let list = state.voices.length > 0 ? state.voices : state.featuredVoices;

    // Filter by Language
    if (state.langFilter === 'vi') {
      list = list.filter(v => v.locale.startsWith('vi-'));
    } else if (state.langFilter === 'en') {
      list = list.filter(v => v.locale.startsWith('en-'));
    } else if (state.langFilter === 'asia') {
      list = list.filter(v => ['vi-', 'ja-', 'ko-', 'zh-'].some(p => v.locale.startsWith(p)));
    }

    // Filter by Gender
    if (state.genderFilter !== 'all') {
      list = list.filter(v => v.gender.toLowerCase() === state.genderFilter.toLowerCase());
    }

    return list;
  }

  function renderVoiceOptions() {
    const list = getFilteredVoices();
    el.voiceSelect.innerHTML = '';

    if (list.length === 0) {
      const opt = document.createElement('option');
      opt.textContent = 'Không tìm thấy giọng đọc phù hợp';
      opt.disabled = true;
      el.voiceSelect.appendChild(opt);
      return;
    }

    list.forEach(v => {
      const opt = document.createElement('option');
      opt.value = v.id;
      opt.textContent = `${v.flag} ${v.name} (${v.gender_label || v.gender} - ${v.language})`;
      if (v.id === state.selectedVoiceId) {
        opt.selected = true;
      }
      el.voiceSelect.appendChild(opt);
    });

    // If current selected voice is not in filtered list, select first available
    const stillExists = list.some(v => v.id === state.selectedVoiceId);
    if (!stillExists && list.length > 0) {
      state.selectedVoiceId = list[0].id;
      el.voiceSelect.value = state.selectedVoiceId;
    }

    updateSelectedVoiceCard();
  }

  function selectVoiceById(id) {
    state.selectedVoiceId = id;
    if (el.voiceSelect.querySelector(`option[value="${id}"]`)) {
      el.voiceSelect.value = id;
    } else {
      // Reset filters so that voice becomes visible
      state.langFilter = 'all';
      state.genderFilter = 'all';
      syncFilterPills();
      renderVoiceOptions();
      el.voiceSelect.value = id;
    }
    updateSelectedVoiceCard();
  }

  function syncFilterPills() {
    document.querySelectorAll('.lang-pill').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === state.langFilter);
      if (btn.dataset.lang === state.langFilter) {
        btn.classList.add('bg-indigo-600', 'text-white');
        btn.classList.remove('bg-slate-100', 'dark:bg-slate-800/80');
      } else {
        btn.classList.remove('bg-indigo-600', 'text-white');
        btn.classList.add('bg-slate-100', 'dark:bg-slate-800/80');
      }
    });

    document.querySelectorAll('.gender-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.gender === state.genderFilter);
      if (btn.dataset.gender === state.genderFilter) {
        btn.classList.add('bg-indigo-100', 'text-indigo-700', 'dark:bg-indigo-900/60', 'dark:text-indigo-300');
      } else {
        btn.classList.remove('bg-indigo-100', 'text-indigo-700', 'dark:bg-indigo-900/60', 'dark:text-indigo-300');
      }
    });
  }

  function updateSelectedVoiceCard() {
    const list = state.voices.length > 0 ? state.voices : state.featuredVoices;
    const v = list.find(item => item.id === state.selectedVoiceId) || {
      name: state.selectedVoiceId,
      flag: '🎙️',
      gender_label: 'Tự nhiên',
      description: 'Giọng đọc AI đa ngôn ngữ'
    };

    el.voiceFlagAvatar.textContent = v.flag || '🎙️';
    el.voiceInfoName.textContent = v.name;
    el.voiceInfoGender.textContent = v.gender_label || v.gender || 'Neural';
    el.voiceInfoDesc.textContent = v.description || 'Chất lượng phòng thu';
  }

  function initVoiceFilters() {
    // Language pills
    document.querySelectorAll('.lang-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        state.langFilter = btn.dataset.lang;
        syncFilterPills();
        renderVoiceOptions();
      });
    });

    // Gender buttons
    document.querySelectorAll('.gender-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.genderFilter = btn.dataset.gender;
        syncFilterPills();
        renderVoiceOptions();
      });
    });

    // Dropdown change
    el.voiceSelect.addEventListener('change', (e) => {
      state.selectedVoiceId = e.target.value;
      updateSelectedVoiceCard();
    });

    // Preview voice sample
    el.btnPreviewVoice.addEventListener('click', async () => {
      try {
        el.btnPreviewVoice.disabled = true;
        el.btnPreviewVoice.innerHTML = '<span class="animate-spin inline-block mr-1">⌛</span> Đang nạp...';
        
        const previewUrl = `${API_BASE}/api/tts/preview?voice=${encodeURIComponent(state.selectedVoiceId)}`;
        if (state.previewAudio) {
          state.previewAudio.pause();
        }
        state.previewAudio = new Audio(previewUrl);
        await state.previewAudio.play();
        showToast('Đang phát giọng đọc mẫu...', 'info');

        state.previewAudio.onended = () => {
          el.btnPreviewVoice.disabled = false;
          el.btnPreviewVoice.innerHTML = '<span>🔊 Nghe thử</span>';
        };
      } catch (err) {
        showToast('Không thể phát thử giọng đọc: ' + err.message, 'error');
        el.btnPreviewVoice.disabled = false;
        el.btnPreviewVoice.innerHTML = '<span>🔊 Nghe thử</span>';
      }
    });
  }

  // 5. Sliders Fine Tuning
  function initSliders() {
    // Rate Slider
    el.rateSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      const factor = ((100 + val) / 100).toFixed(1);
      const sign = val >= 0 ? `+${val}%` : `${val}%`;
      el.rateBadge.textContent = `${factor}x (${sign})`;
      updateTextStats();
    });

    el.resetRate.addEventListener('click', () => {
      el.rateSlider.value = 0;
      el.rateBadge.textContent = '1.0x (0%)';
      updateTextStats();
    });

    // Pitch Slider
    el.pitchSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      const sign = val >= 0 ? `+${val}Hz` : `${val}Hz`;
      el.pitchBadge.textContent = sign;
    });

    el.resetPitch.addEventListener('click', () => {
      el.pitchSlider.value = 0;
      el.pitchBadge.textContent = '0Hz';
    });

    // Volume Slider
    el.volSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      const displayVal = 100 + val;
      const sign = val >= 0 ? `+${val}%` : `${val}%`;
      el.volBadge.textContent = `${displayVal}% (${sign})`;
    });

    el.resetVol.addEventListener('click', () => {
      el.volSlider.value = 0;
      el.volBadge.textContent = '100% (+0%)';
    });

    // Presets Click
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const rate = btn.dataset.rate;
        const pitch = btn.dataset.pitch;

        el.rateSlider.value = rate;
        el.rateSlider.dispatchEvent(new Event('input'));

        el.pitchSlider.value = pitch;
        el.pitchSlider.dispatchEvent(new Event('input'));

        showToast(`Đã áp dụng cấu hình: ${btn.textContent.trim()}`, 'success');
      });
    });
  }

  // 6. Speech Generation Workflow
  function initGeneration() {
    el.btnGenerate.addEventListener('click', async () => {
      const text = el.textInput.value.trim();
      if (!text) {
        showToast('Vui lòng nhập văn bản cần chuyển đổi!', 'error');
        el.textInput.focus();
        return;
      }

      const payload = {
        text: text,
        voice: state.selectedVoiceId,
        rate: parseInt(el.rateSlider.value, 10),
        pitch: parseInt(el.pitchSlider.value, 10),
        volume: parseInt(el.volSlider.value, 10),
      };

      setGeneratingState(true);

      try {
        const response = await fetch(`${API_BASE}/api/tts/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.detail || `Lỗi máy chủ (${response.status})`);
        }

        const blob = await response.blob();
        if (state.currentAudioUrl) {
          URL.revokeObjectURL(state.currentAudioUrl);
        }

        state.currentAudioBlob = blob;
        state.currentAudioUrl = URL.createObjectURL(blob);

        loadAudioIntoPlayer(state.currentAudioUrl, text, state.selectedVoiceId);
        showToast('Tổng hợp âm thanh thành công!', 'success');

        // Add to history
        addToHistory({
          id: Date.now(),
          text: text,
          voiceId: state.selectedVoiceId,
          blob: blob,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        });

      } catch (err) {
        console.error(err);
        showToast(`Không thể tạo giọng nói: ${err.message}`, 'error');
      } finally {
        setGeneratingState(false);
      }
    });
  }

  function setGeneratingState(isGenerating) {
    el.btnGenerate.disabled = isGenerating;
    if (isGenerating) {
      el.generateBtnText.textContent = 'Đang Tổng Hợp Âm Thanh...';
      el.generateIcon.classList.add('hidden');
      el.generateSpinner.classList.remove('hidden');
      el.btnGenerate.classList.add('opacity-80', 'cursor-wait');
    } else {
      el.generateBtnText.textContent = 'Tạo Âm Thanh Ngay';
      el.generateIcon.classList.remove('hidden');
      el.generateSpinner.classList.add('hidden');
      el.btnGenerate.classList.remove('opacity-80', 'cursor-wait');
    }
  }

  // 7. Custom Audio Player Implementation
  function initPlayer() {
    const audio = el.nativeAudio;

    // Play / Pause Toggle
    el.btnPlayPause.addEventListener('click', () => {
      if (!audio.src) return;
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
    });

    audio.addEventListener('play', () => {
      el.iconPlay.classList.add('hidden');
      el.iconPause.classList.remove('hidden');
      el.soundWaveAnim.classList.remove('paused');
    });

    audio.addEventListener('pause', () => {
      el.iconPlay.classList.remove('hidden');
      el.iconPause.classList.add('hidden');
      el.soundWaveAnim.classList.add('paused');
    });

    audio.addEventListener('ended', () => {
      el.iconPlay.classList.remove('hidden');
      el.iconPause.classList.add('hidden');
      el.soundWaveAnim.classList.add('paused');
      el.seekBar.value = 0;
      el.timeCurrent.textContent = '00:00';
    });

    // Time Update & Seek Bar
    audio.addEventListener('timeupdate', () => {
      if (!audio.duration) return;
      const progress = (audio.currentTime / audio.duration) * 100;
      el.seekBar.value = progress || 0;
      el.timeCurrent.textContent = formatTime(audio.currentTime);
    });

    audio.addEventListener('loadedmetadata', () => {
      el.timeTotal.textContent = formatTime(audio.duration);
      el.seekBar.disabled = false;
      el.btnPlayPause.disabled = false;
      el.btnReplay5.disabled = false;
      el.btnForward5.disabled = false;
      el.btnDownload.disabled = false;
    });

    // Seeking
    el.seekBar.addEventListener('input', (e) => {
      if (!audio.duration) return;
      const seekTo = (e.target.value / 100) * audio.duration;
      audio.currentTime = seekTo;
    });

    // Skip Buttons
    el.btnReplay5.addEventListener('click', () => {
      audio.currentTime = Math.max(0, audio.currentTime - 5);
    });

    el.btnForward5.addEventListener('click', () => {
      audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
    });

    // Playback Speed
    el.playbackSpeedSelect.addEventListener('change', (e) => {
      audio.playbackRate = parseFloat(e.target.value);
    });

    // Download Button
    el.btnDownload.addEventListener('click', () => {
      if (!state.currentAudioBlob) return;
      const a = document.createElement('a');
      const timeStr = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      a.href = state.currentAudioUrl;
      a.download = `VoiceCraft_${state.selectedVoiceId}_${timeStr}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast('Đang tải xuống tệp MP3...', 'success');
    });
  }

  function loadAudioIntoPlayer(url, text, voiceId) {
    const audio = el.nativeAudio;
    audio.src = url;
    audio.load();

    const snippet = text.length > 50 ? text.slice(0, 48) + '...' : text;
    el.playerTitle.textContent = snippet;
    el.playerSubtitle.textContent = `Giọng đọc: ${voiceId} • Sẵn sàng phát`;

    audio.play().catch(e => console.warn('Autoplay prevented:', e));
  }

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  // 8. History Management
  function addToHistory(item) {
    state.history.unshift(item);
    if (state.history.length > 8) {
      state.history.pop();
    }
    renderHistory();
  }

  function renderHistory() {
    if (state.history.length === 0) {
      el.historyEmpty.classList.remove('hidden');
      el.historyList.querySelectorAll('.history-item').forEach(e => e.remove());
      return;
    }

    el.historyEmpty.classList.add('hidden');
    el.historyList.querySelectorAll('.history-item').forEach(e => e.remove());

    state.history.forEach((item) => {
      const row = document.createElement('div');
      row.className = 'history-item py-3 flex items-center justify-between gap-4';
      
      const textPreview = item.text.length > 60 ? item.text.slice(0, 58) + '...' : item.text;
      const blobUrl = URL.createObjectURL(item.blob);

      row.innerHTML = `
        <div class="flex items-center space-x-3 min-w-0">
          <button class="play-hist-btn w-8 h-8 rounded-full bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition-all flex-shrink-0" title="Phát lại">
            <svg class="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/></svg>
          </button>
          <div class="min-w-0">
            <p class="font-medium text-slate-800 dark:text-slate-200 truncate text-xs sm:text-sm">${textPreview}</p>
            <div class="flex items-center space-x-2 text-[11px] text-slate-400">
              <span>${item.voiceId}</span>
              <span>•</span>
              <span>${item.timestamp}</span>
            </div>
          </div>
        </div>
        <div class="flex items-center space-x-2 flex-shrink-0">
          <button class="download-hist-btn p-2 text-slate-400 hover:text-emerald-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="Tải xuống">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          </button>
        </div>
      `;

      // Play history item
      row.querySelector('.play-hist-btn').addEventListener('click', () => {
        loadAudioIntoPlayer(blobUrl, item.text, item.voiceId);
      });

      // Download history item
      row.querySelector('.download-hist-btn').addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `VoiceCraft_${item.voiceId}_${item.id}.mp3`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });

      el.historyList.appendChild(row);
    });
  }

  el.btnClearHistory.addEventListener('click', () => {
    state.history = [];
    renderHistory();
    showToast('Đã xóa toàn bộ lịch sử', 'info');
  });

  // 9. Backend Health Monitoring
  async function checkBackendHealth() {
    try {
      const res = await fetch(`${API_BASE}/api/health`, { cache: 'no-store' });
      if (res.ok) {
        el.backendStatusText.textContent = 'Máy chủ Online';
        el.backendStatusPill.classList.remove('bg-rose-500/10', 'text-rose-500', 'border-rose-500/20');
        el.backendStatusPill.classList.add('bg-emerald-500/10', 'text-emerald-600', 'dark:text-emerald-400', 'border-emerald-500/20');
        return true;
      }
    } catch (err) {
      // Offline
    }
    el.backendStatusText.textContent = 'Mất kết nối backend';
    el.backendStatusPill.classList.remove('bg-emerald-500/10', 'text-emerald-600', 'dark:text-emerald-400', 'border-emerald-500/20');
    el.backendStatusPill.classList.add('bg-rose-500/10', 'text-rose-500', 'border-rose-500/20');
    return false;
  }

  // Initialization Entry Point
  async function init() {
    initTheme();
    initTextActions();
    initSliders();
    initVoiceFilters();
    initGeneration();
    initPlayer();
    updateTextStats();

    await checkBackendHealth();
    await loadVoices();

    // Check health periodically every 15s
    setInterval(checkBackendHealth, 15000);
  }

  // Start app when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
