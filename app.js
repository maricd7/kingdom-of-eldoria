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
  checkXp: (currentXp, goalXp) => {
    if (currentXp >= goalXp) {
      console.log("Level Up!");
    }
  },
  // levelUp: (newLevel) => {},
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
        Player.xp = Player.xp + 100;
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
