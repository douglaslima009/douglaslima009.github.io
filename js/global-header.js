/* js/global-header.js */
(function() {
    const url = window.location.href;
    const isInnerPage = url.includes('/catalogue/') || url.includes('/registry/') || url.includes('/updates/') || url.includes('/misc/');
    const prefix = isInnerPage ? '../' : '';

    const headerHTML = `
        <header class="sys-header">
            <div class="header-logo-container">
                <h1 data-i18n="header-author" style="margin: 0;">
                    <a href="${prefix}index.html" style="color: inherit; text-decoration: none;">DOUGLAS LIMA.</a>
                </h1>
            </div>
            
            <div class="header-controls">
                <div class="sys-audio-module">
                    <div id="sys-equalizer" class="equalizer">
                        <span class="eq-bar"></span>
                        <span class="eq-bar"></span>
                        <span class="eq-bar"></span>
                        <span class="eq-bar"></span>
                        <span class="eq-bar"></span>
                    </div>
                    <button id="btn-sys-audio" class="sys-btn">[ PLAY ]</button>
                </div>
                <button id="lang-toggle" class="sys-btn"></button>
                <button id="theme-toggle" class="sys-btn">[ THEME ]</button>
            </div>
            
            <nav class="nav-links">
                <a href="${prefix}index.html" data-i18n="nav-home">HOME</a>
                <a href="${prefix}about.html" data-i18n="nav-about">SOBRE</a>
                <a href="${prefix}catalogue.html" data-i18n="nav-catalogue">CATÁLOGO</a>
                <a href="${prefix}registry.html" data-i18n="nav-registry">REGISTROS</a>
                <a href="${prefix}updates.html" data-i18n="nav-updates">UPDATES</a>
                <a href="${prefix}miscellaneous.html" data-i18n="nav-miscellaneous">MISCELÂNEAS</a>
                <a href="${prefix}contact.html" data-i18n="nav-contact">CONTATO</a>
            </nav>
        </header>
    `;
    
    document.getElementById('header-container').innerHTML = headerHTML;
    
    // ========================================================
    // TEMA: BOTÃO (A leitura inicial já foi feita no <head>)
    // ========================================================
    const themeToggle = document.getElementById('theme-toggle');
    
    themeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-mode');
        
        if (document.documentElement.classList.contains('light-mode')) {
            localStorage.setItem('sysTheme', 'light');
        } else {
            localStorage.setItem('sysTheme', 'dark');
        }
    });

    // ========================================================
    // LÓGICA DE ÁUDIO (Rádio SomaFM)
    // ========================================================
    const audioBtn = document.getElementById('btn-sys-audio');
    const equalizer = document.getElementById('sys-equalizer');
    
    if (!window.sysRadio) {
        window.sysRadio = new Audio('https://ice1.somafm.com/defcon-128-mp3');
        window.sysRadio.volume = 0.3; 
    }

    function updateUI(isPlaying) {
        if (isPlaying) {
            audioBtn.innerText = '[ STOP ]';
            equalizer.classList.add('playing');
        } else {
            audioBtn.innerText = '[ PLAY ]';
            equalizer.classList.remove('playing');
        }
    }

    function attemptPlay() {
        if (sessionStorage.getItem('sysRadioState') === 'playing') {
            window.sysRadio.play().then(() => {
                updateUI(true);
            }).catch(() => {
                updateUI(false); 
            });
        }
    }

    attemptPlay();

    audioBtn.addEventListener('click', () => {
        if (window.sysRadio.paused) {
            sessionStorage.setItem('sysRadioState', 'playing');
            attemptPlay();
        } else {
            sessionStorage.setItem('sysRadioState', 'paused');
            window.sysRadio.pause();
            updateUI(false);
        }
    });

    window.addEventListener('pageshow', () => { setTimeout(attemptPlay, 100); });

    const resumeOnInteraction = () => {
        if (sessionStorage.getItem('sysRadioState') === 'playing' && window.sysRadio.paused) { attemptPlay(); }
    };

    window.addEventListener('click', resumeOnInteraction);
    window.addEventListener('keydown', resumeOnInteraction);
    window.addEventListener('touchstart', resumeOnInteraction);
})();