const gameContainer = document.getElementById("game-container");
const continueButton = document.getElementById("continue-button");
const actionsContainer = document.querySelector(".actions-container");
const playerLevel = document.getElementById("player-level");
const playerInput = document.getElementById("playerInput");
const playerName = document.getElementById("player-name");
const playerInventory = document.getElementById("player-inventory");

const SteelDager = {
  type: "Weapon",
  name: "Steel Dagger",
  damage: 50,
  rarity: "Common",
};
const HealthPotion = {
  type: "Healing",
  name: "HealthPotion",
  heal: 50,
  rarity: "Common",
  use: () => {
    Player.heal();
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

  //player methods
  getPlayerName: (name) => {
    console.log(name);
  },
  checkXp: () => {
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
  heal: function healPlayer(value) {
    if (Player.health == 100) {
      const fullHealthMessage = document.createElement("p");
      fullHealthMessage.innerText = "Your health is already full";
      fullHealthMessage.classList.add("text-warning");
      gameContainer.appendChild(fullHealthMessage);
    }
    Player.health = Player.health + value;
  },
};

const quests = [
  {
    index: 0,
    questName: "Village of Hope",
    questSummary:
      "As you begin your journey, you come across the Village of Hope under attack by bandits. The villagers plead for your help. Defeating the bandits will earn you the villagers gratitude and valuable information about Malakars whereabouts.",
    questObjective: "Help the villagers of Hope fend off a bandit attack.",
    completed: false,
    action: "Help villagers",
    questXp: 50,
    questActionFunction: () => {
      const helpAttackBandit = document.createElement("button");
      helpAttackBandit.innerText = `Attack with ${Player.inventory.weapon.name}`;
      actionsContainer.appendChild(helpAttackBandit);
      helpAttackBandit.onclick = () => {
        //player stats updater
        Player.health = Player.health - 50;
        newXp = Player.xp + this.questXp;
        Player.xp = newXp;
        Player.checkXp();
        helpAttackBandit.classList.add("hidden");

        //quest completition main messages
        const successMessage = document.createElement("p");
        successMessage.innerText = "You have successfully defated bandits";
        successMessage.classList.add("text-success");
        gameContainer.appendChild(successMessage);
        const xpMessage = document.createElement("p");
        xpMessage.innerText = "You have gained 50XP";
        xpMessage.classList.add("text-success");
        gameContainer.appendChild(xpMessage);

        //loot drops and actions
        const lootMessage = document.createElement("p");
        lootMessage.innerText = "One Of the bandits dropped a purse...";
        gameContainer.appendChild(lootMessage);

        const lootBandit = document.createElement("button");
        lootBandit.innerText = "Loot Bandit";
        const leavePurse = document.createElement("button");
        leavePurse.innerText = "Leave Purse";

        actionsContainer.appendChild(lootBandit);
        actionsContainer.appendChild(leavePurse);

        lootBandit.onclick = () => {
          console.log("bandit looted");

          //quest continuation
          const villagerMessage = document.createElement("p");
          villagerMessage.innerText =
            '"Villager : Thank you so much traveller... What is your name?";';
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

  Player.inventory.forEach((item) => {
    console.log(item);
    const inventoryItem = document.createElement("span");
    inventoryItem.classList.add("inventory-element");
    inventoryItem.innerText = item.name;
    inventoryItem.onclick = () => {
      item.use();
    };
    playerInventory.appendChild(inventoryItem);
  });
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
