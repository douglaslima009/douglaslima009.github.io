/* js/scripts.js */
document.addEventListener('DOMContentLoaded', () => {
    /* =========================================
       1. SISTEMA AUTOMÁTICO DE TAGS "!!! NEW !!!"
       ========================================= */
    const DIAS_NOVO = 14;
    const threshold = DIAS_NOVO * 24 * 60 * 60 * 1000;
    const now = new Date();
    const items = document.querySelectorAll('[data-date]');

    items.forEach(item => {
        const itemDate = new Date(item.getAttribute('data-date'));
        if (!isNaN(itemDate) && (now - itemDate) < threshold) {
            const newTag = document.createElement('span');
            newTag.className = 'tag-new';
            newTag.textContent = '!!! NEW !!! ';
            const spanContainer = item.querySelector('span');
            if (spanContainer) spanContainer.prepend(newTag);
        }
    });

    /* =========================================
       2. SISTEMA DE INTERNACIONALIZAÇÃO (i18n)
       ========================================= */
    const langToggleButton = document.getElementById('lang-toggle');
    
    // Checa se o usuário já escolheu um idioma antes (salvo no navegador). Se não, usa PT.
    let currentLang = localStorage.getItem('siteLang') || 'pt';

    // Função que varre a página e traduz tudo
    function updateLanguage(lang) {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                // Preserva o conteúdo HTML interno (como as tags <strong> ou <a>) se existirem
                if(element.tagName === 'A' && element.children.length > 0) {
                     // Caso específico para manter a tag de data se o link a englobar
                } else {
                    element.innerHTML = translations[lang][key];
                }
            }
        });
        
        // Atualiza o texto do botão
        if(langToggleButton) {
            langToggleButton.textContent = lang === 'pt' ? '[ PT ]' : '[ EN ]';
        }
    }

    // Traduz a página imediatamente ao carregar
    updateLanguage(currentLang);

    // Evento de clique no botão de trocar idioma
    if (langToggleButton) {
        langToggleButton.addEventListener('click', () => {
            currentLang = currentLang === 'pt' ? 'en' : 'pt';
            localStorage.setItem('siteLang', currentLang); // Salva a escolha
            updateLanguage(currentLang);
        });
    }
});