const equipmentCards = require("../gameCards/equipmentCards");
const questCards = require("../gameCards/questCards");
const titanCards = require("../gameCards/titanCards");
const treasureCards = require("../gameCards/treasureCards");
const worldEventCards = require("../gameCards/worldEventCards");

class CardManager {
    constructor() {
        // Initialize any properties here, if necessary
    }

    // Method to determine starting cards for players
    determineStartingCards(players) {
        let chosenEquipmentCards = [];
        players.forEach((player) => {
            // Allocate 1 random equipment card
            let equipmentCard;
            do {
                const randomIndex = Math.floor(Math.random() * equipmentCards.length);
                equipmentCard = equipmentCards[randomIndex];
            } while (chosenEquipmentCards.includes(equipmentCard.equipmentName));
            player.inventory.equipment.push(equipmentCard);
            chosenEquipmentCards.push(equipmentCard.equipmentName);
        });

        return { chosenEquipmentCards };
    }

    // Method to draw a phase card
    drawPhaseCardDraw(player, gameState) {
        let card;
        do {
            const randomIndex = Math.floor(Math.random() * equipmentCards.length);
            card = equipmentCards[randomIndex];
        } while (
            gameState.equipmentCardCount.includes(card.equipmentName)
        );

        player.inventory.equipment.push(card);
        gameState.equipmentCardCount.push(card.equipmentName);

        return card;
    }

    // Other card-related methods can be added here
}

module.exports = CardManager;
