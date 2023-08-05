let ls1 = []
let ls2 = []


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
    var modelChoice, max_tokens, temperature, oldmsgs

    if (llm === "llm1"){
        modelChoice = document.getElementById("model1").value
        temperature = parseFloat(document.getElementById("Temperature1").value)
        max_tokens = parseInt(document.getElementById("MaxTokens1").value)
        oldmsgs = ls1


    } else{
        modelChoice = document.getElementById("model2").value
        temperature = parseFloat(document.getElementById("Temperature2").value)
        max_tokens = parseInt(document.getElementById("MaxTokens2").value)
        oldmsgs = ls2
    }
    ans = await call(modelChoice, message,max_tokens,temperature, oldmsgs)
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
        if (chatId === "llm1-chat"){
            ls1.push({role:"user",content:message})
        }
        else{
            ls2.push({role:"user",content:message})
        }
    } else {
        if (chatId === "llm1-chat"){
            ls1.push({role:"system",content:message})
        } else{
            ls2.push({role:"system",content:message})
        }
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
            ls1 = []
        }else{
            node = document.getElementById('1msg2');  
            ls2 = []
        }
        const clone = node.cloneNode(true);
        const parentNode = node.parentNode;
        parentNode.innerHTML = '';
        parentNode.append(clone);
    
}

async function call(modelChoice, message, maxtokens,tempe, ls){
    const OPENAI_API_KEY = await fetch("/.netlify/functions/getApiKey");
    console.log(OPENAI_API_KEY)
    console.log(ls + [{role: "user", content:message }])

    if (modelChoice === "gpt"){
        opts = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: ls ,
                max_tokens:maxtokens,
                temperature:tempe

            })
        }
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', opts);        
            const data = await response.json()
            console.log(data.choices[0].message.content)
            return data.choices[0].message.content
            

        } catch (error) {
            console.error(error)
        }
    } else{

    }

}