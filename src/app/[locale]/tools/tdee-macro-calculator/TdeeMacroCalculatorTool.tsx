'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Download,
  Flame,
  Heart,
  History,
  Plus,
  RotateCcw,
  Search,
  Shield,
  Trash2,
  Utensils,
  X,
  Dumbbell,
  Target,
  User,
  Minus,
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────────

interface PersonalInfo {
  age: string;
  gender: 'male' | 'female' | 'other';
  heightCm: string;
  heightFt: string;
  heightIn: string;
  weightKg: string;
  weightLbs: string;
  heightUnit: 'cm' | 'ft';
  weightUnit: 'kg' | 'lbs';
}

interface FoodItem {
  id: string;
  name: string;
  nameHi: string;
  category: FoodCategory;
  serving: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface MealPlanItem {
  food: FoodItem;
  quantity: number;
}

interface CalculationHistory {
  id: string;
  date: string;
  bmr: number;
  tdee: number;
  adjustedTdee: number;
  goal: string;
  macroPreset: string;
  protein: number;
  carbs: number;
  fat: number;
}

type FoodCategory =
  | 'Dal & Pulses'
  | 'Rice & Roti'
  | 'Vegetables'
  | 'Non-Veg'
  | 'Snacks'
  | 'Dairy'
  | 'Fruits'
  | 'Sweets';

type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very' | 'extreme';
type GoalType = 'lose' | 'maintain' | 'gain' | 'custom';
type MacroPreset = 'balanced' | 'lowcarb' | 'highprotein';

// ─── Constants ──────────────────────────────────────────────────────────────────

const ACTIVITY_LEVELS: {
  key: ActivityLevel;
  label: string;
  desc: string;
  multiplier: number;
  icon: string;
}[] = [
  { key: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise, desk job', multiplier: 1.2, icon: '🪑' },
  { key: 'light', label: 'Lightly Active', desc: 'Light exercise 1-3 days/week', multiplier: 1.375, icon: '🚶' },
  { key: 'moderate', label: 'Moderately Active', desc: 'Moderate exercise 3-5 days/week', multiplier: 1.55, icon: '🏃' },
  { key: 'very', label: 'Very Active', desc: 'Hard exercise 6-7 days/week', multiplier: 1.725, icon: '🏋️' },
  { key: 'extreme', label: 'Extremely Active', desc: 'Very hard exercise, physical job', multiplier: 1.9, icon: '⚡' },
];

const MACRO_PRESETS: {
  key: MacroPreset;
  label: string;
  carbs: number;
  protein: number;
  fat: number;
  desc: string;
}[] = [
  { key: 'balanced', label: 'Balanced', carbs: 40, protein: 30, fat: 30, desc: '40% Carbs / 30% Protein / 30% Fat' },
  { key: 'lowcarb', label: 'Low Carb', carbs: 25, protein: 40, fat: 35, desc: '25% Carbs / 40% Protein / 35% Fat' },
  { key: 'highprotein', label: 'High Protein', carbs: 30, protein: 40, fat: 30, desc: '30% Carbs / 40% Protein / 30% Fat' },
];

const FOOD_CATEGORIES: FoodCategory[] = [
  'Dal & Pulses',
  'Rice & Roti',
  'Vegetables',
  'Non-Veg',
  'Snacks',
  'Dairy',
  'Fruits',
  'Sweets',
];

const CATEGORY_COLORS: Record<FoodCategory, string> = {
  'Dal & Pulses': 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
  'Rice & Roti': 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300',
  'Vegetables': 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
  'Non-Veg': 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
  'Snacks': 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300',
  'Dairy': 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
  'Fruits': 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300',
  'Sweets': 'bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300',
};

// ─── Indian Food Database (40+ items) ──────────────────────────────────────────

const FOOD_DATABASE: FoodItem[] = [
  // Dal & Pulses
  { id: 'dal-tadka', name: 'Dal Tadka', nameHi: 'दाल तड़का', category: 'Dal & Pulses', serving: '1 bowl (200g)', calories: 180, protein: 9, carbs: 24, fat: 6 },
  { id: 'rajma', name: 'Rajma Curry', nameHi: 'राजमा', category: 'Dal & Pulses', serving: '1 bowl (200g)', calories: 210, protein: 11, carbs: 30, fat: 5 },
  { id: 'chole', name: 'Chole / Chana Masala', nameHi: 'छोले', category: 'Dal & Pulses', serving: '1 bowl (200g)', calories: 240, protein: 12, carbs: 34, fat: 7 },
  { id: 'moong-dal', name: 'Moong Dal', nameHi: 'मूंग दाल', category: 'Dal & Pulses', serving: '1 bowl (200g)', calories: 150, protein: 10, carbs: 22, fat: 3 },
  { id: 'sambar', name: 'Sambar', nameHi: 'सांभर', category: 'Dal & Pulses', serving: '1 bowl (200g)', calories: 130, protein: 7, carbs: 18, fat: 4 },
  { id: 'dal-makhani', name: 'Dal Makhani', nameHi: 'दाल मखनी', category: 'Dal & Pulses', serving: '1 bowl (200g)', calories: 260, protein: 10, carbs: 26, fat: 12 },

  // Rice & Roti
  { id: 'plain-rice', name: 'Plain Rice', nameHi: 'सादा चावल', category: 'Rice & Roti', serving: '1 bowl (150g)', calories: 195, protein: 4, carbs: 43, fat: 0.5 },
  { id: 'roti', name: 'Roti / Chapati', nameHi: 'रोटी / चपाती', category: 'Rice & Roti', serving: '1 piece (40g)', calories: 104, protein: 3, carbs: 18, fat: 2.5 },
  { id: 'paratha', name: 'Aloo Paratha', nameHi: 'आलू पराठा', category: 'Rice & Roti', serving: '1 piece (80g)', calories: 220, protein: 5, carbs: 30, fat: 9 },
  { id: 'naan', name: 'Butter Naan', nameHi: 'बटर नान', category: 'Rice & Roti', serving: '1 piece (90g)', calories: 260, protein: 7, carbs: 38, fat: 9 },
  { id: 'biryani', name: 'Chicken Biryani', nameHi: 'चिकन बिरयानी', category: 'Rice & Roti', serving: '1 plate (300g)', calories: 490, protein: 22, carbs: 58, fat: 18 },
  { id: 'veg-pulao', name: 'Veg Pulao', nameHi: 'वेज पुलाव', category: 'Rice & Roti', serving: '1 bowl (200g)', calories: 260, protein: 5, carbs: 42, fat: 8 },

  // Vegetables
  { id: 'paneer-butter', name: 'Paneer Butter Masala', nameHi: 'पनीर बटर मसाला', category: 'Vegetables', serving: '1 bowl (200g)', calories: 340, protein: 14, carbs: 12, fat: 26 },
  { id: 'aloo-gobi', name: 'Aloo Gobi', nameHi: 'आलू गोभी', category: 'Vegetables', serving: '1 bowl (200g)', calories: 160, protein: 4, carbs: 22, fat: 7 },
  { id: 'bhindi-fry', name: 'Bhindi Fry', nameHi: 'भिंडी फ्राई', category: 'Vegetables', serving: '1 bowl (150g)', calories: 130, protein: 3, carbs: 10, fat: 9 },
  { id: 'palak-paneer', name: 'Palak Paneer', nameHi: 'पालक पनीर', category: 'Vegetables', serving: '1 bowl (200g)', calories: 280, protein: 14, carbs: 10, fat: 20 },
  { id: 'mixed-veg', name: 'Mixed Veg Curry', nameHi: 'मिक्स वेज', category: 'Vegetables', serving: '1 bowl (200g)', calories: 170, protein: 5, carbs: 18, fat: 8 },
  { id: 'baingan-bharta', name: 'Baingan Bharta', nameHi: 'बैंगन भर्ता', category: 'Vegetables', serving: '1 bowl (200g)', calories: 150, protein: 4, carbs: 14, fat: 9 },

  // Non-Veg
  { id: 'chicken-curry', name: 'Chicken Curry', nameHi: 'चिकन करी', category: 'Non-Veg', serving: '1 bowl (200g)', calories: 280, protein: 24, carbs: 8, fat: 16 },
  { id: 'butter-chicken', name: 'Butter Chicken', nameHi: 'बटर चिकन', category: 'Non-Veg', serving: '1 bowl (200g)', calories: 380, protein: 26, carbs: 12, fat: 26 },
  { id: 'tandoori-chicken', name: 'Tandoori Chicken', nameHi: 'तंदूरी चिकन', category: 'Non-Veg', serving: '2 pieces (200g)', calories: 260, protein: 30, carbs: 4, fat: 14 },
  { id: 'fish-curry', name: 'Fish Curry', nameHi: 'मछली करी', category: 'Non-Veg', serving: '1 bowl (200g)', calories: 220, protein: 22, carbs: 6, fat: 12 },
  { id: 'egg-bhurji', name: 'Egg Bhurji', nameHi: 'अंडा भुर्जी', category: 'Non-Veg', serving: '2 eggs (120g)', calories: 190, protein: 14, carbs: 3, fat: 14 },
  { id: 'keema', name: 'Mutton Keema', nameHi: 'कीमा', category: 'Non-Veg', serving: '1 bowl (200g)', calories: 340, protein: 26, carbs: 6, fat: 24 },

  // Snacks
  { id: 'samosa', name: 'Samosa', nameHi: 'समोसा', category: 'Snacks', serving: '1 piece (80g)', calories: 250, protein: 4, carbs: 26, fat: 14 },
  { id: 'pakora', name: 'Pakora / Bhajiya', nameHi: 'पकोड़ा / भजिया', category: 'Snacks', serving: '5 pieces (100g)', calories: 280, protein: 5, carbs: 22, fat: 19 },
  { id: 'dosa', name: 'Masala Dosa', nameHi: 'मसाला डोसा', category: 'Snacks', serving: '1 piece (150g)', calories: 290, protein: 6, carbs: 38, fat: 12 },
  { id: 'idli', name: 'Idli', nameHi: 'इडली', category: 'Snacks', serving: '2 pieces (80g)', calories: 120, protein: 4, carbs: 22, fat: 1 },
  { id: 'poha', name: 'Poha', nameHi: 'पोहा', category: 'Snacks', serving: '1 bowl (200g)', calories: 250, protein: 5, carbs: 40, fat: 8 },
  { id: 'upma', name: 'Upma', nameHi: 'उपमा', category: 'Snacks', serving: '1 bowl (200g)', calories: 230, protein: 6, carbs: 34, fat: 8 },

  // Dairy
  { id: 'lassi-sweet', name: 'Sweet Lassi', nameHi: 'मीठी लस्सी', category: 'Dairy', serving: '1 glass (250ml)', calories: 200, protein: 6, carbs: 32, fat: 5 },
  { id: 'lassi-salt', name: 'Salted Lassi', nameHi: 'नमकीन लस्सी', category: 'Dairy', serving: '1 glass (250ml)', calories: 110, protein: 6, carbs: 8, fat: 5 },
  { id: 'raita', name: 'Boondi Raita', nameHi: 'बूंदी रायता', category: 'Dairy', serving: '1 bowl (150g)', calories: 120, protein: 5, carbs: 10, fat: 6 },
  { id: 'paneer-raw', name: 'Paneer (Raw)', nameHi: 'पनीर', category: 'Dairy', serving: '100g', calories: 260, protein: 18, carbs: 2, fat: 20 },
  { id: 'curd', name: 'Curd / Dahi', nameHi: 'दही', category: 'Dairy', serving: '1 bowl (200g)', calories: 120, protein: 7, carbs: 10, fat: 6 },

  // Fruits
  { id: 'mango', name: 'Mango', nameHi: 'आम', category: 'Fruits', serving: '1 medium (200g)', calories: 130, protein: 1, carbs: 30, fat: 0.5 },
  { id: 'banana', name: 'Banana', nameHi: 'केला', category: 'Fruits', serving: '1 medium (120g)', calories: 105, protein: 1, carbs: 27, fat: 0.4 },
  { id: 'apple', name: 'Apple', nameHi: 'सेब', category: 'Fruits', serving: '1 medium (180g)', calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
  { id: 'papaya', name: 'Papaya', nameHi: 'पपीता', category: 'Fruits', serving: '1 bowl (200g)', calories: 80, protein: 1, carbs: 18, fat: 0.3 },
  { id: 'guava', name: 'Guava', nameHi: 'अमरूद', category: 'Fruits', serving: '1 medium (150g)', calories: 68, protein: 2.5, carbs: 14, fat: 1 },

  // Sweets
  { id: 'gulab-jamun', name: 'Gulab Jamun', nameHi: 'गुलाब जामुन', category: 'Sweets', serving: '2 pieces (80g)', calories: 300, protein: 4, carbs: 40, fat: 14 },
  { id: 'rasgulla', name: 'Rasgulla', nameHi: 'रसगुल्ला', category: 'Sweets', serving: '2 pieces (80g)', calories: 190, protein: 4, carbs: 36, fat: 4 },
  { id: 'jalebi', name: 'Jalebi', nameHi: 'जलेबी', category: 'Sweets', serving: '2 pieces (60g)', calories: 240, protein: 2, carbs: 38, fat: 9 },
  { id: 'ladoo', name: 'Besan Ladoo', nameHi: 'बेसन लड्डू', category: 'Sweets', serving: '1 piece (40g)', calories: 180, protein: 4, carbs: 18, fat: 10 },
  { id: 'kheer', name: 'Rice Kheer', nameHi: 'खीर', category: 'Sweets', serving: '1 bowl (150g)', calories: 220, protein: 5, carbs: 34, fat: 7 },
];

// ─── Helper Functions ───────────────────────────────────────────────────────────

function calculateBMR(weightKg: number, heightCm: number, age: number, gender: string): number {
  // Mifflin-St Jeor Equation
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (gender === 'male') return base + 5;
  if (gender === 'female') return base - 161;
  return base - 78; // 'other' — average of male and female
}

function lbsToKg(lbs: number): number {
  return lbs * 0.453592;
}

function ftInToCm(ft: number, inches: number): number {
  return (ft * 12 + inches) * 2.54;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// ─── Donut Chart Component ──────────────────────────────────────────────────────

function DonutChart({
  protein,
  carbs,
  fat,
}: {
  protein: number;
  carbs: number;
  fat: number;
}) {
  const total = protein + carbs + fat;
  if (total === 0) return null;

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const cx = 100;
  const cy = 100;

  const proteinPct = protein / total;
  const carbsPct = carbs / total;
  const fatPct = fat / total;

  const proteinDash = proteinPct * circumference;
  const carbsDash = carbsPct * circumference;
  const fatDash = fatPct * circumference;

  const proteinOffset = 0;
  const carbsOffset = -(proteinDash);
  const fatOffset = -(proteinDash + carbsDash);

  return (
    <div className="relative w-52 h-52 mx-auto">
      <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
        {/* Protein arc - Blue */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="24"
          strokeDasharray={`${proteinDash} ${circumference - proteinDash}`}
          strokeDashoffset={proteinOffset}
          strokeLinecap="round"
          initial={{ strokeDasharray: `0 ${circumference}` }}
          animate={{ strokeDasharray: `${proteinDash} ${circumference - proteinDash}` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        {/* Carbs arc - Amber */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="#f59e0b"
          strokeWidth="24"
          strokeDasharray={`${carbsDash} ${circumference - carbsDash}`}
          strokeDashoffset={carbsOffset}
          strokeLinecap="round"
          initial={{ strokeDasharray: `0 ${circumference}` }}
          animate={{ strokeDasharray: `${carbsDash} ${circumference - carbsDash}` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        />
        {/* Fat arc - Pink */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="#ec4899"
          strokeWidth="24"
          strokeDasharray={`${fatDash} ${circumference - fatDash}`}
          strokeDashoffset={fatOffset}
          strokeLinecap="round"
          initial={{ strokeDasharray: `0 ${circumference}` }}
          animate={{ strokeDasharray: `${fatDash} ${circumference - fatDash}` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-slate-800 dark:text-white">{total}</span>
        <span className="text-xs text-slate-500 dark:text-slate-400">kcal</span>
      </div>
    </div>
  );
}

// ─── Step Indicator ─────────────────────────────────────────────────────────────

function StepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  const steps = [
    { label: 'Personal Info', icon: User },
    { label: 'Activity Level', icon: Activity },
    { label: 'Your Goal', icon: Target },
  ];

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 mb-8">
      {steps.slice(0, totalSteps).map((step, i) => {
        const StepIcon = step.icon;
        const isActive = i + 1 === currentStep;
        const isCompleted = i + 1 < currentStep;

        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center">
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : isActive
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                }`}
                animate={{ scale: isActive ? 1.1 : 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
              </motion.div>
              <span
                className={`text-xs mt-1 hidden sm:block ${
                  isActive ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < totalSteps - 1 && (
              <div
                className={`w-8 sm:w-16 h-0.5 mx-1 sm:mx-2 mb-4 sm:mb-5 ${
                  isCompleted ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-700'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export function TdeeMacroCalculatorTool() {
  // Wizard state
  const [step, setStep] = useState(1);
  const [showResults, setShowResults] = useState(false);

  // Step 1: Personal Info
  const [info, setInfo] = useState<PersonalInfo>({
    age: '',
    gender: 'male',
    heightCm: '',
    heightFt: '',
    heightIn: '',
    weightKg: '',
    weightLbs: '',
    heightUnit: 'cm',
    weightUnit: 'kg',
  });

  // Step 2: Activity Level
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');

  // Step 3: Goal
  const [goal, setGoal] = useState<GoalType>('maintain');
  const [customAdjust, setCustomAdjust] = useState(0);

  // Macros
  const [macroPreset, setMacroPreset] = useState<MacroPreset>('balanced');

  // Food database & meal plan
  const [foodSearch, setFoodSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | 'All'>('All');
  const [mealPlan, setMealPlan] = useState<MealPlanItem[]>([]);
  const [showFoodDB, setShowFoodDB] = useState(false);

  // History
  const [history, setHistory] = useState<CalculationHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('tdee-calc-history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch {
      // Ignore
    }
  }, []);

  // Save history to localStorage
  const saveHistory = useCallback(
    (entry: CalculationHistory) => {
      const updated = [entry, ...history].slice(0, 5);
      setHistory(updated);
      try {
        localStorage.setItem('tdee-calc-history', JSON.stringify(updated));
      } catch {
        // Ignore
      }
    },
    [history]
  );

  // ─── Calculations ──────────────────────────────────────────────────────

  const weightKg = useMemo(() => {
    if (info.weightUnit === 'kg') return parseFloat(info.weightKg) || 0;
    return lbsToKg(parseFloat(info.weightLbs) || 0);
  }, [info.weightUnit, info.weightKg, info.weightLbs]);

  const heightCm = useMemo(() => {
    if (info.heightUnit === 'cm') return parseFloat(info.heightCm) || 0;
    return ftInToCm(parseFloat(info.heightFt) || 0, parseFloat(info.heightIn) || 0);
  }, [info.heightUnit, info.heightCm, info.heightFt, info.heightIn]);

  const age = parseInt(info.age) || 0;

  const bmr = useMemo(() => {
    if (weightKg <= 0 || heightCm <= 0 || age <= 0) return 0;
    return Math.round(calculateBMR(weightKg, heightCm, age, info.gender));
  }, [weightKg, heightCm, age, info.gender]);

  const activityMultiplier = ACTIVITY_LEVELS.find((a) => a.key === activityLevel)?.multiplier || 1.55;
  const tdee = Math.round(bmr * activityMultiplier);

  const goalAdjustment = useMemo(() => {
    switch (goal) {
      case 'lose':
        return -500;
      case 'gain':
        return 500;
      case 'custom':
        return customAdjust;
      default:
        return 0;
    }
  }, [goal, customAdjust]);

  const adjustedTdee = tdee + goalAdjustment;

  const currentMacroPreset = MACRO_PRESETS.find((m) => m.key === macroPreset)!;

  const macroGrams = useMemo(() => {
    const proteinCals = adjustedTdee * (currentMacroPreset.protein / 100);
    const carbsCals = adjustedTdee * (currentMacroPreset.carbs / 100);
    const fatCals = adjustedTdee * (currentMacroPreset.fat / 100);
    return {
      proteinG: Math.round(proteinCals / 4),
      carbsG: Math.round(carbsCals / 4),
      fatG: Math.round(fatCals / 9),
      proteinCals: Math.round(proteinCals),
      carbsCals: Math.round(carbsCals),
      fatCals: Math.round(fatCals),
    };
  }, [adjustedTdee, currentMacroPreset]);

  // ─── Meal Plan Totals ──────────────────────────────────────────────────

  const mealTotals = useMemo(() => {
    return mealPlan.reduce(
      (acc, item) => ({
        calories: acc.calories + item.food.calories * item.quantity,
        protein: acc.protein + item.food.protein * item.quantity,
        carbs: acc.carbs + item.food.carbs * item.quantity,
        fat: acc.fat + item.food.fat * item.quantity,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [mealPlan]);

  // ─── Filtered Foods ────────────────────────────────────────────────────

  const filteredFoods = useMemo(() => {
    return FOOD_DATABASE.filter((f) => {
      const matchesCategory = selectedCategory === 'All' || f.category === selectedCategory;
      const matchesSearch =
        foodSearch === '' ||
        f.name.toLowerCase().includes(foodSearch.toLowerCase()) ||
        f.nameHi.includes(foodSearch);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, foodSearch]);

  // ─── Handlers ──────────────────────────────────────────────────────────

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Calculate and show results
      setShowResults(true);
      // Save to history
      saveHistory({
        id: generateId(),
        date: new Date().toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        bmr,
        tdee,
        adjustedTdee,
        goal: goal === 'custom' ? `Custom (${customAdjust > 0 ? '+' : ''}${customAdjust})` : goal,
        macroPreset,
        protein: macroGrams.proteinG,
        carbs: macroGrams.carbsG,
        fat: macroGrams.fatG,
      });
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleReset = () => {
    setStep(1);
    setShowResults(false);
    setInfo({
      age: '',
      gender: 'male',
      heightCm: '',
      heightFt: '',
      heightIn: '',
      weightKg: '',
      weightLbs: '',
      heightUnit: 'cm',
      weightUnit: 'kg',
    });
    setActivityLevel('moderate');
    setGoal('maintain');
    setCustomAdjust(0);
    setMacroPreset('balanced');
    setMealPlan([]);
    setShowFoodDB(false);
  };

  const addToMealPlan = (food: FoodItem) => {
    const existing = mealPlan.find((m) => m.food.id === food.id);
    if (existing) {
      setMealPlan(mealPlan.map((m) => (m.food.id === food.id ? { ...m, quantity: m.quantity + 1 } : m)));
    } else {
      setMealPlan([...mealPlan, { food, quantity: 1 }]);
    }
  };

  const removeFromMealPlan = (foodId: string) => {
    setMealPlan(mealPlan.filter((m) => m.food.id !== foodId));
  };

  const updateMealQuantity = (foodId: string, delta: number) => {
    setMealPlan(
      mealPlan
        .map((m) => (m.food.id === foodId ? { ...m, quantity: Math.max(0, m.quantity + delta) } : m))
        .filter((m) => m.quantity > 0)
    );
  };

  const exportCSV = () => {
    const header = 'Food,Serving,Qty,Calories,Protein(g),Carbs(g),Fat(g)\n';
    const rows = mealPlan
      .map(
        (m) =>
          `"${m.food.name}","${m.food.serving}",${m.quantity},${m.food.calories * m.quantity},${
            m.food.protein * m.quantity
          },${m.food.carbs * m.quantity},${m.food.fat * m.quantity}`
      )
      .join('\n');
    const totalRow = `\n"TOTAL","","",${mealTotals.calories},${mealTotals.protein},${mealTotals.carbs},${mealTotals.fat}`;
    const targetRow = `"TARGET (TDEE)","","",${adjustedTdee},${macroGrams.proteinG},${macroGrams.carbsG},${macroGrams.fatG}`;
    const csv = header + rows + totalRow + '\n' + targetRow;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meal-plan-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('tdee-calc-history');
  };

  // ─── Validation ────────────────────────────────────────────────────────

  const isStep1Valid = useMemo(() => {
    const ageVal = parseInt(info.age);
    if (!ageVal || ageVal < 10 || ageVal > 120) return false;
    if (info.heightUnit === 'cm') {
      const h = parseFloat(info.heightCm);
      if (!h || h < 50 || h > 280) return false;
    } else {
      const ft = parseFloat(info.heightFt);
      if (!ft || ft < 1 || ft > 9) return false;
    }
    if (info.weightUnit === 'kg') {
      const w = parseFloat(info.weightKg);
      if (!w || w < 20 || w > 300) return false;
    } else {
      const w = parseFloat(info.weightLbs);
      if (!w || w < 44 || w > 660) return false;
    }
    return true;
  }, [info]);

  const canProceed = step === 1 ? isStep1Valid : true;

  // ─── Render ────────────────────────────────────────────────────────────

  if (showResults) {
    return (
      <div className="space-y-6">
        {/* Top Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <motion.button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm font-medium"
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw className="w-4 h-4" /> Recalculate
          </motion.button>
          <div className="flex gap-2">
            <motion.button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm font-medium"
              whileTap={{ scale: 0.95 }}
            >
              <History className="w-4 h-4" /> History
            </motion.button>
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">
              <Shield className="w-3.5 h-3.5" /> All data stays on your device
            </div>
          </div>
        </div>

        {/* History Panel */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                    <History className="w-4 h-4" /> Recent Calculations
                  </h3>
                  {history.length > 0 && (
                    <button
                      onClick={clearHistory}
                      className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Clear All
                    </button>
                  )}
                </div>
                {history.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">No history yet.</p>
                ) : (
                  <div className="space-y-2">
                    {history.map((h) => (
                      <div
                        key={h.id}
                        className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-sm"
                      >
                        <span className="text-slate-500 dark:text-slate-400 text-xs">{h.date}</span>
                        <span className="font-medium text-slate-700 dark:text-slate-200">
                          TDEE: {h.adjustedTdee} kcal
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 capitalize">{h.goal}</span>
                        <span className="text-xs text-slate-400">
                          P:{h.protein}g C:{h.carbs}g F:{h.fat}g
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Left Column: Calorie Breakdown */}
          <div className="space-y-5">
            {/* BMR & TDEE Cards */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 rounded-2xl p-5 border border-blue-200 dark:border-blue-800"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">BMR</p>
                <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{bmr}</p>
                <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">kcal/day</p>
              </motion.div>
              <motion.div
                className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/20 rounded-2xl p-5 border border-indigo-200 dark:border-indigo-800"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mb-1">TDEE</p>
                <p className="text-3xl font-bold text-indigo-700 dark:text-indigo-300">{tdee}</p>
                <p className="text-xs text-indigo-500 dark:text-indigo-400 mt-1">kcal/day</p>
              </motion.div>
            </div>

            {/* Adjusted TDEE */}
            <motion.div
              className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/20 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-800 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mb-2">
                Daily Calorie Target ({goal === 'custom' ? `${customAdjust > 0 ? '+' : ''}${customAdjust} cal` : goal === 'lose' ? '-500 cal' : goal === 'gain' ? '+500 cal' : 'Maintain'})
              </p>
              <p className="text-5xl font-extrabold text-emerald-700 dark:text-emerald-300">{adjustedTdee}</p>
              <p className="text-sm text-emerald-500 dark:text-emerald-400 mt-1">kcal / day</p>
            </motion.div>

            {/* Macro Preset Selector */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Macro Split</h3>
              <div className="grid grid-cols-3 gap-2">
                {MACRO_PRESETS.map((preset) => (
                  <button
                    key={preset.key}
                    onClick={() => setMacroPreset(preset.key)}
                    className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      macroPreset === preset.key
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">{currentMacroPreset.desc}</p>
            </div>
          </div>

          {/* Right Column: Donut Chart & Macro Cards */}
          <div className="space-y-5">
            {/* Donut Chart */}
            <motion.div
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4 text-center">
                Macronutrient Breakdown
              </h3>
              <DonutChart
                protein={macroGrams.proteinCals}
                carbs={macroGrams.carbsCals}
                fat={macroGrams.fatCals}
              />
              {/* Legend */}
              <div className="flex justify-center gap-4 mt-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-xs text-slate-600 dark:text-slate-400">Protein</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-xs text-slate-600 dark:text-slate-400">Carbs</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-pink-500" />
                  <span className="text-xs text-slate-600 dark:text-slate-400">Fat</span>
                </div>
              </div>
            </motion.div>

            {/* Macro Cards */}
            <div className="grid grid-cols-3 gap-3">
              <motion.div
                className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 rounded-2xl p-4 border border-blue-200 dark:border-blue-800 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Dumbbell className="w-5 h-5 mx-auto text-blue-500 mb-2" />
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Protein</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{macroGrams.proteinG}g</p>
                <p className="text-xs text-blue-500 dark:text-blue-400">{macroGrams.proteinCals} kcal</p>
                <p className="text-xs text-blue-400 dark:text-blue-500 mt-1">{currentMacroPreset.protein}%</p>
              </motion.div>
              <motion.div
                className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/20 rounded-2xl p-4 border border-amber-200 dark:border-amber-800 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Flame className="w-5 h-5 mx-auto text-amber-500 mb-2" />
                <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">Carbs</p>
                <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{macroGrams.carbsG}g</p>
                <p className="text-xs text-amber-500 dark:text-amber-400">{macroGrams.carbsCals} kcal</p>
                <p className="text-xs text-amber-400 dark:text-amber-500 mt-1">{currentMacroPreset.carbs}%</p>
              </motion.div>
              <motion.div
                className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/30 dark:to-pink-800/20 rounded-2xl p-4 border border-pink-200 dark:border-pink-800 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Heart className="w-5 h-5 mx-auto text-pink-500 mb-2" />
                <p className="text-xs text-pink-600 dark:text-pink-400 font-medium">Fat</p>
                <p className="text-2xl font-bold text-pink-700 dark:text-pink-300">{macroGrams.fatG}g</p>
                <p className="text-xs text-pink-500 dark:text-pink-400">{macroGrams.fatCals} kcal</p>
                <p className="text-xs text-pink-400 dark:text-pink-500 mt-1">{currentMacroPreset.fat}%</p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* ─── Indian Food Database & Meal Planner ──────────────────── */}
        <div className="space-y-5">
          {/* Toggle Food DB */}
          <motion.button
            onClick={() => setShowFoodDB(!showFoodDB)}
            className="w-full flex items-center justify-between px-6 py-4 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-200 dark:border-orange-800 hover:shadow-md transition-all"
            whileTap={{ scale: 0.99 }}
          >
            <span className="flex items-center gap-3">
              <Utensils className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <span className="font-semibold text-orange-700 dark:text-orange-300">
                Indian Food Database & Meal Planner
              </span>
            </span>
            <ChevronDown
              className={`w-5 h-5 text-orange-500 transition-transform ${showFoodDB ? 'rotate-180' : ''}`}
            />
          </motion.button>

          <AnimatePresence>
            {showFoodDB && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-5">
                  {/* Meal Plan Summary Bar */}
                  {mealPlan.length > 0 && (
                    <motion.div
                      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                          <Utensils className="w-4 h-4" /> Your Meal Plan
                        </h3>
                        <div className="flex gap-2">
                          <button
                            onClick={exportCSV}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" /> Export CSV
                          </button>
                          <button
                            onClick={() => setMealPlan([])}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Clear
                          </button>
                        </div>
                      </div>

                      {/* Meal Items */}
                      <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
                        {mealPlan.map((item) => (
                          <div
                            key={item.food.id}
                            className="flex items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                                {item.food.name}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {item.food.serving} | {item.food.calories * item.quantity} kcal
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => updateMealQuantity(item.food.id, -1)}
                                className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-6 text-center text-sm font-semibold text-slate-700 dark:text-slate-200">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateMealQuantity(item.food.id, 1)}
                                className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => removeFromMealPlan(item.food.id)}
                                className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-500 flex items-center justify-center hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors ml-1"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Totals vs Target */}
                      <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div className="text-center">
                            <p className="text-xs text-slate-500 dark:text-slate-400">Calories</p>
                            <p className={`text-lg font-bold ${mealTotals.calories > adjustedTdee ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                              {mealTotals.calories}
                            </p>
                            <p className="text-xs text-slate-400">/ {adjustedTdee}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-slate-500 dark:text-slate-400">Protein</p>
                            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{mealTotals.protein}g</p>
                            <p className="text-xs text-slate-400">/ {macroGrams.proteinG}g</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-slate-500 dark:text-slate-400">Carbs</p>
                            <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{mealTotals.carbs}g</p>
                            <p className="text-xs text-slate-400">/ {macroGrams.carbsG}g</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-slate-500 dark:text-slate-400">Fat</p>
                            <p className="text-lg font-bold text-pink-600 dark:text-pink-400">{mealTotals.fat}g</p>
                            <p className="text-xs text-slate-400">/ {macroGrams.fatG}g</p>
                          </div>
                        </div>
                        {/* Calorie progress bar */}
                        <div className="mt-3">
                          <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full ${
                                mealTotals.calories > adjustedTdee
                                  ? 'bg-red-500'
                                  : mealTotals.calories > adjustedTdee * 0.8
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              }`}
                              initial={{ width: 0 }}
                              animate={{
                                width: `${Math.min(100, (mealTotals.calories / adjustedTdee) * 100)}%`,
                              }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                          <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-1">
                            {Math.round((mealTotals.calories / adjustedTdee) * 100)}% of daily target
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Search & Filter */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
                    <div className="flex flex-col sm:flex-row gap-3 mb-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search foods (English or Hindi)..."
                          value={foodSearch}
                          onChange={(e) => setFoodSearch(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Category pills */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <button
                        onClick={() => setSelectedCategory('All')}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          selectedCategory === 'All'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                        }`}
                      >
                        All
                      </button>
                      {FOOD_CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                            selectedCategory === cat
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    {/* Food Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[480px] overflow-y-auto pr-1">
                      {filteredFoods.length === 0 && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 col-span-full text-center py-8">
                          No foods found matching your search.
                        </p>
                      )}
                      {filteredFoods.map((food) => (
                        <motion.div
                          key={food.id}
                          className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-100 dark:border-slate-600 hover:shadow-md transition-shadow group"
                          whileHover={{ y: -2 }}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{food.name}</p>
                              <p className="text-xs text-slate-400 dark:text-slate-500">{food.nameHi}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap ${CATEGORY_COLORS[food.category]}`}>
                              {food.category}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{food.serving}</p>
                          <div className="grid grid-cols-4 gap-1 text-center mb-3">
                            <div>
                              <p className="text-xs text-slate-400 dark:text-slate-500">Cal</p>
                              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{food.calories}</p>
                            </div>
                            <div>
                              <p className="text-xs text-blue-400">P</p>
                              <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{food.protein}g</p>
                            </div>
                            <div>
                              <p className="text-xs text-amber-400">C</p>
                              <p className="text-sm font-bold text-amber-600 dark:text-amber-400">{food.carbs}g</p>
                            </div>
                            <div>
                              <p className="text-xs text-pink-400">F</p>
                              <p className="text-sm font-bold text-pink-600 dark:text-pink-400">{food.fat}g</p>
                            </div>
                          </div>
                          <button
                            onClick={() => addToMealPlan(food)}
                            className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors opacity-80 group-hover:opacity-100"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add to Meal Plan
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // ─── Wizard Steps ──────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      <StepIndicator currentStep={step} totalSteps={3} />

      <AnimatePresence mode="wait">
        {/* ─── Step 1: Personal Info ───────────────────────────────── */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-5"
          >
            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-500" /> Personal Information
            </h2>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Age</label>
              <input
                type="number"
                min={10}
                max={120}
                placeholder="Enter your age"
                value={info.age}
                onChange={(e) => setInfo({ ...info, age: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Gender</label>
              <div className="grid grid-cols-3 gap-2">
                {(['male', 'female', 'other'] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setInfo({ ...info, gender: g })}
                    className={`px-4 py-3 rounded-xl text-sm font-medium capitalize transition-all ${
                      info.gender === g
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Height */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Height</label>
                <div className="flex rounded-lg border border-slate-200 dark:border-slate-600 overflow-hidden">
                  {(['cm', 'ft'] as const).map((u) => (
                    <button
                      key={u}
                      onClick={() => setInfo({ ...info, heightUnit: u })}
                      className={`px-3 py-1 text-xs font-medium transition-colors ${
                        info.heightUnit === u
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {u === 'cm' ? 'cm' : 'ft/in'}
                    </button>
                  ))}
                </div>
              </div>
              {info.heightUnit === 'cm' ? (
                <input
                  type="number"
                  min={50}
                  max={280}
                  placeholder="Height in cm (e.g. 170)"
                  value={info.heightCm}
                  onChange={(e) => setInfo({ ...info, heightCm: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min={1}
                    max={9}
                    placeholder="Feet"
                    value={info.heightFt}
                    onChange={(e) => setInfo({ ...info, heightFt: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    min={0}
                    max={11}
                    placeholder="Inches"
                    value={info.heightIn}
                    onChange={(e) => setInfo({ ...info, heightIn: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>

            {/* Weight */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Weight</label>
                <div className="flex rounded-lg border border-slate-200 dark:border-slate-600 overflow-hidden">
                  {(['kg', 'lbs'] as const).map((u) => (
                    <button
                      key={u}
                      onClick={() => setInfo({ ...info, weightUnit: u })}
                      className={`px-3 py-1 text-xs font-medium transition-colors ${
                        info.weightUnit === u
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="number"
                min={info.weightUnit === 'kg' ? 20 : 44}
                max={info.weightUnit === 'kg' ? 300 : 660}
                placeholder={info.weightUnit === 'kg' ? 'Weight in kg (e.g. 70)' : 'Weight in lbs (e.g. 154)'}
                value={info.weightUnit === 'kg' ? info.weightKg : info.weightLbs}
                onChange={(e) =>
                  setInfo({
                    ...info,
                    ...(info.weightUnit === 'kg' ? { weightKg: e.target.value } : { weightLbs: e.target.value }),
                  })
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </motion.div>
        )}

        {/* ─── Step 2: Activity Level ──────────────────────────────── */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4"
          >
            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-500" /> Activity Level
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Select the option that best describes your typical week.
            </p>
            <div className="space-y-3">
              {ACTIVITY_LEVELS.map((level) => (
                <motion.button
                  key={level.key}
                  onClick={() => setActivityLevel(level.key)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                    activityLevel === level.key
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-md'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-2xl">{level.icon}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800 dark:text-white text-sm">{level.label}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{level.desc}</p>
                  </div>
                  <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-lg">
                    x{level.multiplier}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ─── Step 3: Goal ────────────────────────────────────────── */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-5"
          >
            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-500" /> Your Goal
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {([
                { key: 'lose' as GoalType, label: 'Lose Weight', desc: '-500 cal/day', color: 'text-red-600 dark:text-red-400', icon: '📉' },
                { key: 'maintain' as GoalType, label: 'Maintain', desc: 'No change', color: 'text-emerald-600 dark:text-emerald-400', icon: '⚖️' },
                { key: 'gain' as GoalType, label: 'Gain Weight', desc: '+500 cal/day', color: 'text-blue-600 dark:text-blue-400', icon: '📈' },
              ]).map((g) => (
                <motion.button
                  key={g.key}
                  onClick={() => setGoal(g.key)}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    goal === g.key
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-md'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="text-2xl block mb-2">{g.icon}</span>
                  <p className="font-semibold text-slate-800 dark:text-white text-sm">{g.label}</p>
                  <p className={`text-xs mt-1 ${g.color}`}>{g.desc}</p>
                </motion.button>
              ))}
            </div>

            {/* Custom Option */}
            <div
              className={`p-4 rounded-xl border-2 transition-all ${
                goal === 'custom'
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              <button
                onClick={() => setGoal('custom')}
                className="w-full text-left flex items-center gap-3 mb-3"
              >
                <span className="text-2xl">🎯</span>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white text-sm">Custom Adjustment</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Set your own calorie deficit or surplus</p>
                </div>
              </button>
              {goal === 'custom' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      {customAdjust > 0 ? '+' : ''}{customAdjust} cal/day
                    </span>
                    <span className="text-xs text-slate-400">
                      {customAdjust < 0 ? 'Deficit' : customAdjust > 0 ? 'Surplus' : 'Maintenance'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={-1000}
                    max={1000}
                    step={50}
                    value={customAdjust}
                    onChange={(e) => setCustomAdjust(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>-1000</span>
                    <span>0</span>
                    <span>+1000</span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Preview */}
            {bmr > 0 && (
              <motion.div
                className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-indigo-200 dark:border-indigo-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex flex-wrap items-center justify-around gap-4 text-center">
                  <div>
                    <p className="text-xs text-indigo-500 dark:text-indigo-400">BMR</p>
                    <p className="text-lg font-bold text-indigo-700 dark:text-indigo-300">{bmr}</p>
                  </div>
                  <div className="text-slate-300 dark:text-slate-600">x{activityMultiplier}</div>
                  <div>
                    <p className="text-xs text-indigo-500 dark:text-indigo-400">TDEE</p>
                    <p className="text-lg font-bold text-indigo-700 dark:text-indigo-300">{tdee}</p>
                  </div>
                  <div className="text-slate-300 dark:text-slate-600">
                    {goalAdjustment >= 0 ? '+' : ''}{goalAdjustment}
                  </div>
                  <div>
                    <p className="text-xs text-emerald-500 dark:text-emerald-400">Target</p>
                    <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">{adjustedTdee}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <div>
          {step > 1 && (
            <motion.button
              onClick={handleBack}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm font-medium"
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </motion.button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm"
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </motion.button>
          <motion.button
            onClick={handleNext}
            disabled={!canProceed}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
              canProceed
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
            }`}
            whileTap={canProceed ? { scale: 0.95 } : {}}
          >
            {step === 3 ? (
              <>
                Calculate <Flame className="w-4 h-4" />
              </>
            ) : (
              <>
                Next <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Privacy badge */}
      <div className="flex justify-center">
        <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-medium">
          <Shield className="w-3.5 h-3.5" /> All calculations happen locally. No data is sent to any server.
        </div>
      </div>
    </div>
  );
}
