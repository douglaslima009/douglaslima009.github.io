/* js/global-header.js */
(function() {
    // Verifica a URL atual para injetar o "../" caso esteja em qualquer subpasta
    const url = window.location.href;
   const isInnerPage = url.includes('/catalogue/') || url.includes('/registry/') || url.includes('/updates/') || url.includes('/misc/');
    const prefix = isInnerPage ? '../' : '';

    const headerHTML = `
        <header style="margin-bottom: 40px; position: relative;">
            <div style="margin-bottom: 20px;">
                <h1 data-i18n="header-author" style="margin: 0;">
                    <a href="${prefix}index.html" style="color: inherit; text-decoration: none;">DOUGLAS LIMA.</a>
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
                    <button id="btn-sys-audio" class="sys-btn">[ PLAY ]</button>
                </div>

                <!-- Botão de Tradução -->
                <button id="lang-toggle" class="sys-btn"></button>
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
    
    // Configuração do Áudio
    const audioBtn = document.getElementById('btn-sys-audio');
    const equalizer = document.getElementById('sys-equalizer');
    
    if (!window.sysRadio) {
        window.sysRadio = new Audio('https://ice1.somafm.com/defcon-128-mp3');
        window.sysRadio.volume = 0.3; 
    }

    // Função para atualizar os visuais (Equalizador e Botão)
    function updateUI(isPlaying) {
        if (isPlaying) {
            audioBtn.innerText = '[ STOP ]';
            equalizer.classList.add('playing');
        } else {
            audioBtn.innerText = '[ PLAY ]';
            equalizer.classList.remove('playing');
        }
    }

    // Função que tenta dar o play e lida com bloqueios do navegador
    function attemptPlay() {
        if (sessionStorage.getItem('sysRadioState') === 'playing') {
            window.sysRadio.play().then(() => {
                updateUI(true);
            }).catch(() => {
                // Se o navegador bloquear o autoplay pelo botão voltar, 
                // a UI fica pausada esperando a interação do usuário.
                updateUI(false); 
            });
        }
    }

    // 1. Tenta rodar ao carregar a página normalmente
    attemptPlay();

    // 2. Controle manual no botão
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

    // 3. SOLUÇÃO PARA O BOTÃO VOLTAR (BFCache)
    // Tenta forçar o play assim que a página é descongelada
    window.addEventListener('pageshow', () => {
        setTimeout(attemptPlay, 100);
    });

    // 4. A ARMADILHA (Recuperação de Interação)
    // Se o usuário clicar em "Voltar" e o navegador forçar o bloqueio do som,
    // nós ficamos observando. No primeiro clique que ele der na tela, o som volta.
    const resumeOnInteraction = () => {
        if (sessionStorage.getItem('sysRadioState') === 'playing' && window.sysRadio.paused) {
            attemptPlay();
        }
    };

    window.addEventListener('click', resumeOnInteraction);
    window.addEventListener('keydown', resumeOnInteraction);
    window.addEventListener('touchstart', resumeOnInteraction);

})();