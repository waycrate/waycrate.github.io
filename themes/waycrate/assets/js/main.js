window.addEventListener('load', function() {
  const menuOpen = document.querySelector("#menuOpen")
  const menuClose = document.querySelector("#menuClose")
  const menu = document.querySelector("#menu")
  menuOpen.addEventListener('click', () => {
    menu.classList.remove("-translate-x-80")
    menu.classList.add("shadow-[0_100px_100px_0_rgba(0,0,0,0.5)]")
  })
  menuClose.addEventListener('click', () => {
    menu.classList.add("-translate-x-80")
    menu.classList.remove("shadow-[0_100px_100px_0_rgba(0,0,0,0.5)]")
  })

const bodyClx = document.documentElement.classList;
const btnDark = document.querySelector('#btn-dark');
const sysDark = window.matchMedia('(prefers-color-scheme: dark)');
const darkVal = localStorage.getItem('dark');

const setDark = isDark => (bodyClx.toggle('dark', isDark), localStorage.setItem('dark', isDark));

setDark(darkVal ? darkVal === 'true' : sysDark.matches);
requestAnimationFrame(() => bodyClx.remove('not-ready'));

btnDark.addEventListener('click', () => setDark(!bodyClx.contains('dark')));
sysDark.addEventListener('change', ({ matches }) => setDark(matches));
  
})
