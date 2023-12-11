const customCursor = document.querySelector(".custom-cursor")
const closeMenuBtn = document.querySelector(".close-menu")
const aside = document.querySelector("aside")
const selectedList = document.querySelector(".selected")
const selectedItems = document.querySelectorAll(".selected li")
const unselectedList = document.querySelector(".unselected")
const unselectedItems = document.querySelectorAll(".unselected li")
const shareButton = document.querySelector(".share-button")
const shareModale = document.querySelector('.share-modale')
const cancelShareBtn = document.querySelector(".share-modale .cancel")
const continueShareBtn = document.querySelector(".share-modale .continue")
const closeShareModaleBtn = document.querySelector(".share-modale .close")
const copyBtn = document.querySelector(".export-button")
const importInput = document.querySelector(".import-input")
const mainList = document.querySelector(".main-list")
const addBtn = document.querySelector('.add-button')
const addModale = document.querySelector('.add-modale')
const cancelAddBtn = document.querySelector(".add-modale .cancel")
const continueAddBtn = document.querySelector(".add-modale .continue")
const closeAddModaleBtn = document.querySelector(".add-modale .close")
const categoryInput = document.querySelector(".category-input select")
const nameInput = document.querySelector(".name-input input")
const showMenuBtn = document.querySelector(".menu-btn")
const searchInput = document.querySelector(".searchbar input")
const sortInput = document.querySelector(".select-sort")
let mousePosY
let mousePosX
const categories = ["animes"]

if (!localStorage.getItem("datas")) {
    localStorage.setItem("datas", JSON.stringify([]))
}

let datas = JSON.parse(localStorage.getItem("datas"))

function positionCursor(e){
    if (e.clientX) {
        mousePosY = e.clientY
        mousePosX = e.clientX
    }
    customCursor.style.left = mousePosX - 13 + "px"
    customCursor.style.top = mousePosY + window.scrollY - 13 + "px"
};

if (!navigator.userAgent.match(/(Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone)/i)) {
    window.addEventListener("mousemove", (e) => {
        positionCursor(e)
    });
    
    window.addEventListener("scroll", (e) => {
        positionCursor(e)
    })
    
    document.body.addEventListener("mouseenter", (e) => {
        positionCursor(e)
        customCursor.style.opacity = 1
    });
    
    window.addEventListener("mouseout", (e) => {
        if (e.clientX >= window.innerWidth || e.clientX < 0  || e.clientY >= window.innerHeight || e.clientY < 0 ) {
            customCursor.style.opacity = 0
        }
    });
}

function makesHoverable(){
    const hoverable = document.querySelectorAll(".hoverable")
    hoverable.forEach(element => {
        element.addEventListener("mouseover", () => {
            customCursor.style.backgroundColor = "rgba(31, 255, 19, 0.5)"
            customCursor.style.borderRadius = "0 100vw 0 100vw"
        })
        element.addEventListener("mouseout", () => {
            customCursor.style.backgroundColor = ""
            customCursor.style.borderRadius = ""
        })
    });
}

const navItemListener = (element, oldList, newList) => {
    let fnc
    element.addEventListener("click", fnc = () => {
        oldList.removeChild(element)
        newList.appendChild(element)
        element.removeEventListener("click", fnc)
        navItemListener(element, newList, oldList)
        if (newList == selectedList) {
            categories.push(element.id)
        }else{
            categories.splice(categories.indexOf(element.id), 1)
        }
        initializeData()
        customCursor.style.backgroundColor = ""
        customCursor.style.borderRadius = ""
    })
}

closeMenuBtn.addEventListener("click", () => {
    aside.style.left = "-100vw"
})

showMenuBtn.addEventListener("click", () => {
    aside.style.left = "0"
})

unselectedItems.forEach(element => {
    navItemListener(element, unselectedList, selectedList)
});

selectedItems.forEach(element => {
    navItemListener(element, selectedList, unselectedList)
});

const getIcon = (category) => {
    switch (category) {
        case "animes":
            return "./assets/luffy.png";

        case "mangas":
            return "./assets/manga.png";

        case "webtoons":
            return "./assets/webtoon.png";

        case "films":
            return "./assets/CD.png";

        case "series":
            return "./assets/serie.png";

        case "kdramas":
            return "./assets/korea.png";

        case "tdramas":
            return "./assets/thailand.png";

        case "livres":
            return "./assets/book.png";
    
        default:
            break;
    }
}

function initializeData(){
    mainList.innerHTML = null
    let usedData = []
    datas = datas.sort(function (a, b) {
        let sorterA
        let sorterB
        switch (sortInput.value) {
            case "alpha":
                sorterA = a.name.toLowerCase();
                sorterB = b.name.toLowerCase();
                break;
    
            case "category":
                sorterA = a.category;
                sorterB = b.category;
                break;
    
            case "date":
                sorterA = new Date(b.date);
                sorterB = new Date(a.date);
                break;
    
            case "colorBG":
                sorterA = a.colorBG;
                sorterB = b.colorBG;
                break;
    
            case "colorTXT":
                console.log(a.colorTXT)
                sorterA = b.colorTXT;
                sorterB = a.colorTXT;
                break;
        
            default:
                break;
        }
        if (sorterA < sorterB) {
          return -1;
        }
        if (sorterA > sorterB) {
          return 1;
        }
        return 0;
      });
    datas.forEach(data => {
        if (categories.indexOf(data.category) > -1) {
            usedData.push(data)
            const li = document.createElement("li")
            li.style.backgroundColor = data.colorBG
            li.style.color = data.colorTXT
            data.element = li

            const name = document.createElement("p")
            name.classList.add("item-name")
            name.innerText = data.name
            
            const icon = document.createElement("img")
            icon.src = getIcon(data.category)
            icon.classList.add("item-icon")
            
            const dateColorContainer = document.createElement("div")

            const date = document.createElement("p", {class: "item-date"})
            date.classList.add("item-date")
            const day = new Date(data.date).getDate()
            const month = new Date(data.date).getMonth() + 1
            const year = new Date(data.date).getFullYear()
            date.innerText = day + " / " + month + " / " + year

            const colorBg = document.createElement("input")
            colorBg.type = "color"
            colorBg.value = data.colorBG
            colorBg.classList.add("item-color")
            colorBg.classList.add("hoverable")
            colorBg.addEventListener("change", (e) => {
                li.style.background = e.target.value
                data.colorBG = e.target.value
                putDataInLocalStorage()
                
            })

            const colorTxt = document.createElement("input")
            colorTxt.type = "color"
            colorTxt.value = data.colorTXT
            colorTxt.classList.add("item-color")
            colorTxt.classList.add("hoverable")
            colorTxt.addEventListener("change", (e) => {
                li.style.color = e.target.value
                data.colorTXT = e.target.value
                putDataInLocalStorage()
            })
            
            dateColorContainer.appendChild(date)
            dateColorContainer.appendChild(colorBg)
            dateColorContainer.appendChild(colorTxt)

            const cancelTrash = document.createElement("p")
            cancelTrash.classList.add("cancel")
            cancelTrash.classList.add("hoverable")
            cancelTrash.innerHTML = "Annuler"
            cancelTrash.addEventListener("click", () => {
                trashConfirm.style.opacity = 0
                trashConfirm.style.pointerEvents = "none"
            })
            const trashConfirm = document.createElement("div")
            const actionTrash = document.createElement("p")
            actionTrash.classList.add("continue")
            actionTrash.classList.add("hoverable")
            actionTrash.innerHTML = "Confirmer"
            actionTrash.addEventListener("click", () => {
                li.remove()
                datas.splice(datas.indexOf(data), 1)
                putDataInLocalStorage()
                li.style.opacity = 0
                li.style.pointerEvents = "none"
            })
            trashConfirm.classList.add("trash-confirm")
            trashConfirm.appendChild(cancelTrash)
            trashConfirm.appendChild(actionTrash)

            const trash = document.createElement("img")
            trash.src = "./assets/trash-solid.svg"
            trash.classList.add("trash")
            trash.classList.add("hoverable")
            trash.addEventListener("click", () => {
                trashConfirm.style.opacity = 1
                trashConfirm.style.pointerEvents = "all"
            })

            li.appendChild(icon)
            li.appendChild(name)
            li.appendChild(dateColorContainer)
            li.appendChild(trash)
            li.appendChild(trashConfirm)
            mainList.appendChild(li)
        }
    });
    if (usedData.length == 0) {
        const empty = document.createElement("div")
        mainList.appendChild(empty)
    }
    makesHoverable()
    searchItem()
}

initializeData()

function putDataInLocalStorage(){
    localStorage.setItem('datas', JSON.stringify(datas))
}

function closeModale(modale){
    modale.style.opacity = 0;
    modale.style.pointerEvents = "none";
}

addBtn.addEventListener("click", () => {
    addModale.style.opacity = 1;
    addModale.style.pointerEvents = "all";
})

continueAddBtn.addEventListener("click", () => {
    const newData = {
        name: nameInput.value,
        date: new Date(),
        category: categoryInput.value,
        favorite:false,
        view:false,
        colorBG:"#FFFFFF",
        colorTXT: "#000000"
    }
    if (newData.name) {
        datas.unshift(newData)
        putDataInLocalStorage()
        initializeData()
        closeModale(addModale)
    }
})

cancelAddBtn.addEventListener("click", () => {
    closeModale(addModale)
})

closeAddModaleBtn.addEventListener("click", () => {
    closeModale(addModale)
})

shareButton.addEventListener("click", () => {
    shareModale.style.opacity = 1;
    shareModale.style.pointerEvents = "all";
})

copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(localStorage.getItem("datas"))
    copyBtn.innerText = "Copié !"
    setTimeout(() => {
        copyBtn.innerHTML = 'Copier <img src="assets/copy-solid.svg" alt="copy">'
    }, 2000);
})

continueShareBtn.addEventListener("click", () => {
    const JSONimport = JSON.parse(importInput.value)
    if (JSONimport && JSONimport.length > 0) {
        datas = JSONimport;
        putDataInLocalStorage();
        initializeData();
        closeModale(shareModale)
        importInput.value = ""
    }
})

cancelShareBtn.addEventListener("click", () => {
    closeModale(shareModale)
})

closeShareModaleBtn.addEventListener("click", () => {
    closeModale(shareModale)
})

function searchItem(){
    const littleValue = searchInput.value.toLowerCase()
    const noCorespondingData = datas.filter((data) => data.name.toLowerCase().indexOf(littleValue) == -1)
    const correspondingData = datas.filter((data) => data.name.toLowerCase().indexOf(littleValue) > -1)
    noCorespondingData.forEach(data => {
        if (data?.element?.innerHTML) {
            data.element.style.display = "none"
        }
    });
    correspondingData.forEach(data => {
        if (data?.element?.innerHTML) {
            data.element.style.display = ""
        }
    });
}

searchInput.addEventListener("keyup", () => {
    searchItem()
})

sortInput.addEventListener("change", () => {
    initializeData()
})