/* js/global-header.js */
(function() {
    // Verifica se a página está dentro da subpasta de obras para arrumar o href
    const isInnerPage = window.location.pathname.includes('/works/');
    const prefix = isInnerPage ? '../' : '';

    const headerHTML = `
        <header>
            <h1 data-i18n="header-author">DOUGLAS LIMA</h1>
            
            <!-- O Botão de Idioma Fixo aqui no Header -->
            <button id="lang-toggle" class="lang-toggle"></button>
            
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
    
    // Injeta o cabeçalho no container vazio do HTML
    document.getElementById('header-container').innerHTML = headerHTML;
})();