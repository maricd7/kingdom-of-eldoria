const gameContainer = document.getElementById("game-container");
const continueButton = document.getElementById("continue-button");
const actionsContainer = document.querySelector(".actions-container");
const playerLevel = document.getElementById("player-level");
const playerInput = document.getElementById("playerInput");
const playerName = document.getElementById("player-name");
const playerInventory = document.getElementById("player-inventory");
const playerXp = document.getElementById("player-xp");
const playerGold = document.getElementById("player-gold");
const playerHealth = document.getElementById("player-health");

const SteelDager = {
  type: "Weapon",
  name: "Steel Dagger",
  damage: 50,
  rarity: "Common",
};
const HealthPotion = {
  type: "Healing",
  name: "Health Potion",
  heal: 50,
  rarity: "Common",
  quantity: 4,
  use: () => {
    Player.heal(50);
    HealthPotion.quantity = HealthPotion.quantity - 1;
    if (HealthPotion.quantity < 1) {
      console.log("kvantas", HealthPotion.quantity);
      Player.inventory = Player.inventory.filter(
        (item) => item !== HealthPotion
      );
      Player.loadInventory();
    }
  },
};

const Player = {
  playerName: "Mysterios Warrior",
  health: 100,
  level: 1,
  xp: 0,
  goalXp: 100,
  gold: 50,
  inventory: [SteelDager, HealthPotion],
  equipedWeapon: SteelDager.name,

  //player methods
  getPlayerName: (name) => {
    console.log(name);
  },
  checkXp: () => {
    playerXp.innerText = "XP" + Player.xp;
    if (Player.xp >= Player.goalXp) {
      Player.levelUp();
    } else {
      console.log("You still need more xp");
    }
  },
  levelUp: () => {
    playerLevel.innerText = `Level ${Player.level + 1}`;
  },
  updatePlayerName: (newName) => {
    Player.name = newName;
    playerName.innerText = `Name:${newName}`;
  },
  loadInventory: () => {
    playerInventory.innerHTML = "";
    Player.inventory.forEach((item) => {
      const inventoryItem = document.createElement("span");
      inventoryItem.classList.add("inventory-element");
      if (item.quantity) {
        console.log(item.quantity);
        inventoryItem.innerText = item.name + " x" + item.quantity;
      } else {
        inventoryItem.innerText = item.name;
      }
      inventoryItem.onclick = () => {
        item.use();
      };
      playerInventory.appendChild(inventoryItem);
    });
  },
  checkHp: () => {
    console.log("Check up", Player.health);
    if (Player.health == 100) {
      const fullHealthMessage = document.createElement("p");
      fullHealthMessage.innerText = "Your health is already full";
      fullHealthMessage.classList.add("text-warning");
      gameContainer.appendChild(fullHealthMessage);
    }
    if (Player.health < 50) {
      console.log("loool");
      playerHealth.classList.remove("healthy");
      playerHealth.classList.add("damaged");
    } else {
      playerHealth.classList.add("healthy");
      playerHealth.classList.remove("damaged");
    }
  },
  heal: (value) => {
    const healingMessage = document.createElement("p");
    healingMessage.innerText = "You have successfully healed";
    gameContainer.appendChild(healingMessage);

    Player.health = Player.health + value;
    Player.checkHp();
    playerHealth.innerText = "Health: " + Player.health;
  },
};

const quests = [
  {
    index: 0,
    questName: "Village of Hope",
    questSummary:
      "As you begin your journey, you come across the Village of Hope under attack by bandits. The villagers plead for your help. Defeating the bandits will earn you the villagers' gratitude and valuable information about Malakar's whereabouts.",
    questObjective: "Help the villagers of Hope fend off a bandit attack.",
    completed: false,
    action: "Help villagers",
    questXp: 50,
    questActionFunction: function () {
      const quest = this;
      const battleMessage = document.createElement("p");
      battleMessage.innerText = "Bandits attacked you!";
      gameContainer.appendChild(battleMessage);
      const helpAttackBandit = document.createElement("button");
      helpAttackBandit.innerText = `Attack with ${Player.equipedWeapon}`;
      actionsContainer.appendChild(helpAttackBandit);
      helpAttackBandit.onclick = () => {
        // Player stats updater
        Player.health -= 51;
        playerHealth.innerHTML = "Health : " + Player.health;
        Player.checkHp();
        console.log(quest.questXp, "kvest xp"); // Use the captured context
        const newXp = Player.xp + quest.questXp;
        Player.xp = newXp;
        Player.checkXp();
        playerXp.innerText = `XP ${Player.xp + "/" + Player.goalXp}`;

        helpAttackBandit.classList.add("hidden");

        // Damage from battle
        createDamgeMessage(
          `One of the bandits inflicted ${50} damage... make sure to heal`
        );

        // Quest completion main messages
        createSuccessMessage("You have successfully defeated the bandits");
        createXpMessage(50);
        createLootMessage("One of the bandits dropped a purse...");

        // Loot drops and actions
        const lootBandit = document.createElement("button");
        lootBandit.innerText = "Loot Bandit";
        const leavePurse = document.createElement("button");
        leavePurse.innerText = "Leave Purse";

        actionsContainer.appendChild(lootBandit);
        actionsContainer.appendChild(leavePurse);

        lootBandit.onclick = () => {
          console.log("bandit looted");

          // Quest continuation
          const villagerMessage = document.createElement("p");
          villagerMessage.innerText =
            '"Villager : Thank you so much, traveller... What is your name?";';
          gameContainer.appendChild(villagerMessage);
          playerInput.classList.toggle("hidden");
          playerInput.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              Player.updatePlayerName(event.target.value);
              playerInput.classList.toggle("hidden");
            }
          });
        };
      };
    },
  },
];

const initilizeGame = () => {
  playerLevel.innerText = `Level ${Player.level}`;
  // return console.log(Player.inventory);
  playerHealth.innerText = `Health: ${Player.health}`;
  playerXp.innerText = `XP ${Player.xp + "/" + Player.goalXp}`;
  playerGold.innerText = "Gold: " + Player.gold;
  Player.loadInventory();
};
initilizeGame();

const startQuest = (index) => {
  const questSummary = quests[index].questSummary;
  const newPar = document.createElement("p");
  newPar.innerText = questSummary;
  gameContainer.appendChild(newPar);
  continueButton.classList.toggle("hidden");
  const newAction = document.createElement("button");
  newAction.innerText = quests[index].action;
  actionsContainer.appendChild(newAction);
  newAction.onclick = () => {
    newAction.classList.add("hidden");
    quests[index].questActionFunction();
  };
};

//common message creation functions
const createSuccessMessage = (message) => {
  const successMessage = document.createElement("p");
  successMessage.innerText = message;
  successMessage.classList.add("text-success");
  gameContainer.appendChild(successMessage);
};

const createXpMessage = (xp) => {
  const xpMessage = document.createElement("p");
  xpMessage.innerText = `You have gained ${xp}XP`;
  xpMessage.classList.add("text-success");
  gameContainer.appendChild(xpMessage);
};

const createLootMessage = (message) => {
  const lootMessage = document.createElement("p");
  lootMessage.innerText = message;
  lootMessage.classList.add("text-warning");
  gameContainer.appendChild(lootMessage);
};

const createDamgeMessage = (message) => {
  const damageMessage = document.createElement("p");
  damageMessage.classList.add("text-danger");
  damageMessage.innerText = message;
  gameContainer.appendChild(damageMessage);
  Player.checkHp();
};
