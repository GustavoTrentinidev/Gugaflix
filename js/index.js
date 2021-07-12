const db = firebase.firestore()
let tasks = []
let currentUser = {}

function getUser() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            currentUser.uid = user.uid
            readTasks()
            let userLabel = document.getElementById("navbarDropdown")
            userLabel.innerHTML = user.email
        } else {
        swal
            .fire({
                icon: "success",
                title: "Redirecionando para a tela de autenticação",
            })
            .then(() => {
                setTimeout(() => {
                    window.location.replace("login.html")
            }, 1000)
          })
        }
    })
}

function createDelButton(task) {
    const newButton = document.createElement("button")
    newButton.setAttribute("class","btn btn-danger btn-excluir")
    newButton.setAttribute("onclick",`excluir("${task.id}")`)
    newButton.setAttribute("id", task.id)
    newButton.appendChild(document.createTextNode("Excluir"))
    return newButton
}

function createTrailerButton(task) {
    const newButtonT = document.createElement("button")
    newButtonT.setAttribute("class","btn btn-danger btn-trailer")
    newButtonT.setAttribute("onclick",`teste("${task.trailer}")`)
    newButtonT.appendChild(document.createTextNode("Trailer"))
    return newButtonT
}

function renderTasks() {
    let itemList = document.getElementById('itemList')
    itemList.innerHTML = ""
    for (let task of tasks) {
        const newContainer = document.createElement("div")
        newContainer.setAttribute(
            "class", "botao-foto"
        )
        const botoes = document.createElement("div")
        botoes.setAttribute(
            "class", "botoes d-flex flex-column"
        )
        itemList.appendChild(newContainer)
        const newItem = document.createElement("img") 
        newItem.setAttribute(
            "src", `${task.title}`
        )
        newItem.setAttribute(
            "class", "mt-4 ml-2"
        )
        newItem.setAttribute(
            "id", task.id
        )
        /*newItem.setAttribute(
            "onclick", `teste("${task.trailer}")`
        )*/
        newContainer.appendChild(createDelButton(task))
        console.log(task.trailer)
        newContainer.appendChild(createTrailerButton(task))
        newContainer.appendChild(newItem)
    }
}

async function readTasks(){
    tasks = []
    const logTasks = await db.collection("tasks").where("owner","==", currentUser.uid).get()
    for (doc of logTasks.docs){
        tasks.push({
            id: doc.id,
            title: doc.data().title,
            trailer: doc.data().trailer,
        })
    }
    renderTasks()
}

async function addTask() {
    const title = document.getElementById('newItem').value
    const trailer = document.getElementById('newTrailer').value
    if (title !== ""){
        let input = document.getElementById('newItem')
        let input1 = document.getElementById('newTrailer')
        await db.collection("tasks").add({
            title: title,
            owner: currentUser.uid,
            trailer: trailer,
        })
        readTasks()
        input.value = ""
        input1.value = ""
    }
}

async function excluir(id) {
    await db.collection("tasks").doc(id).delete()
    readTasks()
}


window.onload = function () {
    getUser() 
}

function teste(trailer){
    var trailerMostrado = trailer.replace("watch?v=", "embed/")
    trailerMostrado = trailerMostrado.split("&")   
    swal.fire({
        html: `<iframe width="560" height="315" src="${trailerMostrado[0]}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
        width: "fit-content",
        background: "#343a40",
        confirmButtonColor: "#dc3545",
    })
    if (trailerMostrado[0] == "") {
        swal.fire({
            icon: "error",
            confirmButtonColor: "#dc3545",
            title: "Trailer não adicionado",
            color:"#dc3545",
        })
    }

    
}
