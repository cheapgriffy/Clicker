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
        first_coin: false,
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
        multiplier: 1,
        price: 10,
        effect: function(){state.modifiers.clickPower = state.modifiers.clickPower + this.multiplier}
    },
    {
        name: "Cliques automatiques",
        description: "Duuuh c'est dans le titre ducon",
        bought: false,
        multiplier: 1,
        price: 30,
        effect: () => {
            if(this.bought = true){
                setInterval((e) =>{
                    console.log(upgrade[1].multiplier)
                    clickProcess(1 * upgrade[1].multiplier)
                    render(state)
                }, 2000)
            }
        } ,
    },
    { 
        name: "Bouton doré",
        description: "Un autre bouton aparaitera parfois, il vaut plus",
        bought: false,
        multiplier: 1,
        price: 50,
        effect: (coin_modifier = this.multiplier) => {
            if(getRandomInt(0, 100) == 1){
                console.log(`%cGold Target have spawned`, `background-color:orange; color: black; padding:3px; border-radius: 5em;`)
                let target_element = document.createElement("span")
                target_element.style.position = "absolute"
                target_element.classList = "occasional_target"
                target_element.addEventListener("click", (e) =>{
                    clickProcess(10 * coin_modifier)
                    if(state.achievement.first_coin == false){
                        playAchievement("Aimlab en pls, les vrais il se train sur ça")
                        state.achievemtn.first_coin = true
                    }
                    target_element.remove()
                })
                elements.gameview.appendChild(target_element)
            
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
    state.currency.score += target_value * state.modifiers.multiplier
    blinkElement(elements.label.coins)
    state.currency.coins += target_value * state.modifiers.clickPower


    xpWorks(target_value * state.modifiers.clickPower)

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

        let upgrade_price = element.price * element.multiplier

        div_template.appendChild(title)
        div_template.appendChild(description)
        div_template.appendChild(buy_button)

        buy_button.addEventListener("click", (e) => {
            if(upgrade_price <= state.currency.coins && element.bought == false){
                state.currency.coins = state.currency.coins - upgrade_price
                element.bought = true
                element.effect()
                render(state)
            } else if(upgrade_price <= state.currency.coins && element.bought == true){
                state.currency.coins = state.currency.coins - upgrade_price
                element.multiplier = element.multiplier + 1
                element.effect()
                render(state)
            }

        })

        div_template.classList.add("upgrade")
        buy_button.classList.add("generic-button")

        title.innerText = element.name
        description.innerText = element.description

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
    render(state)

    if(upgrade.filter((e) => e.name == "Bouton doré")[0].bought == true){
        upgrade.filter((e) => e.name == "Bouton doré")[0].effect()
    }
}


elements.target.addEventListener("click", (e) => {
    clickProcess()
})

setInterval(() => {tick()}, 250)