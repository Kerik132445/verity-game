
console.log("VERITY GAME ЗАПУЩЕН")

// ==============================
// СОСТОЯНИЕ ИГРЫ
// ==============================

let inventory = {}
let messages = []

let currentDialogue = "start"

let anger = 0
let lives = 3

let dialogueData = {}

let isWaitingForReply = false

// Защита от слишком частых эффектов
let horrorEffectCooldown = false
let screamerCooldown = false

// ==============================
// НАСТРОЙКИ
// ==============================

const MAX_ANGER = 10
const MAX_LOVE = 30

// ==============================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ==============================

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms))
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
		lives: lives
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

	} catch (error) {

		console.error(
			"Ошибка загрузки диалога:",
			error
		)

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

	if (!choice1 || !choice2) {
		return
	}

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

	updateGameUI()
}


// ==============================
// ВЫБОР ДИАЛОГА
// ==============================

async function chooseDialogue(index) {

	if (isWaitingForReply) {
		return
	}

	const dialogue =
		dialogueData[currentDialogue]

	if (!dialogue) {
		return
	}

	const choice =
		dialogue.choices[index]

	if (!choice) {
		return
	}

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

	currentDialogue =
		choice.next


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

		addMessage(
			"verity",
			nextDialogue.verity
		)

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

		return
	}


	// Снимаем сердце

	lives--


	console.log(
		"❤️ ПОТЕРЯНА ЖИЗНЬ"
	)

	console.log(
		"Осталось жизней:",
		lives
	)


	// После атаки злость сбрасывается

	anger = 0


	saveGame()

	updateGameUI()


	// Скример

	verityScreamer()

}


function handleLoveMax() {

	console.log(
		"❤️ МАКСИМАЛЬНОЕ СЧАСТЬЕ"
	)

	console.log(
		"УРОВЕНЬ ПРОЙДЕН"
	)

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

	if (anger < 0) {
		return "love"
	}

	if (anger === 0) {
		return "neutral"
	}

	if (anger <= 3) {
		return "low"
	}

	if (anger <= 6) {
		return "medium"
	}

	if (anger <= 9) {
		return "high"
	}

	return "critical"
}


// ==============================
// ОСНОВНАЯ СИСТЕМА ХОРРОРА
// ==============================

function processAngerHorror() {

	const level =
		getHorrorLevel()


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


	// ==========================
	// ЛЮБОВЬ
	// ==========================

	if (level === "love") {

		return
	}


	// ==========================
	// НЕЙТРАЛЬНО
	// ==========================

	if (level === "neutral") {

		// Очень редко

		if (Math.random() < 0.05) {
			triggerRandomAngerEffect()
		}

		return
	}


	// ==========================
	// ЗЛОСТЬ 1-3
	// ==========================

	if (level === "low") {

		if (Math.random() < 0.20) {
			triggerRandomAngerEffect()
		}

		return
	}


	// ==========================
	// ЗЛОСТЬ 4-6
	// ==========================

	if (level === "medium") {

		if (Math.random() < 0.40) {
			triggerRandomAngerEffect()
		}

		return
	}


	// ==========================
	// ЗЛОСТЬ 7-9
	// ==========================

	if (level === "high") {

		if (Math.random() < 0.70) {
			triggerRandomAngerEffect()
		}


		// Иногда скример

		if (
			Math.random() < 0.10 &&
			!screamerCooldown
		) {

			triggerAngerScreamer()

		}

		return
	}


	// ==========================
	// ЗЛОСТЬ 10
	// ==========================

	if (level === "critical") {

		// На максимальной злости
		// скример происходит сразу

		handleAngerMax()

	}

}


// ==============================
// СЛУЧАЙНЫЙ ЭФФЕКТ
// ==============================

function triggerRandomAngerEffect() {

	if (horrorEffectCooldown) {
		return
	}


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
			((anger + MAX_LOVE) /
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


	updateDebugPanel()

}


// ==============================
// DEBUG ПАНЕЛЬ
// ==============================

function updateDebugPanel() {

	const debugAnger =
		document.getElementById(
			"debugAnger"
		)

	const debugLove =
		document.getElementById(
			"debugLove"
		)

	const debugLives =
		document.getElementById(
			"debugLives"
		)

	const debugHorror =
		document.getElementById(
			"debugHorror"
		)

	const debugDialogue =
		document.getElementById(
			"debugDialogue"
		)


	if (debugAnger) {

		debugAnger.textContent =
			anger

	}


	if (debugLove) {

		debugLove.textContent =
			getLove()

	}


	if (debugLives) {

		debugLives.textContent =
			lives

	}


	if (debugHorror) {

		debugHorror.textContent =
			getHorrorLevel()

	}


	if (debugDialogue) {

		debugDialogue.textContent =
			currentDialogue

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
		openInventory
	)

}


if (closeInventory) {

	closeInventory.addEventListener(
		"click",
		closeInventoryWindow
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
		chance: 50
	},

	{
		id: "key",
		name: "Маленький ключ",
		image: "images/key.webp",
		description:
			"Неизвестно, что он открывает.",
		rarity: "uncommon",
		chance: 30
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
		chance: 8
	},

	{
		id: "eye",
		name: "Чёрный глаз",
		image: "images/eye.png",
		description:
			"Небольшой стеклянный шарик, похожий на глаз. Иногда кажется, что он смотрит на тебя.",
		rarity: "mythic",
		chance: 4
	},

	{
		id: "note",
		name: "Старая записка",
		image: "images/note.webp",
		description:
			'В записке кровью написано: "Верити не тот, за кого себя выдает. БЕГИ!!!"',
		rarity: "legendary",
		chance: 2
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


	inventory[randomItem.id] =
		(inventory[randomItem.id] || 0) + 1


	saveGame()


	showItemNotification(
		`Ты получил: ${randomItem.name}`
	)


	openInventory()


	setTimeout(() => {

		highlightItem(
			Object.keys(inventory).length - 1
		)

	}, 100)

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
		rewardItemAd
	)

}


// ==============================
// СКИНЫ
// ==============================

const skinButton =
	document.getElementById(
		"skinButton"
	)


if (skinButton) {

	skinButton.addEventListener(
		"click",
		() => {

			alert(
				"Система скинов пока находится в разработке."
			)

		}
	)

}


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


	if (anger < 0) {

		// Любовь

		minDelay = 12000
		maxDelay = 25000

	} else if (anger === 0) {

		// Нейтрально

		minDelay = 9000
		maxDelay = 18000

	} else if (anger <= 3) {

		// Лёгкая злость

		minDelay = 6000
		maxDelay = 13000

	} else if (anger <= 6) {

		// Средняя

		minDelay = 4000
		maxDelay = 9000

	} else {

		// Сильная

		minDelay = 1800
		maxDelay = 5000

	}


	const delay =
		Math.random() *
		(maxDelay - minDelay) +
		minDelay


	setTimeout(() => {

		// Проверяем ещё раз,
		// потому что anger мог измениться

		if (anger >= 0) {
			screenFlicker()
		}

		randomFlicker()

	}, delay)

}


// ==============================
// ФОНОВЫЙ GLITCH
// ==============================

function screenGlitch() {

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


	if (anger < 0) {

		minDelay = 18000
		maxDelay = 35000

	} else if (anger === 0) {

		minDelay = 14000
		maxDelay = 28000

	} else if (anger <= 3) {

		minDelay = 9000
		maxDelay = 18000

	} else if (anger <= 6) {

		minDelay = 5000
		maxDelay = 11000

	} else {

		minDelay = 2200
		maxDelay = 6000

	}


	const delay =
		Math.random() *
		(maxDelay - minDelay) +
		minDelay


	setTimeout(() => {

		if (anger >= 1) {
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

		if (anger >= 2) {
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

		if (anger >= 3) {
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

		if (anger >= 4) {
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


if (choice1) {

	choice1.addEventListener(
		"click",
		() => {

			chooseDialogue(0)

		}
	)

}


if (choice2) {

	choice2.addEventListener(
		"click",
		() => {

			chooseDialogue(1)

		}
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

localStorage.clear()

loadGame()


renderMessages()

updateGameUI()


// Фоновые эффекты

randomFlicker()
randomGlitch()
randomAvatarGlitch()
randomStatusChange()
randomAvatarChange()


// Диалог

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