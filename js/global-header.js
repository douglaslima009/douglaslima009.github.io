/* js/global-header.js */
(function() {
    // Verifica a URL atual para injetar o "../" caso esteja em qualquer subpasta
    const url = window.location.href;
    const isInnerPage = url.includes('/works/') || url.includes('/registry/') || url.includes('/updates/');
    const prefix = isInnerPage ? '../' : '';

    const headerHTML = `
        <header>
            <h1 data-i18n="header-author">DOUGLAS LIMA</h1>
            
            <!-- Botão de Tradução -->
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
    
    document.getElementById('header-container').innerHTML = headerHTML;
})();