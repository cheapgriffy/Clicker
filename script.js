let state = {
    currency: {
        //total clicks
        score: 0,
        //gained with modifier and shit
        coins: 0,
        
        level: 1,
        experience: 0,
    },
    
    modifiers: {
        clickPower: 1,
        multiplier: 1,
        autoIncome: 0,
    },
    
    achievement:{
        first_level: false,
        first_10_coin: false,
    },
    debug:{
        log: "",
    },
}

// multiplyer here is the amont of time he bough it
// the usage fonction of those upgrades are directly inside objects
let upgrade = [
    {
        name: "Boost de puissance",
        description: "Rend vos clicks plus puissants",
        bought: false,
        multiplier: 0,
        price: 10,
        effect: () => {state.modifiers.clickPower++}
    },
    {
        name: "Cliques automatiques",
        description: "Clique automatiquement, ne prend pas en compte le Boost de puissance",
        bought: false,
        multiplier: 0,
        price: 30,
        effect: () => {
            let = current_object = upgrade.filter((e) => e.name == "Cliques automatiques")[0]
            if(this.bought = true){
                setInterval((e) =>{
                    console.log(upgrade[1].multiplier)
                    clickProcess(1 * upgrade[1].multiplier)
                    render(state)
                }, 2000)

                for (let i = 0; i < current_object.multiplier ; i++) {
                    let element = document.createElement("span")
                    element.classList.add("autoclick-minions")
                    
                    elements.gameview.appendChild(element)
                }
            }
        } ,
    },
    { 
        name: "Bouton doré",
        description: "Un autre bouton aparaitera parfois, il vaut plus",
        bought: false,
        multiplier: 0,
        price: 50,
        effect: () => {
            if(getRandomInt(0, 50) == 1){
                console.log(`%cGold Target have spawned`, `background-color:orange; color: black; padding:3px; border-radius: 5em;`)
                let target_element = document.createElement("span")
                target_element.style.position = "absolute"
                target_element.classList = "occasional_target"
                target_element.addEventListener("click", (e) =>{
                    clickProcess(10 * state.modifiers.clickPower * upgrade.filter((e) => e.name == "Bouton doré")[0].multiplier)
                    target_element.remove()
                })
                elements.gameview.appendChild(target_element)

                let disapear_timer = setTimeout(() => {
                    target_element.remove()
                }, 5000)
            
                target_element.style.transform = `translate(
                ${getRandomInt(elements.gameview.offsetWidth / 3 * -1, elements.gameview.offsetWidth / 3)}px, 
                ${getRandomInt(elements.gameview.offsetHeight / 3 *-1, elements.gameview.offsetHeight / 3)}px`
            }
        } ,
    },
]



// contain direct html calls
let elements = {
    label: {
        score: document.getElementById("score-label"),
        coins: document.getElementById("coin-label"),
        lvl: document.getElementById("lvl-label"),
        xp: document.getElementById("xp-label"),
        xp_wrapper: document.querySelector(".loading-bar"),
        xp_fill: document.getElementById("xp-fill") ,
    },
    target: document.getElementById("clickable"), 
    pannel: document.querySelector(".pannel"),
    gameview: document.querySelector(".gameview"),
    // the div that contain upgrades output
    upgrades: document.querySelector(".upgrades"),
    achievement:{
        root_element: document.getElementById("achievement"),
        text_area: document.getElementById("achievement-content"),
        text: document.querySelector(".achievement-text"),
        icon: document.getElementById("achievement-illustration"),
    },
}


/**
 * register any modification to clicks
 * target_value can change based on thing that is clicked, like if you get occasional better target
 * @param {provided number by the clicked element} target_value 
 */
function clickProcess(target_value = 1){
    blinkElement(elements.label.score)
    state.currency.score += target_value
    blinkElement(elements.label.coins)
    state.currency.coins += target_value

    xpWorks(target_value)

    render(state)
} 


/**
 * yellow effect on ellement
 * @param {hmtl element} e 
 */
function blinkElement(e){
    e.style.animation = "none"
    // ? change animation doesn rerender the element,
    // ? so i call offsetHeigh to trick browser into thinking he need to be rerendered 
    e.offsetHeight;
    e.style.animation = "blink 0.5s ease"
}

/**
 * user everytime you wanna add xp, handle leveling system
 * @param {xp amont that will be processed} xp_received 
 */
function xpWorks(xp_received = 0){
    state.currency.experience += xp_received
    blinkElement(elements.label.xp)
    let xp_required = state.currency.level * state.currency.level * 15
    let percentage = state.currency.experience / xp_required *100

    if(percentage < 100){
        elements.label.xp_fill.style.width = `${percentage.toFixed(0)}%`
    } else{ 
        elements.label.xp_fill.style.width = "0%"
        state.currency.experience = 0
        state.currency.level ++
        blinkElement(elements.label.lvl)
    }
}


function playAchievement(content = "Rien du tout", image = "url(/assets/icons/Achivement_default.png)"){
    elements.achievement.text.innerHTML = content 
    elements.achievement.icon.style.backgroundImage = image
    elements.achievement.root_element.style.opacity = "100%"
    elements.achievement.root_element.style.animation = "achievement-text 5s ease forwards"
    elements.achievement.text_area.style.animation = "achievement-expand 5s ease"
    elements.achievement.text.style.animation = "animation: achievement-text ease 5s"
    setInterval((e) => {
        elements.achievement.text_area.style.animation = "none"
        elements.achievement.text.style.animation = "none"
        elements.achievement.root_element.style.animation = "none"
        elements.achievement.root_element.style.opacity = "0%"
    },5000)
}


function randomTargets(coin_modifier = 1){

}



/**
 * Create the buy element and shit, register buy and coins management too
 * @param {whole hecking array} upgrade 
 */
function renderUpgrade(upgrade){
    elements.upgrades.innerHTML = ""
    upgrade.forEach(element => {
        let div_template = document.createElement("div")
        let title = document.createElement("h2")
        let description = document.createElement("h4")
        let buy_button = document.createElement("button")

        let upgrade_price = 0

        // Handle price check for multiply bought element
        if (element.bought != false){
            let temp_increment_element = element.multiplier + 1
            upgrade_price = element.price * temp_increment_element
        } else if (element.bought == false) {
            upgrade_price = element.price
        }
        
        buy_button.addEventListener("click", (e) => {
            if(upgrade_price <= state.currency.coins && element.bought == false){
                state.currency.coins = state.currency.coins - upgrade_price
                element.bought = true
                
                element.multiplier++
                element.effect()
                render(state)
            } else if(upgrade_price <= state.currency.coins && element.bought == true){
                state.currency.coins = state.currency.coins - upgrade_price
                element.multiplier++
                console.log("test")
                element.effect()
                render(state)
            }
            
        })
        

        div_template.appendChild(title)
        div_template.appendChild(description)
        div_template.appendChild(buy_button)
        div_template.classList.add("upgrade")
        buy_button.classList.add("generic-button")

        title.innerText = element.name
        description.innerText = `${element.description}, Acheté ${element.multiplier}`

        if(element.bought == true){
            buy_button.innerText = `Acheté ${element.multiplier}, ${upgrade_price}`
        } else{
            buy_button.innerText = `${upgrade_price} Coins`
        }
        
        elements.upgrades.appendChild(div_template)
    });
}

/**
 * give random number between two inputs.
 * @min
 * @max
 * @returns a random int between the two values 
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}


/**
 * interface with player ui
 * @param {contain player state} state 
 */
function render(state){
    // Updates scores and shit
    elements.label.score.innerText = state.currency.score
    elements.label.coins.innerText = state.currency.coins
    elements.label.lvl.innerText = state.currency.level
    elements.label.xp.innerText = state.currency.experience

    if(state.currency.level == 2 && state.achievement.first_level == false){
        playAchievement("Premier level ! <br> Le debut d'une longue procrastination")
        state.achievement.first_level = true
    }
    renderUpgrade(upgrade)
}


function tick(){
    
    if(upgrade.filter((e) => e.name == "Bouton doré")[0].bought == true){
        upgrade.filter((e) => e.name == "Bouton doré")[0].effect()
    }
}


elements.target.addEventListener("click", (e) => {
    clickProcess(state.modifiers.clickPower)
})

render(state)
setInterval(() => {tick()}, 300)