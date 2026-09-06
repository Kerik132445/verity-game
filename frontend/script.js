console.log("SCRIPT JS ЗАГРУЗИЛСЯ");
async function sendMessage() {
	const message = document.getElementById("messageInput").value;

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

	console.log(data);
}

document.getElementById("sendButton").addEventListener("click", sendMessage)
