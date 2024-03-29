const equipmentCards = require("../gameCards/equipmentCards");
const questCards = require("../gameCards/questCards");
const titanCards = require("../gameCards/titanCards");
const treasureCards = require("../gameCards/treasureCards");
const worldEventCards = require("../gameCards/worldEventCards");

class CardManager {
    constructor( sessionClient) {
      this.sessionClient = sessionClient;
      this.chosenEquipmentCards = [];
      this.equipmentCards = equipmentCards;
    }
    determineStartingCards(players) {
      this.chosenEquipmentCards = [];
      players.forEach((player) => {
        let equipmentCard;
        do {
          const randomIndex = Math.floor(
            Math.random() * this.equipmentCards.length
          );
          equipmentCard = this.equipmentCards[randomIndex];
        } while (this.chosenEquipmentCards.includes(equipmentCard.equipmentName));
        player.inventory.equipment.push(equipmentCard);
        this.chosenEquipmentCards.push(equipmentCard.equipmentName);
      });
  
      return { chosenEquipmentCards: this.chosenEquipmentCards };
    }
    async allocateResources(player, sessionId, ) {
      const sessionString = await this.sessionClient.get(sessionId);
      console.log("Retrieved session data:", sessionString);

      if (!sessionString) {
          throw new Error("Session data not found");
      }
  
      const sessionData = JSON.parse(sessionString);
      if (!sessionData) {
          throw new Error("Game state not found in session data");
      }
  
      let farmCount = 0;
      let ranchCount = 0;
      let plantationCount = 0;
  
      // Count each type of resource building for the single player
      player.buildings.forEach((building) => {
        if (building.category === "resource") {
          if (building.type === "farm") farmCount++;
          else if (building.type === "ranch") ranchCount++;
          else if (building.type === "plantation") plantationCount++;
        }
      });
  
      // Calculate the new resources to be added
      const newResources =
        1 + farmCount * 1 + ranchCount * 2 + plantationCount * 3;
  
      // Retrieve the current resources from the player's inventory
      const currentResources = player.inventory.resources || 0; // Default to 0 if undefined
  
      // Add the new resources to the current total resources
      const totalResources = currentResources + newResources;
  
      // Update the player's resources in the inventory
      player.inventory.resources = totalResources;
  
      // Update the player in the session data and save the changes
      sessionData.player = player;
      await this.sessionClient.set(sessionId, JSON.stringify(sessionData));
  
      return newResources, totalResources; // Return the new total resources
    }
  
    async drawPhaseCardDraw(player, sessionId) {
      const sessionData = JSON.parse(await this.sessionClient.get(sessionId));
      let card;
      do {
        const randomIndex = Math.floor(Math.random() * equipmentCards.length);
        card = equipmentCards[randomIndex];
      } while (
        sessionData.equipmentCardCount.includes(card.equipmentName)
      );
  
      player.inventory.equipment.push(card);
      sessionData.equipmentCardCount.push(card.equipmentName);
      await this.sessionClient.set(sessionId, JSON.stringify(sessionData));
  
      return card;
    }
  }

module.exports = CardManager;
