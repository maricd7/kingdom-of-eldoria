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

const quests = [
  {
    index: 0,
    questName: "Village of Hope",
    questSummary:
      "As you begin your journey, you come across the Village of Hope under attack by bandits. The villagers plead for your help. Defeating the bandits will earn you the villagers gratitude and valuable information about Malakars whereabouts.",
    questObjective: "Help the villagers of Hope fend off a bandit attack.",
    completed: false,
  },
];
const Player = {
  playerName: "Mysterios Warrior",
  getPlayerName: (name) => {
    console.log(name);
  },
};

continueButton.addEventListener("click", () => {
  startQuest(0);
});

const startQuest = (index) => {
  const questSummary = quests[index].questSummary;
  const newPar = document.createElement("p");
  newPar.innerText = questSummary;
  gameContainer.appendChild(newPar);
};
