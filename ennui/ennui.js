ennui_start = document.getElementById('ennui_start')
ennui_loading = document.getElementById('ennui_loading')
ennui_error = document.getElementById('ennui_error')

ennui_start.addEventListener('click', () => {
    setTimeout(() => {
        ennui_loading.classList.add('show')
        ennui_start.classList.add('hidden')
        setTimeout(() => {
            ennui_loading.classList.remove('show')
            ennui_error.classList.add('show')
        }, 20000);
    }, 5000);
})