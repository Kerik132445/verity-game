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
		lives: lives,
		trust: trust
	}

	localStorage.setItem(
		"verityGame",
		JSON.stringify(gameData)
	)
}


function loadGame() {
	const savedGame = localStorage.getItem("verityGame")

	if (!savedGame) {
		return
	}

	try {
		const gameData = JSON.parse(savedGame)

		inventory = gameData.inventory ?? {}
		messages = gameData.messages ?? []

		currentDialogue = gameData.currentDialogue ?? "start"

		anger = gameData.anger ?? 0
		lives = gameData.lives ?? 3
		trust = gameData.trust ?? 0

	} catch (error) {
		console.error("Ошибка загрузки сохранения:", error)
	}
}


// ==============================
// ДИАЛОГ
// ==============================

async function loadDialogue() {
	try {
		const response = await fetch("data/dialogue.json")

		if (!response.ok) {
			throw new Error("Не удалось загрузить dialogue.json")
		}

		dialogueData = await response.json()

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
		console.error("Ошибка загрузки диалога:", error)
	}
}


function renderDialogue() {
	const dialogue = dialogueData[currentDialogue]

	if (!dialogue) {
		console.error(
			"Диалог не найден:",
			currentDialogue
		)
		return
	}

	const choice1 = document.getElementById("choice1")
	const choice2 = document.getElementById("choice2")

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


async function chooseDialogue(index) {

	if (isWaitingForReply) {
		return
	}

	const dialogue = dialogueData[currentDialogue]

	if (!dialogue) {
		return
	}

	const choice = dialogue.choices[index]

	if (!choice) {
		return
	}

	// Блокируем повторные нажатия
	isWaitingForReply = true

	const choice1 = document.getElementById("choice1")
	const choice2 = document.getElementById("choice2")

	if (choice1) {
		choice1.disabled = true
	}

	if (choice2) {
		choice2.disabled = true
	}

	// Сообщение игрока
	addMessage("user", choice.text)

	// Изменяем отношение
	changeRelationship(choice.anger ?? 0)

	trust += choice.trust ?? 0

	// Переходим к следующему диалогу
	currentDialogue = choice.next


	// Задержка перед ответом Верити

	// Верити начинает печатать
	showTyping()

	// Задержка перед ответом
	const replyDelay =
		Math.random() * 700 + 700

	await sleep(replyDelay)

	// Убираем "печатает..."
	hideTyping()

	processTrustHorror()

	const nextDialogue =
		dialogueData[currentDialogue]

	// Ответ Верити
	if (nextDialogue?.verity) {
		addMessage("verity", nextDialogue.verity)
	}

	checkRelationship()
	saveGame()
	renderDialogue()


	// Разблокируем кнопки
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

	const typing = document.createElement("div")

	typing.classList.add(
		"message",
		"verity",
		"typing-message"
	)

	typing.id = "verityTyping"

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
		document.getElementById("verityTyping")

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

	messageElement.textContent = text

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

const MAX_ANGER = 10
const MAX_LOVE = 30

let trust = 5

const TRUST_HORROR = {
	calm: 10,
	suspicious: 5,
	unstable: 1,
	danger: 0
}

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

function checkRelationship() {
	const relationship = getRelationship()

	if (
		relationship.type === "anger" &&
		relationship.value >= MAX_ANGER
	) {
		handleAngerMax()
	}

	if (
		relationship.type === "love" &&
		relationship.value >= MAX_LOVE
	) {
		handleLoveMax()
	}
}

function handleAngerMax() {
	console.log("ЗЛОСТЬ ДОСТИГЛА МАКСИМУМА")

	if (lives <= 0) {
		console.log("Жизни закончились")
		return
	}

	lives--

	// После скримера отношения возвращаются в нейтральное состояние
	anger = 0

	saveGame()
	updateGameUI()

	verityScreamer()
}

function handleLoveMax() {
	console.log("❤️ МАКСИМАЛЬНОЕ СЧАСТЬЕ")
	console.log("УРОВЕНЬ ПРОЙДЕН")

	// Здесь позже сделаем настоящий финал
}

function getTrustHorrorLevel() {
	if (trust >= 10) return "calm"
	if (trust >= 5) return "suspicious"
	if (trust >= 1) return "unstable"
	return "danger"
}


// ==============================
// ИЗМЕНЕНИЕ ОТНОШЕНИЙ
// ==============================

function changeRelationship(value) {

	anger += value

	// Не даём значению выйти за пределы -10 / +10
	anger = Math.max(
		-MAX_LOVE,
		Math.min(MAX_ANGER, anger)
	)

	console.log("Отношение:", anger)

	updateGameUI()
}

function processTrustHorror() {

	const level =
		getTrustHorrorLevel()

	if (level === "calm") {
		return
	}

	if (level === "suspicious") {

		if (Math.random() < 0.15) {
			triggerTrustGlitch()
		}

		return
	}

	if (level === "unstable") {

		if (Math.random() < 0.35) {
			triggerRandomTrustEffect()
		}

		return
	}

	// trust <= 0

	const roll = Math.random()

	if (roll < 0.08) {

		triggerTrustScreamer()

	} else if (roll < 0.60) {

		triggerRandomTrustEffect()
	}
}

function triggerRandomTrustEffect() {
	const effects = [
		triggerTrustGlitch,
		triggerTrustFlicker,
		triggerTrustAvatar,
		triggerTrustStatus
	]

	const effect = effects[Math.floor(Math.random() * effects.length)]

	effect()
}

function triggerTrustGlitch() {

	const phoneScreen =
		document.querySelector(".phone-screen")

	if (!phoneScreen) return

	phoneScreen.classList.remove("glitch")

	void phoneScreen.offsetWidth

	phoneScreen.classList.add("glitch")

	setTimeout(() => {

		phoneScreen.classList.remove("glitch")

	}, 200 + Math.random() * 400)
}

function triggerTrustFlicker() {
	const screen = document.querySelector(".phone-screen")

	if (!screen) return

	screen.classList.add("trust-flicker")

	setTimeout(() => {
		screen.classList.remove("trust-flicker")
	}, 300 + Math.random() * 500)
}


// ==============================
// UI ХАРАКТЕРИСТИК
// ==============================

function updateGameUI() {

	const relationshipPoint =
		document.getElementById("relationshipPoint")

	const livesContainer =
		document.getElementById("livesContainer")

	// Позиция точки на шкале отношений
	if (relationshipPoint) {
		const percent = ((anger + 30) / 40) * 100
		relationshipPoint.style.left = `${percent}%`
	}

	// Сердца жизней
	if (livesContainer) {

		livesContainer.innerHTML = ""

		for (let i = 0; i < 3; i++) {

			const heart =
				document.createElement("img")

			heart.classList.add("life-heart")

			if (i < lives) {
				heart.src = "images/heart.png"
			} else {
				heart.src = "images/bad-heart.png"
			}

			heart.alt = ""

			livesContainer.appendChild(heart)
		}
	}
}


// ==============================
// ИНВЕНТАРЬ
// ==============================

const inventoryButton =
	document.getElementById("inventoryButton")

const inventoryModal =
	document.getElementById("inventoryModal")

const closeInventory =
	document.getElementById("closeInventory")

const inventoryGrid =
	document.getElementById("inventoryGrid")


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
		description: "Странная старая монета.",
		rarity: "common",
		chance: 50
	},

	{
		id: "key",
		name: "Маленький ключ",
		image: "images/key.webp",
		description: "Неизвестно, что он открывает.",
		rarity: "uncommon",
		chance: 30
	},

	{
		id: "cassette",
		name: "Кассета",
		image: "images/cassette.png",
		description: "Верити почему-то не хочет, чтобы ты её включал.",
		rarity: "rare",
		chance: 15
	},

	{
		id: "glass",
		name: "Осколок зеркала",
		image: "images/glass.png",
		description: "Осколок старого зеркала. Странно, но твоё отражение в нём иногда улыбается раньше тебя.",
		rarity: "epic",
		chance: 8
	},

	{
		id: "eye",
		name: "Чёрный глаз",
		image: "images/eye.png",
		description: "Небольшой стеклянный шарик, похожий на глаз. Иногда кажется, что он смотрит на тебя.",
		rarity: "mythic",
		chance: 4
	},

	{
		id: "note",
		name: "Старая записка",
		image: "images/note.webp",
		description: 'В записке кровью написано: "Верити не тот, за кого себя выдает. БЕГИ!!!"',
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

				image.src = item.image
				image.alt = item.name

				image.classList.add(
					"inventory-item"
				)

				slot.appendChild(image)


				const amount =
					document.createElement("div")

				amount.classList.add(
					"item-amount"
				)

				amount.textContent =
					inventory[itemId] > 1
						? inventory[itemId]
						: ""

				slot.appendChild(amount)


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

						document.getElementById(
							"itemName"
						).textContent =
							item.name

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

						rarityElement.textContent =
							rarityNames[item.rarity]

						rarityElement.className =
							`item-rarity ${item.rarity}`


						document.getElementById(
							"itemDescription"
						).textContent =
							item.description
					}
				)
			}
		}

		inventoryGrid.appendChild(slot)
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

	if (!notification || !notificationItem) {
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
// ЭФФЕКТЫ ЭКРАНА
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

	}, 80)
}

function triggerTrustScreamer() {
	const screamer = document.getElementById("verityScreamer")

	if (!screamer) return

	screamer.classList.remove("active")

	void screamer.offsetWidth

	screamer.classList.add("active")

	setTimeout(() => {
		screamer.classList.remove("active")
	}, 700)
}


function randomFlicker() {

	const delay =
		Math.random() * 10000 + 5000

	setTimeout(() => {

		screenFlicker()
		randomFlicker()

	}, delay)
}


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

	}, 350)
}


function randomGlitch() {

	const delay =
		Math.random() * 12000 + 7000

	setTimeout(() => {

		screenGlitch()
		randomGlitch()

	}, delay)
}


// ==============================
// ГЛИТЧ АВАТАРА
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

	const delay =
		Math.random() * 7500 + 800

	setTimeout(() => {

		avatarGlitch()
		randomAvatarGlitch()

	}, delay)
}


// ==============================
// СТАТУС ВЕРИТИ
// ==============================

function changeVerityStatus() {

	const status =
		document.querySelector(
			".chat-status"
		)

	if (!status) {
		return
	}

	status.textContent =
		"не в сети"

	status.classList.add(
		"offline"
	)

	setTimeout(() => {

		status.textContent =
			"в сети"

		status.classList.remove(
			"offline"
		)

	}, Math.random() * 2500 + 1500)
}


function randomStatusChange() {

	const delay =
		Math.random() * 20000 + 10000

	setTimeout(() => {

		changeVerityStatus()
		randomStatusChange()

	}, delay)
}


// ==============================
// СКРИМЕР
// ==============================

function verityScreamer() {

	const screamer =
		document.getElementById(
			"verityScreamer"
		)

	if (!screamer) {
		return
	}

	screamer.classList.remove(
		"active"
	)

	// Перезапуск CSS-анимации
	void screamer.offsetWidth

	screamer.classList.add(
		"active"
	)

	setTimeout(() => {

		screamer.classList.remove(
			"active"
		)

	}, 700)
}


// ==============================
// ВРЕМЕННАЯ СМЕНА АВАТАРА
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

	}, 20000)
}


function randomAvatarChange() {

	const delay =
		Math.random() * 120000 + 60000

	setTimeout(() => {

		changeVerityAvatar()
		randomAvatarChange()

	}, delay)
}

function triggerTrustStatus() {

	const status =
		document.querySelector(".chat-status")

	if (!status) return

	const originalText =
		status.textContent

	status.textContent = "не в сети"

	status.classList.add("offline")

	setTimeout(() => {

		status.textContent = originalText

		status.classList.remove("offline")

	}, 700 + Math.random() * 1000)
}

// ==============================
// КНОПКИ ДИАЛОГА
// ==============================

const choice1 =
	document.getElementById("choice1")

const choice2 =
	document.getElementById("choice2")


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

localStorage.clear()
localStorage.removeItem("verityGame")

loadGame()

renderMessages()
updateGameUI()

randomFlicker()
randomGlitch()
randomAvatarGlitch()
randomStatusChange()
randomAvatarChange()

loadDialogue()