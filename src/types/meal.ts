export type MealType = '早餐' | '午餐' | '晚餐' | '加餐';

export type VegetableType = '無' | '菠菜' | '西蘭花' | '胡蘿蔔' | '生菜' | '青椒' | '茄子' | '其他';
export type CookingMethod = '清炒' | '蒸煮' | '生食' | '燉煮' | '烤製' | '煎炸';
export type ProteinType = '無' | '雞肉' | '魚肉' | '豆腐' | '雞蛋' | '牛肉' | '豬肉' | '其他';
export type StarchType = '無' | '米飯' | '麵條' | '土豆' | '紅薯' | '全麥麵包' | '其他';
export type BeverageType = '水' | '茶' | '咖啡' | '果汁' | '奶類' | '其他';
export type SatietyLevel = '非常飽' | '適中' | '仍感飢餓';
export type Portion = '少量' | '適中' | '較多';

export interface Vegetable {
  type: VegetableType;
  cookingMethod: CookingMethod;
  portion: Portion;
}

export interface Protein {
  type: ProteinType;
  cookingMethod: CookingMethod;
  portion: Portion;
}

export interface Starch {
  type: StarchType;
  cookingMethod: CookingMethod;
  portion: Portion;
}

export interface MealRecord {
  id: string;
  date: string;
  time: string;
  mealType: MealType;
  vegetables: [Vegetable, Vegetable]; // 兩份蔬菜
  protein: Protein;
  starch: Starch;
  additionals: string;
  beverage: {
    type: BeverageType;
    amount: string;
  };
  satietyLevel: SatietyLevel;
  satisfaction: number; // 1-5 分
  notes: string;
} 