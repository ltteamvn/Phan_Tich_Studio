
import { GoogleGenAI, Type } from "@google/genai";

document.addEventListener('DOMContentLoaded', () => {

    const languages = [
        { name: 'Tiếng Việt', flag: '🇻🇳' },
        { name: 'English', flag: '🇺🇸' },
        { name: 'Español (Spanish)', flag: '🇪🇸' },
        { name: 'Français (French)', flag: '🇫🇷' },
        { name: 'Deutsch (German)', flag: '🇩🇪' },
        { name: 'Italiano (Italian)', flag: '🇮🇹' },
        { name: 'Português (Portuguese)', flag: '🇵Ť' },
        { name: 'Русский (Russian)', flag: '🇷🇺' },
        { name: '日本語 (Japanese)', flag: '🇯🇵' },
        { name: '简体中文 (Chinese, Simplified)', flag: '🇨🇳' },
        { name: '한국어 (Korean)', flag: '🇰🇷' },
        { name: 'العربية (Arabic)', flag: '🇸🇦' },
        { name: 'हिन्दी (Hindi)', flag: '🇮🇳' },
        { name: 'বাংলা (Bengali)', flag: '🇧🇩' },
        { name: 'Bahasa Indonesia (Indonesian)', flag: '🇮🇩' },
        { name: 'Nederlands (Dutch)', flag: '🇳🇱' },
        { name: 'Türkçe (Turkish)', flag: '🇹🇷' },
        { name: 'Polski (Polish)', flag: '🇵🇱' },
        { name: 'Svenska (Swedish)', flag: '🇸🇪' },
        { name: 'ภาษาไทย (Thai)', flag: '🇹🇭' },
        { name: 'Filipino', flag: '🇵🇭' },
    ];

    const lytranTTSVoices = {
        'Đa Ngôn Ngữ': [
            { name: 'Seraphina (Nữ)', voiceId: 'de-DE-SeraphinaMultilingualNeural' },
            { name: 'Florian (Nam)', voiceId: 'de-DE-FlorianMultilingualNeural' },
            { name: 'Ava (Nữ)', voiceId: 'en-US-AvaMultilingualNeural' },
            { name: 'Andrew (Nam)', voiceId: 'en-US-AndrewMultilingualNeural' },
            { name: 'Emma (Nữ)', voiceId: 'en-US-EmmaMultilingualNeural' },
            { name: 'Brian (Nam)', voiceId: 'en-US-BrianMultilingualNeural' },
        ],
        'Tiếng Việt': [
            { name: 'Thu Hà (Nữ)', voiceId: 'vi-VN-HoaiMyNeural' },
            { name: 'Minh (Nam)', voiceId: 'vi-VN-NamMinhNeural' },
        ],
        'English (US)': [
            { name: 'Aria (Female)', voiceId: 'en-US-AriaNeural' },
            { name: 'Guy (Male)', voiceId: 'en-US-GuyNeural' },
            { name: 'Jenny (Female)', voiceId: 'en-US-JennyNeural' },
            { name: 'Davis (Male)', voiceId: 'en-US-DavisNeural' },
        ],
        '日本語 (Japanese)': [
            { name: 'Nanami (Female)', voiceId: 'ja-JP-NanamiNeural' },
            { name: 'Keita (Male)', voiceId: 'ja-JP-KeitaNeural' },
        ],
        '한국어 (Korean)': [
             { name: 'Sun-Hi (Female)', voiceId: 'ko-KR-SunHiNeural' },
             { name: 'InJoon (Male)', voiceId: 'ko-KR-InJoonNeural' },
        ],
        '中国 (China)': [
             { name: 'Xiaoxiao (Female)', voiceId: 'zh-CN-XiaoxiaoNeural' },
             { name: 'Yunjian (Male)', voiceId: 'zh-CN-YunjianNeurall' },
        ]
    };
     const geminiVoices = [
        { value: 'Kore', text: 'Kore (Nữ)' },
        { value: 'Puck', text: 'Puck (Nam)' },
        { value: 'Charon', text: 'Charon (Nữ)' },
        { value: 'Fenrir', text: 'Fenrir (Nam)' },
        { value: 'Zephyr', text: 'Zephyr (Nam)' },
    ];

    // --- ROLE & AUTH MANAGEMENT ---
    const userRole = sessionStorage.getItem('userRole') || 'Guest';
    const loggedInUser = sessionStorage.getItem('loggedInUser') || 'Khách';
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';

    const userSessionControls = document.getElementById('user-session-controls');
    const tabBatch = document.getElementById('tab-batch');
    const singleUploadText = document.getElementById('single-upload-text');

    const roleDisplayMap = {
        'Pro': '<span class="ml-2 px-2 py-0.5 text-xs font-semibold bg-purple-600 text-purple-100 rounded-full">Pro</span>',
        'Plus': '<span class="ml-2 px-2 py-0.5 text-xs font-semibold bg-cyan-600 text-cyan-100 rounded-full">Plus</span>',
        'Guest': '<span class="ml-2 px-2 py-0.5 text-xs font-semibold bg-slate-600 text-slate-100 rounded-full">Khách</span>'
    };
    
    // Setup header based on login status and role
    if (isLoggedIn && userRole !== 'Guest') {
        userSessionControls.innerHTML = `
            <div id="user-info" class="text-sm text-slate-300">
                Xin chào, <strong class="font-semibold text-white">${loggedInUser}</strong> ${roleDisplayMap[userRole] || ''}
            </div>
            <button id="logout-button" class="p-2 rounded-full bg-slate-700/50 hover:bg-red-500/50 text-slate-300 transition-colors" aria-label="Đăng xuất" title="Đăng xuất">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"></path>
                </svg>
            </button>
        `;
        document.getElementById('logout-button').addEventListener('click', logout);
    } else {
        // Guest user or not logged in
        sessionStorage.setItem('userRole', 'Guest'); // Ensure role is set for guests
        sessionStorage.setItem('loggedInUser', 'Khách');
        userSessionControls.innerHTML = `
            <div id="user-info" class="text-sm text-slate-300">
                Bạn là <strong class="font-semibold text-white">Khách</strong> ${roleDisplayMap['Guest']}
            </div>
            <a href="/login.html" id="login-button" class="p-2 rounded-full bg-slate-700/50 hover:bg-green-500/50 text-slate-300 transition-colors" aria-label="Đăng nhập" title="Đăng nhập">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                 <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m-3 0l-3-3m0 0l3-3m-3 3h12.75" />
               </svg>
            </a>
        `;
    }

    // Apply role-based permissions
    if (userRole === 'Plus' || userRole === 'Guest') {
        if (tabBatch) tabBatch.classList.add('hidden');
    }
    if (userRole === 'Guest') {
        if (singleUploadText) {
            singleUploadText.innerHTML = `
                <p class="text-lg font-semibold text-slate-300">Kéo và thả hoặc nhấp để tải lên video</p>
                <p class="text-sm text-slate-500">Giới hạn <span class="font-semibold text-yellow-400">20MB</span> cho tài khoản Khách.</p>
            `;
        }
    }

    // --- STATE ---
    let apiKey = localStorage.getItem('gemini-api-key') || '';
    let lytranTTSApiKey = localStorage.getItem('lytrantts-api-key') || '';
    let elevenLabsVoices = [];
    let elevenLabsApiKeys = [];
    let elevenLabsApiIndex = 0;
    const depletedElevenLabsKeys = new Set();
    const elevenLabsQuotaCache = new Map();
    let customElevenLabsVoiceIds = []; // Max 3
    let model = 'gemini-2.5-flash';
    let singleVideoFile = null;
    let batchFilesState = [];
    let isLoading = false;
    let scenesForExport = [];
    let activeTab = 'single';
    let singleAnalysisFrames = null; // To store extracted frames for regeneration
    
    // --- CONSTANTS ---
    const GOOD_KEY_THRESHOLD = 1000;

    // --- DOM ELEMENTS ---
    const settingsToggle = document.getElementById('settings-toggle');
    const settingsIcon = document.getElementById('settings-icon');
    const settingsPanel = document.getElementById('settings-panel');
    const apiKeyInput = document.getElementById('api-key');
    const modelSelect = document.getElementById('model-select');
    const tabSingle = document.getElementById('tab-single');
    const panelSingle = document.getElementById('panel-single');
    const panelBatch = document.getElementById('panel-batch');
    const singleUploadContainer = document.getElementById('single-upload-container');
    const singleFileInput = document.getElementById('single-file-input');
    const videoPlayerContainer = document.getElementById('video-player-container');
    const videoPlayer = document.getElementById('video-player');
    const singleAnalyzeButton = document.getElementById('single-analyze-button');
    const singleCreativeButton = document.getElementById('single-creative-button');
    const creativeOptionsContainer = document.getElementById('creative-options-container');
    const creativeSubjectInput = document.getElementById('creative-subject-input');
    const singleResultsContainer = document.getElementById('single-results-container');
    const batchUploadContainer = document.getElementById('batch-upload-container');
    const batchFileInput = document.getElementById('batch-file-input');
    const batchUploadText = document.getElementById('batch-upload-text');
    const batchAnalyzeButton = document.getElementById('batch-analyze-button');
    const batchResultsContainer = document.getElementById('batch-results-container');
    const batchOverallProgress = document.getElementById('batch-overall-progress');
    const exportModal = document.getElementById('export-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const exportFullTxtBtn = document.getElementById('export-full-txt-btn');
    const exportPromptsBtn = document.getElementById('export-prompts-btn');
    const urlInput = document.getElementById('url-input');
    const urlAnalyzeButton = document.getElementById('url-analyze-button');
    
    // Scriptwriting Elements
    const scriptwritingFeatureContainer = document.getElementById('scriptwriting-feature-container');
    const scriptwritingCheckbox = document.getElementById('scriptwriting-checkbox');
    const scriptwritingOptions = document.getElementById('scriptwriting-options');
    const scriptStyleSelect = document.getElementById('script-style-select');
    const scriptCustomPrompt = document.getElementById('script-custom-prompt');
    const startScriptButton = document.getElementById('start-script-button');
    const scriptResultsContainer = document.getElementById('script-results-container');


    // --- INITIALIZATION ---
    apiKeyInput.value = apiKey;
    modelSelect.value = model;
    updateUploaderUI(singleUploadContainer, singleUploadText);
    updateUploaderUI(batchUploadContainer, batchUploadText);

    // --- MODAL HANDLING ---
    const openModal = () => {
        exportModal.classList.remove('hidden');
        setTimeout(() => {
            exportModal.classList.add('opacity-100');
            exportModal.querySelector('div').classList.remove('scale-95');
        }, 10);
    };
    const closeModal = () => {
        exportModal.classList.remove('opacity-100');
        exportModal.querySelector('div').classList.add('scale-95');
        setTimeout(() => {
            exportModal.classList.add('hidden');
        }, 300);
    };

    closeModalBtn.addEventListener('click', closeModal);
    exportModal.addEventListener('click', (e) => {
        if (e.target === exportModal) closeModal();
    });
    exportFullTxtBtn.addEventListener('click', () => {
        handleExportFullTXT(scenesForExport);
        closeModal();
    });
    exportPromptsBtn.addEventListener('click', () => {
        handleExportPromptsTXT(scenesForExport);
        closeModal();
    });
    
    // --- EVENT LISTENERS ---
    function logout() {
        sessionStorage.clear();
        window.location.href = '/index.html';
    }

    settingsToggle.addEventListener('click', () => {
        settingsPanel.classList.toggle('hidden');
        settingsIcon.classList.toggle('rotate-90');
    });

    apiKeyInput.addEventListener('change', (e) => {
        apiKey = e.target.value;
        localStorage.setItem('gemini-api-key', apiKey);
        updateUploaderUI(singleUploadContainer, singleUploadText);
        updateUploaderUI(batchUploadContainer, batchUploadText);
    });

    modelSelect.addEventListener('change', (e) => {
        model = e.target.value;
    });

    // Tab Switching
    [tabSingle, tabBatch].forEach(tab => {
        if (!tab) return;
        tab.addEventListener('click', (e) => {
            const targetTab = e.currentTarget.dataset.tab;
            if (targetTab === activeTab) return;
            
            activeTab = targetTab;
            
            // Toggle tab styles
            tabSingle.classList.toggle('active', activeTab === 'single');
            tabSingle.classList.toggle('text-purple-400', activeTab === 'single');
            tabSingle.classList.toggle('border-purple-400', activeTab === 'single');
            tabSingle.classList.toggle('text-slate-400', activeTab !== 'single');
            tabSingle.classList.toggle('border-transparent', activeTab !== 'single');

            if (tabBatch) {
                tabBatch.classList.toggle('active', activeTab === 'batch');
                tabBatch.classList.toggle('text-cyan-400', activeTab === 'batch');
                tabBatch.classList.toggle('border-cyan-400', activeTab === 'batch');
                tabBatch.classList.toggle('text-slate-400', activeTab !== 'batch');
                tabBatch.classList.toggle('border-transparent', activeTab !== 'batch');
            }
            
            // Toggle panels
            panelSingle.classList.toggle('hidden', activeTab !== 'single');
            if (panelBatch) panelBatch.classList.toggle('hidden', activeTab !== 'batch');
        });
    });

    // Single File Listeners
    singleUploadContainer.addEventListener('click', () => {
        if (!isLoading && apiKey) singleFileInput.click();
    });
    singleFileInput.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Guest file size validation
        const GUEST_SIZE_LIMIT = 20 * 1024 * 1024; // 20 MB
        if (userRole === 'Guest' && file.size > GUEST_SIZE_LIMIT) {
            showError(singleResultsContainer, `Lỗi: Tệp video vượt quá giới hạn 20MB cho tài khoản Khách.`);
            singleFileInput.value = ''; // Reset file input
            return;
        }

        singleVideoFile = file;
        urlInput.value = '';
        urlAnalyzeButton.disabled = true;
        const videoUrl = URL.createObjectURL(singleVideoFile);
        videoPlayer.src = videoUrl;
        videoPlayerContainer.classList.remove('hidden');
        singleAnalyzeButton.classList.remove('hidden');
        singleCreativeButton.classList.remove('hidden');
        creativeOptionsContainer.classList.remove('hidden');
        updateUploaderUI(singleUploadContainer, singleUploadText, file.name);
        clearResults(singleResultsContainer, 'Kết quả phân tích sẽ xuất hiện ở đây.');
    });
    singleAnalyzeButton.addEventListener('click', handleSingleAnalyzeClick);
    singleCreativeButton.addEventListener('click', handleSingleCreativeClick);

    // URL Listeners
    urlInput.addEventListener('input', () => {
        urlAnalyzeButton.disabled = !urlInput.value.trim();
    });
    urlAnalyzeButton.addEventListener('click', handleUrlAnalyzeClick);

    // Batch File Listeners
    if (batchUploadContainer) {
        batchUploadContainer.addEventListener('click', () => {
            if (!isLoading && apiKey) batchFileInput.click();
        });
    }
    if (batchFileInput) {
        batchFileInput.addEventListener('change', (e) => {
            const files = e.target.files;
            if (!files || files.length === 0) return;
            
            batchFilesState = Array.from(files).map(file => ({
                file,
                id: `${file.name}-${file.size}`,
                status: 'pending',
                progress: 0,
                progressMessage: 'Đang chờ',
                scenes: null,
                error: null,
            }));
            
            batchAnalyzeButton.classList.remove('hidden');
            updateUploaderUI(batchUploadContainer, batchUploadText, null, files.length);
            renderBatchProgress();
        });
    }
    if (batchAnalyzeButton) {
        batchAnalyzeButton.addEventListener('click', handleBatchAnalyzeClick);
    }

    // Scriptwriting Listeners
    if(scriptwritingCheckbox) {
        scriptwritingCheckbox.addEventListener('change', () => {
            scriptwritingOptions.classList.toggle('hidden', !scriptwritingCheckbox.checked);
        });
    }
    if(startScriptButton) {
        startScriptButton.addEventListener('click', handleScriptwritingClick);
    }


    // --- UI UPDATE FUNCTIONS ---
    function updateUploaderUI(container, textEl, fileName = null, fileCount = 0) {
        if (!container || !textEl) return;
        if (!apiKey) {
            textEl.innerHTML = `
                <p class="text-lg font-semibold text-slate-400">Vui lòng nhập Khóa API</p>
                <p class="text-sm text-slate-500">Mở cài đặt (biểu tượng bánh răng) để thêm khóa của bạn.</p>
            `;
            container.classList.add('cursor-not-allowed', 'border-slate-700', 'bg-slate-800/30');
            container.classList.remove('cursor-pointer', 'hover:border-purple-400', 'hover:border-cyan-400');
        } else {
            if (fileName) {
                textEl.innerHTML = `<p class="text-slate-300">Đã chọn: <span class="font-semibold text-purple-300">${fileName}</span></p>`;
            } else if (fileCount > 0) {
                textEl.innerHTML = `<p class="text-slate-300">Đã chọn: <span class="font-semibold text-cyan-300">${fileCount} video</span></p><p class="text-sm text-slate-500">Nhấp lần nữa để chọn lại.</p>`;
            } else {
                if (container.id.includes('single')) {
                     textEl.innerHTML = userRole === 'Guest' ?
                    `<p class="text-lg font-semibold text-slate-300">Kéo và thả hoặc nhấp để tải lên video</p><p class="text-sm text-slate-500">Giới hạn <span class="font-semibold text-yellow-400">20MB</span> cho tài khoản Khách.</p>`:
                    `<p class="text-lg font-semibold text-slate-300">Kéo và thả hoặc nhấp để tải lên video</p><p class="text-sm text-slate-500">Video sẽ được phân tích chi tiết từng giây.</p>`
                } else {
                    textEl.innerHTML = `<p class="text-lg font-semibold text-slate-300">Chọn nhiều video để xử lý hàng loạt</p><p class="text-sm text-slate-500">Các video sẽ được xử lý song song để tăng tốc độ.</p>`;
                }
            }
             container.classList.remove('cursor-not-allowed', 'border-slate-700', 'bg-slate-800/30');
             container.classList.add('cursor-pointer');
        }
    }
    
    function setLoading(loading, target) {
        isLoading = loading;
        const elementsToDisable = [apiKeyInput, modelSelect, singleFileInput, batchFileInput, urlInput, startScriptButton, creativeSubjectInput];
        elementsToDisable.forEach(el => { if (el) el.disabled = loading; });

        if (target === 'single') {
            if (singleAnalyzeButton) singleAnalyzeButton.disabled = loading;
            if (singleCreativeButton) singleCreativeButton.disabled = loading;
            if (urlAnalyzeButton) urlAnalyzeButton.disabled = loading;
            // After loading, re-enable URL button only if there's text
            if (!loading && urlAnalyzeButton) {
                urlAnalyzeButton.disabled = !urlInput.value.trim();
            }
        } else if (target === 'batch' && batchAnalyzeButton) {
            batchAnalyzeButton.disabled = loading;
        }
    }
    
    function showError(container, message) {
         container.innerHTML = `
            <div class="flex items-center justify-center h-full p-8 bg-red-900/20 border border-red-500 rounded-lg">
                <div class="text-red-300 text-center">${message}</div>
            </div>`;
    }

    function showYouTubeInstructions(container) {
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full p-8 bg-slate-800/50 border border-slate-700 rounded-lg text-center">
                <svg class="w-16 h-16 mb-4 text-red-500" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.407-.501-9.407-.501s-7.537 0-9.407.501A3.007 3.007 0 0 0 .505 6.205a31.25 31.25 0 0 0-.501 9.407 31.25 31.25 0 0 0 .501 9.407 3.007 3.007 0 0 0 2.088 2.088c1.87.501 9.407.501 9.407.501s7.537 0 9.407-.501a3.007 3.007 0 0 0 2.088-2.088 31.25 31.25 0 0 0 .501-9.407 31.25 31.25 0 0 0-.501-9.407Zm-14.88 11.231V8.406l6.438 3.513-6.438 3.517Z"></path></svg>
                <h3 class="text-xl font-bold text-slate-100 mb-2">Phân Tích Video YouTube</h3>
                <p class="text-slate-400 max-w-md mb-6">
                    Do chính sách của YouTube, ứng dụng không thể phân tích video trực tiếp từ link. Vui lòng làm theo các bước sau:
                </p>
                <div class="text-left space-y-4 max-w-md w-full">
                    <div class="flex items-start gap-4">
                        <div class="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center font-bold text-white">1</div>
                        <div>
                            <h4 class="font-semibold text-slate-200">Tải Video về máy</h4>
                            <p class="text-sm text-slate-400">Sử dụng một công cụ <a href="/index.html#cong-cu" target="_blank" class="text-cyan-400 hover:text-cyan-300 underline font-semibold">"Tool tải video"</a> hoặc trang web cho phép tải video YouTube để lưu video vào máy tính của bạn.</p>
                        </div>
                    </div>
                    <div class="flex items-start gap-4">
                        <div class="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center font-bold text-white">2</div>
                        <div>
                            <h4 class="font-semibold text-slate-200">Tải File Lên Ứng Dụng</h4>
                            <p class="text-sm text-slate-400">Sau khi tải xong, hãy quay lại đây và dùng chức năng <strong class="text-cyan-300">"Tải lên video"</strong> để chọn file bạn vừa lưu.</p>
                        </div>
                    </div>
                </div>
            </div>`;
    }

    function clearResults(container, message = null) {
        if(container) {
            container.innerHTML = `<div class="flex items-center justify-center h-full p-8 bg-slate-800/50 rounded-lg">
                ${message ? `<p class="text-slate-400 text-center">${message}</p>` : ''}
            </div>`;
        }
    }

    function renderSceneCards(scenes, container) {
        container.innerHTML = ''; // Clear previous cards

        if (scenes.length === 0) {
            container.innerHTML = `<p class="text-slate-400 text-center p-4">Không tìm thấy phân cảnh nào hoặc đã xảy ra lỗi.</p>`;
            return;
        }
        
        scenes.forEach(scene => {
            const card = document.createElement('div');
            card.className = 'bg-slate-800 rounded-lg p-5 shadow-md border border-slate-700 transition-all duration-300 hover:border-purple-500 hover:shadow-purple-500/10 mb-4';
            const copyId = `copy-btn-${Math.random().toString(36).substr(2, 9)}`;
            card.innerHTML = `
                <div class="flex justify-between items-center mb-3"><p class="font-mono text-sm font-semibold text-cyan-300 bg-slate-700 px-3 py-1 rounded-full">${scene.timestamp}</p></div>
                <div class="space-y-4">
                    <div>
                        <h3 class="font-semibold text-slate-300 mb-1">Mô tả phân cảnh:</h3>
                        <p class="text-slate-400 text-sm flex-grow">${scene.description}</p>
                    </div>
                    <div class="bg-slate-900/50 p-4 rounded-md border border-slate-700 relative">
                        <h3 class="font-semibold text-slate-300 mb-1">Prompt đề xuất (Tiếng Anh):</h3>
                        <p class="text-purple-300/90 text-sm font-mono leading-relaxed">${scene.prompt}</p>
                        <button id="${copyId}" class="absolute top-2 right-2 p-2 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors" title="Copy prompt">
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v3.045A2.25 2.25 0 0113.5 9.75h-3A2.25 2.25 0 018.25 7.5V4.455c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"></path></svg>
                        </button>
                    </div>
                </div>`;
            container.appendChild(card);
            card.querySelector(`#${copyId}`).addEventListener('click', (e) => {
                const button = e.currentTarget;
                navigator.clipboard.writeText(scene.prompt);
                button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-green-400"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path></svg>`;
                setTimeout(() => {
                    button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v3.045A2.25 2.25 0 0113.5 9.75h-3A2.25 2.25 0 018.25 7.5V4.455c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"></path></svg>`;
                }, 2000);
            });
        });
    }

    async function handleRegenerateAnalysisClick() {
        if (!singleAnalysisFrames) {
            showError(document.getElementById('analysis-cards-container'), 'Lỗi: Không tìm thấy dữ liệu khung hình. Vui lòng thử phân tích lại từ đầu.');
            return;
        }

        const customPrompt = document.getElementById('analysis-custom-prompt').value;
        const cardsContainer = document.getElementById('analysis-cards-container');
        const regenerateButton = document.getElementById('regenerate-analysis-btn');

        setLoading(true, 'single');
        if (regenerateButton) regenerateButton.disabled = true;
        cardsContainer.innerHTML = `<div class="flex items-center justify-center h-full p-8">
            <div class="flex flex-col items-center justify-center h-full">
                <div class="w-10 h-10 border-4 border-dashed rounded-full animate-spin border-purple-400"></div>
                <p class="mt-4 text-slate-300 animate-pulse">Đang tạo lại phân tích với yêu cầu mới...</p>
            </div>
        </div>`;
        
        try {
            const newScenes = await getAnalysisFromFrames(singleAnalysisFrames, customPrompt, (update) => {
                // Optional: Show progress update during regeneration
            });
            // Replace contents of scenesForExport array in-place to avoid potential stale reference issues.
            scenesForExport.splice(0, scenesForExport.length, ...newScenes);
            renderSceneCards(newScenes, cardsContainer);
        } catch (err) {
            console.error(err);
            showError(cardsContainer, `Đã xảy ra lỗi khi tạo lại phân tích: ${formatGeminiError(err)}`);
        } finally {
            setLoading(false, 'single');
            if (regenerateButton) regenerateButton.disabled = false;
        }
    }

    function renderSingleResults(scenes, title = "Kết quả phân tích chi tiết") {
        if (!scenes) {
            clearResults(singleResultsContainer, 'Không tìm thấy phân cảnh nào hoặc đã xảy ra lỗi.');
            return;
        }

        singleResultsContainer.innerHTML = ''; // Clear previous content

        // Create Tab UI
        const nav = document.createElement('div');
        nav.className = 'border-b border-slate-700 mb-4';
        nav.innerHTML = `
            <nav class="-mb-px flex space-x-6" aria-label="Tabs">
                <button id="res-tab-details" class="res-tab-btn text-purple-400 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm border-purple-400">${title}</button>
                ${userRole === 'Pro' ? '<button id="res-tab-narration" class="res-tab-btn text-slate-400 hover:text-slate-200 hover:border-slate-400 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm border-transparent">Lời Thuyết Minh</button>' : ''}
            </nav>
        `;

        const panelDetails = document.createElement('div');
        panelDetails.id = 'res-panel-details';

        const panelNarration = document.createElement('div');
        panelNarration.id = 'res-panel-narration';
        panelNarration.className = 'hidden';
        
        singleResultsContainer.appendChild(nav);
        singleResultsContainer.appendChild(panelDetails);
        singleResultsContainer.appendChild(panelNarration);

        // --- Populate Details Panel ---
        const analysisControls = document.createElement('div');
        analysisControls.className = 'space-y-4 p-4 bg-slate-800/50 rounded-lg mb-4';
        let exportButtonHTML = '';
        if (userRole !== 'Guest') {
            exportButtonHTML = `
            <button id="export-button" class="bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-2 px-4 rounded-lg text-sm transition-colors duration-200 flex items-center gap-2" title="Xuất kết quả">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"></path></svg>
                Xuất File
            </button>`;
        }
        
        analysisControls.innerHTML = `
            <h2 class="text-xl font-bold text-slate-200">${title}</h2>
            <div>
                <label for="analysis-custom-prompt" class="block text-sm font-medium text-slate-400 mb-2">Yêu cầu thêm (tùy chọn)</label>
                <textarea id="analysis-custom-prompt" rows="2" class="w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition" placeholder="Ví dụ: Tập trung vào cảm xúc của nhân vật chính, mô tả chi tiết hơn về bối cảnh..."></textarea>
            </div>
            <div class="flex flex-col sm:flex-row gap-4">
                <button id="regenerate-analysis-btn" class="w-full sm:w-auto flex-grow bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-2 px-5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                    Tạo Lại Phân Tích
                </button>
                ${exportButtonHTML}
            </div>
        `;
        
        const analysisCardsContainer = document.createElement('div');
        analysisCardsContainer.id = 'analysis-cards-container';
        
        panelDetails.appendChild(analysisControls);
        panelDetails.appendChild(analysisCardsContainer);
        
        renderSceneCards(scenes, analysisCardsContainer);
        
        // Add listeners for the new controls
        analysisControls.querySelector('#regenerate-analysis-btn').addEventListener('click', handleRegenerateAnalysisClick);
        const exportButton = analysisControls.querySelector('#export-button');
        if (exportButton) {
            exportButton.addEventListener('click', () => {
                // scenesForExport is updated by runFullAnalysis and handleRegenerateAnalysisClick.
                // We just need to open the modal.
                openModal();
            });
        }
        
        // --- Populate Narration Panel ---
        if (userRole === 'Pro') {
            const languageOptions = languages.map(lang => `<option value="${lang.name}">${lang.flag} ${lang.name}</option>`).join('');
            panelNarration.innerHTML = `
                <div class="space-y-4 p-4 bg-slate-800/50 rounded-lg">
                    <h3 class="text-lg font-semibold text-slate-200">Tạo Lời Thuyết Minh</h3>
                    <div>
                        <label for="language-select" class="block text-sm font-medium text-slate-400 mb-2">Chọn ngôn ngữ</label>
                        <select id="language-select" class="w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition">
                            ${languageOptions}
                        </select>
                    </div>
                    <div>
                        <label for="narration-custom-prompt" class="block text-sm font-medium text-slate-400 mb-2">Yêu cầu thêm (tùy chọn)</label>
                        <textarea id="narration-custom-prompt" rows="2" class="w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition" placeholder="Ví dụ: Giọng văn hài hước, tập trung vào nhân vật chính..."></textarea>
                    </div>
                    
                    <div class="border-t border-slate-600 pt-4 mt-4 space-y-3">
                        <div class="flex items-center gap-3">
                            <input id="multi-speaker-checkbox" type="checkbox" class="w-5 h-5 rounded bg-slate-700 border-slate-500 text-purple-500 focus:ring-purple-600 cursor-pointer">
                            <label for="multi-speaker-checkbox" class="font-semibold text-slate-300 cursor-pointer">Phân vai (Nhiều nhân vật)</label>
                        </div>
                    </div>

                    <button id="generate-narration-btn" class="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold py-2 px-5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                        Tạo Lời Thuyết Minh
                    </button>
                    <div id="narration-results-area" class="mt-4 border-t border-slate-700 pt-4"></div>
                </div>
            `;
            panelNarration.querySelector('#generate-narration-btn').addEventListener('click', () => {
                const resultsArea = panelNarration.querySelector('#narration-results-area');
                handleGenerateNarrationClick(resultsArea);
            });
        }

        // Tab Switching Logic
        const resTabs = singleResultsContainer.querySelectorAll('.res-tab-btn');
        resTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                resTabs.forEach(t => {
                    t.classList.remove('text-purple-400', 'border-purple-400');
                    t.classList.add('text-slate-400', 'border-transparent');
                });
                const clickedTab = e.currentTarget;
                clickedTab.classList.add('text-purple-400', 'border-purple-400');
                clickedTab.classList.remove('text-slate-400', 'border-transparent');

                if (clickedTab.id === 'res-tab-details') {
                    panelDetails.classList.remove('hidden');
                    panelNarration.classList.add('hidden');
                } else {
                    panelDetails.classList.add('hidden');
                    panelNarration.classList.remove('hidden');
                }
            });
        });

        // Show Scriptwriting feature for Pro users
        if (userRole === 'Pro' && scriptwritingFeatureContainer) {
            scriptwritingFeatureContainer.classList.remove('hidden');
        }
    }

    function renderBatchProgress() {
        if (!batchResultsContainer) return;
        if(batchFilesState.length === 0) {
            clearResults(batchResultsContainer, 'Chọn các video để bắt đầu phân tích hàng loạt.');
            return;
        }

        batchResultsContainer.innerHTML = ''; // Clear
        const list = document.createElement('div');
        list.className = 'space-y-4';
        list.innerHTML = `<h2 class="text-xl font-bold text-slate-200 border-b-2 border-slate-700 pb-2 mb-2">Tiến độ xử lý</h2>`;

        batchFilesState.forEach((item) => {
            const card = document.createElement('div');
            card.className = 'bg-slate-800 p-4 rounded-lg border border-slate-700';
            
            const statusClasses = {
                pending: 'text-slate-400',
                processing: 'text-cyan-400',
                completed: 'text-green-400',
                error: 'text-red-400'
            };
            const statusText = {
                 pending: 'Đang chờ',
                 processing: item.progressMessage,
                 completed: 'Hoàn thành',
                 error: 'Lỗi'
            }

            let buttonHTML = '';
             if (item.status === 'completed') {
                buttonHTML = `<button data-id="${item.id}" class="batch-download-btn bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-1 px-3 rounded-md text-xs transition-colors">Xuất File</button>`;
            } else if (item.status === 'error') {
                 buttonHTML = `<button data-id="${item.id}" class="batch-retry-btn bg-yellow-700 hover:bg-yellow-600 text-slate-200 font-semibold py-1 px-3 rounded-md text-xs transition-colors" title="Thử lại video này">Thử lại</button>`;
            }

            card.innerHTML = `
                <div class="flex justify-between items-center mb-2">
                    <p class="text-slate-300 truncate text-sm font-medium" title="${item.file.name}">${item.file.name}</p>
                    ${buttonHTML}
                </div>
                <div class="w-full bg-slate-700 rounded-full h-2.5 mb-2">
                    <div class="h-2.5 rounded-full transition-all duration-300 ${item.status === 'error' ? 'bg-red-500' : 'bg-cyan-600'}" style="width: ${item.progress}%"></div>
                </div>
                <div class="text-xs ${statusClasses[item.status]}">
                    ${statusText[item.status]}
                    ${item.status === 'error' ? `<span class="block text-red-500">${item.error}</span>` : ''}
                </div>
            `;
            list.appendChild(card);
        });
        
        batchResultsContainer.appendChild(list);
        
        document.querySelectorAll('.batch-download-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const target = e.currentTarget;
                const id = target.dataset.id;
                const result = batchFilesState.find(item => item.id === id);
                if (result?.status === 'completed' && result.scenes) {
                    scenesForExport = result.scenes;
                    openModal();
                }
            });
        });

         document.querySelectorAll('.batch-retry-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                // Future implementation: retry logic
            });
        });
    }

    // --- EXPORT FUNCTIONS ---
    function downloadFile(content, filename, type) {
        // Prepend BOM for better UTF-8 compatibility with Windows text editors
        const blob = new Blob(['\uFEFF' + content], { type });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
    function handleExportFullTXT(scenes) {
        const content = scenes.map(scene => `Timestamp: ${scene.timestamp}\nMô tả: ${scene.description}\nPrompt: ${scene.prompt}`).join('\n\n---\n\n');
        downloadFile(content, 'video_analysis_full.txt', 'text/plain;charset=utf-8');
    }
    function handleExportPromptsTXT(scenes) {
        const content = scenes.map(scene => scene.prompt).join('\n');
        downloadFile(content, 'video_prompts.txt', 'text/plain;charset=utf-8');
    }
    
    // --- CORE LOGIC ---
    function formatGeminiError(err) {
        console.error("Gemini API Error:", err);
        try {
            // The error message from the API might be a JSON string.
            const errorObj = JSON.parse(err.message);
            if (errorObj && errorObj.error && errorObj.error.message) {
                if (errorObj.error.code === 503 || errorObj.error.message.includes('overloaded')) {
                    return 'Mô hình AI hiện đang quá tải. Vui lòng thử lại sau ít phút.';
                }
                return `Lỗi từ API: ${errorObj.error.message}`;
            }
        } catch (e) {
            // Not a JSON error, return the original message.
        }
        return err.message;
    }

    const dataUrlToGenerativePart = (dataUrl) => {
      const [, data] = dataUrl.split(',');
      const mimeType = dataUrl.substring(dataUrl.indexOf(':') + 1, dataUrl.indexOf(';'));
      return { inlineData: { data, mimeType } };
    };
    const getVideoDuration = (videoFile) => new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => { URL.revokeObjectURL(video.src); resolve(video.duration); };
        video.onerror = () => { URL.revokeObjectURL(video.src); reject(new Error("Không thể đọc metadata của video.")); };
        video.src = URL.createObjectURL(videoFile);
    });
    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = Math.floor(totalSeconds % 60);
        const pad = (num) => num.toString().padStart(2, '0');
        return hours > 0 ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`;
    };
    const timeToSeconds = (timeStr) => {
        const parts = timeStr.split(':').map(Number);
        if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
        if (parts.length === 2) return parts[0] * 60 + parts[1];
        return 0;
    };
    const adjustTimestamp = (timestamp, offsetSeconds) => {
        const [startStr, endStr] = timestamp.split(' - ');
        if (!startStr || !endStr) return timestamp;
        const newStart = formatTime(timeToSeconds(startStr.trim()) + offsetSeconds);
        const newEnd = formatTime(timeToSeconds(endStr.trim()) + offsetSeconds);
        return `${newStart} - ${newEnd}`;
    };
    async function extractFrames(videoFile, intervalSeconds, onProgress, startTime, endTime) {
      return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const frames = [];
        video.src = URL.createObjectURL(videoFile);
        video.muted = true;
        video.onloadedmetadata = async () => {
            if (!context) return reject(new Error("Không thể lấy canvas context."));
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const totalFrames = Math.max(1, Math.floor((endTime - startTime) / intervalSeconds));
            let processedFrames = 0;
            const captureFrame = (time) => new Promise((resolveCapture) => {
                video.currentTime = time;
                video.onseeked = () => {
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);
                    frames.push(canvas.toDataURL('image/jpeg', 0.8));
                    processedFrames++;
                    onProgress( (processedFrames / totalFrames) * 100, `Đang trích xuất... (${processedFrames}/${totalFrames})`);
                    resolveCapture();
                };
                video.onerror = () => reject(new Error("Lỗi khi tua video."));
            });
            try {
                video.currentTime = startTime;
                await new Promise(res => { video.onseeked = () => res(); });
                for (let time = startTime; time < endTime; time += intervalSeconds) await captureFrame(time);
                URL.revokeObjectURL(video.src);
                resolve(frames);
            } catch(e) {
                URL.revokeObjectURL(video.src);
                reject(e);
            }
        };
        video.onerror = () => { URL.revokeObjectURL(video.src); reject(new Error("Không thể tải video.")); };
        video.load();
      });
    }

    function createAnalysisPrompt(numFramesInChunk, chunkDuration, customRequest) {
        let prompt = `**YÊU CẦU BẮT BUỘC:** Bạn là một AI phân tích video. Bạn sẽ nhận được ${numFramesInChunk} khung hình, đại diện cho một video clip dài ${Math.round(chunkDuration)} giây.
    Nhiệm vụ của bạn là chia clip này thành các phân cảnh CỐ ĐỊNH, mỗi phân cảnh dài chính xác 8 giây, và tạo ra mô tả chi tiết cho MỖI phân cảnh.

    **QUY TRÌNH:**
    1.  Tạo ra các phân cảnh liên tiếp, không có khoảng trống. Bắt đầu từ 00:00.
        - Phân cảnh 1: 00:00 - 00:08
        - Phân cảnh 2: 00:08 - 00:16
        - Phân cảnh 3: 00:16 - 00:24
        - ... và tiếp tục cho đến khi hết độ dài của clip.
    2.  Phân cảnh cuối cùng có thể ngắn hơn 8 giây nếu clip không chia hết cho 8. (Ví dụ: nếu clip dài 20 giây, phân cảnh cuối sẽ là 00:16 - 00:20).
    3.  Với MỖI phân cảnh đã tạo, hãy phân tích các khung hình tương ứng và cung cấp:
        - **timestamp**: Mốc thời gian chính xác của phân cảnh (ví dụ: "00:00 - 00:08").
        - **description**: Mô tả chi tiết bằng tiếng Việt về những gì xảy ra trong 8 giây đó.
        - **prompt**: Một prompt chi tiết bằng tiếng Anh cho các mô hình AI tạo video, mô tả hành động, chuyển động, góc máy và cảm xúc trong phân cảnh đó.`;

        if (customRequest && customRequest.trim() !== '') {
            prompt += `\n\n**YÊU CẦU THÊM TỪ NGƯỜI DÙNG:** ${customRequest}\nHãy điều chỉnh mô tả và prompt của bạn để phản ánh yêu cầu này.`;
        }

        prompt += `\n\n**ĐẢM BẢO RẰNG:**
    - Bạn phải tạo đủ số lượng phân cảnh để bao phủ toàn bộ ${Math.round(chunkDuration)} giây.
    - Không được bỏ sót bất kỳ giây nào.
    - Kết quả trả về phải là một mảng JSON chứa tất cả các phân cảnh.`;
        
        return prompt;
    }

    function createCreativePrompt(numFramesInChunk, chunkDuration, newSubject) {
        return `**YÊU CẦU SÁNG TẠO NỘI DUNG TƯƠNG TỰ:**
Bạn là một đạo diễn sáng tạo và AI phân tích video. Tôi sẽ cung cấp cho bạn ${numFramesInChunk} khung hình từ một video GỐC.
Nhiệm vụ của bạn là:
1.  **Phân tích phong cách:** Xem các khung hình để hiểu về phong cách quay phim (cinematic, vlog, documentary), nhịp độ (fast/slow), và các kỹ thuật camera được sử dụng.
2.  **Sáng tạo nội dung MỚI cho chủ đề: "${newSubject}"**.
3.  **Cấu trúc:** Video mới phải có độ dài và cấu trúc phân cảnh tương tự video gốc. Hãy chia video mới thành các phân cảnh CỐ ĐỊNH 8 GIÂY (00:00-00:08, 00:08-00:16, v.v.).
4.  **Nội dung:** Thay vì mô tả video gốc, hãy sáng tạo ra các cảnh quay cho chủ đề "${newSubject}" mà có cùng nhịp điệu và kiểu hình ảnh với video gốc. Ví dụ: Nếu video gốc là quy trình làm Coca-Cola, và chủ đề mới là Pepsi, hãy mô tả quy trình làm Pepsi với cùng góc máy và nhịp điệu.

**KẾT QUẢ ĐẦU RA:** Trả về một mảng JSON chứa:
- **timestamp**: Mốc thời gian (ví dụ: "00:00 - 00:08").
- **description**: Mô tả CHI TIẾT bằng TIẾNG VIỆT về cảnh quay mới của chủ đề "${newSubject}".
- **prompt**: Prompt bằng TIẾNG ANH chuyên nghiệp cho AI tạo video (như Veo, Sora) để tạo ra cảnh quay đó.

Hãy đảm bảo tính sáng tạo và đồng bộ với phong cách của video gốc.`;
    }

    async function getAnalysisFromFrames(chunkedFramesData, customPrompt, onProgressUpdate, isCreative = false, newSubject = "") {
        let analysisScenes = [];
        const ai = new GoogleGenAI({ apiKey });
        const numChunks = chunkedFramesData.length;
        
        const responseSchema = { type: Type.OBJECT, properties: { scenes: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { timestamp: { type: Type.STRING }, description: { type: Type.STRING }, prompt: { type: Type.STRING } }, required: ["timestamp", "description", "prompt"] } } }, required: ["scenes"] };

        for (let i = 0; i < numChunks; i++) {
            const chunk = chunkedFramesData[i];
            const progressPrefix = numChunks > 1 ? `Phần ${i + 1}/${numChunks}: ` : '';
            onProgressUpdate({ message: `${progressPrefix}Đang ${isCreative ? 'sáng tạo' : 'phân tích'}...` });
            
            const chunkDuration = chunk.chunkEndTime - chunk.chunkStartTime;
            const textPrompt = isCreative ? 
                createCreativePrompt(chunk.frameDataUrls.length, chunkDuration, newSubject) : 
                createAnalysisPrompt(chunk.frameDataUrls.length, chunkDuration, customPrompt);
                
            const imageParts = chunk.frameDataUrls.map(dataUrlToGenerativePart);

            const response = await ai.models.generateContent({ 
                model, 
                contents: [ { parts: [...imageParts, {text: textPrompt}] } ], 
                config: { responseMimeType: "application/json", responseSchema: responseSchema } 
            });
            
            const jsonText = response.text.trim();
            const result = JSON.parse(jsonText);
            const chunkScenes = result.scenes || [];
            const adjustedScenes = chunkScenes.map(scene => ({...scene, timestamp: adjustTimestamp(scene.timestamp, chunk.chunkStartTime)}));
            analysisScenes.push(...adjustedScenes);
            onProgressUpdate({ message: `${progressPrefix}Hoàn thành.` });
        }
        return analysisScenes;
    }
    
    async function extractAllVideoFrames(videoFile, onProgressUpdate) {
        const CHUNK_DURATION_SECONDS = 80; // Process in 80-second chunks for better alignment with 8-second scenes
        const FRAME_INTERVAL_SECONDS = 1;
        const allFramesData = [];

        onProgressUpdate({ progress: 1, message: 'Đang lấy thông tin video...' });
        const duration = await getVideoDuration(videoFile);
        const numChunks = Math.ceil(duration / CHUNK_DURATION_SECONDS);

        for (let i = 0; i < numChunks; i++) {
            const chunkStartTime = i * CHUNK_DURATION_SECONDS;
            const chunkEndTime = Math.min((i + 1) * CHUNK_DURATION_SECONDS, duration);
            const chunkProgressStart = (i / numChunks) * 100;
            const chunkProgressWeight = 100 / numChunks;
            const progressPrefix = numChunks > 1 ? `Phần ${i + 1}/${numChunks}: ` : '';

            const frameDataUrls = await extractFrames(videoFile, FRAME_INTERVAL_SECONDS, (percent, msg) => {
                const overallProgress = chunkProgressStart + (percent / 100) * chunkProgressWeight;
                onProgressUpdate({ progress: overallProgress, message: `${progressPrefix}${msg}`});
            }, chunkStartTime, chunkEndTime);
            
            if (frameDataUrls.length > 0) {
                 allFramesData.push({ chunkStartTime, chunkEndTime, frameDataUrls });
            }
        }
        return allFramesData;
    }


    async function runFullAnalysis(videoFile, isCreative = false, newSubject = "") {
        setLoading(true, 'single');
        singleResultsContainer.innerHTML = `<div class="flex items-center justify-center h-full p-8 bg-slate-800/50 rounded-lg">
            <div class="flex flex-col items-center justify-center h-full">
                <div class="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-${isCreative ? 'yellow' : 'purple'}-400"></div>
                <p id="single-progress-text" class="mt-4 text-lg text-slate-300 animate-pulse">Bắt đầu ${isCreative ? 'sáng tạo nội dung mới' : 'phân tích'}...</p>
                <p class="text-sm text-slate-400">Quá trình này có thể mất một vài phút.</p>
            </div>
        </div>`;
        if(scriptwritingFeatureContainer) scriptwritingFeatureContainer.classList.add('hidden');
        if(scriptResultsContainer) clearResults(scriptResultsContainer);
        
        const progressTextEl = document.getElementById('single-progress-text');
        const updateProgress = (update) => {
            if (progressTextEl) progressTextEl.textContent = update.message;
        };

        try {
            // Step 1: Extract all frames and store them
            singleAnalysisFrames = await extractAllVideoFrames(videoFile, updateProgress);
            if (!singleAnalysisFrames || singleAnalysisFrames.length === 0) {
                throw new Error("Không thể trích xuất khung hình từ video.");
            }

            // Step 2: Get analysis/creative results from the extracted frames
            const scenes = await getAnalysisFromFrames(singleAnalysisFrames, '', updateProgress, isCreative, newSubject);
            scenesForExport.splice(0, scenesForExport.length, ...scenes); // Update scenes in-place
            renderSingleResults(scenes, isCreative ? "Kịch bản sáng tạo tương tự" : "Kết quả phân tích chi tiết");

        } catch (err) {
            console.error(err);
            showError(singleResultsContainer, `Đã xảy ra lỗi trong quá trình ${isCreative ? 'sáng tạo' : 'phân tích'}: ${formatGeminiError(err)}`);
            singleAnalysisFrames = null; // Clear frames on error
        } finally {
            setLoading(false, 'single');
        }
    }

    async function handleSingleAnalyzeClick() {
        if (!singleVideoFile) return showError(singleResultsContainer, 'Vui lòng tải lên một video trước.');
        if (!apiKey) return showError(singleResultsContainer, 'Vui lòng nhập khóa API Gemini của bạn trong phần cài đặt.');
        await runFullAnalysis(singleVideoFile);
    }

    async function handleSingleCreativeClick() {
      if (!singleVideoFile) return showError(singleResultsContainer, 'Vui lòng tải lên một video trước.');
      if (!apiKey) return showError(singleResultsContainer, 'Vui lòng nhập khóa API Gemini của bạn trong phần cài đặt.');
      const newSubject = creativeSubjectInput.value.trim();
      if (!newSubject) {
          alert('Vui lòng nhập chủ đề mới cho video muốn sáng tạo.');
          creativeSubjectInput.focus();
          return;
      }
      await runFullAnalysis(singleVideoFile, true, newSubject);
    }
    
    async function handleUrlAnalyzeClick() {
        const url = urlInput.value.trim();
        if (!url) return;
        if (!apiKey) return showError(singleResultsContainer, 'Vui lòng nhập khóa API Gemini của bạn trong phần cài đặt.');

        // Clear previous file selection if any
        singleVideoFile = null;
        singleFileInput.value = '';
        videoPlayerContainer.classList.add('hidden');
        singleAnalyzeButton.classList.add('hidden');
        singleCreativeButton.classList.add('hidden');
        creativeOptionsContainer.classList.add('hidden');
        updateUploaderUI(singleUploadContainer, singleUploadText); // Reset uploader UI

        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
        if (youtubeRegex.test(url)) {
            showYouTubeInstructions(singleResultsContainer);
            return;
        }

        singleResultsContainer.innerHTML = `<div class="flex items-center justify-center h-full p-8 bg-slate-800/50 rounded-lg">...</div>`; // Show loader
        
        try {
            // NOTE: This fetch can be blocked by CORS policy on the remote server.
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Không thể tải video. Server trả về mã lỗi ${response.status}.`);
            
            const blob = await response.blob();
            if (!blob.type.startsWith('video/')) throw new Error(`Link không trỏ đến một file video hợp lệ. Loại nội dung: ${blob.type}`);

            const fileName = url.substring(url.lastIndexOf('/') + 1).split('?')[0] || 'video_from_url.mp4';
            const videoFile = new File([blob], fileName, { type: blob.type });

            const GUEST_SIZE_LIMIT = 20 * 1024 * 1024; // 20 MB
            if (userRole === 'Guest' && videoFile.size > GUEST_SIZE_LIMIT) {
                throw new Error(`Tệp video từ link vượt quá giới hạn 20MB cho tài khoản Khách.`);
            }

            const videoUrl = URL.createObjectURL(videoFile);
            videoPlayer.src = videoUrl;
            videoPlayerContainer.classList.remove('hidden');

            // Show action buttons
            singleAnalyzeButton.classList.remove('hidden');
            singleCreativeButton.classList.remove('hidden');
            creativeOptionsContainer.classList.remove('hidden');

            // Default to normal analysis
            await runFullAnalysis(videoFile);

        } catch (err) {
            console.error(err);
            if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
                 showError(singleResultsContainer, `Lỗi khi tải video: Không thể truy cập link do chính sách CORS. Máy chủ của video không cho phép tải trực tiếp.`);
            } else {
                 showError(singleResultsContainer, `Đã xảy ra lỗi: ${formatGeminiError(err)}`);
            }
        }
    }
    
    async function handleBatchAnalyzeClick() {
        if (batchFilesState.length === 0) return;
        if (!apiKey) return showError(batchResultsContainer, 'Vui lòng nhập khóa API Gemini của bạn trong phần cài đặt.');
        
        setLoading(true, 'batch');
        batchOverallProgress.textContent = `Đang chuẩn bị...`;

        // Reset status for pending/error files
        batchFilesState.forEach(item => {
            if (item.status === 'pending' || item.status === 'error') {
                item.status = 'processing';
                item.error = null;
                item.progress = 0;
            }
        });
        renderBatchProgress();

        const analysisPromises = batchFilesState
            .filter(item => item.status === 'processing')
            .map(async (item) => {
                try {
                    const updateProgress = (update) => {
                        item.progress = update.progress;
                        item.progressMessage = update.message;
                        renderBatchProgress();
                    };
                    const frames = await extractAllVideoFrames(item.file, updateProgress);
                    const scenes = await getAnalysisFromFrames(frames, '', updateProgress);
                    item.status = 'completed';
                    item.scenes = scenes;
                    item.progress = 100;
                    item.progressMessage = 'Hoàn thành';
                } catch (err) {
                    item.status = 'error';
                    item.error = formatGeminiError(err);
                    item.progress = 100; // Show full bar for error
                }
            });

        await Promise.all(analysisPromises);
        
        setLoading(false, 'batch');
        batchOverallProgress.textContent = `Đã hoàn tất phân tích hàng loạt!`;
        renderBatchProgress();
    }
    
    async function handleScriptwritingClick() {
        if (!apiKey) return showError(scriptResultsContainer, 'Vui lòng nhập khóa API Gemini của bạn trong phần cài đặt.');
        if (scenesForExport.length === 0) return showError(scriptResultsContainer, 'Không có dữ liệu phân tích để viết kịch bản.');

        setLoading(true, 'single');
        scriptResultsContainer.innerHTML = `<div class="flex items-center justify-center h-full p-8 bg-slate-800/50 rounded-lg">
            <div class="flex flex-col items-center justify-center h-full">
                <div class="w-10 h-10 border-4 border-dashed rounded-full animate-spin border-pink-400"></div>
                <p class="mt-4 text-slate-300 animate-pulse">AI đang sáng tạo kịch bản...</p>
            </div>
        </div>`;

        try {
            const ai = new GoogleGenAI({ apiKey });
            const analysisContext = scenesForExport.map(s => `Thời gian: ${s.timestamp}\nMô tả: ${s.description}`).join('\n\n');
            const style = scriptStyleSelect.value;
            const customPrompt = scriptCustomPrompt.value;

            const scriptwritingPrompt = `Bạn là một nhà biên kịch chuyên nghiệp. Dưới đây là bản phân tích chi tiết từng phân cảnh HÌNH ẢNH của một video. Nhiệm vụ của bạn là viết lại một kịch bản mới hoàn chỉnh dựa trên logic sau:

**QUY TRÌNH BẮT BUỘC:**
1.  **Phân tích bối cảnh:** Dựa vào mô tả hình ảnh (ví dụ: có người đang nói, phỏng vấn, thuyết trình, hay chỉ là cảnh quay thiên nhiên với nhạc nền), hãy phán đoán xem video gốc CÓ khả năng chứa giọng đọc/lời thoại hay KHÔNG.
2.  **Viết kịch bản tương ứng:**
    *   **Trường hợp 1 (Nếu bạn tin rằng video CÓ giọng đọc/lời thoại):** Hãy tưởng tượng nội dung của giọng đọc đó là gì dựa trên hình ảnh. Sau đó, hãy viết lại kịch bản mới chủ yếu dựa trên NỘI DUNG LỜI THOẠI mà bạn suy luận ra, kết hợp với mô tả hình ảnh để tạo sự liền mạch.
    *   **Trường hợp 2 (Nếu bạn tin rằng video KHÔNG có giọng đọc, ví dụ video ca nhạc, cinematic...):** Hãy viết một kịch bản mới hoàn toàn dựa trên DIỄN BIẾN HÌNH ẢNH, tạo ra một câu chuyện hoặc một bài thuyết minh phù hợp.

**YÊU CẦU CHO KỊCH BẢN ĐẦU RA:**
*   **Phong cách viết:** ${style}.
*   **Nội dung:** Giữ lại tinh thần và thông điệp cốt lõi của video gốc.
*   **Sáng tạo:** Bổ sung các chi tiết, mô tả hành động, và biểu cảm để làm kịch bản trở nên sống động.
${customPrompt ? `*   **Yêu cầu thêm từ người dùng:** ${customPrompt}` : ''}
*   **Định dạng:** Chỉ trả về nội dung kịch bản cuối cùng, không bao gồm các bước phân tích hay suy luận của bạn.

**DỮ LIỆU PHÂN TÍCH HÌNH ẢNH ĐỘC LẬP:**
---
${analysisContext}
---

**KỊCH BẢN MỚI HOÀN CHỈNH:**`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash', // Use Pro for higher quality creative writing
                contents: [{ parts: [{text: scriptwritingPrompt}] }]
            });

            const scriptText = response.text;
            const copyId = `copy-script-btn-${Math.random().toString(36).substr(2, 9)}`;

            scriptResultsContainer.innerHTML = `
                <div class="bg-slate-900/50 p-4 rounded-md border border-slate-700 relative">
                    <h3 class="font-semibold text-slate-300 mb-2">Kịch bản đã tạo:</h3>
                    <pre class="text-slate-300/90 text-sm font-sans whitespace-pre-wrap leading-relaxed">${scriptText}</pre>
                    <button id="${copyId}" class="absolute top-2 right-2 p-2 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors" title="Copy kịch bản">
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v3.045A2.25 2.25 0 0113.5 9.75h-3A2.25 2.25 0 018.25 7.5V4.455c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"></path></svg>
                    </button>
                </div>
            `;
            
            document.getElementById(copyId).addEventListener('click', (e) => {
                 const button = e.currentTarget;
                 navigator.clipboard.writeText(scriptText);
                 button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-green-400"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path></svg>`;
                 setTimeout(() => {
                    button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v3.045A2.25 2.25 0 0113.5 9.75h-3A2.25 2.25 0 018.25 7.5V4.455c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"></path></svg>`;
                 }, 2000);
            });


        } catch (err) {
            console.error(err);
            showError(scriptResultsContainer, `Đã xảy ra lỗi khi viết kịch bản: ${formatGeminiError(err)}`);
        } finally {
            setLoading(false, 'single');
        }
    }

    // --- NARRATION / SRT & TTS FUNCTIONS ---
    function decode(base64) {
      const binaryString = atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
    }

    async function customDecodeAudioData(data, ctx, sampleRate, numChannels) {
      const dataInt16 = new Int16Array(data.buffer);
      const frameCount = dataInt16.length / numChannels;
      const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

      for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
          channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
      }
      return buffer;
    }

    function audioBufferToWav(buffer) {
        const numChannels = buffer.numberOfChannels;
        const sampleRate = buffer.sampleRate;
        const format = 1; // PCM
        const bitDepth = 16;

        let result = buffer.getChannelData(0); // Assume mono
        const dataLength = result.length * (bitDepth / 8);
        const bufferLength = 44 + dataLength;
        const view = new DataView(new ArrayBuffer(bufferLength));

        let offset = 0;

        const writeString = (str) => {
            for (let i = 0; i < str.length; i++) {
                view.setUint8(offset + i, str.charCodeAt(i));
            }
        };
        
        writeString('RIFF'); offset += 4;
        view.setUint32(offset, 36 + dataLength, true); offset += 4;
        writeString('WAVE'); offset += 4;
        writeString('fmt '); offset += 4;
        view.setUint32(offset, 16, true); offset += 4;
        view.setUint16(offset, format, true); offset += 2;
        view.setUint16(offset, numChannels, true); offset += 2;
        view.setUint32(offset, sampleRate, true); offset += 4;
        view.setUint32(offset, sampleRate * numChannels * (bitDepth / 8), true); offset += 4;
        view.setUint16(offset, numChannels * (bitDepth / 8), true); offset += 2;
        view.setUint16(offset, bitDepth, true); offset += 2;
        writeString('data'); offset += 4;
        view.setUint32(offset, dataLength, true); offset += 4;

        for (let i = 0; i < result.length; i++, offset += 2) {
            const s = Math.max(-1, Math.min(1, result[i]));
            view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        }
        
        return new Blob([view], { type: 'audio/wav' });
    }

    async function generateLyTranTTSAudio(text, voiceId, apiKey, rate, pitch) {
        const response = await fetch('https://tts.congnghe360.com/api/speak', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': apiKey,
            },
            body: JSON.stringify({
                text: text,
                voice: voiceId,
                rate: `${rate >= 0 ? '+' : ''}${rate}%`,
                pitch: `${pitch >= 0 ? '+' : ''}${pitch}Hz`,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text().catch(() => `Lỗi HTTP ${response.status}`);
            throw new Error(`TTS Studio API error (${response.status}): ${errorText}`);
        }
        return await response.blob();
    }

    async function getElevenLabsQuota(apiKey) {
        if (elevenLabsQuotaCache.has(apiKey)) {
            return elevenLabsQuotaCache.get(apiKey);
        }
        try {
            const response = await fetch('https://api.elevenlabs.io/v1/user', {
                headers: { 'xi-api-key': apiKey }
            });
            if (!response.ok) {
                if (response.status === 401) depletedElevenLabsKeys.add(apiKey);
                return 0;
            }
            const data = await response.json();
            const remaining = data.subscription.character_limit - data.subscription.character_count;
            elevenLabsQuotaCache.set(apiKey, remaining);
            return remaining;
        } catch (e) {
            console.error("Failed to get quota for key", apiKey, e);
            return 0;
        }
    }
    
    async function pickNextViableElevenLabsKey() {
        if (elevenLabsApiKeys.length === 0) return null;
        const totalKeys = elevenLabsApiKeys.length;
        for (let i = 0; i < totalKeys; i++) {
            const key = elevenLabsApiKeys[elevenLabsApiIndex];
            elevenLabsApiIndex = (elevenLabsApiIndex + 1) % totalKeys;
            if (depletedElevenLabsKeys.has(key)) continue;
            const quota = await getElevenLabsQuota(key);
            if (quota > GOOD_KEY_THRESHOLD) {
                return key;
            } else {
                depletedElevenLabsKeys.add(key);
                console.warn(`Key ${key.substring(0, 4)}... is depleted.`);
            }
        }
        return null;
    }
    
    async function generateElevenLabsAudio(text, voiceId, modelId) {
        const maxAttempts = elevenLabsApiKeys.length * 2;
        for (let attempts = 0; attempts < maxAttempts; attempts++) {
            const apiKey = await pickNextViableElevenLabsKey();
            if (!apiKey) {
                throw new Error("Tất cả các khóa API ElevenLabs đều đã hết hạn mức hoặc không hợp lệ.");
            }
    
            const preRequestQuota = await getElevenLabsQuota(apiKey);
            console.log(`Attempting TTS with key ${apiKey.substring(0,4)}... (quota: ${preRequestQuota})`);
            
            try {
                const voice_settings = {
                    stability: parseFloat(document.getElementById('elevenlabs-stability').value),
                    similarity_boost: parseFloat(document.getElementById('elevenlabs-similarity').value),
                    style: parseFloat(document.getElementById('elevenlabs-style').value),
                    use_speaker_boost: document.getElementById('elevenlabs-speaker-boost').checked
                };
    
                const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'xi-api-key': apiKey },
                    body: JSON.stringify({ text: text, model_id: modelId, voice_settings }),
                });
    
                if (response.ok) {
                    return await response.blob();
                }
    
                const errorData = await response.json().catch(() => ({ detail: { message: `Lỗi HTTP ${response.status}` } }));
                console.warn(`Key ${apiKey.substring(0, 4)}... failed with status ${response.status}:`, errorData.detail.message);
                if (response.status === 401) {
                    depletedElevenLabsKeys.add(apiKey);
                    elevenLabsQuotaCache.set(apiKey, 0);
                }
            } catch (error) {
                console.warn(`Key ${apiKey.substring(0, 4)}... encountered a network error:`, error);
            }
        }
        throw new Error("Tất cả các khóa API ElevenLabs đều không thành công.");
    }

    async function generateGeminiAudio(text, voiceId) {
        const ai = new GoogleGenAI({ apiKey });
        const ttsResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text }] }],
            config: {
                responseModalities: ['AUDIO'],
                speechConfig: {
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: voiceId } }
                }
            }
        });
        const base64Audio = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) return null;
        return decode(base64Audio);
    }

    async function handleGenerateAudioClick(narrationData) {
        const service = document.getElementById('tts-service-select').value;
        const generateBtn = document.getElementById('generate-audio-btn');
        const progressContainer = document.getElementById('tts-progress-container');
        const resultContainer = document.getElementById('tts-result-container');
        const standardizeCheckbox = document.getElementById('tts-standardize-checkbox');
        const standardize = standardizeCheckbox.checked;
        const isMultiSpeaker = narrationData.length > 0 && narrationData[0].hasOwnProperty('speaker');

        if (service === 'gemini' && !apiKey) {
            alert('Vui lòng nhập khóa API Gemini của bạn trong phần cài đặt.');
            return;
        }

        let singleVoiceId;
        let voiceMap = {};
        
        if (isMultiSpeaker) {
            document.querySelectorAll(`.${service}-voice-assign-select`).forEach(select => {
                voiceMap[select.dataset.speaker] = select.value;
            });
        } else {
             if (service === 'lytrantts') singleVoiceId = document.getElementById('lytrantts-voice-select').value;
             else if (service === 'elevenlabs') singleVoiceId = document.getElementById('elevenlabs-voice-select').value;
             else singleVoiceId = document.getElementById('gemini-voice-select').value;
        }

        if (service === 'lytrantts' && !lytranTTSApiKey) {
            alert('Vui lòng nhập khóa API TTS Studio.');
            return;
        }
        if (service === 'elevenlabs' && elevenLabsApiKeys.length === 0) {
            alert('Vui lòng tải lên file .txt chứa API key của ElevenLabs.');
            return;
        }

        setLoading(true, 'single');
        generateBtn.disabled = true;
        resultContainer.innerHTML = '';
        resultContainer.classList.add('hidden');
        progressContainer.textContent = 'Bắt đầu...';
        
        try {
            const ai = new GoogleGenAI({ apiKey });
            let processedData = narrationData;

            if (standardize) {
                progressContainer.textContent = 'Đang chuẩn hóa câu thoại...';
                const standardizePrompt = `Bạn là một AI biên tập kịch bản cho video. Nhiệm vụ của bạn là điều chỉnh lời thoại để khớp CHÍNH XÁC với thời lượng của từng phân cảnh.
Dưới đây là danh sách các phân cảnh với mốc thời gian và lời thoại gốc. Với MỖI phân cảnh, hãy:
1. **Tính toán thời lượng:** Xác định chính xác số giây cho phép từ mốc thời gian (ví dụ: "00:00 - 00:08" là 8 giây).
2. **Phân tích lời thoại:** Ước tính thời gian đọc của "lời thoại". Tốc độ đọc tự nhiên là khoảng 2 đến 2.5 từ mỗi giây.
3. **Quyết định và Chỉnh sửa:**
    * **Nếu lời thoại quá dài** so với thời lượng cho phép, hãy **VIẾT LẠI** câu đó sao cho **NGẮN GỌN** hơn nhưng vẫn **GIỮ NGUYÊN Ý CHÍNH**. Câu mới phải đảm bảo đọc vừa vặn trong khoảng thời gian đó.
    * **Nếu lời thoại đã vừa vặn hoặc ngắn**, hãy **GIỮ NGUYÊN** câu đó.
**YÊU CẦU ĐẦU RA:**
- Trả về kết quả dưới dạng một mảng JSON hợp lệ, có cấu trúc y hệt đầu vào.
- **QUAN TRỌNG:** Giữ nguyên giá trị của key "speaker" từ dữ liệu đầu vào nếu có.
- **KHÔNG** được thêm bất kỳ giải thích, ghi chú hay văn bản nào khác ngoài mảng JSON.
**DỮ LIỆU ĐẦU VÀO:**
${JSON.stringify(narrationData, null, 2)}`;
                let responseSchema = { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { timestamp: { type: Type.STRING }, narration: { type: Type.STRING } }, required: ["timestamp", "narration"] } };
                if (isMultiSpeaker) {
                    responseSchema.items.properties.speaker = { type: Type.STRING };
                    responseSchema.items.required.push("speaker");
                }

                const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: [{ parts: [{ text: standardizePrompt }] }], config: { responseMimeType: "application/json", responseSchema } });
                processedData = JSON.parse(response.text.trim());
            }

            const audioClips = [];
            const outputAudioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            for (let i = 0; i < processedData.length; i++) {
                const item = processedData[i];
                progressContainer.textContent = `Đang tạo âm thanh (${service}) cho phân cảnh ${i + 1}/${processedData.length}...`;

                const speakerKey = item.speaker ? item.speaker.trim() : '';
                 if (isMultiSpeaker && !voiceMap[speakerKey]) {
                    console.warn(`Speaker "${speakerKey}" not found in voice map. Using default voice.`);
                }
                const defaultVoice = isMultiSpeaker ? Object.values(voiceMap)[0] : singleVoiceId;
                const voiceIdForClip = isMultiSpeaker ? (voiceMap[speakerKey] || defaultVoice) : singleVoiceId;
                
                let audioBlob = null;
                let decodedBytes = null;
                
                 // --- DYNAMIC SPEED ADJUSTMENT & PARAMETER GATHERING ---
                let rate = 0, pitch = 0;
                if (service === 'lytrantts') {
                    rate = parseInt(document.getElementById('lytrantts-rate-slider').value, 10);
                    pitch = parseInt(document.getElementById('lytrantts-pitch-slider').value, 10);
                    
                    const allowedDuration = timeToSeconds(item.timestamp.split(' - ')[1].trim()) - timeToSeconds(item.timestamp.split(' - ')[0].trim());
                    const words = item.narration.split(/\s+/).filter(Boolean).length;
                    const estimatedDuration = words / 3.0; // Estimate based on ~180 WPM (TTS is often faster)
                    
                    if (estimatedDuration > allowedDuration && allowedDuration > 0.5) {
                        const requiredSpeedFactor = estimatedDuration / allowedDuration;
                        const rateIncrease = (requiredSpeedFactor - 1) * 100;
                        const cappedRateIncrease = Math.min(rateIncrease, 75); // Cap at +75% to avoid unnatural sound
                        rate = Math.round(cappedRateIncrease);
                    }
                }
                
                switch(service) {
                    case 'gemini':
                        decodedBytes = await generateGeminiAudio(item.narration, voiceIdForClip);
                        break;
                    case 'lytrantts':
                        audioBlob = await generateLyTranTTSAudio(item.narration, voiceIdForClip, lytranTTSApiKey, rate, pitch);
                        break;
                    case 'elevenlabs':
                        const elevenLabsModelId = document.getElementById('elevenlabs-model-select').value;
                        audioBlob = await generateElevenLabsAudio(item.narration, voiceIdForClip, elevenLabsModelId);
                        break;
                }

                let audioBuffer = null;
                if (decodedBytes) {
                     audioBuffer = await customDecodeAudioData(decodedBytes, outputAudioContext, 24000, 1);
                } else if (audioBlob) {
                    const arrayBuffer = await audioBlob.arrayBuffer();
                    audioBuffer = await outputAudioContext.decodeAudioData(arrayBuffer);
                }

                if (audioBuffer) {
                    audioClips.push({ timestamp: item.timestamp, buffer: audioBuffer });
                }
            }

            progressContainer.textContent = 'Đang ghép các file âm thanh...';
            if (audioClips.length === 0) throw new Error("Không có clip âm thanh nào được tạo.");

            const lastClip = audioClips[audioClips.length - 1];
            const totalDurationSeconds = timeToSeconds(lastClip.timestamp.split(' - ')[1].trim()) + lastClip.buffer.duration + 1;
            const finalSampleRate = 24000; // Standardize output to 24kHz
            const finalBuffer = outputAudioContext.createBuffer(1, Math.ceil(finalSampleRate * totalDurationSeconds), finalSampleRate);
            
            for (const clip of audioClips) {
                if (clip.buffer) {
                    const startTimeSeconds = timeToSeconds(clip.timestamp.split(' - ')[0].trim());
                    
                    // Resample buffer if its sample rate doesn't match the final one
                    let bufferToCopy = clip.buffer;
                    if (clip.buffer.sampleRate !== finalSampleRate) {
                        const offlineCtx = new OfflineAudioContext(1, Math.ceil(clip.buffer.duration * finalSampleRate), finalSampleRate);
                        const source = offlineCtx.createBufferSource();
                        source.buffer = clip.buffer;
                        source.connect(offlineCtx.destination);
                        source.start();
                        bufferToCopy = await offlineCtx.startRendering();
                    }

                    const offset = Math.floor(finalSampleRate * startTimeSeconds);
                    if (offset + bufferToCopy.length <= finalBuffer.length) {
                        finalBuffer.copyToChannel(bufferToCopy.getChannelData(0), 0, offset);
                    } else {
                        console.warn(`Audio clip for timestamp ${clip.timestamp} would overflow the final buffer. It might be truncated.`);
                        // Copy only what fits
                        const fittingData = bufferToCopy.getChannelData(0).slice(0, finalBuffer.length - offset);
                        finalBuffer.copyToChannel(fittingData, 0, offset);
                    }
                }
            }
            const wavBlob = audioBufferToWav(finalBuffer);
            const wavUrl = URL.createObjectURL(wavBlob);
            const srtContent = formatToSrt(processedData);
            const srtBlob = new Blob(['\uFEFF' + srtContent], { type: 'application/x-subrip;charset=utf-8' });
            const srtUrl = URL.createObjectURL(srtBlob);
            resultContainer.innerHTML = `
                <div class="bg-slate-100 p-2 rounded-full mb-4">
                    <audio controls class="w-full" src="${wavUrl}"></audio>
                </div>
                <div class="flex flex-col sm:flex-row gap-4">
                    <a href="${wavUrl}" download="narration_audio.wav" class="flex-1 block text-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-full transition-colors">Tải Âm Thanh (.wav)</a>
                    <a href="${srtUrl}" download="narration_subtitle.srt" class="flex-1 block text-center bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-full transition-colors">Tải Phụ Đề (.srt)</a>
                </div>`;

            resultContainer.classList.remove('hidden');
            progressContainer.textContent = 'Hoàn tất!';

        } catch (err) {
            console.error(err);
            progressContainer.textContent = '';
            showError(resultContainer, `Lỗi khi tạo âm thanh: ${err.message}`);
            resultContainer.classList.remove('hidden');
        } finally {
            setLoading(false, 'single');
            generateBtn.disabled = false;
        }
    }

    async function handleGenerateNarrationClick(container) {
        if (!apiKey) return showError(container, 'Vui lòng nhập khóa API Gemini của bạn trong phần cài đặt.');
        if (scenesForExport.length === 0) {
            showError(container, 'Không có dữ liệu phân tích để tạo lời thuyết minh.');
            return;
        }
        
        const selectedLanguage = document.getElementById('language-select').value;
        const customPrompt = document.getElementById('narration-custom-prompt').value;
        const isMultiSpeakerMode = document.getElementById('multi-speaker-checkbox')?.checked;

        setLoading(true, 'single');
        container.innerHTML = `<div class="flex items-center justify-center h-full p-8">
            <div class="flex flex-col items-center justify-center h-full">
                <div class="w-10 h-10 border-4 border-dashed rounded-full animate-spin border-cyan-400"></div>
                <p class="mt-4 text-slate-300 animate-pulse">AI đang viết lời thuyết minh bằng ${selectedLanguage}...</p>
            </div>
        </div>`;

        try {
            const ai = new GoogleGenAI({ apiKey });
            const analysisContext = scenesForExport.map(s => `Timestamp: ${s.timestamp}\nMô tả: ${s.description}`).join('\n\n');
            
            let narrationPrompt;
            let responseSchema;

            if (isMultiSpeakerMode) {
                narrationPrompt = `Bạn là một biên kịch chuyên nghiệp. Dựa vào bản phân tích chi tiết các phân cảnh của một video câm dưới đây, nhiệm vụ của bạn là viết một kịch bản đối thoại/dẫn chuyện hấp dẫn bằng ngôn ngữ "${selectedLanguage}".

**QUY TẮC BẮT BUỘC:**
1.  **Tự động nhận dạng người nói:** Phân tích nội dung và tự xác định có bao nhiêu người nói (ví dụ: Người dẫn truyện, Nhân vật A, Nhân vật B...).
2.  **Viết kịch bản và phân vai:** Tạo ra lời thoại/dẫn chuyện phù hợp cho từng mốc thời gian, và gán vai cho từng câu thoại một cách hợp lý. **LƯU Ý QUAN TRỌNG:** Tên của các "speaker" (ví dụ: "Người dẫn truyện", "Nhân vật A") phải nhất quán trong toàn bộ kịch bản.
3.  **KHÔNG MÔ TẢ LẠI HÌNH ẢNH.** Thay vào đó, hãy tạo ra một kịch bản **THÊM MỘT TẦNG Ý NGHĨA MỚI** cho hình ảnh, xây dựng một câu chuyện hoặc truyền tải một thông điệp.
4.  **LỜI THOẠI SẠCH:** Trong key "narration", chỉ viết lời thoại thuần túy. **TUYỆT ĐỐI KHÔNG** thêm bất kỳ ghi chú nào về biểu cảm, hành động, hay giọng điệu trong dấu ngoặc đơn (ví dụ: (khóc), (la hét), (giọng trầm lắng)).
${customPrompt ? `**Yêu cầu thêm từ người dùng:** ${customPrompt}` : ''}

**YÊU CẦU ĐỊNH DẠNG ĐẦU RA (RẤT QUAN TRỌNG):**
Chỉ trả về kết quả dưới dạng một mảng JSON hợp lệ. Mỗi phần tử trong mảng là một đối tượng chứa ba key:
1. "timestamp": Giữ nguyên giá trị từ dữ liệu phân tích.
2. "speaker": Tên của người nói bạn đã xác định (ví dụ: "Người dẫn truyện", "Nhân vật A").
3. "narration": Nội dung lời thoại/thuyết minh bằng ngôn ngữ "${selectedLanguage}" bạn đã viết.

**DỮ LIỆU PHÂN TÍCH HÌNH ẢNH (Video gốc không có âm thanh):**
---
${analysisContext}
---
`;
                responseSchema = { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { timestamp: { type: Type.STRING }, speaker: { type: Type.STRING }, narration: { type: Type.STRING } }, required: ["timestamp", "speaker", "narration"] } };

            } else {
                narrationPrompt = `Bạn là một người viết kịch bản lồng tiếng chuyên nghiệp. Dựa vào bản phân tích chi tiết các phân cảnh của một video câm dưới đây, nhiệm vụ của bạn là viết một lời thuyết minh hấp dẫn bằng ngôn ngữ "${selectedLanguage}".
        
**QUY TẮC QUAN TRỌNG:**
- **KHÔNG MÔ TẢ LẠI HÌNH ẢNH.** Thay vào đó, hãy viết lời thoại hoặc lời dẫn chuyện để **BỔ SUNG VÀ NÂNG CAO** ý nghĩa của hình ảnh. Hãy tưởng tượng bạn đang tạo một giọng đọc cho video này để kể một câu chuyện hoặc truyền tải một thông điệp.
- Lời thuyết minh cho mỗi phân cảnh phải phù hợp với diễn biến và cảm xúc được mô tả.
- Giọng văn phải mạch lạc, tự nhiên.
- **LỜI THOẠI SẠCH:** Trong key "narration", chỉ viết lời thoại thuần túy. **TUYỆT ĐỐI KHÔNG** thêm bất kỳ ghi chú nào về biểu cảm, hành động, hay giọng điệu trong dấu ngoặc đơn (ví dụ: (khóc), (la hét), (giọng trầm lắng)).
${customPrompt ? `**Yêu cầu thêm từ người dùng:** ${customPrompt}` : ''}

**YÊU CẦU ĐỊNH DẠNG ĐẦU RA:**
Chỉ trả về kết quả dưới dạng một mảng JSON hợp lệ. Mỗi phần tử trong mảng là một đối tượng chứa hai key:
1. "timestamp": Giữ nguyên giá trị từ dữ liệu phân tích.
2. "narration": Nội dung lời thuyết minh bằng ngôn ngữ "${selectedLanguage}" bạn đã viết cho phân cảnh đó.

**DỮ LIỆU PHÂN TÍCH HÌNH ẢNH (Video gốc không có âm thanh):**
---
${analysisContext}
---
`;
                responseSchema = { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { timestamp: { type: Type.STRING }, narration: { type: Type.STRING } }, required: ["timestamp", "narration"] } };
            }
            
            const response = await ai.models.generateContent({
                model, 
                contents: [{ parts: [{text: narrationPrompt}] }],
                config: { responseMimeType: "application/json", responseSchema }
            });
            
            const rawNarrationData = JSON.parse(response.text.trim());
            // Post-process to remove any parenthetical expressions the AI might have included
            const narrationData = rawNarrationData.map(item => ({
                ...item,
                narration: item.narration.replace(/\s*\(.*?\)\s*/g, ' ').trim()
            }));

            renderNarration(narrationData, container);

        } catch (err) {
            console.error(err);
            showError(container, `Đã xảy ra lỗi khi tạo lời thuyết minh: ${formatGeminiError(err)}`);
        } finally {
            setLoading(false, 'single');
        }
    }

    function renderNarration(narrationData, container) {
        container.innerHTML = ''; // Clear previous content (like loading spinners)
        const isMultiSpeaker = narrationData.length > 0 && narrationData[0].hasOwnProperty('speaker');

        const header = document.createElement('div');
        header.className = 'flex justify-between items-center pb-2 mb-4';
        header.innerHTML = `
             <h3 class="text-lg font-semibold text-slate-200">Lời Thuyết Minh</h3>
             <div class="flex gap-2">
                 <button id="export-txt-btn" class="bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-2 px-4 rounded-lg text-sm transition-colors duration-200 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                    Tải File .TXT
                 </button>
                 <button id="export-srt-btn" class="bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-2 px-4 rounded-lg text-sm transition-colors duration-200 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"></path></svg>
                    Tải File .SRT
                 </button>
             </div>
        `;
        container.appendChild(header);
        header.querySelector('#export-srt-btn').addEventListener('click', () => handleExportSrtClick(narrationData));
        header.querySelector('#export-txt-btn').addEventListener('click', () => handleExportTxtClick(narrationData));

        const narrationList = document.createElement('div');
        narrationList.className = 'space-y-3 max-h-60 overflow-y-auto pr-2';
        
        if (narrationData && narrationData.length > 0) {
            narrationData.forEach(item => {
                const card = document.createElement('div');
                card.className = 'bg-slate-800/70 p-4 rounded-lg border border-slate-700';
                card.innerHTML = `
                    <p class="font-mono text-sm font-semibold text-cyan-300 mb-2">${item.timestamp}</p>
                    <p class="text-slate-300 text-sm">${item.speaker ? `<strong class="text-purple-300">${item.speaker}:</strong> ` : ''}${item.narration}</p>
                `;
                narrationList.appendChild(card);
            });
        } else {
            narrationList.innerHTML = `<p class="text-slate-400 text-center">Không có lời thuyết minh nào được tạo.</p>`;
        }
        
        container.appendChild(narrationList);

        // --- NEW TTS UI ---
        const ttsContainer = document.createElement('div');
        ttsContainer.id = 'tts-generation-container';
        ttsContainer.className = 'border-t-2 border-slate-700 pt-4 mt-4';
        ttsContainer.innerHTML = `
            <h3 class="text-lg font-semibold text-slate-200 mb-4">Tạo file âm thanh</h3>
            <div class="space-y-4">
                <div>
                    <label for="tts-service-select" class="block text-sm font-medium text-slate-400 mb-1">Chọn dịch vụ lồng tiếng</label>
                    <select id="tts-service-select" class="w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition">
                        <option value="lytrantts">TTS Studio (Đề xuất, Phân vai tốt nhất)</option>
                        <option value="gemini">Gemini TTS</option>
                        <option value="elevenlabs">ElevenLabs (Chất lượng cao)</option>
                    </select>
                </div>
                
                <!-- Gemini Options -->
                <div id="gemini-tts-options" class="hidden space-y-2">
                     <div id="gemini-single-voice-container">
                        <label for="gemini-voice-select" class="block text-sm font-medium text-slate-400 mb-1">Giọng đọc Gemini</label>
                        <select id="gemini-voice-select" class="w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"></select>
                    </div>
                    <div id="gemini-multivoice-options" class="hidden space-y-2"></div>
                </div>

                <!-- LyTranTTS Options -->
                <div id="lytrantts-tts-options" class="space-y-4 border-t border-slate-700 pt-4">
                    <div>
                        <label for="lytrantts-api-key" class="block text-sm font-medium text-slate-400 mb-1">Khóa API TTS Studio</label>
                        <input type="password" id="lytrantts-api-key" placeholder="Nhập khóa API của TTS Studio" class="w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"/>
                    </div>
                    <div id="lytrantts-single-voice-container">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label for="lytrantts-language-select" class="block text-sm font-medium text-slate-400 mb-1">Ngôn ngữ</label>
                                <select id="lytrantts-language-select" class="w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"></select>
                            </div>
                            <div>
                                <label for="lytrantts-voice-select" class="block text-sm font-medium text-slate-400 mb-1">Giọng đọc</label>
                                <select id="lytrantts-voice-select" class="w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"></select>
                            </div>
                        </div>
                    </div>
                    <div id="lytrantts-multivoice-options" class="hidden space-y-2"></div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label for="lytrantts-rate-slider" class="block text-sm font-medium text-slate-400 mb-1">Tốc độ: <span id="lytrantts-rate-value">0%</span></label>
                            <input type="range" id="lytrantts-rate-slider" min="-50" max="50" value="0" class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500">
                        </div>
                        <div>
                            <label for="lytrantts-pitch-slider" class="block text-sm font-medium text-slate-400 mb-1">Cao độ: <span id="lytrantts-pitch-value">0Hz</span></label>
                            <input type="range" id="lytrantts-pitch-slider" min="-50" max="50" value="0" class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500">
                        </div>
                    </div>
                </div>

                <!-- ElevenLabs Options -->
                <div id="elevenlabs-tts-options" class="hidden space-y-4 border-t border-slate-700 pt-4">
                    <div>
                        <label for="elevenlabs-single-key-input" class="block text-sm font-medium text-slate-400 mb-1">Khóa API ElevenLabs</label>
                        <div class="flex gap-2 mb-2">
                            <input type="password" id="elevenlabs-single-key-input" placeholder="Hoặc nhập một API key và nhấn Thêm" class="flex-grow bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"/>
                            <button id="elevenlabs-add-single-key-btn" class="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-3 rounded-lg transition-colors text-sm">Thêm</button>
                        </div>
                        <div class="flex gap-2">
                            <input type="file" id="elevenlabs-key-file-input" class="hidden" accept=".txt">
                            <button id="elevenlabs-upload-key-btn" class="w-full text-center bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-2 px-3 rounded-lg text-sm transition-colors">
                                Tải lên file .txt
                            </button>
                            <button id="elevenlabs-clear-keys-btn" class="hidden flex-shrink-0 bg-red-800 hover:bg-red-700 text-white font-semibold p-2 rounded-lg text-sm transition-colors" title="Xóa các key đã tải">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                            </button>
                        </div>
                        <p id="elevenlabs-key-status" class="text-xs text-slate-500 mt-1 h-4"></p>
                        <p id="elevenlabs-status" class="text-xs text-slate-500 mt-1 h-4"></p>
                    </div>
                     <div id="elevenlabs-single-voice-container" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label for="elevenlabs-model-select" class="block text-sm font-medium text-slate-400 mb-1">Model</label>
                            <select id="elevenlabs-model-select" class="w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 transition">
                                <option value="eleven_multilingual_v2">Eleven Multilingual v2</option> 
                                <option value="eleven_turbo_v2_5">Eleven Turbo v2.5</option> 
                            </select>
                        </div>
                        <div>
                            <label for="elevenlabs-voice-select" class="block text-sm font-medium text-slate-400 mb-1">Giọng đọc</label>
                            <select id="elevenlabs-voice-select" disabled class="w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 transition disabled:opacity-50 disabled:cursor-not-allowed"></select>
                        </div>
                    </div>
                    <div id="elevenlabs-multivoice-options" class="hidden space-y-2"></div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 pt-2 border-t border-slate-600">
                        <div>
                            <label for="elevenlabs-stability" class="block text-sm font-medium text-slate-400">Stability: <span id="elevenlabs-stability-value">0.90</span></label>
                            <input type="range" id="elevenlabs-stability" min="0" max="1" value="0.9" step="0.05" class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500">
                        </div>
                        <div>
                            <label for="elevenlabs-similarity" class="block text-sm font-medium text-slate-400">Similarity Boost: <span id="elevenlabs-similarity-value">0.50</span></label>
                            <input type="range" id="elevenlabs-similarity" min="0" max="1" value="0.5" step="0.05" class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500">
                        </div>
                        <div>
                            <label for="elevenlabs-style" class="block text-sm font-medium text-slate-400">Style Exaggeration: <span id="elevenlabs-style-value">0.30</span></label>
                            <input type="range" id="elevenlabs-style" min="0" max="1" value="0.3" step="0.05" class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500">
                        </div>
                        <div class="flex items-center pt-2">
                             <input id="elevenlabs-speaker-boost" type="checkbox" checked class="w-4 h-4 rounded bg-slate-700 border-slate-500 text-pink-500 focus:ring-pink-600 cursor-pointer">
                             <label for="elevenlabs-speaker-boost" class="ml-2 text-sm text-slate-300 cursor-pointer">Speaker Boost</label>
                        </div>
                    </div>
                    <div>
                        <label for="elevenlabs-add-voice-id" class="block text-sm font-medium text-slate-400 mb-1">Hoặc thêm ID giọng đọc</label>
                        <div class="flex gap-2">
                            <input type="text" id="elevenlabs-add-voice-id" placeholder="Nhập Voice ID" class="flex-grow bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"/>
                            <button id="elevenlabs-add-voice-btn" class="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm">Thêm</button>
                        </div>
                    </div>
                </div>

                <div class="flex items-center gap-3 pt-2">
                    <input id="tts-standardize-checkbox" type="checkbox" class="w-5 h-5 rounded bg-slate-700 border-slate-500 text-purple-500 focus:ring-purple-600 cursor-pointer">
                    <label for="tts-standardize-checkbox" class="text-sm text-slate-300 cursor-pointer">Chuẩn hóa (Ghép giọng nói khớp với thời gian)</label>
                </div>
                <p id="tts-standardize-note" class="hidden text-xs text-yellow-400 bg-yellow-900/30 p-2 rounded-md">Chế độ phân vai yêu cầu phải bật Chuẩn hóa để gán giọng và ghép âm thanh chính xác.</p>

                <button id="generate-audio-btn" class="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed">
                    Bắt Đầu Chuyển Đổi
                </button>
                <div id="tts-progress-container" class="text-center text-sm text-slate-400 h-5"></div>
                <div id="tts-result-container" class="hidden mt-4"></div>
            </div>
        `;
        container.appendChild(ttsContainer);
        
        // --- Add Listeners and Populate UI for new TTS controls ---
        const speakers = isMultiSpeaker ? [...new Set(narrationData.map(item => item.speaker.trim()))] : [];
        
        const createVoiceAssignmentUI = (container, service, voiceList, options = {}) => {
            container.innerHTML = `<h4 class="text-sm font-semibold text-slate-300 border-b border-slate-600 pb-2 mb-2">Gán giọng đọc cho nhân vật</h4>`;
            speakers.forEach(speaker => {
                const row = document.createElement('div');
                row.className = 'flex items-center gap-2';
                row.innerHTML = `<label class="w-1/3 text-slate-400 text-sm truncate" title="${speaker}">${speaker}</label>`;
                
                const select = document.createElement('select');
                select.dataset.speaker = speaker;
                select.className = `${service}-voice-assign-select w-2/3 bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition`;

                if (options.isGrouped) {
                     Object.keys(voiceList).forEach(lang => {
                        const optgroup = document.createElement('optgroup');
                        optgroup.label = lang;
                        voiceList[lang].forEach(voice => {
                            const option = document.createElement('option');
                            option.value = voice.voiceId;
                            option.textContent = voice.name;
                            optgroup.appendChild(option);
                        });
                        select.appendChild(optgroup);
                    });
                } else {
                    voiceList.forEach(voice => {
                         const option = document.createElement('option');
                         option.value = options.valueKey ? voice[options.valueKey] : voice.value;
                         option.textContent = options.textKey ? voice[options.textKey] : voice.text;
                         select.appendChild(option);
                    });
                }
                row.appendChild(select);
                container.appendChild(row);
            });
        };
        
        // --- Service Specific UI Setup ---
        const ttsServiceSelect = document.getElementById('tts-service-select');
        const geminiOptions = document.getElementById('gemini-tts-options');
        const elevenlabsOptions = document.getElementById('elevenlabs-tts-options');
        const lytranttsOptions = document.getElementById('lytrantts-tts-options');
        const standardizeCheckbox = document.getElementById('tts-standardize-checkbox');
        const standardizeNote = document.getElementById('tts-standardize-note');

        // Populate single voice selects first
        const geminiSingleSelect = document.getElementById('gemini-voice-select');
        geminiVoices.forEach(voice => {
            const option = document.createElement('option');
            option.value = voice.value;
            option.textContent = voice.text;
            geminiSingleSelect.appendChild(option);
        });
        
        const updateMultiSpeakerUI = () => {
            const selectedService = ttsServiceSelect.value;
            geminiOptions.classList.toggle('hidden', selectedService !== 'gemini');
            elevenlabsOptions.classList.toggle('hidden', selectedService !== 'elevenlabs');
            lytranttsOptions.classList.toggle('hidden', selectedService !== 'lytrantts');
            
            standardizeCheckbox.disabled = false;
            standardizeNote.classList.add('hidden');

            if (isMultiSpeaker) {
                // Gemini
                document.getElementById('gemini-single-voice-container').classList.add('hidden');
                const geminiMultiContainer = document.getElementById('gemini-multivoice-options');
                createVoiceAssignmentUI(geminiMultiContainer, 'gemini', geminiVoices);
                geminiMultiContainer.classList.remove('hidden');

                // TTS Studio
                document.getElementById('lytrantts-single-voice-container').classList.add('hidden');
                const lytranMultiContainer = document.getElementById('lytrantts-multivoice-options');
                createVoiceAssignmentUI(lytranMultiContainer, 'lytrantts', lytranTTSVoices, { isGrouped: true });
                lytranMultiContainer.classList.remove('hidden');

                // ElevenLabs
                document.getElementById('elevenlabs-single-voice-container').classList.add('hidden');
                const elevenMultiContainer = document.getElementById('elevenlabs-multivoice-options');
                // We need to build a simple list for elevenlabs
                const elevenLabsVoiceList = (elevenLabsVoices || []).map(v => ({ value: v.voice_id, text: `${v.name} (${v.labels.gender || 'N/A'})` }));
                createVoiceAssignmentUI(elevenMultiContainer, 'elevenlabs', elevenLabsVoiceList);
                elevenMultiContainer.classList.remove('hidden');

                // Force standardization for multi-speaker on Gemini/ElevenLabs
                if (selectedService === 'gemini' || selectedService === 'elevenlabs') {
                    standardizeCheckbox.checked = true;
                    standardizeCheckbox.disabled = true;
                    standardizeNote.classList.remove('hidden');
                }

            } else {
                // Hide all multi-voice containers
                 document.getElementById('gemini-multivoice-options').classList.add('hidden');
                 document.getElementById('gemini-single-voice-container').classList.remove('hidden');
                 document.getElementById('lytrantts-multivoice-options').classList.add('hidden');
                 document.getElementById('lytrantts-single-voice-container').classList.remove('hidden');
                 document.getElementById('elevenlabs-multivoice-options').classList.add('hidden');
                 document.getElementById('elevenlabs-single-voice-container').classList.remove('hidden');
            }
        };

        ttsServiceSelect.addEventListener('change', updateMultiSpeakerUI);
        
        // --- LyTranTTS Listeners ---
        const lytranTTSApiKeyInput = document.getElementById('lytrantts-api-key');
        const lytranTTSLangSelect = document.getElementById('lytrantts-language-select');
        const lytranTTSVoiceSelect = document.getElementById('lytrantts-voice-select');
        const lytranTTSRateSlider = document.getElementById('lytrantts-rate-slider');
        const lytranTTSRateValue = document.getElementById('lytrantts-rate-value');
        const lytranTTSPitchSlider = document.getElementById('lytrantts-pitch-slider');
        const lytranTTSPitchValue = document.getElementById('lytrantts-pitch-value');

        lytranTTSApiKeyInput.value = lytranTTSApiKey;
        lytranTTSApiKeyInput.addEventListener('change', (e) => {
            lytranTTSApiKey = e.target.value;
            localStorage.setItem('lytrantts-api-key', lytranTTSApiKey);
        });
        lytranTTSRateSlider.addEventListener('input', (e) => { if (lytranTTSRateValue) lytranTTSRateValue.textContent = `${e.target.value >= 0 ? '+' : ''}${e.target.value}%`; });
        lytranTTSPitchSlider.addEventListener('input', (e) => { if (lytranTTSPitchValue) lytranTTSPitchValue.textContent = `${e.target.value >= 0 ? '+' : ''}${e.target.value}Hz`; });

        function populateLyTranTTSVoices() {
            const selectedLang = lytranTTSLangSelect.value;
            const voices = lytranTTSVoices[selectedLang] || [];
            lytranTTSVoiceSelect.innerHTML = '';
            voices.forEach(voice => {
                const option = document.createElement('option');
                option.value = voice.voiceId;
                option.textContent = voice.name;
                lytranTTSVoiceSelect.appendChild(option);
            });
        }
        
        Object.keys(lytranTTSVoices).forEach(lang => {
            const option = document.createElement('option');
            option.value = lang;
            option.textContent = lang;
            lytranTTSLangSelect.appendChild(option);
        });
        lytranTTSLangSelect.addEventListener('change', populateLyTranTTSVoices);
        populateLyTranTTSVoices(); // Initial population

        // --- ElevenLabs Listeners & Key Management ---
        const elevenlabsSingleKeyInput = document.getElementById('elevenlabs-single-key-input');
        const elevenlabsAddSingleKeyBtn = document.getElementById('elevenlabs-add-single-key-btn');
        const elevenlabsUploadKeyBtn = document.getElementById('elevenlabs-upload-key-btn');
        const elevenlabsKeyFileInput = document.getElementById('elevenlabs-key-file-input');
        const elevenlabsKeyStatus = document.getElementById('elevenlabs-key-status');
        const elevenlabsClearKeysBtn = document.getElementById('elevenlabs-clear-keys-btn');
        const elevenlabsVoiceSelect = document.getElementById('elevenlabs-voice-select');
        const elevenlabsStatus = document.getElementById('elevenlabs-status');
        const elevenlabsAddVoiceInput = document.getElementById('elevenlabs-add-voice-id');
        const elevenlabsAddVoiceBtn = document.getElementById('elevenlabs-add-voice-btn');
        const elevenlabsStabilitySlider = document.getElementById('elevenlabs-stability');
        const elevenlabsStabilityValue = document.getElementById('elevenlabs-stability-value');
        const elevenlabsSimilaritySlider = document.getElementById('elevenlabs-similarity');
        const elevenlabsSimilarityValue = document.getElementById('elevenlabs-similarity-value');
        const elevenlabsStyleSlider = document.getElementById('elevenlabs-style');
        const elevenlabsStyleValue = document.getElementById('elevenlabs-style-value');

        elevenlabsStabilitySlider.addEventListener('input', (e) => { if (elevenlabsStabilityValue) elevenlabsStabilityValue.textContent = parseFloat(e.target.value).toFixed(2); });
        elevenlabsSimilaritySlider.addEventListener('input', (e) => { if (elevenlabsSimilarityValue) elevenlabsSimilarityValue.textContent = parseFloat(e.target.value).toFixed(2); });
        elevenlabsStyleSlider.addEventListener('input', (e) => { if (elevenlabsStyleValue) elevenlabsStyleValue.textContent = parseFloat(e.target.value).toFixed(2); });

        const updateElevenLabsVoiceDropdown = () => {
            const currentVal = elevenlabsVoiceSelect.value;
            elevenlabsVoiceSelect.innerHTML = ''; // Clear

            if (customElevenLabsVoiceIds.length > 0) {
                 const optgroup = document.createElement('optgroup');
                 optgroup.label = 'Giọng đọc tùy chỉnh';
                 customElevenLabsVoiceIds.forEach(id => {
                     const option = document.createElement('option');
                     option.value = id;
                     option.textContent = `Custom ID: ${id.substring(0, 10)}...`;
                     optgroup.appendChild(option);
                 });
                 elevenlabsVoiceSelect.appendChild(optgroup);
            }

            if (elevenLabsVoices.length > 0) {
                 const optgroup = document.createElement('optgroup');
                 optgroup.label = 'Giọng đọc có sẵn';
                 elevenLabsVoices.forEach(voice => {
                    const option = document.createElement('option');
                    option.value = voice.voice_id;
                    option.textContent = `${voice.name} (${voice.labels.gender || 'N/A'}, ${voice.labels.accent || 'N/A'})`;
                    optgroup.appendChild(option);
                });
                elevenlabsVoiceSelect.appendChild(optgroup);
            }
            
            if (Array.from(elevenlabsVoiceSelect.options).some(opt => opt.value === currentVal)) {
                elevenlabsVoiceSelect.value = currentVal;
            }

            elevenlabsVoiceSelect.disabled = elevenlabsVoiceSelect.options.length === 0;
            updateMultiSpeakerUI(); // Refresh multi-speaker UI with new voices
        }
        
        const updateElevenLabsKeyStatus = () => {
            if (elevenLabsApiKeys.length > 0) {
                elevenlabsKeyStatus.textContent = `Đã tải thành công ${elevenLabsApiKeys.length} khóa API.`;
                elevenlabsKeyStatus.className = 'text-xs text-green-400 mt-1 h-4';
                elevenlabsClearKeysBtn.classList.remove('hidden');
            } else {
                elevenlabsKeyStatus.innerHTML = '&nbsp;';
                elevenlabsKeyStatus.className = 'text-xs text-slate-500 mt-1 h-4';
                elevenlabsClearKeysBtn.classList.add('hidden');
            }
        };

        const addElevenLabsKey = (key) => {
            const trimmedKey = key.trim();
            if (trimmedKey.length > 0 && !elevenLabsApiKeys.includes(trimmedKey)) {
                const wasEmpty = elevenLabsApiKeys.length === 0;
                elevenLabsApiKeys.push(trimmedKey);
                if (wasEmpty) {
                    loadElevenLabsVoices(trimmedKey);
                }
                return true;
            }
            return false;
        };
        
        elevenlabsAddSingleKeyBtn.addEventListener('click', () => {
            const newKey = elevenlabsSingleKeyInput.value;
            if (addElevenLabsKey(newKey)) {
                 updateElevenLabsKeyStatus();
                 elevenlabsSingleKeyInput.value = '';
            } else if (newKey.trim().length > 0) {
                 alert('Khóa API đã tồn tại hoặc không hợp lệ.');
            }
        });
        
        elevenlabsAddVoiceBtn.addEventListener('click', () => {
            const voiceId = elevenlabsAddVoiceInput.value.trim();
            if (voiceId) {
                const existingIndex = customElevenLabsVoiceIds.indexOf(voiceId);
                if (existingIndex > -1) customElevenLabsVoiceIds.splice(existingIndex, 1);
                if (customElevenLabsVoiceIds.length >= 3) customElevenLabsVoiceIds.shift(); 
                customElevenLabsVoiceIds.push(voiceId);
                updateElevenLabsVoiceDropdown();
                elevenlabsVoiceSelect.value = voiceId;
                elevenlabsAddVoiceInput.value = '';
            }
        });
        
        elevenlabsUploadKeyBtn.addEventListener('click', () => elevenlabsKeyFileInput.click());

        elevenlabsClearKeysBtn.addEventListener('click', () => {
             elevenLabsApiKeys = [];
             elevenLabsVoices = [];
             depletedElevenLabsKeys.clear();
             elevenLabsQuotaCache.clear();
             elevenlabsKeyFileInput.value = '';
             updateElevenLabsKeyStatus();
             updateElevenLabsVoiceDropdown();
             elevenlabsStatus.innerHTML = '&nbsp;';
        });

        elevenlabsKeyFileInput.addEventListener('change', (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target.result;
                const keysFromFile = text.split(/\r?\n/);
                
                elevenLabsApiKeys = [];
                elevenLabsVoices = [];
                depletedElevenLabsKeys.clear();
                elevenLabsQuotaCache.clear();
                elevenLabsApiIndex = 0;

                keysFromFile.forEach(addElevenLabsKey);
                updateElevenLabsKeyStatus();

                if (elevenLabsApiKeys.length === 0) {
                    elevenlabsKeyStatus.textContent = 'File không chứa khóa API hợp lệ.';
                    elevenlabsKeyStatus.className = 'text-xs text-red-400 mt-1 h-4';
                }
            };
            reader.readAsText(file);
        });

        async function loadElevenLabsVoices(key) {
             if (!key) {
                elevenlabsStatus.textContent = 'Không có API key để tải giọng đọc.';
                return;
            }
            elevenlabsStatus.textContent = 'Đang tải giọng đọc...';
            elevenlabsStatus.className = 'text-xs text-slate-400 mt-1 h-4';
            elevenlabsVoiceSelect.disabled = true;
            try {
                const response = await fetch('https://api.elevenlabs.io/v1/voices', {
                    headers: { 'xi-api-key': key }
                });
                if (!response.ok) throw new Error('Khóa API không hợp lệ hoặc có lỗi.');
                const data = await response.json();
                elevenLabsVoices = data.voices;
                updateElevenLabsVoiceDropdown();
                elevenlabsStatus.textContent = elevenLabsVoices.length > 0 ? `Đã tải ${elevenLabsVoices.length} giọng đọc.` : 'Không tìm thấy giọng đọc nào.';
                elevenlabsStatus.className = `text-xs mt-1 h-4 ${elevenLabsVoices.length > 0 ? 'text-green-400' : 'text-yellow-400'}`;
            } catch (error) {
                console.error('Lỗi khi tải giọng đọc ElevenLabs:', error);
                elevenlabsStatus.textContent = 'Lỗi: ' + error.message;
                elevenlabsStatus.className = 'text-xs text-red-400 mt-1 h-4';
                elevenLabsVoices = [];
                updateElevenLabsVoiceDropdown();
            }
        }
        
        // Trigger initial UI setup
        updateMultiSpeakerUI();
        document.getElementById('generate-audio-btn').addEventListener('click', () => handleGenerateAudioClick(narrationData));
    }

    function handleExportSrtClick(narrationData) {
        const srtContent = formatToSrt(narrationData);
        downloadFile(srtContent, 'narration.srt', 'application/x-subrip;charset=utf-8');
    }

    function handleExportTxtClick(narrationData) {
        const txtContent = narrationData.map(item => {
             return item.speaker ? `${item.speaker}: ${item.narration}` : item.narration;
        }).join('\n\n');
        downloadFile(txtContent, 'narration.txt', 'text/plain;charset=utf-8');
    }

    function formatToSrt(narrationData) {
        const timeToSrtFormat = (timeStr) => {
            const parts = timeStr.split(':').map(Number);
            let hours = 0, minutes = 0, seconds = 0;
            if (parts.length === 3) {
                [hours, minutes, seconds] = parts;
            } else if (parts.length === 2) {
                [minutes, seconds] = parts;
            }
            const pad = (num) => num.toString().padStart(2, '0');
            return `${pad(hours)}:${pad(minutes)}:${pad(seconds)},000`;
        };
        
        let srtContent = '';
        narrationData.forEach((item, index) => {
            const [startStr, endStr] = item.timestamp.split(' - ');
            if (!startStr || !endStr) return;

            const srtStartTime = timeToSrtFormat(startStr.trim());
            const srtEndTime = timeToSrtFormat(endStr.trim());
            
            const line = item.speaker ? `${item.speaker}: ${item.narration}` : item.narration;

            srtContent += `${index + 1}\n`;
            srtContent += `${srtStartTime} --> ${srtEndTime}\n`;
            srtContent += `${line}\n\n`;
        });
        
        return srtContent;
    }
});
