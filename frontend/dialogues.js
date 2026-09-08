const dialogueTree = {
    start: {
        choices: [
            { text: "Привет, Верити!", reply: "Привет. Рад тебя видеть.", anger: -1, next: "hello" },
            { text: "Ну привет. Чего тебе надо?", reply: "Ничего. Можешь просто поговорить со мной.", anger: 1, next: "hello" }
        ]
    },
    hello: {
        choices: [
            { text: "Как у тебя дела?", reply: "Неплохо. Сегодня здесь довольно спокойно.", anger: -1, next: "about" },
            { text: "Ты вообще умеешь нормально отвечать?", reply: "Умею. Просто не всегда вижу смысл говорить много.", anger: 1, next: "about" }
        ]
    },
    about: {
        choices: [
            { text: "Расскажи о себе.", reply: "Я Верити. Этого пока достаточно.", anger: -1, next: "end" },
            { text: "Ты странный.", reply: "Возможно. Но ты всё ещё здесь.", anger: 1, next: "end" }
        ]
    },
    end: {
        choices: [
            { text: "Мне нравится с тобой говорить.", reply: "Мне тоже.", anger: -1, next: "start" },
            { text: "Ладно, надоел.", reply: "Понимаю.", anger: 1, next: "start" }
        ]
    },
    gameOver: { choices: [] },
    levelComplete: { choices: [] }
};
