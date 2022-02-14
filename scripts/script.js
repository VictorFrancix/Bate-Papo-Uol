let username;
let chat = document.querySelector("ul")
let refreshuser;
let refreshmessages;
let to = "Todos";
let type = "message";



function LogIn(){
    username = {
        name: prompt("Qual o seu nome?")
    };
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", username);
    promise.then(GetMessage);
    promise.then(KeepOnline);
    promise.catch(UserNameChecker);
}

function UserNameChecker(){
    alert("Esse nome já está sendo utilizado!");
    LogIn();
}

function GetMessage(){
    const promise = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages')
    .then(MessageRender);

}

function SubmitUser(){
    const online = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", username)
    .catch(Disconnect);
}

function KeepOnline(){
    refreshmessages = setInterval(SubmitUser,5000);
    refreshuser = setInterval(GetMessage, 2000);
}

function MessageRender(message){
    chat.innerHTML = "";
    let arraymessages = message.data;

    for (let i = 0; i < arraymessages.length ; i++){

        if (arraymessages[i].type === 'status'){
            StatusRender(arraymessages[i])

        }else if(arraymessages[i].type === 'message'){
            PublicRender(arraymessages[i])

        }else{
            PrivateRender(arraymessages[i])
        }
        
        let lastmessage = document.querySelector("ul>li:last-child");
        lastmessage.scrollIntoView();
    }
}

function StatusRender(message){
    chat.innerHTML += `
    <li class = "status" >
        <span>
            <time>(${message.time})</time>
            <strong>${message.from}</strong>
            ${message.text}
        </span>
    </li>
    `
}

function PublicRender(message){
    chat.innerHTML += `
    <li class="public">
        <span>
            <time>(${message.time})  </time>
            <strong>${message.from}</strong>
            para
            <strong>${message.to}</strong>:
            ${message.text}
        </span>
    </li>
    `
}

function PrivateRender(message){
    if (message.to === username.name || message.from === username.name || message.to === 'Todos'){
        chat.innerHTML += `
        <li class="private">
            <span>
                <time>(${message.time})  </time>
                <strong>${message.from}</strong>
                reservadamente para
                <strong>${message.to}</strong>:
                ${message.text}
            </span>
        </li>
        `
    }
}

function SendMessages(){
    const txt = document.querySelector('.text-box input').value;

    if(txt !== ''){
        message = {
            from: username.name,
            to: to,
            text: txt,
            type: type
        }   
    }
    const promise = axios.post('https://mock-api.driven.com.br/api/v4/uol/messages', message)
    promise.catch(Disconnect);
    promise.then(GetMessage);
    promise.then(KeepOnline);
    ClearInput()
}

function ClearInput(){
    let txt = document.querySelector('.text-box input');
    txt.value = '';
}

function Disconnect(){
    alert('Ops, essa não, você foi desconectado... :(');
    clearInterval(refreshuser);
    clearInterval(refreshmessages);
    window.location.reload(true);
}
LogIn()