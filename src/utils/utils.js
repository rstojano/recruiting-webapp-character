export const calculateModifier = (attributeValue) => {
    return Math.floor((attributeValue - 10) / 2);
};

export const calculateTotalSkillPoints = (char, calculateModifier) => {
    const intelligenceModifier = calculateModifier(char.attributes['Intelligence']);
    return 10 + 4 * intelligenceModifier;
};

export const calculateAllocatedSkillPoints = (char) => {
    return Object.values(char.skillPoints).reduce((sum, val) => sum + val, 0);
};
