let username;
let chat = document.querySelector("ul")
username = {
    name: prompt("Qual o seu nome?")
};

function LogIn(){
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", username);
    promise.then(GetMessage);
    promise.catch(UserNameChecker);
}

function UserNameChecker(){
    alert("Esse nome já está sendo utilizado!");
    username = {
        name: prompt("Qual o seu nome?")
    };
    LogIn();
}

function GetMessage(){
    const promise = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages')
    .then(MessageRender);

}

function HandleError(error){}

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

LogIn()