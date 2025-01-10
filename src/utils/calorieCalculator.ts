import { FoodCalories, CalorieInfo } from '../types/calories';
import { Vegetable, Protein, Starch } from '../types/meal';
import caloriesData from '../data/calories.json';

// 導入卡路里數據
export const STANDARD_CALORIES: FoodCalories = caloriesData;

// 根據份量計算卡路里
function calculatePortionCalories(standardCalorie: CalorieInfo, portion: string): number {
  const portionMultiplier = {
    '少量': 0.5,
    '適中': 1,
    '較多': 1.5
  }[portion] || 1;

  return standardCalorie.calories * portionMultiplier;
}

// 計算蔬菜卡路里
function calculateVegetableCalories(vegetable: Vegetable): number {
  if (vegetable.type === '無') {
    return 0;
  }
  const standardCalorie = STANDARD_CALORIES.vegetables.other;
  return calculatePortionCalories(standardCalorie, vegetable.portion);
}

// 計算蛋白質卡路里
function calculateProteinCalories(protein: Protein): number {
  if (protein.type === '無') {
    return 0;
  }
  const proteinType = protein.type.toLowerCase() as keyof typeof STANDARD_CALORIES.proteins;
  const standardCalorie = STANDARD_CALORIES.proteins[proteinType] || STANDARD_CALORIES.proteins.chicken;
  return calculatePortionCalories(standardCalorie, protein.portion);
}

// 計算澱粉卡路里
function calculateStarchCalories(starch: Starch): number {
  if (starch.type === '無') {
    return 0;
  }
  const starchType = starch.type.toLowerCase() as keyof typeof STANDARD_CALORIES.starches;
  const standardCalorie = STANDARD_CALORIES.starches[starchType] || STANDARD_CALORIES.starches.rice;
  return calculatePortionCalories(standardCalorie, starch.portion);
}

// 計算總卡路里
export function calculateTotalCalories(
  vegetables: [Vegetable, Vegetable],
  protein: Protein,
  starch: Starch
): {
  vegetablesCalories: number;
  proteinCalories: number;
  starchCalories: number;
  totalCalories: number;
} {
  try {
    const vegetablesCalories = vegetables.reduce(
      (total, veg) => total + calculateVegetableCalories(veg),
      0
    );
    const proteinCalories = calculateProteinCalories(protein);
    const starchCalories = calculateStarchCalories(starch);

    return {
      vegetablesCalories,
      proteinCalories,
      starchCalories,
      totalCalories: vegetablesCalories + proteinCalories + starchCalories
    };
  } catch (error) {
    console.error('Error calculating calories:', error);
    return {
      vegetablesCalories: 0,
      proteinCalories: 0,
      starchCalories: 0,
      totalCalories: 0
    };
  }
} 