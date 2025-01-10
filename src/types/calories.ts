export interface CalorieInfo {
  amount: number; // 克數
  calories: number; // 卡路里
}

export interface FoodCalories {
  // 蔬菜類
  vegetables: {
    leafy: CalorieInfo; // 綠葉蔬菜
    cruciferous: CalorieInfo; // 十字花科
    other: CalorieInfo; // 其他蔬菜
  };
  // 蛋白質類
  proteins: {
    chicken: CalorieInfo; // 雞肉
    fish: CalorieInfo; // 魚肉
    tofu: CalorieInfo; // 豆腐
    egg: CalorieInfo; // 雞蛋
    beef: CalorieInfo; // 牛肉
    pork: CalorieInfo; // 豬肉
  };
  // 澱粉類
  starches: {
    rice: CalorieInfo; // 米飯
    noodles: CalorieInfo; // 麵條
    potato: CalorieInfo; // 土豆
    sweetPotato: CalorieInfo; // 紅薯
    bread: CalorieInfo; // 全麥麵包
  };
  // 調味品和油脂
  condiments: {
    oil: CalorieInfo; // 食用油
    sauce: CalorieInfo; // 醬料
  };
  // 飲品
  beverages: {
    milk: CalorieInfo; // 牛奶
    juice: CalorieInfo; // 果汁
    soda: CalorieInfo; // 碳酸飲料
  };
} 