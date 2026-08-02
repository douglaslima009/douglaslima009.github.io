/* js/scripts.js */
document.addEventListener('DOMContentLoaded', () => {
    
    // Objeto auxiliar abrangente para gerenciar singular/plural e tags dinâmicas
    const timeText = {
        'pt': {
            newTag: '!!! NOVO !!! ',
            hour: ' hora atrás',
            hours: ' horas atrás',
            day: ' dia atrás',
            days: ' dias atrás'
        },
        'en': {
            newTag: '!!! NEW !!! ',
            hour: ' hour ago',
            hours: ' hours ago',
            day: ' day ago',
            days: ' days ago'
        }
    };

    function initSystem() {
        // Puxa o idioma salvo, padrão é PT
        let currentLang = localStorage.getItem('siteLang') || 'pt';

        function updateLanguage(lang) {
            // Traduz os textos globais
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
            
            // Garante que o botão mostre sempre o idioma atual selecionado
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
                processTagsAndDates(currentLang); // Atualiza os "dias atrás" e a tag na troca
            });
        }
        
        processTagsAndDates(currentLang);
    }

    // Calcula Tag NEW e controle de Tempo (Horas e Dias)
    function processTagsAndDates(lang) {
        const DIAS_NOVO = 14;
        const msPorHora = 60 * 60 * 1000;
        const msPorDia = 24 * msPorHora;
        const threshold = DIAS_NOVO * msPorDia;
        const now = new Date();
        const items = document.querySelectorAll('[data-date]');

        items.forEach(item => {
            const dateStr = item.getAttribute('data-date');
            const timeStr = item.getAttribute('data-time');
            let itemDate;

            if (timeStr) {
                // Se tiver o atributo data-time, monta a data exata (ex: "2026-08-02T02:00:00")
                itemDate = new Date(`${dateStr}T${timeStr}:00`);
            } else {
                // Se NÃO tiver a hora, força a leitura no fuso horário LOCAL dividindo a string
                const [year, month, day] = dateStr.split('-');
                itemDate = new Date(year, month - 1, day);
            }
            
            if (!isNaN(itemDate)) {
                // Previne eventuais bugs de data no futuro dando o max de 0
                const diffTime = Math.max(0, now - itemDate); 
                const diffHours = Math.floor(diffTime / msPorHora);
                const diffDays = Math.floor(diffTime / msPorDia); 
                
                let timeString = '';

                // LÓGICA DE TEMPO: < 24h, == 1 dia, > 1 dia
                if (diffHours < 24) {
                    // Evita aparecer "0 horas atrás" logo no minuto que você posta
                    const displayHours = diffHours === 0 ? 1 : diffHours; 
                    timeString = displayHours + (displayHours === 1 ? timeText[lang].hour : timeText[lang].hours);
                } else if (diffDays === 1) {
                    timeString = '1' + timeText[lang].day;
                } else {
                    timeString = diffDays + timeText[lang].days;
                }
                
                // Aplica o texto de tempo
                const calcTimeContainer = item.querySelector('.calc-time');
                if(calcTimeContainer) {
                    calcTimeContainer.textContent = timeString;
                }

                // Injeta a Tag !!! NEW !!! (ou !!! NOVO !!!) se for recente
                if (diffTime < threshold) {
                    let newTag = item.querySelector('.tag-new');
                    
                    if(!newTag) {
                        newTag = document.createElement('span');
                        newTag.className = 'tag-new';
                        const spanContainer = item.querySelector('span');
                        if (spanContainer) spanContainer.prepend(newTag);
                    }
                    
                    // Altera o texto da tag dinamicamente dependendo da linguagem escolhida
                    newTag.textContent = timeText[lang].newTag;
                }
            }
        });
    }

    initSystem();
});