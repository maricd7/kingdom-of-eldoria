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
const questModal = document.getElementById("quest-modal");
const questModalBtn = document.getElementById("hide-quest");
const questCompletedModal = document.getElementById("quest-modal-completed");
const questCompletedModalBtn = document.getElementById("hide-quest-completed");
const shopModal = document.querySelector(".shop");
const exitShopBtn = document.querySelector(".exit-shop-btn");
const openShopBtn = document.querySelector(".openShopBtn");

const SteelDager = {
  type: "Weapon",
  name: "Steel Dagger",
  damage: 50,
  rarity: "Common",
  price: 50,
};

class ancientArtifact {
  constructor() {
    this.type = "Arifact";
    this.name = "Ancient Artifact";
  }
}

class HealthPotion {
  constructor(quantity) {
    this.type = "Healing";
    this.name = "Health Potion";
    this.heal = 50;
    this.rarity = "Common";
    this.quantity = quantity;
    this.price = 10;
  }

  //pot healing method
  use() {
    Player.heal(this.heal);
    this.quantity -= 1;
    if (this.quantity < 1) {
      Player.inventory = Player.inventory.filter((item) => item !== this);
    }
    Player.loadInventory();
  }
}
const BattleAxe = {
  type: "Weapon",
  name: "Battle Axe",
  damage: 100,
  rarity: "rare",
  price: 150,
};

const Player = {
  playerName: "Mysterios Warrior",
  health: 100,
  level: 1,
  xp: 0,
  goalXp: 100,
  gold: 50,
  inventory: [SteelDager, new HealthPotion(1)],
  equipedWeapon: SteelDager,

  //player methods
  getPlayerName: (name) => {
    console.log(name);
  },
  updatePlayerGold: (qty) => {
    Player.gold += qty;
    playerGold.innerText = "Gold: " + Player.gold;
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
        inventoryItem.innerText = item.name + " x" + item.quantity;
      } else {
        inventoryItem.innerText = item.name;
      }
      inventoryItem.onclick = () => {
        if (item.type === "Weapon") {
          return Player.equipWeapon(item);
        }

        item.use();
      };
      playerInventory.appendChild(inventoryItem);
    });
  },
  checkHp: () => {
    if (Player.health == 100) {
      const fullHealthMessage = document.createElement("p");
      fullHealthMessage.innerText = "Your health is already full";
      fullHealthMessage.classList.add("text-warning");
      gameContainer.appendChild(fullHealthMessage);
    }
    if (Player.health < 50) {
      playerHealth.classList.remove("healthy");
      playerHealth.classList.add("damaged");
    } else {
      playerHealth.classList.add("healthy");
      playerHealth.classList.remove("damaged");
    }
  },
  heal: (value) => {
    createHealingMessage();
    Player.health = Player.health + value;
    Player.checkHp();
    playerHealth.innerText = "Health: " + Player.health;
  },
  equipWeapon: (weapon) => {
    if (Player.equipedWeapon === weapon) {
      const alreadyEquipedWeaponMessage = document.createElement("p");
      alreadyEquipedWeaponMessage.classList.add("text-success");
      alreadyEquipedWeaponMessage.innerText = `${weapon.name} is already equipped.`;
      gameContainer.appendChild(alreadyEquipedWeaponMessage);
      return;
    }
    Player.equipedWeapon = weapon;
    const equipedWeaponMessage = document.createElement("p");
    equipedWeaponMessage.classList.add("text-success");
    equipedWeaponMessage.innerText = `You have equipped ${weapon.name} it does ${weapon.damage} damage`;
    gameContainer.appendChild(equipedWeaponMessage);
    Player.loadInventory();
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
      battleMessage.classList.add("text-danger");
      gameContainer.appendChild(battleMessage);
      const helpAttackBandit = document.createElement("button");
      helpAttackBandit.innerText = `Attack with ${Player.equipedWeapon.name}`;
      actionsContainer.appendChild(helpAttackBandit);
      helpAttackBandit.onclick = () => {
        // Player stats updater
        Player.health -= 51;
        playerHealth.innerHTML = "Health : " + Player.health;
        Player.checkHp();
        const newXp = Player.xp + quest.questXp;
        Player.xp = newXp;
        Player.checkXp();
        playerXp.innerText = `XP ${Player.xp + "/" + Player.goalXp}`;
        Player.updatePlayerGold(50);
        helpAttackBandit.classList.add("hidden");

        // Damage from battle
        createDamgeMessage(
          `One of the bandits inflicted ${50} damage... make sure to heal`
        );

        // Quest completion main messages
        createSuccessMessage("You have successfully defeated the bandits");
        createXpMessage(50);

        // Loot drops and actions
        const lootBandit = document.createElement("button");
        lootBandit.innerText = "Loot Bandit";
        const leavePurse = document.createElement("button");
        leavePurse.innerText = "Leave Purse";

        actionsContainer.appendChild(lootBandit);
        actionsContainer.appendChild(leavePurse);

        lootBandit.onclick = () => {
          handleLoot([new HealthPotion(1), BattleAxe]);
          // Quest continuation
          const villagerMessage = document.createElement("p");
          villagerMessage.innerText =
            '"Villager : Thank you so much, traveller... What is your name?";';
          villagerMessage.classList.add("prologue");
          gameContainer.appendChild(villagerMessage);
          playerInput.classList.toggle("hidden");
          playerInput.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              Player.updatePlayerName(event.target.value);
              playerInput.classList.toggle("hidden");
              questCompletedModal.classList.toggle("hidden");
            }
          });
          const secondQuestContinue = document.createElement("p");
          secondQuestContinue.classList.add("prologue");
          secondQuestContinue.innerText =
            "Villager : One of the bandits escaped with the ancient artifact...please help us retrive it";
          gameContainer.appendChild(secondQuestContinue);
          const exploreTheVillage = document.createElement("button");
          const goAfterBandits = document.createElement("button");
          exploreTheVillage.innerText = "Explore the Village";

          goAfterBandits.innerText = "Go after bandit";
          goAfterBandits.addEventListener("click", () => {
            quests[1].questActionFunction();
          });
          actionsContainer.appendChild(goAfterBandits);
          actionsContainer.appendChild(exploreTheVillage);
        };
      };
    },
  },
  {
    index: 1,
    questName: "The Forest of Shadows",
    questSummary:
      "The village elder tells you about an ancient artifact hidden deep within the Forest of Shadows. This artifact is said to hold the key to weakening Malakar's power.",
    questObjective: "Retrieve the ancient artifact from the Forest of Shadows.",
    completed: false,
    action: "Go to the Forest",
    questXp: 150,
    questActionFunction: () => {
      const quest = this;
      const questMessage = document.createElement("p");
      questMessage.innerText = this.questObjective;
      questMessage.classList.add("prologue");
      const enteredForestMessage = document.createElement("p");
      enteredForestMessage.innerText = "You entered Forest of Shadows";
      enteredForestMessage.classList.add("prologue");
      gameContainer.appendChild(enteredForestMessage);
      questModal.classList.toggle("hidden");
      actionsContainer.innerHTML = "";

      //forest of shadows boss fight
      const banditBossMessage = document.createElement("p");
      banditBossMessage.innerText = "Bandit leader is in your path";
      banditBossMessage.classList.add("text-danger");
      gameContainer.appendChild(banditBossMessage);
      const attackBanditBoss = document.createElement("button");
      attackBanditBoss.innerText = "Attack bandit boss";
      actionsContainer.appendChild(attackBanditBoss);

      attackBanditBoss.addEventListener("click", () => {
        if (Player.equipedWeapon.damage > 99) {
          Player.xp += 150;
          Player.checkXp();
          Player.updatePlayerGold(200);

          const successMessage = document.createElement("p");
          successMessage.innerText =
            "You have successfully defeated the bandit boss!";
          successMessage.classList.add("text-sucess");
          const lootBaditBoss = document.createElement("button");
          const artifactMessage = document.createElement("p");
          artifactMessage.classList.add("prologue");
          gameContainer.appendChild(successMessage);
          gameContainer.appendChild(artifactMessage);
          actionsContainer.innerHTML = "";
          //loot bandit boss
          artifactMessage.innerText =
            "Looks like bandit boss dropped artifact...";
          lootBaditBoss.innerText = "Loot Bandit boss";
          actionsContainer.appendChild(lootBaditBoss);
          lootBaditBoss.addEventListener("click", () => {
            handleLoot([new ancientArtifact(), new HealthPotion(2)]);
          });
        } else {
          console.log("lose");
        }
      });
    },
  },
  {
    index: 2,
    questName: "The Hidden Cave",
    questSummary:
      "After retrieving the ancient artifact, you learn about a hidden cave where a powerful guardian protects a magical gem. This gem is essential to your quest to defeat Malakar.",
    questObjective:
      "Defeat the guardian and retrieve the magical gem from the hidden cave.",
    completed: false,
    action: "Enter the Cave",
    questXp: 200,
    questActionFunction: function () {
      const quest = this;
      const questMessage = document.createElement("p");
      questMessage.innerText = this.questObjective;
      questMessage.classList.add("prologue");
      gameContainer.appendChild(questMessage);
      questModal.classList.toggle("hidden");
      actionsContainer.innerHTML = "";

      const enteredCaveMessage = document.createElement("p");
      enteredCaveMessage.innerText = "You entered the hidden cave.";
      enteredCaveMessage.classList.add("prologue");
      gameContainer.appendChild(enteredCaveMessage);

      const guardianMessage = document.createElement("p");
      guardianMessage.innerText = "A powerful guardian blocks your path.";
      guardianMessage.classList.add("text-danger");
      gameContainer.appendChild(guardianMessage);

      const attackGuardian = document.createElement("button");
      attackGuardian.innerText = `Attack Guardian with ${Player.equipedWeapon.name}`;
      actionsContainer.appendChild(attackGuardian);

      attackGuardian.addEventListener("click", () => {
        if (Player.equipedWeapon.damage > 100) {
          Player.health -= 75;
          playerHealth.innerText = "Health : " + Player.health;
          Player.checkHp();

          if (Player.health > 0) {
            Player.xp += 200;
            Player.checkXp();
            Player.updatePlayerGold(250);

            const successMessage = document.createElement("p");
            successMessage.innerText =
              "You have successfully defeated the guardian!";
            successMessage.classList.add("text-success");
            gameContainer.appendChild(successMessage);

            const gemMessage = document.createElement("p");
            gemMessage.innerText = "You have retrieved the magical gem!";
            gemMessage.classList.add("prologue");
            gameContainer.appendChild(gemMessage);

            handleLoot([new ancientArtifact(), new HealthPotion(3)]);

            const questCompleteMessage = document.createElement("p");
            questCompleteMessage.innerText = "Quest Complete: The Hidden Cave";
            questCompleteMessage.classList.add("text-success");
            gameContainer.appendChild(questCompleteMessage);
          } else {
            const failMessage = document.createElement("p");
            failMessage.innerText = "You have been defeated by the guardian.";
            failMessage.classList.add("text-danger");
            gameContainer.appendChild(failMessage);
          }
        } else {
          const weakWeaponMessage = document.createElement("p");
          weakWeaponMessage.innerText = `Your weapon is too weak to defeat the guardian.`;
          weakWeaponMessage.classList.add("text-danger");
          gameContainer.appendChild(weakWeaponMessage);
        }
      });
    },
  },
];

const initilizeGame = () => {
  playerLevel.innerText = `Level ${Player.level}`;

  playerHealth.innerText = `Health: ${Player.health}`;
  playerXp.innerText = `XP ${Player.xp + "/" + Player.goalXp}`;
  playerGold.innerText = "Gold: " + Player.gold;
  Player.loadInventory();

  initializeShop();
};
initilizeGame();

const startQuest = (index) => {
  const questSummary = quests[index].questSummary;
  const newPar = document.createElement("p");
  newPar.innerText = questSummary;
  newPar.classList.add("prologue");
  gameContainer.appendChild(newPar);
  continueButton.classList.toggle("hidden");
  const newAction = document.createElement("button");
  newAction.innerText = quests[index].action;
  actionsContainer.appendChild(newAction);
  newAction.onclick = () => {
    newAction.classList.add("hidden");
    questModal.classList.toggle("hidden");
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

const handleLoot = (items) => {
  if (items) {
    items.forEach((item) => {
      let found = false;
      Player.inventory.forEach((entry) => {
        if (item.name === entry.name && item instanceof HealthPotion) {
          entry.quantity += item.quantity;
          found = true;
        }
      });
      if (!found) {
        if (item instanceof HealthPotion) {
          Player.inventory.push(new HealthPotion(1));
        } else {
          Player.inventory.push(item);
        }
      }
    });
  }

  actionsContainer.innerHTML = "";
  const lootMessage = document.createElement("p");
  lootMessage.innerText = "Looks like there is some loot...";
  lootMessage.classList.add("text-warning");
  gameContainer.appendChild(lootMessage);
  Player.loadInventory();
};

const createDamgeMessage = (message) => {
  const damageMessage = document.createElement("p");
  damageMessage.classList.add("text-danger");
  damageMessage.innerText = message;
  gameContainer.appendChild(damageMessage);
  Player.checkHp();
};

const createHealingMessage = () => {
  const healingMessage = document.createElement("p");
  healingMessage.innerText = "You have successfully healed";
  healingMessage.classList.add("healthy");
  gameContainer.appendChild(healingMessage);
};

questModalBtn.addEventListener("click", () => {
  questModal.classList.toggle("hidden");
});
questCompletedModalBtn.addEventListener("click", () => {
  questCompletedModal.classList.toggle("hidden");
});

//SHOP LOGIC
exitShopBtn.addEventListener("click", () => {
  console.log("exited");
  shopModal.classList.add("hidden");
});
openShopBtn.addEventListener("click", () => {
  shopModal.classList.remove("hidden");
});

//initialize shop
function initializeShop() {
  const shopItems = [SteelDager, new HealthPotion(1), BattleAxe];
  const shopItemContainer = document.createElement("div");
  shopItems.forEach((shopItem) => {
    shopItemContainer.classList.add("shop-item-container");
    const shopItemName = document.createElement("p");
    const shopItemPrice = document.createElement("p");
    const shopItemCon = document.createElement("div");
    shopItemCon.classList.add("shopItemCon");

    shopItemName.innerText = shopItem.name;
    shopItemPrice.innerText = shopItem.price;
    shopItemCon.appendChild(shopItemName);
    shopItemCon.appendChild(shopItemPrice);
    shopItemContainer.appendChild(shopItemCon);

    shopItemCon.addEventListener("click", () => {
      buyItem(shopItem);
    });
  });
  shopModal.appendChild(shopItemContainer);
}

function buyItem(item) {
  //check player gold
  if (item.price > Player.gold) {
    return console.log("No Gold");
  }
  Player.gold = Player.gold - item.price;
  Player.updatePlayerGold(Player.gold);
  Player.inventory.push(item);
  Player.loadInventory();
}
