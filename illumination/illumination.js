const illumination = document.getElementById('illumination')
let i = 0

const milkPosition = () => {
    let range = 20
    let signe = (Math.floor(Math.random() * 2) ? 1 : -1)
    return Math.round(Math.random() * range * signe)
}

const addMilk = () => {
    const milk = document.createElement('img')
    milk.id = i
    milk.src = 'milk.png'
    milk.alt = 'milk'
    milk.classList.add('milk')
    milk.style = (`right: ${milkPosition() + 4.75}rem;`)
    illumination.appendChild(milk)
}

const removeMilk = (id) => {
    child = document.getElementById(id)
    illumination.removeChild(child)
}

addMilk()

// while (true) {
//     setTimeout(() => {
//         i++
//         addMilk()
//         removeMilk(i -=)
//     }, 1000);
// }