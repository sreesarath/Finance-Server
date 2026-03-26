const calculateGoalAI = ({ income, expense, goalAmount, currentSaved }) => {
  if (!goalAmount || goalAmount <= 0) {
    return { error: "Invalid goal amount" };
  }

  const remaining = Math.max(goalAmount - currentSaved, 0);
  const monthlySavings = income - expense;

  // 🚨 NO SAVING CAPACITY
  if (monthlySavings <= 0) {
    return {
      suggestedMonthly: 0,
      monthsNeeded: Infinity,
      completionDate: null,
      status: "Critical",
      healthScore: 0,
      riskLevel: "High",
      advice: "Your expenses exceed income. Immediate budget correction needed.",
      weeklyTarget: 0,
      dailyTarget: 0,
      velocity: "Stalled",
      savingsRatio: 0,
      projection: "Not Possible"
    };
  }

  // 💰 SMART SAVING STRATEGY (dynamic %)
  let savingRate = 0.3;

  if (monthlySavings > 2000) savingRate = 0.5;
  else if (monthlySavings > 1000) savingRate = 0.4;
  else if (monthlySavings < 300) savingRate = 0.2;

  const suggestedMonthly = Math.max(monthlySavings * savingRate, 50);

  const monthsNeeded = remaining === 0 ? 0 : remaining / suggestedMonthly;

  // 📊 HEALTH SCORE
  const savingsRatio = monthlySavings / income;
  const healthScore = Math.min(100, Math.round(savingsRatio * 100));

  // 📅 COMPLETION DATE
  const completionDate = new Date();
  completionDate.setMonth(completionDate.getMonth() + Math.ceil(monthsNeeded));

  // ⚡ VELOCITY ENGINE
  let velocity = "Steady";
  if (monthsNeeded <= 6) velocity = "Fast Track 🚀";
  else if (monthsNeeded <= 12) velocity = "On Pace";
  else if (monthsNeeded <= 24) velocity = "Slow Build";
  else velocity = "Marathon 🐢";

  // ⚠️ RISK LEVEL
  let riskLevel = "Low";
  if (healthScore < 10) riskLevel = "High";
  else if (healthScore < 25) riskLevel = "Medium";

  // 🎯 STATUS
  let status = "On Track";
  if (monthsNeeded > 18) status = "Delayed";
  if (monthsNeeded > 30) status = "Critical";

  // 🧠 SMART ADVICE ENGINE
  let advice = "";

  if (healthScore < 10) {
    advice = "Your savings rate is very low. Cut unnecessary expenses immediately.";
  } else if (healthScore < 25) {
    advice = "You're saving, but slowly. Try optimizing subscriptions or food costs.";
  } else if (healthScore < 40) {
    advice = "Good progress. Increasing income can accelerate your goal.";
  } else {
    advice = "Excellent financial discipline! Keep pushing consistently.";
  }

  // 🔥 NEW FEATURE: DAILY + WEEKLY TARGETS
  const weeklyTarget = Math.ceil(suggestedMonthly / 4);
  const dailyTarget = Math.ceil(suggestedMonthly / 30);

  // 📈 PROJECTION LABEL
  let projection = "Balanced Plan";
  if (velocity.includes("Fast")) projection = "Aggressive Growth";
  if (velocity.includes("Marathon")) projection = "Long-Term Strategy";

  return {
    suggestedMonthly: Math.round(suggestedMonthly),
    monthsNeeded: Math.ceil(monthsNeeded),
    completionDate,
    status,
    healthScore,
    advice,
    weeklyTarget,
    dailyTarget,
    velocity,
    riskLevel,
    savingsRatio: Math.round(savingsRatio * 100),
    projection
  };
};

module.exports = calculateGoalAI;