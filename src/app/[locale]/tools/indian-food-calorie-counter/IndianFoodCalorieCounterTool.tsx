'use client';

import { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Copy,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Check,
  UtensilsCrossed,
  Coffee,
  Sun,
  Moon,
  Cookie,
  Flame,
  Beef,
  Wheat,
  Droplets,
  Leaf,
  PlusCircle,
  Target,
  Weight,
} from 'lucide-react';

/* ─── Types ─────────────────────────────────────────────────────────────── */
interface FoodItem {
  id: number;
  name: string;
  category: FoodCategory;
  serving: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

interface MealEntry {
  id: number;
  food: FoodItem;
  quantity: number;
}

type FoodCategory =
  | 'Breakfast'
  | 'Dal & Curries'
  | 'Rice Dishes'
  | 'Roti/Bread'
  | 'Snacks'
  | 'Sweets'
  | 'Drinks'
  | 'Salads & Sides'
  | 'Custom';

type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';

const MEAL_TYPES: MealType[] = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

const QUANTITY_OPTIONS = [0.5, 1, 1.5, 2];

/* ─── Food Database (200+ items) ────────────────────────────────────────── */
let _id = 0;
const f = (
  name: string,
  category: FoodCategory,
  serving: string,
  calories: number,
  protein: number,
  carbs: number,
  fat: number,
  fiber: number
): FoodItem => ({ id: ++_id, name, category, serving, calories, protein, carbs, fat, fiber });

const FOOD_DATABASE: FoodItem[] = [
  // ── Breakfast ──
  f('Poha', 'Breakfast', '1 plate (200g)', 250, 5, 45, 6, 2),
  f('Upma', 'Breakfast', '1 plate (200g)', 270, 7, 40, 9, 3),
  f('Idli', 'Breakfast', '2 pieces', 130, 4, 26, 1, 1),
  f('Plain Dosa', 'Breakfast', '1 piece', 120, 3, 20, 3, 1),
  f('Masala Dosa', 'Breakfast', '1 piece', 250, 6, 35, 10, 2),
  f('Aloo Paratha', 'Breakfast', '1 piece', 300, 7, 40, 13, 3),
  f('Gobi Paratha', 'Breakfast', '1 piece', 260, 6, 36, 11, 3),
  f('Paneer Paratha', 'Breakfast', '1 piece', 320, 10, 35, 15, 2),
  f('Methi Paratha', 'Breakfast', '1 piece', 230, 6, 32, 9, 3),
  f('Aloo Puri', 'Breakfast', '2 puris + aloo', 380, 8, 50, 16, 4),
  f('Chole Bhature', 'Breakfast', '1 plate', 450, 12, 55, 20, 6),
  f('Puri Bhaji', 'Breakfast', '2 puris + bhaji', 360, 7, 48, 15, 3),
  f('Medu Vada', 'Breakfast', '2 pieces', 200, 8, 22, 9, 2),
  f('Uttapam', 'Breakfast', '1 piece', 180, 5, 28, 5, 2),
  f('Pesarattu', 'Breakfast', '1 piece', 150, 7, 22, 4, 3),
  f('Sabudana Khichdi', 'Breakfast', '1 katori', 220, 3, 38, 7, 1),
  f('Vermicelli Upma', 'Breakfast', '1 plate', 240, 6, 42, 6, 2),
  f('Bread Omelette', 'Breakfast', '2 slices + 2 eggs', 320, 16, 28, 16, 2),
  f('Besan Chilla', 'Breakfast', '2 pieces', 200, 10, 24, 7, 4),
  f('Moong Dal Chilla', 'Breakfast', '2 pieces', 180, 12, 22, 5, 3),
  f('Rava Dosa', 'Breakfast', '1 piece', 160, 4, 24, 5, 1),
  f('Appam', 'Breakfast', '2 pieces', 170, 3, 30, 4, 1),
  f('Puttu', 'Breakfast', '1 cylinder', 200, 4, 38, 4, 2),
  f('Thepla', 'Breakfast', '2 pieces', 240, 6, 30, 10, 3),
  f('Dhokla', 'Breakfast', '4 pieces', 160, 6, 24, 4, 2),
  f('Khandvi', 'Breakfast', '6 pieces', 140, 5, 18, 5, 2),

  // ── Dal & Curries ──
  f('Dal Tadka', 'Dal & Curries', '1 katori (150ml)', 150, 8, 20, 4, 4),
  f('Dal Fry', 'Dal & Curries', '1 katori (150ml)', 170, 9, 22, 5, 4),
  f('Dal Makhani', 'Dal & Curries', '1 katori (150ml)', 230, 9, 22, 12, 4),
  f('Chana Masala', 'Dal & Curries', '1 katori (150ml)', 200, 10, 28, 6, 6),
  f('Rajma', 'Dal & Curries', '1 katori (150ml)', 210, 11, 30, 5, 7),
  f('Paneer Butter Masala', 'Dal & Curries', '1 katori (150ml)', 320, 14, 12, 24, 1),
  f('Shahi Paneer', 'Dal & Curries', '1 katori (150ml)', 300, 13, 10, 23, 1),
  f('Palak Paneer', 'Dal & Curries', '1 katori (150ml)', 260, 14, 10, 18, 3),
  f('Matar Paneer', 'Dal & Curries', '1 katori (150ml)', 280, 13, 15, 19, 3),
  f('Kadai Paneer', 'Dal & Curries', '1 katori (150ml)', 290, 13, 12, 21, 2),
  f('Chicken Curry', 'Dal & Curries', '1 katori (150ml)', 240, 22, 8, 14, 1),
  f('Butter Chicken', 'Dal & Curries', '1 katori (150ml)', 310, 24, 10, 20, 1),
  f('Chicken Tikka Masala', 'Dal & Curries', '1 katori (150ml)', 290, 25, 10, 17, 1),
  f('Egg Curry', 'Dal & Curries', '2 eggs + gravy', 260, 16, 10, 18, 1),
  f('Fish Curry', 'Dal & Curries', '1 katori (150ml)', 200, 20, 8, 10, 1),
  f('Mutton Curry', 'Dal & Curries', '1 katori (150ml)', 300, 24, 8, 20, 1),
  f('Mutton Rogan Josh', 'Dal & Curries', '1 katori (150ml)', 320, 26, 8, 21, 1),
  f('Prawn Curry', 'Dal & Curries', '1 katori (150ml)', 180, 18, 8, 9, 1),
  f('Aloo Gobi', 'Dal & Curries', '1 katori (150ml)', 160, 4, 20, 8, 3),
  f('Bhindi Masala', 'Dal & Curries', '1 katori (150ml)', 130, 3, 14, 7, 3),
  f('Baingan Bharta', 'Dal & Curries', '1 katori (150ml)', 140, 3, 12, 9, 4),
  f('Lauki Sabzi', 'Dal & Curries', '1 katori (150ml)', 80, 2, 10, 4, 2),
  f('Tinda Masala', 'Dal & Curries', '1 katori (150ml)', 90, 2, 12, 4, 2),
  f('Aloo Matar', 'Dal & Curries', '1 katori (150ml)', 180, 5, 24, 7, 3),
  f('Mixed Veg Curry', 'Dal & Curries', '1 katori (150ml)', 150, 4, 18, 7, 3),
  f('Sambar', 'Dal & Curries', '1 katori (150ml)', 130, 6, 18, 4, 4),
  f('Rasam', 'Dal & Curries', '1 katori (150ml)', 50, 2, 8, 1, 1),
  f('Kadhi Pakora', 'Dal & Curries', '1 katori (150ml)', 200, 6, 16, 12, 2),
  f('Malai Kofta', 'Dal & Curries', '2 koftas + gravy', 350, 10, 20, 26, 2),
  f('Dum Aloo', 'Dal & Curries', '1 katori (150ml)', 220, 5, 24, 12, 3),
  f('Chole (Dry)', 'Dal & Curries', '1 katori', 180, 9, 26, 5, 5),
  f('Chicken Korma', 'Dal & Curries', '1 katori (150ml)', 330, 22, 10, 24, 1),

  // ── Rice Dishes ──
  f('Plain Rice (Steamed)', 'Rice Dishes', '1 katori (150g)', 180, 4, 40, 0.5, 0.5),
  f('Jeera Rice', 'Rice Dishes', '1 katori (150g)', 210, 4, 40, 4, 1),
  f('Chicken Biryani', 'Rice Dishes', '1 plate (250g)', 400, 20, 50, 14, 2),
  f('Mutton Biryani', 'Rice Dishes', '1 plate (250g)', 450, 22, 50, 18, 2),
  f('Veg Biryani', 'Rice Dishes', '1 plate (250g)', 350, 8, 52, 12, 3),
  f('Egg Biryani', 'Rice Dishes', '1 plate (250g)', 380, 16, 50, 13, 2),
  f('Hyderabadi Biryani', 'Rice Dishes', '1 plate (250g)', 420, 21, 50, 16, 2),
  f('Veg Pulao', 'Rice Dishes', '1 plate (200g)', 280, 6, 45, 8, 2),
  f('Peas Pulao', 'Rice Dishes', '1 plate (200g)', 270, 7, 44, 7, 3),
  f('Lemon Rice', 'Rice Dishes', '1 plate (200g)', 250, 5, 42, 7, 2),
  f('Curd Rice', 'Rice Dishes', '1 katori (200g)', 230, 7, 38, 5, 1),
  f('Tomato Rice', 'Rice Dishes', '1 plate (200g)', 260, 5, 44, 7, 2),
  f('Coconut Rice', 'Rice Dishes', '1 plate (200g)', 300, 5, 42, 12, 3),
  f('Tamarind Rice', 'Rice Dishes', '1 plate (200g)', 270, 5, 44, 8, 2),
  f('Khichdi', 'Rice Dishes', '1 katori (200g)', 200, 8, 34, 4, 3),
  f('Dal Khichdi', 'Rice Dishes', '1 katori (200g)', 220, 9, 36, 5, 3),
  f('Fried Rice', 'Rice Dishes', '1 plate (200g)', 310, 8, 45, 11, 2),
  f('Chicken Fried Rice', 'Rice Dishes', '1 plate (250g)', 370, 16, 46, 13, 2),
  f('Egg Fried Rice', 'Rice Dishes', '1 plate (250g)', 350, 14, 46, 12, 2),
  f('Bisibele Bath', 'Rice Dishes', '1 plate (200g)', 280, 9, 42, 8, 4),
  f('Pongal', 'Rice Dishes', '1 katori (200g)', 240, 7, 36, 8, 2),

  // ── Roti/Bread ──
  f('Chapati (Medium)', 'Roti/Bread', '1 medium roti', 100, 3, 18, 2, 2),
  f('Chapati with Ghee', 'Roti/Bread', '1 roti + 1 tsp ghee', 145, 3, 18, 7, 2),
  f('Tandoori Roti', 'Roti/Bread', '1 piece', 120, 4, 22, 2, 2),
  f('Butter Naan', 'Roti/Bread', '1 piece', 260, 7, 38, 9, 2),
  f('Plain Naan', 'Roti/Bread', '1 piece', 220, 7, 36, 5, 2),
  f('Garlic Naan', 'Roti/Bread', '1 piece', 270, 7, 38, 10, 2),
  f('Cheese Naan', 'Roti/Bread', '1 piece', 320, 10, 36, 15, 2),
  f('Kulcha', 'Roti/Bread', '1 piece', 240, 6, 36, 8, 2),
  f('Amritsari Kulcha', 'Roti/Bread', '1 piece', 300, 8, 38, 13, 2),
  f('Bhatura', 'Roti/Bread', '1 piece', 250, 5, 32, 12, 1),
  f('Puri', 'Roti/Bread', '1 piece', 120, 2, 15, 6, 1),
  f('Rumali Roti', 'Roti/Bread', '1 piece', 140, 4, 24, 3, 1),
  f('Missi Roti', 'Roti/Bread', '1 piece', 130, 5, 20, 4, 3),
  f('Makki di Roti', 'Roti/Bread', '1 piece', 140, 3, 26, 3, 3),
  f('Lachha Paratha', 'Roti/Bread', '1 piece', 200, 4, 28, 8, 2),
  f('Plain Paratha', 'Roti/Bread', '1 piece', 180, 4, 26, 7, 2),
  f('Malabar Parotta', 'Roti/Bread', '1 piece', 230, 5, 30, 10, 1),
  f('Roomali Roti', 'Roti/Bread', '1 piece', 140, 4, 24, 3, 1),
  f('Bajra Roti', 'Roti/Bread', '1 piece', 110, 3, 20, 2, 3),
  f('Jowar Roti', 'Roti/Bread', '1 piece', 105, 3, 20, 2, 3),
  f('Ragi Roti', 'Roti/Bread', '1 piece', 110, 3, 22, 2, 4),

  // ── Snacks ──
  f('Samosa (Veg)', 'Snacks', '1 piece', 250, 4, 28, 14, 2),
  f('Samosa (Non-Veg)', 'Snacks', '1 piece', 280, 8, 26, 16, 1),
  f('Aloo Pakora', 'Snacks', '4 pieces', 200, 4, 22, 11, 2),
  f('Onion Pakora', 'Snacks', '4 pieces', 180, 4, 20, 10, 2),
  f('Paneer Pakora', 'Snacks', '4 pieces', 260, 10, 18, 16, 1),
  f('Vada Pav', 'Snacks', '1 piece', 290, 6, 38, 13, 2),
  f('Pani Puri', 'Snacks', '6 pieces', 180, 3, 28, 6, 2),
  f('Bhel Puri', 'Snacks', '1 plate', 200, 5, 32, 6, 3),
  f('Sev Puri', 'Snacks', '6 pieces', 220, 4, 30, 9, 2),
  f('Dahi Puri', 'Snacks', '6 pieces', 250, 6, 32, 10, 2),
  f('Kachori', 'Snacks', '1 piece', 200, 4, 22, 11, 2),
  f('Aloo Tikki', 'Snacks', '2 pieces', 220, 4, 28, 10, 3),
  f('Dahi Vada', 'Snacks', '2 pieces', 240, 8, 28, 10, 2),
  f('Pav Bhaji', 'Snacks', '1 plate', 380, 10, 48, 16, 4),
  f('Bread Pakora', 'Snacks', '2 pieces', 280, 6, 30, 14, 2),
  f('Spring Roll', 'Snacks', '2 pieces', 220, 5, 26, 11, 2),
  f('Momos (Veg)', 'Snacks', '6 pieces', 210, 6, 30, 7, 2),
  f('Momos (Chicken)', 'Snacks', '6 pieces', 250, 14, 28, 9, 1),
  f('Aloo Chaat', 'Snacks', '1 plate', 200, 4, 30, 8, 3),
  f('Papdi Chaat', 'Snacks', '1 plate', 280, 6, 34, 13, 2),
  f('Dabeli', 'Snacks', '1 piece', 250, 5, 36, 10, 2),
  f('Misal Pav', 'Snacks', '1 plate', 350, 12, 44, 14, 5),
  f('Egg Puff', 'Snacks', '1 piece', 220, 7, 22, 12, 1),
  f('Chicken Puff', 'Snacks', '1 piece', 250, 10, 22, 14, 1),
  f('Cutlet (Veg)', 'Snacks', '2 pieces', 200, 4, 24, 10, 2),
  f('Chicken Cutlet', 'Snacks', '2 pieces', 240, 12, 22, 12, 1),
  f('Murukku', 'Snacks', '5 pieces', 180, 3, 22, 9, 1),
  f('Banana Chips', 'Snacks', '1 handful (30g)', 160, 1, 18, 10, 2),
  f('Mixture/Chivda', 'Snacks', '1 handful (30g)', 150, 3, 16, 8, 2),
  f('Namkeen', 'Snacks', '1 handful (30g)', 160, 4, 16, 9, 2),
  f('Mathri', 'Snacks', '4 pieces', 180, 3, 20, 10, 1),
  f('Kathi Roll (Paneer)', 'Snacks', '1 roll', 350, 12, 38, 16, 2),
  f('Kathi Roll (Chicken)', 'Snacks', '1 roll', 370, 18, 36, 16, 2),
  f('Frankie (Veg)', 'Snacks', '1 roll', 320, 8, 40, 14, 3),

  // ── Sweets ──
  f('Gulab Jamun', 'Sweets', '2 pieces', 300, 4, 44, 12, 0.5),
  f('Rasgulla', 'Sweets', '2 pieces', 220, 5, 40, 4, 0),
  f('Rasmalai', 'Sweets', '2 pieces', 280, 7, 36, 12, 0),
  f('Jalebi', 'Sweets', '3 pieces', 300, 2, 50, 10, 0),
  f('Besan Ladoo', 'Sweets', '2 pieces', 280, 6, 30, 16, 2),
  f('Motichoor Ladoo', 'Sweets', '2 pieces', 300, 4, 38, 14, 1),
  f('Boondi Ladoo', 'Sweets', '2 pieces', 280, 4, 36, 14, 1),
  f('Kheer (Rice)', 'Sweets', '1 katori (150ml)', 220, 6, 34, 7, 0.5),
  f('Sevaiyan Kheer', 'Sweets', '1 katori (150ml)', 240, 5, 38, 8, 0.5),
  f('Gajar Halwa', 'Sweets', '1 katori (100g)', 300, 5, 36, 16, 2),
  f('Suji Halwa', 'Sweets', '1 katori (100g)', 280, 4, 36, 14, 1),
  f('Moong Dal Halwa', 'Sweets', '1 katori (100g)', 350, 8, 34, 20, 2),
  f('Barfi (Kaju)', 'Sweets', '2 pieces', 260, 5, 28, 14, 1),
  f('Barfi (Plain)', 'Sweets', '2 pieces', 220, 5, 30, 10, 0),
  f('Peda', 'Sweets', '2 pieces', 200, 5, 28, 8, 0),
  f('Sandesh', 'Sweets', '2 pieces', 180, 5, 26, 6, 0),
  f('Mysore Pak', 'Sweets', '2 pieces', 350, 4, 30, 24, 1),
  f('Kalakand', 'Sweets', '2 pieces', 240, 6, 30, 10, 0),
  f('Cham Cham', 'Sweets', '2 pieces', 260, 5, 38, 10, 0),
  f('Kaju Katli', 'Sweets', '2 pieces', 280, 6, 26, 16, 1),
  f('Imarti', 'Sweets', '2 pieces', 280, 3, 44, 10, 1),
  f('Malpua', 'Sweets', '2 pieces', 320, 5, 42, 14, 1),
  f('Gajak', 'Sweets', '2 pieces (50g)', 250, 5, 30, 12, 2),
  f('Rabri', 'Sweets', '1 katori (100ml)', 260, 7, 28, 14, 0),
  f('Shrikhand', 'Sweets', '1 katori (100g)', 240, 6, 34, 9, 0),
  f('Payasam', 'Sweets', '1 katori (150ml)', 250, 6, 38, 8, 1),
  f('Ras Malai', 'Sweets', '2 pieces', 280, 7, 36, 12, 0),

  // ── Drinks ──
  f('Chai (with sugar)', 'Drinks', '1 cup (150ml)', 80, 2, 12, 2, 0),
  f('Chai (without sugar)', 'Drinks', '1 cup (150ml)', 40, 2, 4, 2, 0),
  f('Masala Chai', 'Drinks', '1 cup (150ml)', 90, 2, 14, 2, 0),
  f('Filter Coffee', 'Drinks', '1 cup (150ml)', 90, 2, 12, 3, 0),
  f('Black Coffee', 'Drinks', '1 cup (150ml)', 5, 0, 1, 0, 0),
  f('Sweet Lassi', 'Drinks', '1 glass (250ml)', 200, 6, 32, 5, 0),
  f('Mango Lassi', 'Drinks', '1 glass (250ml)', 230, 6, 38, 6, 1),
  f('Salt Lassi', 'Drinks', '1 glass (250ml)', 100, 5, 8, 5, 0),
  f('Nimbu Pani', 'Drinks', '1 glass (250ml)', 60, 0, 14, 0, 0),
  f('Buttermilk (Chaas)', 'Drinks', '1 glass (250ml)', 40, 2, 4, 2, 0),
  f('Jaljeera', 'Drinks', '1 glass (250ml)', 30, 0, 7, 0, 0),
  f('Aam Panna', 'Drinks', '1 glass (250ml)', 90, 0, 22, 0, 0),
  f('Thandai', 'Drinks', '1 glass (250ml)', 210, 5, 30, 8, 1),
  f('Badam Milk', 'Drinks', '1 glass (250ml)', 200, 7, 26, 8, 1),
  f('Haldi Doodh', 'Drinks', '1 glass (250ml)', 150, 6, 18, 6, 0),
  f('Rose Sharbat', 'Drinks', '1 glass (250ml)', 100, 0, 24, 0, 0),
  f('Sugarcane Juice', 'Drinks', '1 glass (250ml)', 180, 0, 44, 0, 0),
  f('Coconut Water', 'Drinks', '1 glass (250ml)', 45, 1, 10, 0, 0),
  f('Fresh Lime Soda', 'Drinks', '1 glass (300ml)', 80, 0, 20, 0, 0),
  f('Masala Soda', 'Drinks', '1 glass (300ml)', 70, 0, 16, 0, 0),
  f('Sattu Drink', 'Drinks', '1 glass (250ml)', 120, 5, 20, 2, 2),
  f('Kokum Sharbat', 'Drinks', '1 glass (250ml)', 60, 0, 14, 0, 1),

  // ── Salads & Sides ──
  f('Cucumber Raita', 'Salads & Sides', '1 katori (100g)', 60, 3, 6, 3, 0.5),
  f('Boondi Raita', 'Salads & Sides', '1 katori (100g)', 100, 3, 12, 4, 0.5),
  f('Mixed Veg Raita', 'Salads & Sides', '1 katori (100g)', 70, 3, 8, 3, 1),
  f('Mango Pickle', 'Salads & Sides', '1 tbsp', 30, 0, 2, 2, 0.5),
  f('Lemon Pickle', 'Salads & Sides', '1 tbsp', 20, 0, 2, 1, 0.5),
  f('Mixed Pickle', 'Salads & Sides', '1 tbsp', 30, 0, 2, 2, 0.5),
  f('Roasted Papad', 'Salads & Sides', '1 piece', 40, 2, 6, 1, 1),
  f('Fried Papad', 'Salads & Sides', '1 piece', 75, 2, 6, 5, 1),
  f('Green Salad', 'Salads & Sides', '1 plate', 30, 1, 6, 0, 2),
  f('Onion Salad', 'Salads & Sides', '1 plate', 25, 1, 5, 0, 1),
  f('Kachumber', 'Salads & Sides', '1 plate', 35, 1, 7, 0, 2),
  f('Green Chutney', 'Salads & Sides', '2 tbsp', 15, 1, 2, 0.5, 0.5),
  f('Tamarind Chutney', 'Salads & Sides', '2 tbsp', 40, 0, 10, 0, 0.5),
  f('Coconut Chutney', 'Salads & Sides', '2 tbsp', 50, 1, 4, 4, 1),
  f('Tomato Chutney', 'Salads & Sides', '2 tbsp', 30, 0, 4, 1, 0.5),
  f('Peanut Chutney', 'Salads & Sides', '2 tbsp', 60, 3, 4, 4, 1),
  f('Achaar Gosht', 'Salads & Sides', '1 katori', 200, 16, 6, 14, 1),
  f('Sprouted Moong Salad', 'Salads & Sides', '1 katori', 80, 6, 12, 1, 3),
  f('Beet & Carrot Salad', 'Salads & Sides', '1 plate', 50, 1, 10, 0, 3),
  f('Curd (Plain)', 'Salads & Sides', '1 katori (100g)', 60, 3, 5, 3, 0),
];

const CATEGORIES: FoodCategory[] = [
  'Breakfast',
  'Dal & Curries',
  'Rice Dishes',
  'Roti/Bread',
  'Snacks',
  'Sweets',
  'Drinks',
  'Salads & Sides',
];

/* ─── Custom Food ID Counter ───────────────────────────────────────────── */
let _customId = 10000;

/* ─── Component ─────────────────────────────────────────────────────────── */
export function IndianFoodCalorieCounterTool() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<FoodCategory | 'All'>('All');
  const [meals, setMeals] = useState<Record<MealType, MealEntry[]>>({
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    Snacks: [],
  });
  const [calorieBudget, setCalorieBudget] = useState(2000);
  const [bodyWeight, setBodyWeight] = useState(70);
  const [copied, setCopied] = useState(false);
  const [expandedMeal, setExpandedMeal] = useState<MealType | null>('Breakfast');
  const [addingTo, setAddingTo] = useState<MealType>('Breakfast');
  const [customFoods, setCustomFoods] = useState<FoodItem[]>([]);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customForm, setCustomForm] = useState({
    name: '',
    serving: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    fiber: '',
  });
  const [customAdded, setCustomAdded] = useState(false);
  let _entryId = 0;

  const allFoods = useMemo(() => [...FOOD_DATABASE, ...customFoods], [customFoods]);

  const filteredFoods = useMemo(() => {
    return allFoods.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory, allFoods]);

  const dailyTotals = useMemo(() => {
    const totals = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
    MEAL_TYPES.forEach((meal) => {
      meals[meal].forEach((entry) => {
        totals.calories += entry.food.calories * entry.quantity;
        totals.protein += entry.food.protein * entry.quantity;
        totals.carbs += entry.food.carbs * entry.quantity;
        totals.fat += entry.food.fat * entry.quantity;
        totals.fiber += entry.food.fiber * entry.quantity;
      });
    });
    return totals;
  }, [meals]);

  const mealTotals = useMemo(() => {
    const result: Record<MealType, number> = { Breakfast: 0, Lunch: 0, Dinner: 0, Snacks: 0 };
    MEAL_TYPES.forEach((meal) => {
      meals[meal].forEach((entry) => {
        result[meal] += entry.food.calories * entry.quantity;
      });
    });
    return result;
  }, [meals]);

  const caloriePercent = Math.min((dailyTotals.calories / calorieBudget) * 100, 100);
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (caloriePercent / 100) * circumference;

  /* Protein target: 0.8g per kg bodyweight */
  const proteinTarget = Math.round(bodyWeight * 0.8);
  const proteinConsumed = Math.round(dailyTotals.protein);
  const proteinPercent = Math.min((proteinConsumed / proteinTarget) * 100, 100);
  const proteinRemaining = Math.max(0, proteinTarget - proteinConsumed);
  const proteinMet = proteinConsumed >= proteinTarget;

  /* Calorie deficit / surplus */
  const calorieBalance = Math.round(calorieBudget - dailyTotals.calories);
  const isDeficit = calorieBalance >= 0;

  function addCustomFood() {
    const name = customForm.name.trim();
    const serving = customForm.serving.trim();
    const calories = Number(customForm.calories);
    const protein = Number(customForm.protein);
    const carbs = Number(customForm.carbs);
    const fat = Number(customForm.fat);
    const fiber = Number(customForm.fiber);

    if (!name || !serving || isNaN(calories) || calories <= 0) return;

    const newFood: FoodItem = {
      id: ++_customId,
      name,
      category: 'Custom',
      serving,
      calories,
      protein: isNaN(protein) ? 0 : protein,
      carbs: isNaN(carbs) ? 0 : carbs,
      fat: isNaN(fat) ? 0 : fat,
      fiber: isNaN(fiber) ? 0 : fiber,
    };

    setCustomFoods((prev) => [...prev, newFood]);
    setCustomForm({ name: '', serving: '', calories: '', protein: '', carbs: '', fat: '', fiber: '' });
    setCustomAdded(true);
    setTimeout(() => setCustomAdded(false), 2000);
  }

  function addToMeal(food: FoodItem) {
    setMeals((prev) => {
      const existing = prev[addingTo].find((e) => e.food.id === food.id);
      if (existing) {
        return {
          ...prev,
          [addingTo]: prev[addingTo].map((e) =>
            e.food.id === food.id ? { ...e, quantity: Math.min(e.quantity + 1, 10) } : e
          ),
        };
      }
      return {
        ...prev,
        [addingTo]: [...prev[addingTo], { id: Date.now() + ++_entryId, food, quantity: 1 }],
      };
    });
    setExpandedMeal(addingTo);
  }

  function updateQuantity(meal: MealType, entryId: number, quantity: number) {
    setMeals((prev) => ({
      ...prev,
      [meal]: prev[meal].map((e) => (e.id === entryId ? { ...e, quantity } : e)),
    }));
  }

  function removeEntry(meal: MealType, entryId: number) {
    setMeals((prev) => ({
      ...prev,
      [meal]: prev[meal].filter((e) => e.id !== entryId),
    }));
  }

  function clearAll() {
    setMeals({ Breakfast: [], Lunch: [], Dinner: [], Snacks: [] });
  }

  function copySummary() {
    const lines: string[] = ['--- Daily Food Summary ---', `Calorie Budget: ${calorieBudget} kcal`, ''];
    MEAL_TYPES.forEach((meal) => {
      if (meals[meal].length > 0) {
        lines.push(`${meal}:`);
        meals[meal].forEach((e) => {
          lines.push(`  ${e.food.name} x${e.quantity} - ${Math.round(e.food.calories * e.quantity)} kcal`);
        });
        lines.push(`  Subtotal: ${Math.round(mealTotals[meal])} kcal`);
        lines.push('');
      }
    });
    lines.push(`Total: ${Math.round(dailyTotals.calories)} kcal | Protein: ${Math.round(dailyTotals.protein)}g | Carbs: ${Math.round(dailyTotals.carbs)}g | Fat: ${Math.round(dailyTotals.fat)}g | Fiber: ${Math.round(dailyTotals.fiber)}g`);
    lines.push(`Protein Target: ${proteinTarget}g (${bodyWeight}kg x 0.8g/kg) | ${proteinMet ? 'Met!' : `Need ${proteinRemaining}g more`}`);
    lines.push(`Calorie ${isDeficit ? 'Deficit' : 'Surplus'}: ${Math.abs(calorieBalance)} kcal`);
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const mealIcon = (meal: MealType) => {
    switch (meal) {
      case 'Breakfast': return <Coffee className="w-4 h-4" />;
      case 'Lunch': return <Sun className="w-4 h-4" />;
      case 'Dinner': return <Moon className="w-4 h-4" />;
      case 'Snacks': return <Cookie className="w-4 h-4" />;
    }
  };

  const totalEntries = MEAL_TYPES.reduce((sum, m) => sum + meals[m].length, 0);

  return (
    <div className="space-y-6">
      {/* ── Calorie Budget & Progress Ring ── */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Progress Ring */}
          <div className="relative flex-shrink-0">
            <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" strokeWidth="8"
                className="stroke-zinc-200 dark:stroke-zinc-700" />
              <circle cx="60" cy="60" r="54" fill="none" strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className={dailyTotals.calories > calorieBudget ? 'stroke-red-500' : 'stroke-amber-500'} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-zinc-900 dark:text-white">
                {Math.round(dailyTotals.calories)}
              </span>
              <span className="text-xs text-zinc-500">/ {calorieBudget}</span>
              <span className="text-xs text-zinc-400">kcal</span>
            </div>
          </div>

          {/* Budget & Macros */}
          <div className="flex-1 w-full space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap">
                  Daily Budget:
                </label>
                <input
                  type="number"
                  value={calorieBudget}
                  onChange={(e) => setCalorieBudget(Math.max(500, Math.min(5000, Number(e.target.value))))}
                  className="w-28 px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                />
                <span className="text-sm text-zinc-500">kcal</span>
              </div>
              <div className="flex items-center gap-2">
                <Weight className="w-4 h-4 text-zinc-400" />
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap">
                  Weight:
                </label>
                <input
                  type="number"
                  value={bodyWeight}
                  onChange={(e) => setBodyWeight(Math.max(20, Math.min(250, Number(e.target.value))))}
                  className="w-20 px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                />
                <span className="text-sm text-zinc-500">kg</span>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <MacroCard icon={<Flame className="w-4 h-4" />} label="Calories" value={Math.round(dailyTotals.calories)} unit="kcal" color="text-amber-600 dark:text-amber-400" bg="bg-amber-50 dark:bg-amber-950/30" />
              <MacroCard icon={<Beef className="w-4 h-4" />} label="Protein" value={Math.round(dailyTotals.protein)} unit="g" color="text-red-600 dark:text-red-400" bg="bg-red-50 dark:bg-red-950/30" />
              <MacroCard icon={<Wheat className="w-4 h-4" />} label="Carbs" value={Math.round(dailyTotals.carbs)} unit="g" color="text-blue-600 dark:text-blue-400" bg="bg-blue-50 dark:bg-blue-950/30" />
              <MacroCard icon={<Droplets className="w-4 h-4" />} label="Fat" value={Math.round(dailyTotals.fat)} unit="g" color="text-yellow-600 dark:text-yellow-400" bg="bg-yellow-50 dark:bg-yellow-950/30" />
            </div>
            {dailyTotals.fiber > 0 && (
              <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                <Leaf className="w-3.5 h-3.5 text-green-500" />
                Fiber: {Math.round(dailyTotals.fiber)}g
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Daily Protein & Calorie Deficit Summary ── */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Calorie Deficit / Surplus */}
          <div className={`rounded-xl p-4 ${isDeficit ? 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900' : 'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Flame className={`w-4 h-4 ${isDeficit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
              <span className={`text-sm font-medium ${isDeficit ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                Calorie {isDeficit ? 'Deficit' : 'Surplus'}
              </span>
            </div>
            <div className={`text-2xl font-bold ${isDeficit ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
              {Math.abs(calorieBalance)} <span className="text-sm font-normal">kcal</span>
            </div>
            <p className={`text-xs mt-1 ${isDeficit ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
              {isDeficit
                ? calorieBalance === calorieBudget
                  ? 'Start adding meals to track your intake'
                  : `You can still eat ${calorieBalance} kcal today`
                : `You've exceeded your budget by ${Math.abs(calorieBalance)} kcal`
              }
            </p>
          </div>

          {/* Protein Target */}
          <div className="rounded-xl p-4 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  Protein Target
                </span>
              </div>
              <span className="text-xs text-purple-500 dark:text-purple-400">
                {bodyWeight}kg x 0.8g/kg
              </span>
            </div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                {proteinConsumed}
              </span>
              <span className="text-sm text-purple-500 dark:text-purple-400 mb-0.5">
                / {proteinTarget}g
              </span>
            </div>
            {/* Protein Progress Bar */}
            <div className="h-2.5 rounded-full bg-purple-200 dark:bg-purple-900/50 overflow-hidden mb-2">
              <div
                className={`h-full rounded-full transition-all duration-300 ${proteinMet ? 'bg-green-500' : 'bg-purple-500'}`}
                style={{ width: `${proteinPercent}%` }}
              />
            </div>
            <p className={`text-xs ${proteinMet ? 'text-green-600 dark:text-green-400' : 'text-purple-600 dark:text-purple-400'}`}>
              {proteinMet
                ? "You've met your protein goal!"
                : `You need ${proteinRemaining}g more protein`
              }
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ── Left: Food Search ── */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6">
            {/* Search & Add-to selector */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search Indian food... (e.g. biryani, dal, roti)"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none placeholder:text-zinc-400"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-500 whitespace-nowrap">Add to:</span>
                <select
                  value={addingTo}
                  onChange={(e) => setAddingTo(e.target.value as MealType)}
                  className="px-3 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                >
                  {MEAL_TYPES.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Custom Food Form (Collapsible) */}
            <div className="mb-4">
              <button
                onClick={() => setShowCustomForm(!showCustomForm)}
                className="flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                Add Custom Food
                {showCustomForm ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showCustomForm && (
                <div className="mt-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Food name *"
                      value={customForm.name}
                      onChange={(e) => setCustomForm((p) => ({ ...p, name: e.target.value }))}
                      className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none placeholder:text-zinc-400"
                    />
                    <input
                      type="text"
                      placeholder="Serving size * (e.g. 1 bowl)"
                      value={customForm.serving}
                      onChange={(e) => setCustomForm((p) => ({ ...p, serving: e.target.value }))}
                      className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none placeholder:text-zinc-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div>
                      <label className="text-xs text-zinc-500 dark:text-zinc-400 mb-1 block">Calories *</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={customForm.calories}
                        onChange={(e) => setCustomForm((p) => ({ ...p, calories: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-500 dark:text-zinc-400 mb-1 block">Protein (g)</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={customForm.protein}
                        onChange={(e) => setCustomForm((p) => ({ ...p, protein: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-500 dark:text-zinc-400 mb-1 block">Carbs (g)</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={customForm.carbs}
                        onChange={(e) => setCustomForm((p) => ({ ...p, carbs: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-500 dark:text-zinc-400 mb-1 block">Fat (g)</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={customForm.fat}
                        onChange={(e) => setCustomForm((p) => ({ ...p, fat: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-500 dark:text-zinc-400 mb-1 block">Fiber (g)</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={customForm.fiber}
                        onChange={(e) => setCustomForm((p) => ({ ...p, fiber: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={addCustomFood}
                      disabled={!customForm.name.trim() || !customForm.serving.trim() || !customForm.calories || Number(customForm.calories) <= 0}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 text-white disabled:text-zinc-500 text-sm font-medium transition-colors"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Add Custom Food
                    </button>
                    {customAdded && (
                      <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                        <Check className="w-4 h-4" /> Added!
                      </span>
                    )}
                  </div>
                  {customFoods.length > 0 && (
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                      {customFoods.length} custom food{customFoods.length > 1 ? 's' : ''} added this session
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setActiveCategory('All')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeCategory === 'All'
                    ? 'bg-amber-500 text-white'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                All ({allFoods.length})
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activeCategory === cat
                      ? 'bg-amber-500 text-white'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {cat} ({allFoods.filter((f) => f.category === cat).length})
                </button>
              ))}
              {customFoods.length > 0 && (
                <button
                  onClick={() => setActiveCategory('Custom')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activeCategory === 'Custom'
                      ? 'bg-amber-500 text-white'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  Custom ({customFoods.length})
                </button>
              )}
            </div>

            {/* Food List */}
            <div className="max-h-[480px] overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
              {filteredFoods.length === 0 && (
                <div className="text-center py-8 text-zinc-400">
                  <UtensilsCrossed className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No food items found. Try a different search.</p>
                </div>
              )}
              {filteredFoods.map((food) => (
                <div
                  key={food.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:border-amber-300 dark:hover:border-amber-700 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-zinc-900 dark:text-white truncate">
                        {food.name}
                      </span>
                      <span className="text-xs text-zinc-400 dark:text-zinc-500 hidden sm:inline">
                        {food.category}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {food.serving}
                    </div>
                    <div className="flex gap-3 mt-1 text-xs text-zinc-400">
                      <span className="text-amber-600 dark:text-amber-400 font-semibold">{food.calories} kcal</span>
                      <span>P: {food.protein}g</span>
                      <span>C: {food.carbs}g</span>
                      <span>F: {food.fat}g</span>
                    </div>
                  </div>
                  <button
                    onClick={() => addToMeal(food)}
                    className="flex-shrink-0 p-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition-colors opacity-70 group-hover:opacity-100"
                    title={`Add to ${addingTo}`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: Meal Tracker ── */}
        <div className="lg:col-span-2 space-y-4">
          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={copySummary}
              disabled={totalEntries === 0}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 text-white disabled:text-zinc-500 text-sm font-medium transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Summary'}
            </button>
            <button
              onClick={clearAll}
              disabled={totalEntries === 0}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 text-zinc-700 dark:text-zinc-300 text-sm font-medium transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Clear Day
            </button>
          </div>

          {/* Meal Sections */}
          {MEAL_TYPES.map((meal) => (
            <div
              key={meal}
              className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
            >
              <button
                onClick={() => setExpandedMeal(expandedMeal === meal ? null : meal)}
                className="w-full flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {mealIcon(meal)}
                  <span className="font-medium text-sm text-zinc-900 dark:text-white">{meal}</span>
                  <span className="text-xs text-zinc-400">({meals[meal].length} items)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                    {Math.round(mealTotals[meal])} kcal
                  </span>
                  {expandedMeal === meal ? (
                    <ChevronUp className="w-4 h-4 text-zinc-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-400" />
                  )}
                </div>
              </button>

              {expandedMeal === meal && (
                <div className="border-t border-zinc-100 dark:border-zinc-800">
                  {meals[meal].length === 0 ? (
                    <div className="p-4 text-center text-xs text-zinc-400">
                      No items added. Search and add food above.
                    </div>
                  ) : (
                    <div className="p-2 space-y-1">
                      {meals[meal].map((entry) => (
                        <div
                          key={entry.id}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                              {entry.food.name}
                            </div>
                            <div className="text-xs text-zinc-400">
                              {Math.round(entry.food.calories * entry.quantity)} kcal
                            </div>
                          </div>
                          {/* Quantity Selector */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  meal,
                                  entry.id,
                                  Math.max(0.5, entry.quantity - 0.5)
                                )
                              }
                              className="p-1 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <select
                              value={entry.quantity}
                              onChange={(e) =>
                                updateQuantity(meal, entry.id, Number(e.target.value))
                              }
                              className="w-14 text-center text-xs py-1 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none"
                            >
                              {QUANTITY_OPTIONS.map((q) => (
                                <option key={q} value={q}>
                                  {q}x
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  meal,
                                  entry.id,
                                  Math.min(2, entry.quantity + 0.5)
                                )
                              }
                              className="p-1 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeEntry(meal, entry.id)}
                            className="p-1 rounded-md hover:bg-red-100 dark:hover:bg-red-950/30 text-zinc-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Meal Calorie Breakdown Bar */}
          {totalEntries > 0 && (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4">
              <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                Meal Breakdown
              </h3>
              <div className="flex h-4 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                {MEAL_TYPES.map((meal) => {
                  const pct =
                    dailyTotals.calories > 0
                      ? (mealTotals[meal] / dailyTotals.calories) * 100
                      : 0;
                  if (pct === 0) return null;
                  const colors: Record<MealType, string> = {
                    Breakfast: 'bg-amber-400',
                    Lunch: 'bg-orange-500',
                    Dinner: 'bg-red-500',
                    Snacks: 'bg-yellow-400',
                  };
                  return (
                    <div
                      key={meal}
                      className={`${colors[meal]} transition-all duration-300`}
                      title={`${meal}: ${Math.round(mealTotals[meal])} kcal (${Math.round(pct)}%)`}
                      /* width set via Tailwind arbitrary */
                      /* eslint-disable-next-line react/forbid-dom-props */
                      style={{ width: `${pct}%` }}
                    />
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-3 mt-3">
                {MEAL_TYPES.map((meal) => {
                  const pct =
                    dailyTotals.calories > 0
                      ? (mealTotals[meal] / dailyTotals.calories) * 100
                      : 0;
                  if (pct === 0) return null;
                  const dots: Record<MealType, string> = {
                    Breakfast: 'bg-amber-400',
                    Lunch: 'bg-orange-500',
                    Dinner: 'bg-red-500',
                    Snacks: 'bg-yellow-400',
                  };
                  return (
                    <div key={meal} className="flex items-center gap-1.5 text-xs text-zinc-500">
                      <span className={`w-2.5 h-2.5 rounded-full ${dots[meal]}`} />
                      {meal}: {Math.round(pct)}%
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Macro Card Sub-component ──────────────────────────────────────────── */
function MacroCard({
  icon,
  label,
  value,
  unit,
  color,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  unit: string;
  color: string;
  bg: string;
}) {
  return (
    <div className={`${bg} rounded-xl p-3`}>
      <div className={`flex items-center gap-1.5 ${color} mb-1`}>
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className="text-lg font-bold text-zinc-900 dark:text-white">
        {value}
        <span className="text-xs font-normal text-zinc-500 ml-1">{unit}</span>
      </div>
    </div>
  );
}
