let ysdk = null

const isYandexGames = typeof YaGames !== "undefined"

console.log("Яндекс SDK доступен:", isYandexGames)

if (typeof YaGames !== "undefined") {

	YaGames.init()
		.then((_ysdk) => {

			ysdk = _ysdk

			console.log("Yandex Games SDK подключён")

			if (
				document.querySelector(".game")?.style.display === "flex"
			) {
				startYandexGameplay()
			}

		})
		.catch((error) => {

			console.error(
				"Ошибка Yandex Games SDK:",
				error
			)

		})

}


function startYandexGameplay() {

	if (!ysdk?.features?.GameplayAPI) {
		console.log("⚠️ GameplayAPI ещё не готов")
		return
	}

	ysdk.features.GameplayAPI.start()

	console.log("🎮 Yandex Gameplay START")

}


function stopYandexGameplay() {

	if (!ysdk?.features?.GameplayAPI) {
		console.log("⚠️ GameplayAPI ещё не готов")
		return
	}

	ysdk.features.GameplayAPI.stop()

	console.log("⏸️ Yandex Gameplay STOP")

}


function pauseGame() {

	if (isGamePaused) {
		return
	}

	isGamePaused = true

	pauseGameAudio()
	stopYandexGameplay()

	console.log("⏸️ ИГРА НА ПАУЗЕ")

}


function resumeGame() {

	if (!isGamePaused) {
		return
	}

	isGamePaused = false

	resumeGameAudio()
	startYandexGameplay()

	console.log("▶️ ИГРА ПРОДОЛЖЕНА")

}

console.log("VERITY GAME ЗАПУЩЕН")

// ==============================
// СОСТОЯНИЕ ИГРЫ
// ==============================

let inventory = {}
let messages = []

let isGamePaused = false

let hintCharges = 0
let hintShown = false

let gameFinished = false

let currentDialogue = "start"

let anger = 0
let lives = 3

let lifeRestoreAvailable = false
let isLifeLostMenuOpen = false

let specialChoiceUnlocked = false
let specialChoiceUsed = false

let dialogueData = {}

let isWaitingForReply = false

// Защита от слишком частых эффектов
let horrorEffectCooldown = false
let screamerCooldown = false








const backgroundMusic =
	new Audio("sounds/music/background.mp3")

backgroundMusic.loop = true
backgroundMusic.volume = 0.15


const buttonClickSound =
	new Audio("sounds/ui/click.mp3")

buttonClickSound.volume = 0.35


const verityMessageSound =
	new Audio("sounds/special/soo-veriti_ELxcJg3J.wav")

verityMessageSound.volume = 0.25


const playerMessageSound =
	new Audio("sounds/special/soo-igroka_LJyyCFq6.wav")

playerMessageSound.volume = 0.18


const hintSound =
	new Audio("sounds/special/hint.wav")

hintSound.volume = 0.25



const specialChoiceSound =
	new Audio("sounds/special/dlia-tretego-vybora_o0nPT0Jb.wav")

specialChoiceSound.volume = 0.3


const lifeLostSound =
	new Audio("sounds/special/life-lost.wav")

lifeLostSound.volume = 0.3



const lifeRestoreSound =
	new Audio("sounds/special/life-restore.wav")

lifeRestoreSound.volume = 0.25


const itemGetSound =
	new Audio("sounds/special/item-reward.wav")

itemGetSound.volume = 0.25


const glitchSound =
	new Audio("sounds/horror/glitch.wav")

glitchSound.volume = 0.2


const hardGlitchSound =
	new Audio("sounds/horror/strong-glitch.wav")

hardGlitchSound.volume = 0.2


const screamerSound =
	new Audio("sounds/special/screamer.wav")

screamerSound.volume = 0.7


function playScreamerSound() {

	screamerSound.currentTime = 0

	screamerSound.play().catch(error => {
		console.log(
			"Ошибка звука скримера:",
			error
		)
	})
}


const adLoadingSound =
	new Audio("sounds/special/ad-loading.wav")

adLoadingSound.volume = 0.2



const randomSounds = [
	new Audio("sounds/horror/temnicu-zakryli_[Pro-Sound.org].mp3"),
	new Audio("sounds/horror/zvuk-dlya-horrora-zloveshchee-rydanie-2_[Pro-Sound.org].wav"),
	new Audio("sounds/horror/voices.mp3"),
	new Audio("sounds/horror/whisper.mp3")
]


const gameSounds = [
	backgroundMusic,
	buttonClickSound,
	verityMessageSound,
	playerMessageSound,
	hintSound,
	specialChoiceSound,
	lifeLostSound,
	lifeRestoreSound,
	itemGetSound,
	glitchSound,
	hardGlitchSound,
	screamerSound,
	adLoadingSound,
	...randomSounds
]

function pauseGameAudio() {
	gameSounds.forEach(sound => {
		sound.pause()
	})
}

function resumeGameAudio() {
	if (musicStarted) {
		backgroundMusic.play().catch(() => { })
	}
}


let musicStarted = false

function startBackgroundMusic() {

	if (musicStarted) {
		return
	}

	backgroundMusic.play()
	musicStarted = true
}

window.addEventListener('click', () => {
	backgroundMusic.play().catch(error => {
		console.log("Автозапуск заблокирован браузером:", error);
	});
}, { once: true }); // Срабатывает только один раз

function playButtonClick() {

	if (isGamePaused) {
		return
	}

	buttonClickSound.currentTime = 0
	buttonClickSound.play()

}


function playVerityMessageSound() {
	if (isGamePaused) {
		return
	}

	verityMessageSound.currentTime = 0

	verityMessageSound.play().catch(error => {
		console.log("Ошибка звука Верити:", error)
	})
}


function playPlayerMessageSound() {
	if (isGamePaused) {
		return
	}

	playerMessageSound.currentTime = 0

	playerMessageSound.play().catch(error => {
		console.log("Ошибка звука игрока:", error)
	})
}


function playHintSound() {

	if (isGamePaused) {
		return
	}

	hintSound.currentTime = 0

	hintSound.play().catch(error => {
		console.log("Ошибка звука подсказки:", error)
	})
}


function playSpecialChoiceSound() {

	if (isGamePaused) {
		return
	}

	specialChoiceSound.currentTime = 0

	specialChoiceSound.play().catch(error => {
		console.log("Ошибка звука особого выбора:", error)
	})
}


function playLifeLostSound() {

	if (isGamePaused) {
		return
	}

	lifeLostSound.currentTime = 0

	lifeLostSound.play().catch(error => {
		console.log("Ошибка звука потери жизни:", error)
	})
}


function playLifeRestoreSound() {

	if (isGamePaused) {
		return
	}

	lifeRestoreSound.currentTime = 0

	lifeRestoreSound.play().catch(error => {
		console.log("Ошибка звука восстановления жизни:", error)
	})
}


function playItemGetSound() {

	if (isGamePaused) {
		return
	}

	itemGetSound.currentTime = 0

	itemGetSound.play().catch(error => {
		console.log("Ошибка звука получения предмета:", error)
	})
}



function playGlitchSound() {

	if (isGamePaused) {
		return
	}

	glitchSound.currentTime = 0

	glitchSound.play().catch(error => {
		console.log("Ошибка звука глитча:", error)
	})
}


function playHardGlitchSound() {

	if (isGamePaused) {
		return
	}

	hardGlitchSound.currentTime = 0

	hardGlitchSound.play().catch(error => {
		console.log(
			"Ошибка звука жесткого глитча:",
			error
		)
	})
}


function playAdLoadingSound() {

	if (isGamePaused) {
		return
	}

	adLoadingSound.currentTime = 0

	adLoadingSound.play().catch(error => {
		console.log(
			"Ошибка звука загрузки рекламы:",
			error
		)
	})
}




function playRandomSound() {
	if (isGamePaused) {
		return
	}

	const randomIndex =
		Math.floor(Math.random() * randomSounds.length)

	const sound = randomSounds[randomIndex]

	sound.currentTime = 0
	sound.play().catch(error => {
		console.log("Ошибка случайного звука:", error)
	})
}


setInterval(() => {
	playRandomSound()
}, 60000)






// ==============================
// НАСТРОЙКИ
// ==============================

const MAX_ANGER = 10
const MAX_LOVE = 30

// ==============================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ==============================

function sleep(ms) {

	return new Promise(resolve => {

		let elapsed = 0
		const step = 50

		const timer = setInterval(() => {

			if (!isGamePaused) {

				elapsed += step

			}

			if (elapsed >= ms) {

				clearInterval(timer)
				resolve()

			}

		}, step)

	})

}

function showLifeLostMenu() {

	playLifeLostSound()

	const menu =
		document.getElementById("lifeLostMenu")

	const hearts =
		document.getElementById("lifeLostHearts")

	if (!menu) {
		return
	}

	isLifeLostMenuOpen = true
	lifeRestoreAvailable = true

	if (hearts) {

		hearts.innerHTML = ""

		for (let i = 0; i < 3; i++) {

			const img =
				document.createElement("img")

			img.src =
				i < lives
					? "images/heart.png"
					: "images/bad-heart.png"

			img.alt = ""

			hearts.appendChild(img)
		}
	}

	menu.classList.add("active")
}

function hideLifeLostMenu() {

	const menu =
		document.getElementById(
			"lifeLostMenu"
		)

	if (!menu) {
		return
	}


	menu.classList.remove("active")

	isLifeLostMenuOpen = false

}

function restoreLostLife() {

	if (!lifeRestoreAvailable) {
		return
	}


	if (lives >= 3) {

		hideLifeLostMenu()

		return

	}


	console.log(
		"Запуск рекламы для восстановления жизни"
	)


	const button =
		document.getElementById(
			"restoreLifeButton"
		)

	if (button) {

		button.disabled = true

		button.innerHTML =
			"📺 Загрузка рекламы..."

	}

	if (!ysdk) {

		console.error(
			"Yandex Games SDK ещё не готов"
		)

		if (button) {

			button.disabled = false

			button.innerHTML =
				"❤️ Восстановить жизнь"

		}

		return
	}

	let lifeRewarded = false

	ysdk.adv.showRewardedVideo({

		callbacks: {

			onOpen: () => {

				console.log(
					"📺 Реклама восстановления жизни открыта"
				)

				pauseGameAudio()
				stopYandexGameplay()
			},

			onRewarded: () => {

				console.log(
					"✨ Реклама просмотрена, выдаём жизнь"
				)

				lives = Math.min(
					lives + 1,
					3
				)

				lifeRewarded = true

				lifeRestoreAvailable = false

				saveGame()

				updateGameUI()

				console.log(
					"❤️ Жизнь восстановлена",
					lives
				)
			},

			onClose: (wasShown) => {

				resumeGameAudio()
				startYandexGameplay()

				if (lifeRewarded) {
					playLifeRestoreSound()
				}

				console.log(
					"📺 Реклама закрыта:",
					wasShown
				)

				if (
					lifeRestoreAvailable &&
					button
				) {

					button.disabled = false

					button.innerHTML =
						"❤️ Восстановить жизнь"

				} else {

					hideLifeLostMenu()

				}
			},

			onError: (error) => {

				resumeGameAudio()

				console.error(
					"Ошибка рекламы:",
					error
				)

				if (button) {

					button.disabled = false

					button.innerHTML =
						"❤️ Восстановить жизнь"

				}
			}
		}
	})

}


function unlockSpecialChoice() {
	if (isWaitingForReply || isLifeLostMenuOpen) return

	const dialogue = dialogueData[currentDialogue]

	if (!dialogue?.specialChoice) return
	if (specialChoiceUnlocked || specialChoiceUsed) return

	console.log("📺 Запуск рекламы для особого выбора")

	const button =
		document.getElementById(
			"special-ad-button"
		)

	if (button) {
		button.disabled = true
		playAdLoadingSound()
		button.textContent = "📺 Загрузка рекламы..."
	}

	// Если SDK ещё не загрузился
	if (!ysdk) {
		console.error("Yandex Games SDK ещё не готов")

		if (button) {
			button.disabled = false
			button.textContent = "📺 Посмотреть рекламу"
		}

		return
	}

	let specialRewarded = false

	ysdk.adv.showRewardedVideo({

		callbacks: {

			onOpen: () => {
				console.log("📺 Реклама открыта")
				pauseGameAudio()
				stopYandexGameplay()
			},

			onRewarded: () => {

				console.log("✨ Реклама просмотрена, выдаём награду")

				specialChoiceUnlocked = true

				specialRewarded = true

				if (specialChoiceButton) {

					specialChoiceButton.classList.remove(
						"glitching"
					)

					void specialChoiceButton.offsetWidth

					specialChoiceButton.classList.add(
						"glitching"
					)

					setTimeout(() => {

						specialChoiceButton.classList.remove(
							"glitching"
						)

					}, 500)
				}

				renderDialogue()
			},

			onClose: (wasShown) => {

				resumeGameAudio()
				startYandexGameplay()

				if (specialRewarded) {
					playSpecialChoiceSound()
				}

				console.log(
					"📺 Реклама закрыта:",
					wasShown
				)

				if (!specialChoiceUnlocked && button) {
					button.disabled = false
					button.textContent =
						"📺 Посмотреть рекламу"
				}
			},

			onError: (error) => {

				resumeGameAudio()

				console.error(
					"Ошибка рекламы:",
					error
				)

				if (button) {
					button.disabled = false
					button.textContent =
						"📺 Посмотреть рекламу"
				}
			}
		}
	})
}


function continueAfterLifeLost() {

	console.log(
		"Игрок решил продолжить без восстановления"
	)


	lifeRestoreAvailable = false

	hideLifeLostMenu()


	// Если жизни закончились

	if (lives <= 0) {

		console.log(
			"💀 GAME OVER"
		)

		showGameOver()

		return

	}


	saveGame()

	updateGameUI()

}


function showGameOver() {

	console.log("💀 GAME OVER")

	const gameOver =
		document.getElementById("gameOver")

	if (!gameOver) {
		console.error("❌ #gameOver не найден")
		return
	}

	gameOver.classList.add("active")
}


const restoreLifeButton =
	document.getElementById(
		"restoreLifeButton"
	)

const continueAfterDeathButton =
	document.getElementById(
		"continueAfterDeathButton"
	)


if (restoreLifeButton) {

	restoreLifeButton.addEventListener(
		"click",
		() => {
			playButtonClick()
			restoreLostLife()
		}
	)

}


if (continueAfterDeathButton) {

	continueAfterDeathButton.addEventListener(
		"click",
		() => {
			playButtonClick()
			continueAfterLifeLost()
		}
	)

}

// ==============================
// СОХРАНЕНИЕ
// ==============================

function saveGame() {

	const gameData = {
		inventory: inventory,
		messages: messages,
		currentDialogue: currentDialogue,
		anger: anger,
		lives: lives,
		gameFinished: gameFinished
	}

	localStorage.setItem(
		"verityGame",
		JSON.stringify(gameData)
	)
}


function loadGame() {

	const savedGame =
		localStorage.getItem("verityGame")

	if (!savedGame) {
		return
	}

	try {

		const gameData =
			JSON.parse(savedGame)

		inventory =
			gameData.inventory ?? {}

		messages =
			gameData.messages ?? []

		currentDialogue =
			gameData.currentDialogue ?? "start"

		anger =
			gameData.anger ?? 0

		lives =
			gameData.lives ?? 3

		gameFinished =
			gameData.gameFinished ?? false

	} catch (error) {

		console.error(
			"Ошибка загрузки сохранения:",
			error
		)

	}
}




// ==============================
// ДИАЛОГ
// ==============================

async function loadDialogue() {

	try {

		const response =
			await fetch("data/dialogue.json")

		if (!response.ok) {

			throw new Error(
				"Не удалось загрузить dialogue.json"
			)

		}

		dialogueData =
			await response.json()

		if (
			messages.length === 0 &&
			dialogueData[currentDialogue]?.verity
		) {

			addMessage(
				"verity",
				dialogueData[currentDialogue].verity
			)

		}

		renderDialogue()

		if (ysdk?.features?.LoadingAPI) {
			ysdk.features.LoadingAPI.ready()
		}

	} catch (error) {

		console.error(
			"Ошибка загрузки диалога:",
			error
		)

	}
}


function getHint(dialogue) {

	const choice1 =
		dialogue.choices[0]

	const choice2 =
		dialogue.choices[1]

	if (!choice1 || !choice2) {
		return ""
	}

	if (choice1.anger < choice2.anger) {

		return "Кажется, первый ответ может немного успокоить Верити."

	}

	if (choice2.anger < choice1.anger) {

		return "Кажется, второй ответ может немного успокоить Верити."

	}

	return "Похоже, Верити отреагирует на оба ответа примерно одинаково."
}

function unlockHint() {
	if (isWaitingForReply || isLifeLostMenuOpen) {
		return
	}

	if (hintCharges > 0) {
		if (hintShown) {
			return
		}

		showHint()
		return
	}

	const dialogue = dialogueData[currentDialogue]

	if (!dialogue?.choices?.length) {
		return
	}

	const button = document.getElementById("hint-button")

	if (!button) {
		console.error("❌ Кнопка подсказки не найдена")
		return
	}

	button.disabled = true

	playAdLoadingSound()

	button.classList.add("loading")
	button.textContent = "📺 Загрузка рекламы..."

	let hintRewarded = false

	if (!ysdk) {
		console.error("Yandex Games SDK ещё не готов")

		button.disabled = false
		button.classList.remove("loading")
		button.textContent = "💡 Подсказка"

		return
	}

	ysdk.adv.showRewardedVideo({
		callbacks: {

			onOpen: () => {
				console.log("📺 Реклама подсказки открыта")
				pauseGameAudio()
				stopYandexGameplay()
			},

			onRewarded: () => {
				console.log("💡 Реклама просмотрена, выдаём подсказки")

				hintCharges = 3
				hintShown = false
				hintRewarded = true

				saveGame()
				updateHintButton()
			},

			onClose: (wasShown) => {

				resumeGameAudio()
				startYandexGameplay()

				button.disabled = false
				button.classList.remove("loading")

				if (hintRewarded) {
					showHint()
				} else {
					button.textContent = "💡 Подсказка"
				}
			},

			onError: (error) => {
				console.error("❌ Ошибка рекламы подсказки:", error)

				resumeGameAudio()

				button.disabled = false
				button.classList.remove("loading")
				button.textContent = "💡 Подсказка"
			}
		}
	})
}

function showHint() {

	console.log("💡 showHint() запустилась")

	if (hintCharges <= 0) {
		console.log("❌ hintCharges =", hintCharges)
		return
	}

	const dialogue = dialogueData[currentDialogue]

	console.log("📖 dialogue =", dialogue)

	if (!dialogue?.choices?.length) {
		console.log("❌ У текущего диалога нет choices")
		return
	}

	const message = document.getElementById("hint-message")

	console.log("🔎 hint-message =", message)

	if (!message) {
		console.error("❌ Элемент #hint-message НЕ НАЙДЕН")
		return
	}

	const hint = getHint(dialogue)

	console.log("💡 Подсказка =", hint)

	hintCharges--
	hintShown = true

	message.textContent = hint
	message.style.display = "block"

	playHintSound()

	updateHintButton()
}

function updateHintButton() {

	const button =
		document.getElementById("hint-button")

	if (!button) {
		return
	}

	if (hintCharges > 0) {

		button.disabled = false

		button.innerHTML =
			`<span class="hint-icon">?</span>
			 <span>ПОДСКАЗКА • ${hintCharges}</span>`

	} else {

		button.disabled = false

		button.innerHTML =
			`<span class="hint-icon">?</span>
			 <span>ПОДСКАЗКА</span>`
	}
}



function renderDialogue() {


	const dialogue =
		dialogueData[currentDialogue]

	if (!dialogue) {

		console.error(
			"Диалог не найден:",
			currentDialogue
		)

		return
	}


	const choice1 =
		document.getElementById("choice1")

	const choice2 =
		document.getElementById("choice2")

	const hintButton =
		document.getElementById(
			"hint-button"
		)

	const hintMessage =
		document.getElementById(
			"hint-message"
		)

	const specialChoiceWrapper =
		document.getElementById(
			"special-choice-wrapper"
		)

	const specialChoiceWarning =
		document.getElementById(
			"special-choice-warning"
		)

	const specialAdButton =
		document.getElementById(
			"special-ad-button"
		)

	const specialChoiceButton =
		document.getElementById(
			"special-choice"
		)


	if (!choice1 || !choice2) {
		return
	}


	// ==============================
	// ОБЫЧНЫЕ ВЫБОРЫ
	// ==============================

	choice1.textContent =
		dialogue.choices[0]?.text ?? ""

	choice2.textContent =
		dialogue.choices[1]?.text ?? ""


	choice1.style.display =
		dialogue.choices[0]
			? "block"
			: "none"

	choice2.style.display =
		dialogue.choices[1]
			? "block"
			: "none"


	// ==============================
	// ОСОБЫЙ ВЫБОР
	// ==============================

	if (specialChoiceButton) {
		specialChoiceButton.style.display = "none"
	}

	if (specialAdButton) {
		specialAdButton.style.display = "none"
		specialAdButton.disabled = false
		specialAdButton.textContent = "📺 Посмотреть рекламу"
	}


	if (specialChoiceWrapper) {

		specialChoiceWrapper.classList.add(
			"hidden"
		)

	}


	// ==============================
	// ЕСЛИ ЕСТЬ ОСОБЫЙ ВЫБОР
	// ==============================

	if (
		dialogue.specialChoice &&
		!specialChoiceUsed
	) {

		if (specialChoiceWrapper) {

			specialChoiceWrapper.classList.remove(
				"hidden"
			)

		}


		// ==========================
		// УЖЕ ПОСМОТРЕЛ РЕКЛАМУ
		// ==========================

		if (specialChoiceUnlocked) {

			if (specialChoiceButton) {

				specialChoiceButton.textContent =
					dialogue.specialChoice.text

				specialChoiceButton.style.display =
					"block"

			}


			if (specialChoiceWarning) {

				specialChoiceWarning.textContent =
					"Я НЕ ПОМНЮ, ЧТОБЫ ТЫ МОГ ЭТО ВЫБРАТЬ."

			}

		}


		// ==========================
		// РЕКЛАМА ЕЩЁ НЕ ПРОСМОТРЕНА
		// ==========================

		else {

			if (specialChoiceWarning) {

				specialChoiceWarning.textContent =
					"// ЭТОГО ВЫБОРА НЕ ДОЛЖНО БЫТЬ"

			}


			if (specialAdButton) {

				specialAdButton.style.display =
					"block"

			}

		}

	}


	updateGameUI()

}


// ==============================
// ВЫБОР ДИАЛОГА
// ==============================

async function chooseDialogue(index) {

	if (isWaitingForReply || isLifeLostMenuOpen) {
		return
	}

	const dialogue =
		dialogueData[currentDialogue]

	if (!dialogue) {
		return
	}

	let choice

	if (index === 2) {
		if (!dialogue.specialChoice) return
		if (!specialChoiceUnlocked) return
		if (specialChoiceUsed) return

		choice = dialogue.specialChoice
		specialChoiceUsed = true
	} else {
		choice = dialogue.choices[index]
	}

	if (!choice) return

	specialChoiceUnlocked = false
	specialChoiceUsed = false

	// ==========================
	// БЛОКИРУЕМ КНОПКИ
	// ==========================

	isWaitingForReply = true

	const choice1 =
		document.getElementById("choice1")

	const choice2 =
		document.getElementById("choice2")

	if (choice1) {
		choice1.disabled = true
	}

	if (choice2) {
		choice2.disabled = true
	}


	// ==========================
	// СООБЩЕНИЕ ИГРОКА
	// ==========================

	playPlayerMessageSound()
	addMessage(
		"user",
		choice.text
	)


	// ==========================
	// ИЗМЕНЕНИЕ ОТНОШЕНИЙ
	// ==========================

	changeRelationship(
		choice.anger ?? 0
	)


	console.log(
		"После выбора:",
		{
			anger: anger,
			love: getLove(),
			relationship: getRelationship().type,
			horror: getHorrorLevel(),
			lives: lives
		}
	)


	// ==========================
	// ХОРРОР ПОСЛЕ ВЫБОРА
	// ==========================

	processAngerHorror()


	// ==========================
	// ПЕРЕХОД
	// ==========================

	hintShown = false

	currentDialogue = choice.next

	specialChoiceUnlocked = false
	specialChoiceUsed = false

	hintShown = false

	const hintMessage =
		document.getElementById("hint-message")

	if (hintMessage) {
		hintMessage.style.display = "none"
	}

	renderDialogue()




	// ==========================
	// ВЕРИТИ ПЕЧАТАЕТ
	// ==========================

	showTyping()


	const replyDelay =
		Math.random() * 700 + 700

	await sleep(replyDelay)


	hideTyping()


	// ==========================
	// ЕЩЁ ОДНА ПРОВЕРКА ХОРРОРА
	// ==========================

	processAngerHorror()


	const nextDialogue =
		dialogueData[currentDialogue]


	if (nextDialogue?.verity) {

		showVerityMessage(
			nextDialogue.verity
		)

	}

	if (
		nextDialogue &&
		(!nextDialogue.choices || nextDialogue.choices.length === 0)
	) {

		console.log("💀 ДОСТИГНУТ КОНЕЦ ДИАЛОГА")

		setTimeout(() => {
			triggerFinalScreamer()
		}, 1500)

		return
	}


	// ==========================
	// ПРОВЕРКА МАКСИМАЛЬНОЙ ЗЛОСТИ
	// ==========================

	checkRelationship()


	saveGame()

	renderDialogue()


	// ==========================
	// РАЗБЛОКИРУЕМ КНОПКИ
	// ==========================

	isWaitingForReply = false

	if (choice1) {
		choice1.disabled = false
	}

	if (choice2) {
		choice2.disabled = false
	}

}


function triggerFinalScreamer() {

	console.log("💀 ИГРА ОКОНЧЕНА")

	gameFinished = true

	lives = 0

	saveGame()
	updateGameUI()

	setTimeout(() => {

		playScreamerSound()

		const screamer =
			document.getElementById("verityScreamer")

		if (!screamer) return

		screamer.classList.remove("active")

		void screamer.offsetWidth

		screamer.classList.add("active")

	}, 300)

	setTimeout(() => {

		showGameOver()

	}, 1200)
}

// ==============================
// СООБЩЕНИЯ
// ==============================

function showTyping() {

	const messagesContainer =
		document.getElementById("messages")

	if (!messagesContainer) {
		return
	}

	const typing =
		document.createElement("div")

	typing.classList.add(
		"message",
		"verity",
		"typing-message"
	)

	typing.id =
		"verityTyping"

	typing.innerHTML = `
		<div class="typing">
			<span></span>
			<span></span>
			<span></span>
		</div>
	`

	messagesContainer.appendChild(typing)

	messagesContainer.scrollTop =
		messagesContainer.scrollHeight
}


function hideTyping() {

	const typing =
		document.getElementById(
			"verityTyping"
		)

	if (typing) {
		typing.remove()
	}
}


function addMessage(sender, text) {

	messages.push({
		sender: sender,
		text: text
	})

	const messagesContainer =
		document.getElementById("messages")

	if (!messagesContainer) {
		return
	}

	const messageElement =
		document.createElement("div")

	messageElement.classList.add(
		"message",
		sender === "user"
			? "user"
			: "verity"
	)

	messageElement.textContent =
		text

	messagesContainer.appendChild(
		messageElement
	)

	messagesContainer.scrollTop =
		messagesContainer.scrollHeight
}


function showVerityMessage(text) {

	console.log("🔊 Вызван звук Верити")
	playVerityMessageSound()

	addMessage(
		"verity",
		text
	)
}


function renderMessages() {

	const messagesContainer =
		document.getElementById("messages")

	if (!messagesContainer) {
		return
	}

	messagesContainer.innerHTML = ""

	for (const message of messages) {

		const messageElement =
			document.createElement("div")

		messageElement.classList.add(
			"message",
			message.sender === "user"
				? "user"
				: "verity"
		)

		messageElement.textContent =
			message.text

		messagesContainer.appendChild(
			messageElement
		)
	}

	messagesContainer.scrollTop =
		messagesContainer.scrollHeight
}


// ==============================
// ОТНОШЕНИЯ
// ==============================

function getRelationship() {

	if (anger < 0) {

		return {
			type: "love",
			value: Math.abs(anger)
		}

	}

	return {
		type: "anger",
		value: anger
	}
}


function getLove() {

	if (anger < 0) {
		return Math.abs(anger)
	}

	return 0
}


function changeRelationship(value) {

	anger += value

	anger =
		Math.max(
			-MAX_LOVE,
			Math.min(
				MAX_ANGER,
				anger
			)
		)

	console.log(
		"ОТНОШЕНИЯ:",
		anger
	)

	updateGameUI()
}


function checkRelationship() {

	const relationship =
		getRelationship()


	// ==========================
	// МАКСИМАЛЬНАЯ ЗЛОСТЬ
	// ==========================

	if (
		relationship.type === "anger" &&
		relationship.value >= MAX_ANGER
	) {

		handleAngerMax()

	}


	// ==========================
	// МАКСИМАЛЬНАЯ ЛЮБОВЬ
	// ==========================

	if (
		relationship.type === "love" &&
		relationship.value >= MAX_LOVE
	) {

		handleLoveMax()

	}

}


function handleAngerMax() {

	console.log(
		"🔥 ЗЛОСТЬ ДОСТИГЛА МАКСИМУМА"
	)


	if (lives <= 0) {

		console.log(
			"Жизни закончились"
		)

		showLifeLostMenu()

		return

	}


	// ==========================
	// СНИМАЕМ СЕРДЦЕ
	// ==========================

	lives--


	console.log(
		"❤️ ПОТЕРЯНА ЖИЗНЬ"
	)

	console.log(
		"Осталось жизней:",
		lives
	)


	// ==========================
	// СБРАСЫВАЕМ ЗЛОСТЬ
	// ==========================

	anger = 0


	saveGame()

	updateGameUI()


	// ==========================
	// СКРИМЕР
	// ==========================

	triggerAngerScreamer()


	// ==========================
	// МЕНЮ ПОТЕРИ ЖИЗНИ
	// ==========================

	setTimeout(() => {

		showLifeLostMenu()

	}, 750)

}


function handleLoveMax() {

	console.log("❤️ ИГРА ПРОЙДЕНА")

	gameFinished = true

	saveGame()
	updateGameUI()

	setTimeout(() => {

		const gameComplete =
			document.getElementById("gameComplete")

		if (!gameComplete) return

		gameComplete.classList.add("active")

	}, 1000)
}

function showGameComplete() {

	const gameComplete =
		document.getElementById("gameComplete")

	if (!gameComplete) return

	gameComplete.classList.add("active")
}

// ==============================
// УРОВЕНЬ ХОРРОРА
// ==============================
//
// Теперь всё зависит только от anger.
//
// anger < 0
//     Любовь
//
// anger 0
//     Нейтрально
//
// anger 1-3
//     Лёгкий хоррор
//
// anger 4-6
//     Средний хоррор
//
// anger 7-9
//     Сильный хоррор
//
// anger 10
//     Скример + потеря жизни
// ==============================

function getHorrorLevel() {

	if (anger >= 10) {
		return "critical"
	}

	if (anger >= 7) {
		return "very-high"
	}

	if (anger >= 4) {
		return "high"
	}

	if (anger >= 1) {
		return "medium"
	}

	if (anger >= -5) {
		return "low"
	}

	if (anger >= -17) {
		return "medium-love"
	}

	if (anger >= -24) {
		return "low-love"
	}

	return "hidden-love"
}


// ==============================
// ОСНОВНАЯ СИСТЕМА ХОРРОРА
// ==============================

function processAngerHorror() {

	const level = getHorrorLevel()

	console.log(
		"%cHORROR CHECK",
		"color:red;font-weight:bold",
		{
			anger: anger,
			love: getLove(),
			level: level,
			lives: lives
		}
	)

	if (level === "critical") {
		return
	}

	if (level === "very-high") {

		if (Math.random() < 0.80) {
			triggerRandomAngerEffect()
		}

		return
	}

	if (level === "high") {

		if (Math.random() < 0.60) {
			triggerRandomAngerEffect()
		}

		return
	}

	if (level === "medium") {

		if (Math.random() < 0.40) {
			triggerRandomAngerEffect()
		}

		return
	}

	if (level === "low") {

		if (Math.random() < 0.20) {
			triggerRandomAngerEffect()
		}

		return
	}

	if (level === "medium-love") {

		if (Math.random() < 0.18) {
			triggerRandomAngerEffect()
		}

		return
	}

	if (level === "low-love") {

		if (Math.random() < 0.12) {
			triggerRandomAngerEffect()
		}

		return
	}

	if (level === "hidden-love") {

		if (Math.random() < 0.07) {
			triggerRandomAngerEffect()
		}

		return
	}

	if (anger <= -MAX_LOVE) {
		handleLoveMax()
		return
	}
}

// ==============================
// СЛУЧАЙНЫЙ ЭФФЕКТ
// ==============================

function triggerRandomAngerEffect() {

	if (horrorEffectCooldown) {
		return
	}

	playGlitchSound()

	const effects = [

		triggerAngerGlitch,
		triggerAngerFlicker,
		triggerAngerAvatar,
		triggerAngerStatus

	]


	const effect =
		effects[
		Math.floor(
			Math.random() *
			effects.length
		)
		]


	effect()


	horrorEffectCooldown = true


	setTimeout(() => {

		horrorEffectCooldown = false

	}, 700)

}


// ==============================
// GLITCH
// ==============================

function triggerAngerGlitch() {


	console.log(
		"HORROR: GLITCH",
		"anger:",
		anger
	)

	playHardGlitchSound()


	const phoneScreen =
		document.querySelector(
			".phone-screen"
		)

	if (!phoneScreen) {
		return
	}


	phoneScreen.classList.remove(
		"glitch"
	)

	void phoneScreen.offsetWidth

	phoneScreen.classList.add(
		"glitch"
	)


	setTimeout(() => {

		phoneScreen.classList.remove(
			"glitch"
		)

	}, 250 + Math.random() * 500)

}


// ==============================
// FLICKER
// ==============================

function triggerAngerFlicker() {

	console.log(
		"HORROR: FLICKER",
		"anger:",
		anger
	)


	const phoneScreen =
		document.querySelector(
			".phone-screen"
		)

	if (!phoneScreen) {
		return
	}


	phoneScreen.classList.add(
		"flicker"
	)


	setTimeout(() => {

		phoneScreen.classList.remove(
			"flicker"
		)

	}, 80 + Math.random() * 180)

}


// ==============================
// AVATAR
// ==============================

function triggerAngerAvatar() {

	console.log(
		"HORROR: AVATAR",
		"anger:",
		anger
	)


	const avatar =
		document.querySelector(
			".chat-header .avatar img"
		)

	if (!avatar) {
		return
	}


	const normalAvatar =
		"images/verity.png"

	const scaryAvatar =
		"images/verity-v2.png"


	avatar.src =
		scaryAvatar


	const duration =
		300 +
		Math.random() * 1700


	setTimeout(() => {

		avatar.src =
			normalAvatar

	}, duration)

}


// ==============================
// STATUS
// ==============================

function triggerAngerStatus() {

	console.log(
		"HORROR: STATUS",
		"anger:",
		anger
	)


	const status =
		document.querySelector(
			".chat-status"
		)

	if (!status) {
		return
	}


	const originalText =
		status.textContent


	status.textContent =
		"не в сети"

	status.classList.add(
		"offline"
	)


	setTimeout(() => {

		status.textContent =
			originalText || "в сети"

		status.classList.remove(
			"offline"
		)

	}, 1000 + Math.random() * 2500)

}


// ==============================
// СКРИМЕР
// ==============================

function triggerAngerScreamer() {

	playScreamerSound()

	if (screamerCooldown) {
		return
	}


	console.log(
		"HORROR: SCREAMER",
		"anger:",
		anger
	)


	const screamer =
		document.getElementById(
			"verityScreamer"
		)

	if (!screamer) {
		return
	}


	screamerCooldown = true


	screamer.classList.remove(
		"active"
	)

	void screamer.offsetWidth

	screamer.classList.add(
		"active"
	)


	setTimeout(() => {

		screamer.classList.remove(
			"active"
		)

	}, 700)


	// Защита от скримеров подряд

	setTimeout(() => {

		screamerCooldown = false

	}, 4000)

}


// ==============================
// UI
// ==============================

function updateGameUI() {

	const relationshipPoint =
		document.getElementById(
			"relationshipPoint"
		)

	const livesContainer =
		document.getElementById(
			"livesContainer"
		)


	// ==========================
	// ТОЧКА ОТНОШЕНИЙ
	// ==========================

	if (relationshipPoint) {

		const percent =
			((MAX_ANGER - anger) /
				(MAX_LOVE + MAX_ANGER)) *
			100

		relationshipPoint.style.left =
			`${percent}%`

	}


	// ==========================
	// СЕРДЦА
	// ==========================

	if (livesContainer) {

		livesContainer.innerHTML = ""


		for (
			let i = 0;
			i < 3;
			i++
		) {

			const heart =
				document.createElement("img")


			heart.classList.add(
				"life-heart"
			)


			if (i < lives) {

				heart.src =
					"images/heart.png"

			} else {

				heart.src =
					"images/bad-heart.png"

			}


			heart.alt = ""


			livesContainer.appendChild(
				heart
			)

		}

	}

}


// ==============================
// ИНВЕНТАРЬ
// ==============================

const inventoryButton =
	document.getElementById(
		"inventoryButton"
	)

const inventoryModal =
	document.getElementById(
		"inventoryModal"
	)

const closeInventory =
	document.getElementById(
		"closeInventory"
	)

const inventoryGrid =
	document.getElementById(
		"inventoryGrid"
	)


function openInventory() {

	if (!inventoryModal) {
		return
	}


	inventoryModal.style.display =
		"flex"


	renderInventory()

}


function closeInventoryWindow() {

	if (!inventoryModal) {
		return
	}


	inventoryModal.style.display =
		"none"

}


if (inventoryButton) {

	inventoryButton.addEventListener(
		"click",
		() => {

			playButtonClick()
			openInventory()

		}
	)

}


if (closeInventory) {

	closeInventory.addEventListener(
		"click",
		() => {

			playButtonClick()
			closeInventoryWindow()

		}
	)

}


if (inventoryModal) {

	inventoryModal.addEventListener(
		"click",
		(event) => {

			if (
				event.target ===
				inventoryModal
			) {

				closeInventoryWindow()

			}

		}
	)

}


// ==============================
// ПРЕДМЕТЫ
// ==============================

const items = [

	{
		id: "coin",
		name: "Старая монета",
		image: "images/old_coin.png",
		description:
			"Странная старая монета.",
		rarity: "common",
		chance: 40
	},

	{
		id: "key",
		name: "Маленький ключ",
		image: "images/key.webp",
		description:
			"Неизвестно, что он открывает.",
		rarity: "uncommon",
		chance: 25
	},

	{
		id: "cassette",
		name: "Кассета",
		image: "images/cassette.png",
		description:
			"Верити почему-то не хочет, чтобы ты её включал.",
		rarity: "rare",
		chance: 15
	},

	{
		id: "glass",
		name: "Осколок зеркала",
		image: "images/glass.png",
		description:
			"Осколок старого зеркала. Странно, но твоё отражение в нём иногда улыбается раньше тебя.",
		rarity: "epic",
		chance: 10
	},

	{
		id: "eye",
		name: "Чёрный глаз",
		image: "images/eye.png",
		description:
			"Небольшой стеклянный шарик, похожий на глаз. Иногда кажется, что он смотрит на тебя.",
		rarity: "mythic",
		chance: 6
	},

	{
		id: "note",
		name: "Старая записка",
		image: "images/note.webp",
		description:
			'В записке кровью написано: "Верити не тот, за кого себя выдает. БЕГИ!!!"',
		rarity: "legendary",
		chance: 4
	}

]


function getRandomItem() {

	const random =
		Math.random() * 100

	let currentChance = 0


	for (const item of items) {

		currentChance +=
			item.chance


		if (
			random <
			currentChance
		) {

			return item

		}

	}


	return items[0]

}


// ==============================
// РЕНДЕР ИНВЕНТАРЯ
// ==============================

function renderInventory() {

	if (!inventoryGrid) {
		return
	}


	inventoryGrid.innerHTML = ""


	const inventoryItems =
		Object.keys(inventory)


	for (
		let i = 0;
		i < 15;
		i++
	) {

		const slot =
			document.createElement("div")


		slot.classList.add(
			"inventory-slot"
		)


		const itemId =
			inventoryItems[i]


		if (itemId) {

			const item =
				items.find(
					item =>
						item.id === itemId
				)


			if (item) {

				const image =
					document.createElement("img")


				image.src =
					item.image

				image.alt =
					item.name


				image.classList.add(
					"inventory-item"
				)


				slot.appendChild(
					image
				)


				const amount =
					document.createElement("div")


				amount.classList.add(
					"item-amount"
				)


				amount.textContent =
					inventory[itemId] > 1
						? inventory[itemId]
						: ""


				slot.appendChild(
					amount
				)


				const tooltip =
					document.createElement("div")


				tooltip.classList.add(
					"item-tooltip"
				)


				tooltip.textContent =
					item.name


				slot.appendChild(
					tooltip
				)


				slot.addEventListener(
					"click",
					() => {

						playButtonClick()

						const itemName =
							document.getElementById(
								"itemName"
							)

						if (itemName) {

							itemName.textContent =
								item.name

						}


						const rarityElement =
							document.getElementById(
								"itemRarity"
							)


						const rarityNames = {

							common: "Обычная",
							uncommon: "Необычная",
							rare: "Редкая",
							epic: "Эпическая",
							mythic: "Мифическая",
							legendary: "Легендарная"

						}


						if (rarityElement) {

							rarityElement.textContent =
								rarityNames[item.rarity]

							rarityElement.className =
								`item-rarity ${item.rarity}`

						}


						const description =
							document.getElementById(
								"itemDescription"
							)


						if (description) {

							description.textContent =
								item.description

						}

					}
				)

			}

		}


		inventoryGrid.appendChild(
			slot
		)

	}

}


// ==============================
// РЕКЛАМА: ПРЕДМЕТ
// ==============================

function rewardItemAd() {

	const usedSlots =
		Object.keys(inventory).length


	const randomItem =
		getRandomItem()


	if (
		usedSlots >= 15 &&
		!inventory[randomItem.id]
	) {

		showItemNotification(
			"Инвентарь заполнен!"
		)

		return

	}


	const button = document.getElementById("itemAdButton")

	if (!button) {
		console.error("❌ Кнопка получения предмета не найдена")
		return
	}

	button.disabled = true
	playAdLoadingSound()
	button.classList.add("loading")
	button.textContent = "📺 Загрузка рекламы..."

	let itemRewarded = false

	if (!ysdk) {
		console.error("Yandex Games SDK ещё не готов")

		button.disabled = false
		button.classList.remove("loading")
		button.textContent = "🎁 Получить предмет"

		return
	}

	ysdk.adv.showRewardedVideo({
		callbacks: {

			onOpen: () => {
				console.log("📺 Реклама предмета открыта")
				pauseGameAudio()
				stopYandexGameplay()
			},

			onRewarded: () => {
				console.log("🎁 Реклама просмотрена, выдаём предмет")

				inventory[randomItem.id] =
					(inventory[randomItem.id] || 0) + 1

				itemRewarded = true

				saveGame()
				showItemNotification(`Ты получил: ${randomItem.name}`)
			},

			onClose: (wasShown) => {

				resumeGameAudio()
				startYandexGameplay()

				button.disabled = false
				button.classList.remove("loading")
				button.textContent = "🎁 Получить предмет"

				if (itemRewarded) {
					playItemGetSound()
					openInventory()

					setTimeout(() => {
						highlightItem(Object.keys(inventory).length - 1)
					}, 100)
				}
			},

			onError: (error) => {
				console.error("❌ Ошибка рекламы предмета:", error)

				resumeGameAudio()

				button.disabled = false
				button.classList.remove("loading")
				button.textContent = "🎁 Получить предмет"
			}
		}
	})

}

function showItemNotification(text) {

	const notification =
		document.getElementById(
			"itemNotification"
		)


	const notificationItem =
		document.getElementById(
			"notificationItem"
		)


	if (
		!notification ||
		!notificationItem
	) {

		return

	}


	notificationItem.textContent =
		text


	notification.classList.add(
		"show"
	)


	setTimeout(() => {

		notification.classList.remove(
			"show"
		)

	}, 2500)

}


function highlightItem(index) {

	const slots =
		document.querySelectorAll(
			".inventory-slot"
		)


	const slot =
		slots[index]


	if (!slot) {
		return
	}


	slot.classList.add(
		"new-item"
	)


	setTimeout(() => {

		slot.classList.remove(
			"new-item"
		)

	}, 3000)

}


const itemAdButton =
	document.getElementById(
		"itemAdButton"
	)


if (itemAdButton) {

	itemAdButton.addEventListener(
		"click",
		() => {

			playButtonClick()
			rewardItemAd()

		}
	)

}


// ==============================
// СКИНЫ
// ==============================

//const skinButton =
//	document.getElementById(
//		"skinButton"
//	)


//if (skinButton) {

//	skinButton.addEventListener(
//		"click",
//		() => {

//			playButtonClick()
//			alert(
//				"Система скинов пока находится в разработке."
//			)
//
//		}
//	)

//}


// ==============================
// ФОНОВЫЕ ЭФФЕКТЫ
// ==============================
//
// Теперь их частота зависит
// от anger.
//
// Чем выше anger,
// тем меньше задержка.
// ==============================


// ==============================
// ФОНОВОЕ МЕРЦАНИЕ
// ==============================

function screenFlicker() {

	const phoneScreen =
		document.querySelector(
			".phone-screen"
		)

	if (!phoneScreen) {
		return
	}


	phoneScreen.classList.add(
		"flicker"
	)


	setTimeout(() => {

		phoneScreen.classList.remove(
			"flicker"
		)

	}, 80 + Math.random() * 150)

}


function randomFlicker() {

	let minDelay
	let maxDelay


	if (anger >= 7) {

		minDelay = 1500
		maxDelay = 4000

	} else if (anger >= 4) {

		minDelay = 3000
		maxDelay = 7000

	} else if (anger >= 1) {

		minDelay = 5000
		maxDelay = 10000

	} else if (anger >= -5) {

		minDelay = 7000
		maxDelay = 14000

	} else if (anger >= -17) {

		minDelay = 10000
		maxDelay = 18000

	} else if (anger >= -24) {

		minDelay = 14000
		maxDelay = 25000

	} else {

		minDelay = 18000
		maxDelay = 32000
	}


	const delay =
		Math.random() *
		(maxDelay - minDelay) +
		minDelay


	setTimeout(() => {

		// Проверяем ещё раз,
		// потому что anger мог измениться

		if (!isGamePaused && anger > -30) {
			screenFlicker()
		}

		randomFlicker()

	}, delay)

}


// ==============================
// ФОНОВЫЙ GLITCH
// ==============================

function screenGlitch() {

	playHardGlitchSound()

	const phoneScreen =
		document.querySelector(
			".phone-screen"
		)

	if (!phoneScreen) {
		return
	}


	phoneScreen.classList.remove(
		"glitch"
	)

	void phoneScreen.offsetWidth


	phoneScreen.classList.add(
		"glitch"
	)


	setTimeout(() => {

		phoneScreen.classList.remove(
			"glitch"
		)

	}, 250 + Math.random() * 400)

}


function randomGlitch() {

	let minDelay
	let maxDelay


	if (anger >= 7) {

		minDelay = 2000
		maxDelay = 5000

	} else if (anger >= 4) {

		minDelay = 4000
		maxDelay = 9000

	} else if (anger >= 1) {

		minDelay = 7000
		maxDelay = 14000

	} else if (anger >= -5) {

		minDelay = 10000
		maxDelay = 18000

	} else if (anger >= -17) {

		minDelay = 14000
		maxDelay = 24000

	} else if (anger >= -24) {

		minDelay = 20000
		maxDelay = 32000

	} else {

		minDelay = 25000
		maxDelay = 40000
	}


	const delay =
		Math.random() *
		(maxDelay - minDelay) +
		minDelay


	setTimeout(() => {

		if (!isGamePaused && anger > -30) {
			screenGlitch()
		}

		randomGlitch()

	}, delay)

}


// ==============================
// ФОНОВЫЙ ГЛИТЧ АВАТАРА
// ==============================

function avatarGlitch() {

	const avatar =
		document.querySelector(
			".avatar"
		)

	if (!avatar) {
		return
	}


	avatar.classList.remove(
		"avatar-glitch"
	)

	void avatar.offsetWidth


	avatar.classList.add(
		"avatar-glitch"
	)


	setTimeout(() => {

		avatar.classList.remove(
			"avatar-glitch"
		)

	}, 250)

}


function randomAvatarGlitch() {

	let minDelay
	let maxDelay


	if (anger < 0) {

		minDelay = 20000
		maxDelay = 40000

	} else if (anger === 0) {

		minDelay = 15000
		maxDelay = 30000

	} else if (anger <= 3) {

		minDelay = 8000
		maxDelay = 18000

	} else if (anger <= 6) {

		minDelay = 4000
		maxDelay = 10000

	} else {

		minDelay = 1200
		maxDelay = 5000

	}


	const delay =
		Math.random() *
		(maxDelay - minDelay) +
		minDelay


	setTimeout(() => {

		if (!isGamePaused && anger >= 2) {
			avatarGlitch()
		}

		randomAvatarGlitch()

	}, delay)

}


// ==============================
// ФОНОВАЯ СМЕНА СТАТУСА
// ==============================

function changeVerityStatus() {

	const status =
		document.querySelector(
			".chat-status"
		)

	if (!status) {
		return
	}


	const originalText =
		status.textContent


	status.textContent =
		"не в сети"


	status.classList.add(
		"offline"
	)


	setTimeout(() => {

		status.textContent =
			originalText || "в сети"

		status.classList.remove(
			"offline"
		)

	}, 1000 + Math.random() * 2500)

}


function randomStatusChange() {

	let minDelay
	let maxDelay


	if (anger < 0) {

		minDelay = 30000
		maxDelay = 60000

	} else if (anger <= 3) {

		minDelay = 18000
		maxDelay = 35000

	} else if (anger <= 6) {

		minDelay = 10000
		maxDelay = 20000

	} else {

		minDelay = 4000
		maxDelay = 10000

	}


	const delay =
		Math.random() *
		(maxDelay - minDelay) +
		minDelay


	setTimeout(() => {

		if (!isGamePaused && anger >= 3) {
			changeVerityStatus()
		}

		randomStatusChange()

	}, delay)

}


// ==============================
// СЛУЧАЙНАЯ СМЕНА АВАТАРА
// ==============================

function changeVerityAvatar() {

	const avatar =
		document.querySelector(
			".avatar img"
		)

	if (!avatar) {
		return
	}


	avatar.src =
		"images/verity-v2.png"


	setTimeout(() => {

		avatar.src =
			"images/verity.png"

	}, 3000 + Math.random() * 7000)

}


function randomAvatarChange() {

	let minDelay
	let maxDelay


	if (anger < 0) {

		minDelay = 60000
		maxDelay = 120000

	} else if (anger <= 3) {

		minDelay = 40000
		maxDelay = 80000

	} else if (anger <= 6) {

		minDelay = 20000
		maxDelay = 45000

	} else {

		minDelay = 8000
		maxDelay = 20000

	}


	const delay =
		Math.random() *
		(maxDelay - minDelay) +
		minDelay


	setTimeout(() => {

		if (!isGamePaused && anger >= 4) {
			changeVerityAvatar()
		}

		randomAvatarChange()

	}, delay)

}


// ==============================
// КНОПКИ ДИАЛОГА
// ==============================

const choice1 =
	document.getElementById(
		"choice1"
	)

const choice2 =
	document.getElementById(
		"choice2"
	)

const hintWrapper =
	document.getElementById(
		"hint-wrapper"
	)

const hintButton =
	document.getElementById(
		"hint-button"
	)

const hintMessage =
	document.getElementById(
		"hint-message"
	)

const specialChoiceWrapper =
	document.getElementById("special-choice-wrapper")

const specialChoiceWarning =
	document.getElementById("special-choice-warning")

const specialAdButton =
	document.getElementById("special-ad-button")

const specialChoiceButton =
	document.getElementById("special-choice")

if (specialAdButton) {

	specialAdButton.addEventListener(
		"click",
		unlockSpecialChoice
	)

}

if (specialChoiceButton) {

	specialChoiceButton.addEventListener(
		"click",
		() => chooseDialogue(2)
	)

}

if (hintButton) {

	hintButton.addEventListener(
		"click",
		() => {
			playButtonClick()
			unlockHint()
		}
	)

}


if (choice1) {

	choice1.addEventListener(
		"click",
		() => {

			playButtonClick()
			chooseDialogue(0)

		}
	)

}


if (choice2) {

	choice2.addEventListener(
		"click",
		() => {

			playButtonClick()
			chooseDialogue(1)

		}
	)

}



// ==============================
// ГЛАВНОЕ МЕНЮ
// ==============================

const mainMenu =
	document.getElementById("main-menu")

const startButton =
	document.getElementById("start-button")

const continueButton =
	document.getElementById("continue-button")

const aboutButton =
	document.getElementById("about-button")


function hideMainMenu() {

	if (!mainMenu) {
		return
	}

	mainMenu.style.display = "none"

	startBackgroundMusic()

}


function startNewGame() {

	gameFinished = false
	isGamePaused = false

	document.querySelector(".game").style.display = "flex"

	document
		.getElementById("gameOver")
		.classList.remove("active")

	document
		.getElementById("verityScreamer")
		.classList.remove("active")

	document
		.getElementById("continue-button")
		.disabled = false

	isWaitingForReply = false
	isLifeLostMenuOpen = false
	lifeRestoreAvailable = false

	if (choice1) {
		choice1.disabled = false
	}

	if (choice2) {
		choice2.disabled = false
	}

	playButtonClick()

	// Сбрасываем игру

	inventory = {}
	messages = []

	currentDialogue = "start"

	anger = 0
	lives = 3

	hintCharges = 0
	hintShown = false

	specialChoiceUnlocked = false
	specialChoiceUsed = false

	lifeRestoreAvailable = false
	isLifeLostMenuOpen = false

	// Удаляем старое сохранение

	localStorage.removeItem("verityGame")

	// Очищаем сообщения на экране

	const messagesContainer =
		document.getElementById("messages")

	if (messagesContainer) {
		messagesContainer.innerHTML = ""
	}

	updateGameUI()

	hideMainMenu()

	renderDialogue()

	startYandexGameplay()

}


function continueGame() {

	if (gameFinished) {
		console.log("❌ Игра уже закончена")
		return
	}

	playButtonClick()

	const savedGame =
		localStorage.getItem("verityGame")

	if (!savedGame) {

		alert("Сохранение не найдено.")

		return
	}

	loadGame()

	renderMessages()

	updateGameUI()

	hideMainMenu()

	renderDialogue()

	startYandexGameplay()

}


function showAbout() {

	playButtonClick()

	alert(
		"VERITY\n\n" +
		"Психологическая хоррор-игра о странном собеседнике, " +
		"который, кажется, знает о тебе больше, чем должен.\n\n" +
		"v1.0"
	)

}

if (startButton) {

	startButton.addEventListener(
		"click",
		startNewGame
	)

}


if (continueButton) {

	continueButton.addEventListener(
		"click",
		continueGame
	)

}


if (aboutButton) {

	aboutButton.addEventListener(
		"click",
		showAbout
	)

}




// ==============================
// ЗАПУСК
// ==============================

// ВАЖНО:
//
// localStorage.clear() здесь НЕ используем.
//
// Иначе браузер снесёт вообще
// всё сохранение сайта.
//

loadGame()


if (continueButton) {

	continueButton.disabled =
		gameFinished

}

randomFlicker()
randomGlitch()
randomAvatarGlitch()
randomStatusChange()
randomAvatarChange()

loadDialogue()


console.log(
	"Отношения при запуске:",
	{
		anger: anger,
		love: getLove(),
		horror: getHorrorLevel(),
		lives: lives
	}
)


document
	.getElementById("mainMenuButton")
	.addEventListener("click", () => {
		returnToMainMenu()
	})

function returnToMainMenu() {

	stopYandexGameplay()

	document
		.getElementById("gameOver")
		.classList.remove("active")

	document
		.getElementById("gameComplete")
		.classList.remove("active")

	document
		.getElementById("verityScreamer")
		.classList.remove("active")

	document.querySelector(".game").style.display = "none"

	document.getElementById("main-menu").style.display = "flex"

	if (continueButton) {
		continueButton.disabled = gameFinished
	}
}

const completeMainMenuButton =
	document.getElementById("completeMainMenuButton")

if (completeMainMenuButton) {

	completeMainMenuButton.addEventListener(
		"click",
		returnToMainMenu
	)
}



document.addEventListener("visibilitychange", () => {

	console.log("👀 VISIBILITY CHANGE:", document.hidden)

	if (document.hidden) {
		pauseGame()
	} else {
		resumeGame()
	}

})


window.addEventListener("blur", () => {

	console.log("👋 WINDOW BLUR")

	pauseGame()

})


window.addEventListener("focus", () => {

	console.log("👀 WINDOW FOCUS")

	resumeGame()

})