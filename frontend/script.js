console.log("SCRIPT JS ЗАГРУЗИЛСЯ");

let messagesLeft = 3
let isWaitingForReply = false

let inventory = []

inventory.push("coin")
inventory.push("key")
inventory.push("cassette")
inventory.push("note")

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function rewardAd() {
	messagesLeft += 3

	document.getElementById("messagesLeft").textContent = messagesLeft;

	document.getElementById("normalInput").style.display = "flex";
	document.getElementById("adButton").style.display = "none";
}


async function sendMessage() {

	if (isWaitingForReply) {
		return
	}

	const message = document.getElementById("messageInput").value;

	if (!message.trim()) {
		retur
		n
	}
	if (messagesLeft <= 0) {
		return
	}

	isWaitingForReply = true

	const input = document.getElementById("messageInput")
	const sendButton = document.getElementById("sendButton")

	input.disabled = true
	sendButton.disabled = true

	messagesLeft--

	if (messagesLeft <= 0) {
		document.getElementById("normalInput").style.display = "none";
		document.getElementById("adButton").style.display = "block";
	}

	const counter = document.getElementById("messagesLeft")

	counter.textContent = messagesLeft

	counter.classList.remove("counter-change")

	void counter.offsetWidth

	counter.classList.add("counter-change")


	document.getElementById("messageInput").value = ""

	const messages = document.getElementById("messages")

	const newMessage = document.createElement("div")
	newMessage.classList.add("message", "user")

	newMessage.textContent = message
	messages.appendChild(newMessage)

	messages.scrollTop = messages.scrollHeight;


	const typingMessage = document.createElement("div")

	typingMessage.classList.add("message", "verity", "typing")

	typingMessage.innerHTML = `
		<span></span>
		<span></span>
		<span></span>
	`

	messages.appendChild(typingMessage);

	messages.scrollTop = messages.scrollHeight;

	try {
		const response = await fetch("http://127.0.0.1:8000/chat", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				msg: message
			})
		});

		if (!response.ok) {
			throw new Error(`HTTP error: ${response.status}`);
		}

		const data = await response.json();

		await sleep(2000);

		typingMessage.remove();

		const verityMessage = document.createElement("div");
		verityMessage.classList.add("message", "verity");

		verityMessage.textContent = data.reply;
		messages.appendChild(verityMessage);

		messages.scrollTop = messages.scrollHeight;

	} catch (error) {

		console.error("Ошибка:", error);

		typingMessage.remove();

		const errorMessage = document.createElement("div");
		errorMessage.classList.add("message", "verity");

		errorMessage.textContent = "Что-то пошло не так...";

		messages.appendChild(errorMessage);

		messages.scrollTop = messages.scrollHeight;

	} finally {

		isWaitingForReply = false;

		input.disabled = false;
		sendButton.disabled = false;

		input.focus();
	}
}

document.getElementById("sendButton").addEventListener("click", sendMessage)

document.getElementById("messageInput").addEventListener("keydown", (event) => {
	if (event.key == "Enter") {
		sendMessage()
	}
})

document.getElementById("adButton").addEventListener("click", rewardAd)





const inventoryButton = document.getElementById("inventoryButton")
const inventoryModal = document.getElementById("inventoryModal")
const closeInventory = document.getElementById("closeInventory")
const inventoryGrid = document.getElementById("inventoryGrid")

function openInventory() {
	inventoryModal.style.display = "flex"
	renderInventory()
}

function closeInventoryWindow() {
	inventoryModal.style.display = "none"
}


inventoryButton.addEventListener("click", openInventory)

closeInventory.addEventListener("click", closeInventoryWindow)

inventoryModal.addEventListener("click", (event) => {
	if (event.target == inventoryModal) {
		closeInventoryWindow()
	}
})



const items = [
	{
		id: "coin",
		name: "Старая монета",
		image: "images/old_coin.png",
		description: "Странная старая монета."
	},

	{
		id: "key",
		name: "Маленький ключ",
		image: "images/key.webp",
		description: "Неизвестно, что он открывает."
	},

	{
		id: "cassette",
		name: "Кассета",
		image: "images/cassette.png",
		description: "Верити почему-то не хочет, чтобы ты её включал."
	},

	{
		id: "note",
		name: "Старая записка",
		image: "images/note.webp",
		description: "Верити почему-то не хочет, чтобы ты её прочитал."
	},
]

function renderInventory() {
	inventoryGrid.innerHTML = ""

	for (let i = 0; i < 15; i++) {
		const slot = document.createElement("div")

		slot.classList.add("inventory-slot")

		const itemId = inventory[i]

		if (itemId) {
			const item = items.find(item => item.id === itemId)

			if (item) {
				const image = document.createElement("img")

				image.src = item.image
				image.alt = item.name

				image.classList.add("inventory-item")

				slot.appendChild(image)

				slot.title = item.name
			}
		}

		inventoryGrid.append(slot)
	}
}