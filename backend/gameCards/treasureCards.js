const treasureCards = [
  {
    treasureName: "Harvest",
    description: "Gain 3 resources.",
    reaction: false
  },
  {
    treasureName: "Lost Gear",
    description: "Pull from the Equipment card pile.",
    reaction: false
  },
  {
    treasureName: "Potion of Quickness",
    description: "Gain 2 additional Movement for 1 turn (does not stack).",
    reaction: false
  },
  {
    treasureName: "Potion of Healing",
    description: "Heal to full Health.",
    reaction: false
  },
  {
    treasureName: "Potion of Strength",
    description: "Gain 2 Offense for 1 round of Combat (does not stack).",
    reaction: true
  },
  {
    treasureName: "Potion of Toughness",
    description: "Gain 2 Defense for 1 round of Combat (does not stack).",
    reaction: true
  },
  {
    treasureName: "Potion of Endurance",
    description: "Gain 2 Stamina for 1 round of Combat (does not stack).",
    reaction: true
  },
  {
    treasureName: "Potion of Invisibility",
    description: "Immune to any combat for 1 Game Round.",
    reaction: false
  },
  {
    treasureName: "Potion of Luck",
    description: "Re-roll any dice roll once.",
    reaction: true
  },
  {
    treasureName: "Toolkit",
    description: "Sinlge Building Cost 2 less resources (does not stack).",
    reaction: false
  },
  {
    treasureName: "Whetstone",
    description: "Increase 1 piece of Equipment by 1 Rank.",
    reaction: false
  },
  {
    treasureName: "Ember Fire",
    description: "Attune 1 piece of Equipment to fire element.",
    reaction: false
  },
  {
    treasureName: "Ember Stone",
    description: "Attune 1 piece of Equipment to stone element.",
    reaction: false
  },
  {
    treasureName: "Ember Water",
    description: "Attune 1 piece of Equipment to water element.",
    reaction: false
  },
  {
    treasureName: "Ember Wind",
    description: "Attune 1 piece of Equipment to wind element.",
    reaction: false
  },
  {
    treasureName: "Immunity Trinket",
    description: "Negate the effects of World Event for 1 round, self use.",
    reaction: true
  },
  {
    treasureName: "Ravenger Trinket",
    description: "Negate the effects of World Event for 1 round for another player.",
    reaction: true
  },
  {
    treasureName: "Explosives",
    description: "Instantly destroy another Player’s building, must be in an adjacent Tile.",
    reaction: false
  },
  {
    treasureName: "Teleportation Scroll",
    description: "Teleport up to any unoccupied Tile up to 10 Tiles away.",
    reaction: false
  },
  {
    treasureName: "Enchanted Compass",
    description: "Look at the Top 3 Cards in any deck and rearrange them in any order.",
    reaction: false
  },
  {
    treasureName: "Goblin's Gold Coin",
    description: "Steal 2 Resource Cards from another Player.",
    reaction: false
  },
  {
    treasureName: "Phoenix Feather",
    description: "Negate all card loss upon death.",
    reaction: true
  },
  {
    treasureName: "Draconic Scale",
    description: "Reflect a successful attack back at an opponent during combat.",
    reaction: true
  },
  {
    treasureName: "Wand of Polymorph",
    description: "Decrease another Player’s stats by 1 in all Categories for 1 Turn, must be adjacent.",
    reaction: true
  },
  {
    treasureName: "Thief's Cloak",
    description: "Steal 1 Equipment Card at random from another Player.",
    reaction: false
  },
  {
    treasureName: "Sticky Finger",
    description: "Steal 2 Treasure Cards at random from another Player.",
    reaction: false
  },
  {
    treasureName: "Horn of Summoning",
    description: "Summon a Monster from the Monster Card Pile to aid you in 1 combat, add it’s Rank 1 stats to yours.",
    reaction: true
  },
  {
    treasureName: "Trade Agreement",
    description: "Swap any 1 card, for any 1 card, with another player.",
    reaction: false
  },
  {
    treasureName: "Relic of Power",
    description: "Use any Treasure Card effects twice (does not stack).",
    reaction: true
  },
  {
    treasureName: "Protection Charm",
    description: "Negate any negative effects from another Player’s Treasure Card.",
    reaction: true
  },
  {
    treasureName: "Siren’s Call",
    description: "On a Player’s next turn they must move their maximum movement towards you.",
    reaction: true
  },
  {
    treasureName: "Rod of Fortune",
    description: "Swap Resource total with another Player.",
    reaction: false
  },
  {
    treasureName: "Chain of Binding",
    description: "Reduce another Player’s movement to 0 for 1 turn, must be within 5 Tiles.",
    reaction: true
  },
  {
    treasureName: "Wanted Poster",
    description: "Pull 1 Quest Card.",
    reaction: false
  },
];
