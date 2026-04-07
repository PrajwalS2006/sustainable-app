// frontend/src/utils/ecoUtils.js
/**
 * Utility functions for eco-calculations and sustainability metrics
 */

/**
 * Calculate carbon footprint saved based on eco score
 * @param {number} ecoScore - Product eco score (0-100)
 * @param {number} quantity - Quantity purchased
 * @returns {number} Carbon saved in kg
 */
export const calculateCarbonSaved = (ecoScore, quantity = 1) => {
  // Higher eco score means lower carbon footprint
  const baseCarbon = 10; // kg CO2 for average product
  const savedPercentage = ecoScore / 100;
  const carbonSaved = baseCarbon * savedPercentage * quantity;
  return Math.round(carbonSaved * 10) / 10;
};

/**
 * Get eco score color based on score
 * @param {number} score - Eco score (0-100)
 * @returns {string} Hex color code
 */
export const getEcoScoreColor = (score) => {
  if (score >= 80) return '#52c41a';
  if (score >= 60) return '#73d13d';
  if (score >= 40) return '#faad14';
  if (score >= 20) return '#ff7a45';
  return '#ff4d4f';
};

/**
 * Get eco score label
 * @param {number} score - Eco score (0-100)
 * @returns {string} Label description
 */
export const getEcoScoreLabel = (score) => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  if (score >= 20) return 'Poor';
  return 'Very Poor';
};

/**
 * Calculate water saved in liters
 * @param {number} waterUsage - Water usage in liters
 * @param {number} ecoScore - Eco score
 * @returns {number} Water saved
 */
export const calculateWaterSaved = (waterUsage, ecoScore) => {
  const avgWaterUsage = 100; // average water usage in liters
  const savedPercentage = ecoScore / 100;
  return Math.round((avgWaterUsage - waterUsage) * savedPercentage);
};

/**
 * Get motivational message based on eco score
 * @param {number} ecoScore - User's eco score
 * @returns {string} Motivational message
 */
export const getMotivationalMessage = (ecoScore) => {
  if (ecoScore >= 80) {
    return "🌟 Amazing! You're an eco-warrior! Keep inspiring others!";
  } else if (ecoScore >= 60) {
    return "🌱 Great job! You're making a real difference!";
  } else if (ecoScore >= 40) {
    return "💚 Good start! Every sustainable choice counts!";
  } else if (ecoScore >= 20) {
    return "🌍 You're on the right track! Keep going!";
  } else {
    return "🌿 Start your journey today! Every small step matters!";
  }
};

/**
 * Calculate total eco impact
 * @param {Array} purchases - Array of purchase objects
 * @returns {Object} Impact summary
 */
export const calculateTotalImpact = (purchases) => {
  let totalCarbonSaved = 0;
  let totalWaterSaved = 0;
  let totalEcoPoints = 0;
  
  purchases.forEach(purchase => {
    totalCarbonSaved += calculateCarbonSaved(purchase.ecoScore, purchase.quantity);
    totalWaterSaved += calculateWaterSaved(purchase.waterUsage || 50, purchase.ecoScore);
    totalEcoPoints += purchase.ecoScore * purchase.quantity;
  });
  
  return {
    carbonSaved: totalCarbonSaved,
    waterSaved: totalWaterSaved,
    avgEcoScore: purchases.length > 0 ? Math.round(totalEcoPoints / purchases.length) : 0,
    treesEquivalent: Math.round(totalCarbonSaved / 21), // 21kg CO2 per tree per year
  };
};