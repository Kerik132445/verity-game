console.log("SCRIPT JS ЗАГРУЗИЛСЯ");

let messagesLeft = 3

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

	const message = document.getElementById("messageInput").value;

	if (!message.trim()) {
		return
	}
	if (messagesLeft <= 0) {
		return
	}

	messagesLeft--

	if (messagesLeft <= 0) {
		document.getElementById("normalInput").style.display = "none";
		document.getElementById("adButton").style.display = "block";
	}

	document.getElementById("messagesLeft").textContent = messagesLeft

	document.getElementById("messageInput").value = ""

	const messages = document.getElementById("messages")

	const newMessage = document.createElement("div")
	newMessage.classList.add("message", "user")

	newMessage.textContent = message
	messages.appendChild(newMessage)

	messages.scrollTop = messages.scrollHeight;


	const typingMessage = document.createElement("div")

	typingMessage.classList.add("message", "verity")
	typingMessage.textContent = "Верити печатает..."

	messages.appendChild(typingMessage);
	messages.scrollTop = messages.scrollHeight;

	const response = await fetch("http://127.0.0.1:8000/chat", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			msg: message
		})
	});

	const data = await response.json();

	await sleep(2000)

	typingMessage.remove();

	const verityMessage = document.createElement("div")
	verityMessage.classList.add("message", "verity")

	verityMessage.textContent = data.reply
	messages.appendChild(verityMessage)

	messages.scrollTop = messages.scrollHeight;

	console.log(data);
}

document.getElementById("sendButton").addEventListener("click", sendMessage)

document.getElementById("messageInput").addEventListener("keydown", (event) => {
	if (event.key == "Enter") {
		sendMessage()
	}
})

document.getElementById("adButton").addEventListener("click", rewardAd)