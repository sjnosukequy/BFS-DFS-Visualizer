let themes = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
    "dim",
    "nord",
    "sunset"
]

// Custom Theme
for (let i in themes) {
    let k = document.createElement("li")
    let a = document.createElement("a")
    a.innerText = themes[i]
    a.addEventListener("click", () => {
        localStorage.setItem("theme", a.innerText);
        document.getElementsByTagName("html")[0].setAttribute("data-theme", a.innerText)
    })
    k.appendChild(a)
    document.getElementById('List_Theme').appendChild(k)
}

let theme = localStorage.getItem("theme")
if (theme == null)
    localStorage.setItem("theme", 'dark');
else
    document.getElementsByTagName("html")[0].setAttribute("data-theme", theme)