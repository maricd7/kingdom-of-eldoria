//pseudo archi
//load player  (level,health,gold,quest done,current quest,)
//
//
//
//
//
//
//
//
//
//
//
//
//
const gameContainer = document.getElementById("game-container");
const continueButton = document.getElementById("continue-button");
const actionsContainer = document.querySelector(".actions-container");
const playerLevel = document.getElementById("player-level");
const playerInput = document.getElementById("playerInput");
const playerName = document.getElementById("player-name");

const SteelDager = {
  type: "Weapon",
  name: "Steel Dagger",
  damage: 50,
  rarity: "Common",
};

const Player = {
  playerName: "Mysterios Warrior",
  health: 100,
  level: 1,
  xp: 0,
  goalXp: 100,
  inventory: {
    weapon: SteelDager,
    healing: "Health Potion",
  },

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
    questActionFunction: () => {
      const helpAttackBandit = document.createElement("button");
      helpAttackBandit.innerText = `Attack with ${Player.inventory.weapon.name}`;
      actionsContainer.appendChild(helpAttackBandit);
      helpAttackBandit.onclick = () => {
        Player.health = Player.health - 50;
        newXp = Player.xp + 100;
        Player.xp = newXp;
        Player.checkXp();
        helpAttackBandit.classList.add("hidden");

        const successMessage = document.createElement("p");
        successMessage.innerText = "You have successfully defated bandits";
        successMessage.classList.add("text-success");
        gameContainer.appendChild(successMessage);
        const xpMessage = document.createElement("p");
        xpMessage.innerText = "You have gained 50XP";
        xpMessage.classList.add("text-success");
        gameContainer.appendChild(xpMessage);
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
    },
  },
];

const initilizeGame = () => {
  playerLevel.innerText = `Level ${Player.level}`;
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
