console.log("SCRIPT JS ЗАГРУЗИЛСЯ");

let messagesLeft = 3
let isWaitingForReply = false

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

	console.log(data);
}

document.getElementById("sendButton").addEventListener("click", sendMessage)

document.getElementById("messageInput").addEventListener("keydown", (event) => {
	if (event.key == "Enter") {
		sendMessage()
	}
})

document.getElementById("adButton").addEventListener("click", rewardAd)