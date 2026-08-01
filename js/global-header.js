/* js/global-header.js */
(function() {
    // Verifica a URL atual para injetar o "../" caso esteja em qualquer subpasta
    const url = window.location.href;
    const isInnerPage = url.includes('/works/') || url.includes('/registry/') || url.includes('/updates/');
    const prefix = isInnerPage ? '../' : '';

    const headerHTML = `
        <header style="margin-bottom: 40px; position: relative;">
            <div style="margin-bottom: 20px;">
                <h1 data-i18n="header-author" style="margin: 0;">
                    <a href="${prefix}index.html" style="color: inherit; text-decoration: none;">DOUGLAS LIMA</a>
                </h1>
            </div>
            
            <!-- CAIXA GLOBAL DE CONTROLES (Flutuando no topo direito) -->
            <div class="header-controls">
                
                <!-- Módulo de Áudio -->
                <div class="sys-audio-module">
                    <div id="sys-equalizer" class="equalizer">
                        <span class="eq-bar"></span>
                        <span class="eq-bar"></span>
                        <span class="eq-bar"></span>
                        <span class="eq-bar"></span>
                        <span class="eq-bar"></span>
                    </div>
                    <!-- Usa a nova classe unificada sys-btn -->
                    <button id="btn-sys-audio" class="sys-btn">[ PLAY ]</button>
                </div>

                <!-- Botão de Tradução (Usa a exata mesma classe sys-btn) -->
                <button id="lang-toggle" class="sys-btn"></button>
            </div>
            
            <nav class="nav-links">
                <a href="${prefix}index.html" data-i18n="nav-home">HOME</a>
                <a href="${prefix}about.html" data-i18n="nav-about">SOBRE</a>
                <a href="${prefix}works.html" data-i18n="nav-works">OBRAS</a>
                <a href="${prefix}registry.html" data-i18n="nav-registry">REGISTROS</a>
                <a href="${prefix}updates.html" data-i18n="nav-updates">UPDATES</a>
                <a href="${prefix}miscellaneous.html" data-i18n="nav-miscellaneous">MISCELÂNEAS</a>
                <a href="${prefix}contact.html" data-i18n="nav-contact">CONTATO</a>
            </nav>
        </header>
    `;
    
    document.getElementById('header-container').innerHTML = headerHTML;
    
    // SomaFM Def Con)
    const audioBtn = document.getElementById('btn-sys-audio');
    const equalizer = document.getElementById('sys-equalizer');
    
    if (!window.sysRadio) {
        window.sysRadio = new Audio('https://ice1.somafm.com/defcon-128-mp3');
        window.sysRadio.volume = 0.3; 
    }

    if (sessionStorage.getItem('sysRadioState') === 'playing') {
        window.sysRadio.play().then(() => {
            audioBtn.innerText = '[ STOP ]';
            equalizer.classList.add('playing');
        }).catch(() => {
            sessionStorage.setItem('sysRadioState', 'paused');
        });
    }

    audioBtn.addEventListener('click', () => {
        if (window.sysRadio.paused) {
            window.sysRadio.play();
            audioBtn.innerText = '[ STOP ]';
            equalizer.classList.add('playing');
            sessionStorage.setItem('sysRadioState', 'playing');
        } else {
            window.sysRadio.pause();
            audioBtn.innerText = '[ PLAY ]';
            equalizer.classList.remove('playing');
            sessionStorage.setItem('sysRadioState', 'paused');
        }
    });

})();