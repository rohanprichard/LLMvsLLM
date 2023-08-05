import OPENAI_API_KEY from "./apikeys";

async function sendMessage() {
    var userMessage = document.getElementById("user-input").value;
    document.getElementById("user-input").value = "";
    if(userMessage === ""){
        return
    }
    var selectedLLM = getSelectedLLM();
    console.log(selectedLLM)
    if (selectedLLM === "dual") {
        modelChoice1 = document.getElementById("model1").value
        modelChoice2 = document.getElementById("model2").value
        
        if(modelChoice1 === "" || modelChoice2 === ""){
            return
        }

        displayMessage("user-message", userMessage, "llm2-chat");
        displayMessage("user-message", userMessage, "llm1-chat");
        sendToLLM("llm1", userMessage);
        sendToLLM("llm2", userMessage);
    } else {
        if (selectedLLM === "llm1"){
            modelChoice1 = document.getElementById("model1").value
            if (modelChoice1 === ""){
                return
            }
        }else{
            modelChoice2 = document.getElementById("model2").value
            if (modelChoice2 === ""){
                return
            }
        }
        displayMessage("user-message", userMessage, selectedLLM + "-chat");
        sendToLLM(selectedLLM, userMessage, 0);
    }
}

function setName1(){
    modelChoice = document.getElementById("model1").value

    if (modelChoice === "gpt"){
        listTags = document.getElementsByClassName("llm1-name")
        for (let i = 0; i < listTags.length; i++) {
            console.log(listTags)
            listTags[i].innerText = "GPT-3.5"
          }
    } else if(modelChoice === "llama"){
        listTags = document.getElementsByClassName("llm1-name")
        for (let i = 0; i < listTags.length; i++) {
            listTags[i].innerText = "Llama2"
          }
    } else{
        listTags = document.getElementsByClassName("llm1-name")
        for (let i = 0; i < listTags.length; i++) {
            listTags[i].innerText = "LLM 1"
          }
    }
    clearChat(1)
}


function setName2(){
    modelChoice = document.getElementById("model2").value

    if (modelChoice === "gpt"){
        listTags = document.getElementsByClassName("llm2-name")
        for (let i = 0; i < listTags.length; i++) {
            console.log(listTags)
            listTags[i].innerText = "GPT-3.5"
          }
    } else if(modelChoice === "llama"){
        listTags = document.getElementsByClassName("llm2-name")
        for (let i = 0; i < listTags.length; i++) {
            listTags[i].innerText = "Llama2"
          }
    } else{
        listTags = document.getElementsByClassName("llm2-name")
        for (let i = 0; i < listTags.length; i++) {
            listTags[i].innerText = "LLM 2"
          }
    }
    clearChat(2)
}

function getSelectedLLM() {
    var radioButtons = document.getElementsByName("llm");
    for (var i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].checked) {
            return radioButtons[i].value;
        }
    }
}


async function sendToLLM(llm, message) {
    var modelChoice
    if (llm === "llm1"){
        modelChoice = document.getElementById("model1").value
    } else{
        modelChoice = document.getElementById("model2").value
    }
    ans = call(modelChoice, message)
    console.log(modelChoice + "Is the model")
    var response =  modelChoice + ": " + ans;
    displayMessage("llm-message", response, llm + "-chat");
}


function displayMessage(type, message, chatId) {
    var chatBox = document.getElementById(chatId);
    var messageDiv = document.createElement("div");
    messageDiv.className = type;


    if (type === "user-message"){    
        messageDiv.textContent =  "Me: " + message;
    } else {
        messageDiv.textContent =  message;
        
    }
    console.log(messageDiv, type, chatId)
    chatBox.appendChild(messageDiv);
    console.log(type, message, chatId)
    chatBox.scrollTop = chatBox.scrollHeight;
}

function clearChat(n){
        var node
        if (n == 1){
            node = document.getElementById('1msg1');
        }else{
            node = document.getElementById('1msg2');  
        }
        const clone = node.cloneNode(true);
        const parentNode = node.parentNode;
        parentNode.innerHTML = '';
        parentNode.append(clone);
    
}

async function call(modelChoice, message){
    return
    const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            llm: llm,
            message: message
        })
    });
    const data = await response.json();
    const generatedResponse = data.response;

}