window.addEventListener('load', () => {
    const saved = localStorage.getItem('thePlayer')
    let thePlayer = JSON.parse(saved)

    const Gameboard = { playingField: Array(9).fill("") }
    let cell = Gameboard.playingField
    let player = thePlayer.player
    let playerBot = thePlayer.bot
    const result = document.querySelector('.main__title')
    const indentation = document.querySelector('.indentation-from-the-top')
    const buttons = document.querySelectorAll('.block__game-element')
    const footerButton = document.querySelector('.footer__button').addEventListener('click', () => window.location.href = 'index.html')
    const clickSound = new Audio('./zvuk-nopki-v-kompyuternoy-igre1.mp3');
    const winnerSound = new Audio('./happy-wheels-z_uk-pobedy.mp3');
    const lossSound = new Audio('./49dfdef97d65e09.mp3');
    const drawSound = new Audio('./02d27084e8b480a.mp3');
    const listeners = new Map()
    const combination = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [2, 4, 6], [0, 4, 8]]
    let winnerCombo
    let botWinnerCombo
    let botIndex
    let botCell

    function bot() {
        const botWinnerCombination = combination.find(([a, b, c]) =>
            cell[a] === playerBot && cell[b] === playerBot && cell[c] === '' ||
            cell[a] === playerBot && cell[b] === '' && cell[c] === playerBot ||
            cell[a] === '' && cell[b] === playerBot && cell[c] === playerBot)
        const closePlayer = combination.find(([a, b, c]) =>
            cell[a] === player && cell[b] === player && cell[c] === '' ||
            cell[a] === player && cell[b] === '' && cell[c] === player ||
            cell[a] === '' && cell[b] === player && cell[c] === player)
        if (botWinnerCombination) {
            const [a, b, c] = botWinnerCombination
            if (cell[a] === '' && cell[b] === playerBot && cell[c] === playerBot) {
                cell[a] = playerBot
                botIndex = a
            } else if (cell[a] === playerBot && cell[b] === '' && cell[c] === playerBot) {
                cell[b] = playerBot
                botIndex = b
            } else if (cell[a] === playerBot && cell[b] === playerBot && cell[c] === '') {
                cell[c] = playerBot
                botIndex = c
            }
        } else if (closePlayer) {
            const [a, b, c] = closePlayer
            if (cell[a] === '' && cell[b] === player && cell[c] === player) {
                cell[a] = playerBot
                botIndex = a
            } else if (cell[a] === player && cell[b] === '' && cell[c] === player) {
                cell[b] = playerBot
                botIndex = b
            } else if (cell[a] === player && cell[b] === player && cell[c] === '') {
                cell[c] = playerBot
                botIndex = c
            }
        } else if (!botWinnerCombination && !closePlayer) {
            const availableIndexes = cell
                .map((value, index) => value === '' ? index : null)
                .filter(index => index !== null)

            if (availableIndexes.length > 0) {
                const randomIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)]
                cell[randomIndex] = playerBot
                botIndex = randomIndex
            }
        }
    }

    if (player === 'o') {
        bot()
        botCell = document.querySelector(`.game-button-${botIndex + 1}`)
        if (botCell) botCell.textContent = playerBot
    }

    function waitForPlayer() {
        return new Promise((resolve) => {
            buttons.forEach((btn, index) => {
                const listener = () => {
                    if (btn.textContent !== '') return alert("hush hush")
                    if (cell[index] !== '') return
                    btn.textContent = player
                    cell[index] = player
                    buttons.forEach(b => b.removeEventListener('click', listeners.get(b)))
                    winnerCombo = combination.find(([a, b, c]) => cell[a] !== '' && cell[a] === cell[b] && cell[a] === cell[c])
                    if (winnerCombo) {
                        indentation.classList.remove('indentation-from-the-top')
                        result.textContent = `You win!!!`
                        winnerSound.play()
                        return
                    } else if (cell.every(cell => cell !== '') && !winnerCombo) {
                        indentation.classList.remove('indentation-from-the-top')
                        result.textContent = `Looks like it's a draw`
                        drawSound.play()
                        return
                    }
                    clickSound.play();
                    resolve(cell)
                }
                listeners.set(btn, listener)
                btn.addEventListener('click', listener)
            })
        })
    }
    (async () => {
        while (true) {
            await waitForPlayer();
            bot()
            botCell = document.querySelector(`.game-button-${botIndex + 1}`)
            if (botCell) botCell.textContent = playerBot
            botWinnerCombo = combination.find(([a, b, c]) => cell[a] !== '' && cell[a] === cell[b] && cell[a] === cell[c])
            if (botWinnerCombo) {
                indentation.classList.remove('indentation-from-the-top')
                result.textContent = `You loce`
                lossSound.play()
                break;
            } else if (cell.every(cell => cell !== '') && !botWinnerCombo) {
                indentation.classList.remove('indentation-from-the-top')
                result.textContent = `Looks like it's a draw`
                drawSound.play()
                break;
            }

        }
    })()
})