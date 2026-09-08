console.log("VERITY GAME: ДИАЛОГИ ЗАГРУЖЕНЫ");

const SAVE_KEY = "verityGameV2";

let state = { node:"start", anger:0, lives:3, messages:[], inventory:{} };

loadGame();
renderGame();
updateStats();
setupInventory();

function saveGame(){localStorage.setItem(SAVE_KEY,JSON.stringify(state));}
function loadGame(){
    const saved=localStorage.getItem(SAVE_KEY);
    if(!saved)return;
    try{state={...state,...JSON.parse(saved)};}catch{localStorage.removeItem(SAVE_KEY);}
}

function renderGame(){renderMessages();renderChoices();}

function renderMessages(){
    const container=document.getElementById("messages");
    container.innerHTML="";
    for(const message of state.messages){
        const element=document.createElement("div");
        element.classList.add("message",message.sender==="user"?"user":"verity");
        element.textContent=message.text;
        container.appendChild(element);
    }
    container.scrollTop=container.scrollHeight;
}

function renderChoices(){
    const container=document.getElementById("choices");
    const node=dialogueTree[state.node];
    container.innerHTML="";
    container.classList.remove("disabled");
    if(!node?.choices?.length)return;

    node.choices.forEach((choice,index)=>{
        const button=document.createElement("button");
        button.className="choice-button";
        button.textContent=choice.text;
        button.addEventListener("click",()=>choose(choice));
        container.appendChild(button);
        setTimeout(()=>button.classList.add("show"),index*80);
    });
}

async function choose(choice){
    const container=document.getElementById("choices");
    if(container.classList.contains("disabled"))return;

    container.classList.add("disabled");
    addMessage("user",choice.text);
    await sleep(250);
    addMessage("verity",choice.reply);

    state.anger+=choice.anger;

    if(state.anger>=10){
        triggerScreamer();
        state.lives--;
        state.anger=0;

        if(state.lives<=0){
            state.node="gameOver";
            saveGame();
            updateStats();
            renderGame();
            return;
        }
    }

    if(state.anger<=-5){
        state.node="levelComplete";
        saveGame();
        updateStats();
        renderGame();
        return;
    }

    state.node=choice.next;
    saveGame();
    updateStats();
    renderGame();
}

function addMessage(sender,text){
    state.messages.push({sender,text});
    renderMessages();
    saveGame();
}

function updateStats(){
    const anger=document.getElementById("anger");
    const lives=document.getElementById("lives");
    if(anger)anger.textContent=state.anger<0?\`Любовь: \${Math.abs(state.anger)}/5\`:\`Злость: \${state.anger}/10\`;
    if(lives)lives.textContent="❤".repeat(Math.max(0,state.lives));
}

function triggerScreamer(){
    const screamer=document.getElementById("verityScreamer");
    if(!screamer)return;
    screamer.classList.remove("active");
    void screamer.offsetWidth;
    screamer.classList.add("active");
    setTimeout(()=>screamer.classList.remove("active"),700);
}

function sleep(ms){return new Promise(resolve=>setTimeout(resolve,ms));}

function resetGame(){localStorage.removeItem(SAVE_KEY);location.reload();}
document.getElementById("resetGame")?.addEventListener("click",resetGame);

/* Инвентарь */

const items=[
    {id:"coin",name:"Старая монета",image:"images/old_coin.png",description:"Странная старая монета.",rarity:"common",chance:50},
    {id:"key",name:"Маленький ключ",image:"images/key.webp",description:"Неизвестно, что он открывает.",rarity:"uncommon",chance:30},
    {id:"cassette",name:"Кассета",image:"images/cassette.png",description:"Верити почему-то не хочет, чтобы ты её включал.",rarity:"rare",chance:15},
    {id:"glass",name:"Осколок зеркала",image:"images/glass.png",description:"Осколок старого зеркала.",rarity:"epic",chance:8},
    {id:"eye",name:"Чёрный глаз",image:"images/eye.png",description:"Небольшой стеклянный шарик, похожий на глаз.",rarity:"mythic",chance:4},
    {id:"note",name:"Старая записка",image:"images/note.webp",description:"Странная старая записка.",rarity:"legendary",chance:2}
];

function setupInventory(){
    const button=document.getElementById("inventoryButton");
    const modal=document.getElementById("inventoryModal");
    const close=document.getElementById("closeInventory");

    button?.addEventListener("click",()=>{modal.style.display="flex";renderInventory();});
    close?.addEventListener("click",()=>modal.style.display="none");
    modal?.addEventListener("click",e=>{if(e.target===modal)modal.style.display="none";});
    document.getElementById("itemAdButton")?.addEventListener("click",rewardItem);
    document.getElementById("skinButton")?.addEventListener("click",()=>alert("Система скинов пока находится в разработке."));
}

function renderInventory(){
    const grid=document.getElementById("inventoryGrid");
    if(!grid)return;
    grid.innerHTML="";
    const ids=Object.keys(state.inventory);

    ids.slice(0,15).forEach(id=>{
        const item=items.find(item=>item.id===id);
        if(!item)return;
        const slot=document.createElement("div");
        slot.className="inventory-slot";

        const image=document.createElement("img");
        image.src=item.image;
        image.alt=item.name;
        image.className="inventory-item";
        slot.appendChild(image);

        if(state.inventory[id]>1){
            const amount=document.createElement("div");
            amount.className="item-amount";
            amount.textContent=state.inventory[id];
            slot.appendChild(amount);
        }

        slot.addEventListener("click",()=>{
            document.getElementById("itemName").textContent=item.name;
            document.getElementById("itemDescription").textContent=item.description;
            document.getElementById("itemRarity").textContent=item.rarity;
        });
        grid.appendChild(slot);
    });

    for(let i=ids.length;i<15;i++)grid.appendChild(document.createElement("div")).className="inventory-slot";
}

function rewardItem(){
    const ids=Object.keys(state.inventory);
    const item=getRandomItem();

    if(ids.length>=15&&!state.inventory[item.id]){
        showItemNotification("Инвентарь заполнен!");
        return;
    }

    state.inventory[item.id]=(state.inventory[item.id]||0)+1;
    saveGame();
    showItemNotification(\`Ты получил: \${item.name}\`);
    renderInventory();
}

function getRandomItem(){
    const random=Math.random()*100;
    let chance=0;
    for(const item of items){
        chance+=item.chance;
        if(random<chance)return item;
    }
    return items[0];
}

function showItemNotification(text){
    const notification=document.getElementById("itemNotification");
    const textElement=document.getElementById("notificationItem");
    if(!notification||!textElement)return;
    textElement.textContent=text;
    notification.classList.add("show");
    setTimeout(()=>notification.classList.remove("show"),2500);
}

/* Визуальные эффекты */

function screenFlicker(){
    const screen=document.querySelector(".phone-screen");
    if(!screen)return;
    screen.classList.add("flicker");
    setTimeout(()=>screen.classList.remove("flicker"),80);
}
function randomFlicker(){setTimeout(()=>{screenFlicker();randomFlicker();},Math.random()*10000+5000);}
randomFlicker();

function screenGlitch(){
    const screen=document.querySelector(".phone-screen");
    if(!screen)return;
    screen.classList.remove("glitch");
    void screen.offsetWidth;
    screen.classList.add("glitch");
    setTimeout(()=>screen.classList.remove("glitch"),350);
}
function randomGlitch(){setTimeout(()=>{screenGlitch();randomGlitch();},Math.random()*12000+7000);}
randomGlitch();

function avatarGlitch(){
    const avatar=document.querySelector(".avatar");
    if(!avatar)return;
    avatar.classList.remove("avatar-glitch");
    void avatar.offsetWidth;
    avatar.classList.add("avatar-glitch");
    setTimeout(()=>avatar.classList.remove("avatar-glitch"),250);
}
function randomAvatarGlitch(){setTimeout(()=>{avatarGlitch();randomAvatarGlitch();},Math.random()*7500+800);}
randomAvatarGlitch();

function changeVerityStatus(){
    const status=document.querySelector(".chat-status");
    if(!status)return;
    status.textContent="не в сети";
    status.classList.add("offline");
    setTimeout(()=>{
        status.textContent="в сети";
        status.classList.remove("offline");
    },Math.random()*2500+1500);
}
function randomStatusChange(){setTimeout(()=>{changeVerityStatus();randomStatusChange();},Math.random()*20000+10000);}
randomStatusChange();

function changeVerityAvatar(){
    const avatar=document.querySelector(".avatar img");
    if(!avatar)return;
    avatar.src="images/verity-v2.png";
    setTimeout(()=>avatar.src="images/verity.png",20000);
}
function randomAvatarChange(){setTimeout(()=>{changeVerityAvatar();randomAvatarChange();},Math.random()*120000+60000);}
randomAvatarChange();
