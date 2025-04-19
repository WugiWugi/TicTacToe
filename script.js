const clickSound = new Audio('./zvuk-nopki-v-kompyuternoy-igre1.mp3');
function waitForClick() {
    return new Promise((resolve) => {
        document.querySelectorAll('.main__button').forEach((btn) => {
            btn.addEventListener('click', () => {
                btn.matches('.button-x') ? resolve('x') : resolve('o')
                clickSound.play()
                setTimeout(() => {
                    window.location.href = 'gamePage.html'
                }, 100);
            });
        });
    });
}

(async () => {
    const choice = await waitForClick();
    const thePlayer = {
        player: choice,
        bot: choice === 'x' ? 'o' : 'x'
    }
    localStorage.setItem('thePlayer', JSON.stringify(thePlayer))
})()