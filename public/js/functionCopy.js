document.addEventListener('click', event => {
    
    if (event.target.dataset.short_url) {
        const url = `${window.location.origin}/${event.target.dataset.short_url}`
        
        navigator.clipboard
            .writeText(url)
            .then(() => {
                console.log('Texto copiado en el portapapeles');
            })
            .catch((e) => {
                console.log('Ocurrio un error' + e);
            })
    }

        
})