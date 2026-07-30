/* js/scripts.js */
document.addEventListener('DOMContentLoaded', () => {
    
    // Objeto auxiliar para o texto "dias atrás"
    const timeText = {
        'pt': ' dias atrás',
        'en': ' days ago'
    };

    function initSystem() {
        // Puxa o idioma salvo, padrão é PT
        let currentLang = localStorage.getItem('siteLang') || 'pt';

        function updateLanguage(lang) {
            // Traduz os textos
            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');
                if (translations[lang] && translations[lang][key]) {
                    // Impede que a injeção quebre links e spans internos
                    if(element.tagName === 'A' && element.children.length > 0) {
                        // Preserva
                    } else {
                        element.innerHTML = translations[lang][key];
                    }
                }
            });
            
            // Garante que o botão mostre sempre o idioma de DESTINO
            const langBtn = document.getElementById('lang-toggle');
            if(langBtn) {
                langBtn.textContent = lang === 'pt' ? '[ PT ]' : '[ EN ]';
            }
        }

        // Executa a primeira tradução ao carregar a página
        updateLanguage(currentLang);

        // Adiciona a funcionalidade de clique no botão
        const langBtn = document.getElementById('lang-toggle');
        if (langBtn) {
            langBtn.addEventListener('click', () => {
                currentLang = currentLang === 'pt' ? 'en' : 'pt';
                localStorage.setItem('siteLang', currentLang);
                updateLanguage(currentLang);
                processTagsAndDates(currentLang); // Atualiza também os "dias atrás"
            });
        }
        
        processTagsAndDates(currentLang);
    }

    // Calcula Tag NEW e Dias Atrás
    function processTagsAndDates(lang) {
        const DIAS_NOVO = 14;
        const msPorDia = 24 * 60 * 60 * 1000;
        const threshold = DIAS_NOVO * msPorDia;
        const now = new Date();
        const items = document.querySelectorAll('[data-date]');

        items.forEach(item => {
            const itemDate = new Date(item.getAttribute('data-date'));
            
            if (!isNaN(itemDate)) {
                const diffTime = Math.abs(now - itemDate);
                const diffDays = Math.ceil(diffTime / msPorDia); 
                
                // Atualiza o texto dos dias decorridos
                const calcTimeContainer = item.querySelector('.calc-time');
                if(calcTimeContainer) {
                    calcTimeContainer.textContent = diffDays + timeText[lang];
                }

                // Injeta a Tag !!! NEW !!! se a postagem for recente
                if ((now - itemDate) < threshold) {
                    if(!item.querySelector('.tag-new')) {
                        const newTag = document.createElement('span');
                        newTag.className = 'tag-new';
                        newTag.textContent = '!!! NEW !!! ';
                        const spanContainer = item.querySelector('span');
                        if (spanContainer) spanContainer.prepend(newTag);
                    }
                }
            }
        });
    }

    initSystem();
});