'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  Hash,
  Copy,
  Check,
  Shuffle,
  AlertTriangle,
  Sparkles,
  Instagram,
  Twitter,
  Linkedin,
  Shield,
  X,
  Music,
} from 'lucide-react';

// ─── TYPES ────────────────────────────────────────────────────────────────────

type Platform = 'instagram' | 'tiktok' | 'twitter' | 'linkedin';
type Tier = 'high' | 'medium' | 'low';
type Niche =
  | 'travel'
  | 'food'
  | 'fitness'
  | 'fashion'
  | 'tech'
  | 'photography'
  | 'business'
  | 'lifestyle'
  | 'beauty'
  | 'gaming'
  | 'music'
  | 'education'
  | 'pets'
  | 'art'
  | 'sports'
  | 'motivation';

interface HashtagEntry {
  tag: string;
  tier: Tier;
}

// ─── BANNED HASHTAGS (commonly banned on Instagram) ───────────────────────────

const BANNED_HASHTAGS = new Set([
  'adulting', 'alone', 'attractive', 'beautyblogger', 'besties', 'bikinibody',
  'boho', 'costumes', 'curvygirls', 'date', 'dating', 'desk', 'direct',
  'dm', 'eggplant', 'elevator', 'fighters', 'fitnessgirls', 'girlsnight',
  'gloves', 'graffiti', 'happythanksgiving', 'hardcoretraining', 'humpday',
  'hustler', 'ice', 'instababe', 'instamood', 'iowa', 'italiano', 'kansas',
  'kickoff', 'killer', 'kissing', 'loseweight', 'master', 'mileycyrus',
  'milf', 'models', 'mustfollow', 'nasty', 'newyearsday', 'nudity',
  'obsessed', 'petite', 'pushups', 'rate', 'saltwater', 'single',
  'singlelife', 'skateboarding', 'skype', 'snap', 'snapchat', 'snowstorm',
  'sopretty', 'stranger', 'streetphoto', 'sunbathing', 'swole', 'tag4likes',
  'tagblender', 'teens', 'thought', 'todayimwearing', 'twerk', 'underage',
  'valentinesday', 'weed', 'workflow', 'wtf', 'young',
]);

// ─── HASHTAG DATABASE (800+ hashtags across 16 niches) ────────────────────────

const HASHTAG_DB: Record<Niche, HashtagEntry[]> = {
  travel: [
    { tag: 'travel', tier: 'high' }, { tag: 'travelgram', tier: 'high' }, { tag: 'instatravel', tier: 'high' },
    { tag: 'travelphotography', tier: 'high' }, { tag: 'traveltheworld', tier: 'high' }, { tag: 'wanderlust', tier: 'high' },
    { tag: 'vacation', tier: 'high' }, { tag: 'explore', tier: 'high' }, { tag: 'adventure', tier: 'high' },
    { tag: 'traveling', tier: 'high' }, { tag: 'travelblogger', tier: 'high' }, { tag: 'tourism', tier: 'high' },
    { tag: 'trip', tier: 'high' }, { tag: 'holiday', tier: 'high' }, { tag: 'backpacking', tier: 'medium' },
    { tag: 'traveladdict', tier: 'medium' }, { tag: 'travelholic', tier: 'medium' }, { tag: 'passportready', tier: 'medium' },
    { tag: 'globetrotter', tier: 'medium' }, { tag: 'roamtheplanet', tier: 'medium' }, { tag: 'traveldiaries', tier: 'medium' },
    { tag: 'bucketlist', tier: 'medium' }, { tag: 'solotraveler', tier: 'medium' }, { tag: 'roadtrip', tier: 'medium' },
    { tag: 'traveltips', tier: 'medium' }, { tag: 'travelcouple', tier: 'medium' }, { tag: 'dronephotography', tier: 'medium' },
    { tag: 'digitalnomad', tier: 'medium' }, { tag: 'luxurytravel', tier: 'medium' }, { tag: 'sustainabletravel', tier: 'low' },
    { tag: 'travelinspo', tier: 'medium' }, { tag: 'exploremore', tier: 'medium' }, { tag: 'lonelyplanet', tier: 'medium' },
    { tag: 'jetsetter', tier: 'low' }, { tag: 'travelandlife', tier: 'low' }, { tag: 'adventuretravel', tier: 'low' },
    { tag: 'offthebeatenpath', tier: 'low' }, { tag: 'travelstories', tier: 'low' }, { tag: 'travelcommunity', tier: 'low' },
    { tag: 'seetheworld', tier: 'low' }, { tag: 'travelvibes', tier: 'low' }, { tag: 'travellife', tier: 'low' },
    { tag: 'femaletravel', tier: 'low' }, { tag: 'budgettravel', tier: 'low' }, { tag: 'travelasia', tier: 'low' },
    { tag: 'eurotrip', tier: 'low' }, { tag: 'islandlife', tier: 'low' }, { tag: 'beachvibes', tier: 'low' },
    { tag: 'mountainlovers', tier: 'low' }, { tag: 'campinglife', tier: 'low' }, { tag: 'vanlife', tier: 'medium' },
    { tag: 'hikingadventures', tier: 'low' }, { tag: 'passportstamps', tier: 'low' }, { tag: 'solotravel', tier: 'medium' },
  ],
  food: [
    { tag: 'food', tier: 'high' }, { tag: 'foodie', tier: 'high' }, { tag: 'foodporn', tier: 'high' },
    { tag: 'instafood', tier: 'high' }, { tag: 'yummy', tier: 'high' }, { tag: 'foodphotography', tier: 'high' },
    { tag: 'foodstagram', tier: 'high' }, { tag: 'delicious', tier: 'high' }, { tag: 'homemade', tier: 'high' },
    { tag: 'foodlover', tier: 'high' }, { tag: 'cooking', tier: 'high' }, { tag: 'recipe', tier: 'high' },
    { tag: 'dinner', tier: 'high' }, { tag: 'lunch', tier: 'high' }, { tag: 'breakfast', tier: 'high' },
    { tag: 'healthyfood', tier: 'medium' }, { tag: 'eeeeeats', tier: 'medium' }, { tag: 'foodblogger', tier: 'medium' },
    { tag: 'homecooking', tier: 'medium' }, { tag: 'baking', tier: 'medium' }, { tag: 'vegan', tier: 'medium' },
    { tag: 'vegetarian', tier: 'medium' }, { tag: 'plantbased', tier: 'medium' }, { tag: 'mealprep', tier: 'medium' },
    { tag: 'brunch', tier: 'medium' }, { tag: 'dessert', tier: 'medium' }, { tag: 'streetfood', tier: 'medium' },
    { tag: 'comfortfood', tier: 'medium' }, { tag: 'seafood', tier: 'medium' }, { tag: 'sushi', tier: 'medium' },
    { tag: 'pasta', tier: 'medium' }, { tag: 'bbq', tier: 'medium' }, { tag: 'foodtruck', tier: 'low' },
    { tag: 'cleaneating', tier: 'low' }, { tag: 'recipeideas', tier: 'low' }, { tag: 'foodreview', tier: 'low' },
    { tag: 'cookingathome', tier: 'low' }, { tag: 'seasonalcooking', tier: 'low' }, { tag: 'mealideas', tier: 'low' },
    { tag: 'glutenfree', tier: 'medium' }, { tag: 'dairyfree', tier: 'low' }, { tag: 'ketodiet', tier: 'low' },
    { tag: 'sourdough', tier: 'low' }, { tag: 'fermentedfoods', tier: 'low' }, { tag: 'farmtotable', tier: 'low' },
    { tag: 'eatlocal', tier: 'low' }, { tag: 'foodflatlay', tier: 'low' }, { tag: 'recipeshare', tier: 'low' },
    { tag: 'homebakedgoods', tier: 'low' }, { tag: 'foodstyling', tier: 'low' }, { tag: 'tastytreats', tier: 'low' },
    { tag: 'instayum', tier: 'low' }, { tag: 'cheflife', tier: 'low' },
  ],
  fitness: [
    { tag: 'fitness', tier: 'high' }, { tag: 'gym', tier: 'high' }, { tag: 'workout', tier: 'high' },
    { tag: 'fitnessmotivation', tier: 'high' }, { tag: 'fit', tier: 'high' }, { tag: 'training', tier: 'high' },
    { tag: 'health', tier: 'high' }, { tag: 'motivation', tier: 'high' }, { tag: 'bodybuilding', tier: 'high' },
    { tag: 'exercise', tier: 'high' }, { tag: 'healthy', tier: 'high' }, { tag: 'muscle', tier: 'high' },
    { tag: 'fitnessjourney', tier: 'high' }, { tag: 'personaltrainer', tier: 'medium' }, { tag: 'yoga', tier: 'high' },
    { tag: 'crossfit', tier: 'medium' }, { tag: 'weightlifting', tier: 'medium' }, { tag: 'cardio', tier: 'medium' },
    { tag: 'strengthtraining', tier: 'medium' }, { tag: 'fitlife', tier: 'medium' }, { tag: 'workoutmotivation', tier: 'medium' },
    { tag: 'gymlife', tier: 'medium' }, { tag: 'fitfam', tier: 'medium' }, { tag: 'abs', tier: 'medium' },
    { tag: 'gains', tier: 'medium' }, { tag: 'legday', tier: 'medium' }, { tag: 'running', tier: 'medium' },
    { tag: 'marathon', tier: 'medium' }, { tag: 'pilates', tier: 'medium' }, { tag: 'hiit', tier: 'medium' },
    { tag: 'deadlift', tier: 'medium' }, { tag: 'benchpress', tier: 'low' }, { tag: 'homeworkout', tier: 'low' },
    { tag: 'calisthenics', tier: 'low' }, { tag: 'functionalfitness', tier: 'low' }, { tag: 'fitover40', tier: 'low' },
    { tag: 'powerlifting', tier: 'low' }, { tag: 'gymmotivation', tier: 'low' }, { tag: 'fitnesscoach', tier: 'low' },
    { tag: 'fitnessgoals', tier: 'low' }, { tag: 'activewear', tier: 'low' }, { tag: 'morningworkout', tier: 'low' },
    { tag: 'workoutroutine', tier: 'low' }, { tag: 'flexfriday', tier: 'low' }, { tag: 'noexcuses', tier: 'low' },
    { tag: 'trainhard', tier: 'low' }, { tag: 'sweatitout', tier: 'low' }, { tag: 'fitandhealthy', tier: 'low' },
    { tag: 'beastmode', tier: 'low' }, { tag: 'getstrong', tier: 'low' }, { tag: 'burnfat', tier: 'low' },
    { tag: 'fitnesscommunity', tier: 'low' }, { tag: 'wellnessjourney', tier: 'low' },
  ],
  fashion: [
    { tag: 'fashion', tier: 'high' }, { tag: 'style', tier: 'high' }, { tag: 'ootd', tier: 'high' },
    { tag: 'fashionblogger', tier: 'high' }, { tag: 'instafashion', tier: 'high' }, { tag: 'streetstyle', tier: 'high' },
    { tag: 'fashionstyle', tier: 'high' }, { tag: 'outfit', tier: 'high' }, { tag: 'fashionista', tier: 'high' },
    { tag: 'trendy', tier: 'high' }, { tag: 'clothing', tier: 'high' }, { tag: 'lookoftheday', tier: 'high' },
    { tag: 'whatiwore', tier: 'medium' }, { tag: 'styleinspo', tier: 'medium' }, { tag: 'outfitoftheday', tier: 'medium' },
    { tag: 'fashiondesigner', tier: 'medium' }, { tag: 'streetwear', tier: 'medium' }, { tag: 'luxuryfashion', tier: 'medium' },
    { tag: 'vintage', tier: 'medium' }, { tag: 'womenswear', tier: 'medium' }, { tag: 'mensfashion', tier: 'medium' },
    { tag: 'fashionphotography', tier: 'medium' }, { tag: 'modelling', tier: 'medium' }, { tag: 'accessories', tier: 'medium' },
    { tag: 'shoes', tier: 'medium' }, { tag: 'sneakers', tier: 'medium' }, { tag: 'handmade', tier: 'medium' },
    { tag: 'denim', tier: 'medium' }, { tag: 'bohostyle', tier: 'medium' }, { tag: 'minimalistfashion', tier: 'low' },
    { tag: 'sustainablefashion', tier: 'low' }, { tag: 'thriftedstyle', tier: 'low' }, { tag: 'capsulewardrobe', tier: 'low' },
    { tag: 'slowfashion', tier: 'low' }, { tag: 'fashionforward', tier: 'low' }, { tag: 'outfitideas', tier: 'low' },
    { tag: 'styleguide', tier: 'low' }, { tag: 'fashiondaily', tier: 'low' }, { tag: 'wardrobeessentials', tier: 'low' },
    { tag: 'fashiontrends', tier: 'low' }, { tag: 'dailyoutfit', tier: 'low' }, { tag: 'chic', tier: 'low' },
    { tag: 'elegantstyle', tier: 'low' }, { tag: 'styletips', tier: 'low' }, { tag: 'fashiongoals', tier: 'low' },
    { tag: 'newcollection', tier: 'low' }, { tag: 'outfitinspo', tier: 'low' }, { tag: 'classicstyle', tier: 'low' },
    { tag: 'effortlessstyle', tier: 'low' }, { tag: 'fashiongram', tier: 'low' }, { tag: 'dresscode', tier: 'low' },
    { tag: 'ethicalfashion', tier: 'low' },
  ],
  tech: [
    { tag: 'technology', tier: 'high' }, { tag: 'tech', tier: 'high' }, { tag: 'programming', tier: 'high' },
    { tag: 'coding', tier: 'high' }, { tag: 'developer', tier: 'high' }, { tag: 'software', tier: 'high' },
    { tag: 'gadgets', tier: 'high' }, { tag: 'innovation', tier: 'high' }, { tag: 'ai', tier: 'high' },
    { tag: 'machinelearning', tier: 'high' }, { tag: 'startup', tier: 'high' }, { tag: 'webdevelopment', tier: 'medium' },
    { tag: 'javascript', tier: 'medium' }, { tag: 'python', tier: 'medium' }, { tag: 'datascience', tier: 'medium' },
    { tag: 'cybersecurity', tier: 'medium' }, { tag: 'iot', tier: 'medium' }, { tag: 'blockchain', tier: 'medium' },
    { tag: 'appdevelopment', tier: 'medium' }, { tag: 'robotics', tier: 'medium' }, { tag: 'cloudcomputing', tier: 'medium' },
    { tag: 'devops', tier: 'medium' }, { tag: 'frontend', tier: 'medium' }, { tag: 'backend', tier: 'medium' },
    { tag: 'fullstack', tier: 'medium' }, { tag: 'reactjs', tier: 'medium' }, { tag: 'opensource', tier: 'medium' },
    { tag: 'linux', tier: 'medium' }, { tag: 'techstartup', tier: 'low' }, { tag: 'techcommunity', tier: 'low' },
    { tag: 'codenewbie', tier: 'low' }, { tag: 'womenintech', tier: 'low' }, { tag: 'learntocode', tier: 'low' },
    { tag: 'devlife', tier: 'low' }, { tag: 'codeeveryday', tier: 'low' }, { tag: 'techreview', tier: 'low' },
    { tag: 'gadgetreview', tier: 'low' }, { tag: 'saas', tier: 'low' }, { tag: 'deeplearning', tier: 'low' },
    { tag: 'neuralnetworks', tier: 'low' }, { tag: 'generativeai', tier: 'low' }, { tag: 'promptengineering', tier: 'low' },
    { tag: 'softwaredeveloper', tier: 'low' }, { tag: 'programminglife', tier: 'low' }, { tag: 'techinnovation', tier: 'low' },
    { tag: 'smartdevices', tier: 'low' }, { tag: 'digitalmarketing', tier: 'medium' }, { tag: 'webapp', tier: 'low' },
    { tag: 'apidesign', tier: 'low' }, { tag: 'agiledevelopment', tier: 'low' }, { tag: 'productmanagement', tier: 'low' },
    { tag: 'uiux', tier: 'low' },
  ],
  photography: [
    { tag: 'photography', tier: 'high' }, { tag: 'photooftheday', tier: 'high' }, { tag: 'photographer', tier: 'high' },
    { tag: 'naturephotography', tier: 'high' }, { tag: 'portraitphotography', tier: 'high' }, { tag: 'landscapephotography', tier: 'high' },
    { tag: 'photoshoot', tier: 'high' }, { tag: 'instaphoto', tier: 'high' }, { tag: 'canon', tier: 'high' },
    { tag: 'nikon', tier: 'high' }, { tag: 'streetphotography', tier: 'high' }, { tag: 'sunset', tier: 'high' },
    { tag: 'goldenhour', tier: 'medium' }, { tag: 'photographylovers', tier: 'medium' }, { tag: 'cameragear', tier: 'medium' },
    { tag: 'sony', tier: 'medium' }, { tag: 'fujifilm', tier: 'medium' }, { tag: 'lightroom', tier: 'medium' },
    { tag: 'editingskills', tier: 'medium' }, { tag: 'blackandwhitephotography', tier: 'medium' }, { tag: 'macro', tier: 'medium' },
    { tag: 'longexposure', tier: 'medium' }, { tag: 'astrophotography', tier: 'medium' }, { tag: 'travelphotography', tier: 'high' },
    { tag: 'weddingphotography', tier: 'medium' }, { tag: 'foodphotography', tier: 'medium' }, { tag: 'filmphotography', tier: 'medium' },
    { tag: 'shootandshare', tier: 'low' }, { tag: 'photodaily', tier: 'low' }, { tag: 'photographyislife', tier: 'low' },
    { tag: 'minimalphotography', tier: 'low' }, { tag: 'urbanphotography', tier: 'low' }, { tag: 'architecturephotography', tier: 'low' },
    { tag: 'documentaryphotography', tier: 'low' }, { tag: 'mobilephotography', tier: 'low' }, { tag: 'rawphotography', tier: 'low' },
    { tag: 'photojournalism', tier: 'low' }, { tag: 'shotoncanon', tier: 'low' }, { tag: 'shotonsnikon', tier: 'low' },
    { tag: 'moodyphotography', tier: 'low' }, { tag: 'photographyart', tier: 'low' }, { tag: 'capturethemoment', tier: 'low' },
    { tag: 'shutterspeed', tier: 'low' }, { tag: 'bokeh', tier: 'low' }, { tag: 'primelens', tier: 'low' },
    { tag: 'photoedit', tier: 'low' }, { tag: 'lightroomedit', tier: 'low' }, { tag: 'nightphotography', tier: 'low' },
    { tag: 'dronephotography', tier: 'medium' }, { tag: 'iphone photography', tier: 'low' }, { tag: 'visualstorytelling', tier: 'low' },
    { tag: 'compositionrules', tier: 'low' },
  ],
  business: [
    { tag: 'business', tier: 'high' }, { tag: 'entrepreneur', tier: 'high' }, { tag: 'marketing', tier: 'high' },
    { tag: 'success', tier: 'high' }, { tag: 'money', tier: 'high' }, { tag: 'smallbusiness', tier: 'high' },
    { tag: 'startup', tier: 'high' }, { tag: 'branding', tier: 'high' }, { tag: 'leadership', tier: 'high' },
    { tag: 'networking', tier: 'high' }, { tag: 'socialmedia', tier: 'high' }, { tag: 'hustle', tier: 'high' },
    { tag: 'businessowner', tier: 'medium' }, { tag: 'entrepreneurlife', tier: 'medium' }, { tag: 'onlinebusiness', tier: 'medium' },
    { tag: 'businesstips', tier: 'medium' }, { tag: 'growthmindset', tier: 'medium' }, { tag: 'passiveincome', tier: 'medium' },
    { tag: 'investmenting', tier: 'medium' }, { tag: 'finance', tier: 'medium' }, { tag: 'sidehustle', tier: 'medium' },
    { tag: 'freelancer', tier: 'medium' }, { tag: 'ecommerce', tier: 'medium' }, { tag: 'contentmarketing', tier: 'medium' },
    { tag: 'digitalmarketing', tier: 'medium' }, { tag: 'salesstrategy', tier: 'low' }, { tag: 'emailmarketing', tier: 'low' },
    { tag: 'personalbranding', tier: 'low' }, { tag: 'businesscoach', tier: 'low' }, { tag: 'femalebusinessowner', tier: 'low' },
    { tag: 'productlaunch', tier: 'low' }, { tag: 'ceo', tier: 'low' }, { tag: 'workfromhome', tier: 'medium' },
    { tag: 'linkedinmarketing', tier: 'low' }, { tag: 'b2bmarketing', tier: 'low' }, { tag: 'startuplife', tier: 'low' },
    { tag: 'scaleyourbusiness', tier: 'low' }, { tag: 'businessgrowth', tier: 'low' }, { tag: 'investmentips', tier: 'low' },
    { tag: 'businessmindset', tier: 'low' }, { tag: 'revenuegoals', tier: 'low' }, { tag: 'solopreneur', tier: 'low' },
    { tag: 'buildyourbrand', tier: 'low' }, { tag: 'digitalentrepreneur', tier: 'low' }, { tag: 'bizdev', tier: 'low' },
    { tag: 'founderlife', tier: 'low' }, { tag: 'businessstrategy', tier: 'low' }, { tag: 'womenentrepreneurs', tier: 'low' },
    { tag: 'venturecapital', tier: 'low' }, { tag: 'pitchdeck', tier: 'low' }, { tag: 'saasfounder', tier: 'low' },
    { tag: 'remotework', tier: 'medium' }, { tag: 'teambuilding', tier: 'low' },
  ],
  lifestyle: [
    { tag: 'lifestyle', tier: 'high' }, { tag: 'life', tier: 'high' }, { tag: 'happy', tier: 'high' },
    { tag: 'love', tier: 'high' }, { tag: 'instagood', tier: 'high' }, { tag: 'beautiful', tier: 'high' },
    { tag: 'inspiration', tier: 'high' }, { tag: 'selfcare', tier: 'high' }, { tag: 'mindfulness', tier: 'high' },
    { tag: 'positivevibes', tier: 'high' }, { tag: 'goodvibes', tier: 'high' }, { tag: 'dailylife', tier: 'high' },
    { tag: 'lifestyleblogger', tier: 'medium' }, { tag: 'wellness', tier: 'medium' }, { tag: 'balance', tier: 'medium' },
    { tag: 'morningroutine', tier: 'medium' }, { tag: 'selflove', tier: 'medium' }, { tag: 'gratitude', tier: 'medium' },
    { tag: 'minimal', tier: 'medium' }, { tag: 'homedecor', tier: 'medium' }, { tag: 'cozy', tier: 'medium' },
    { tag: 'weekendvibes', tier: 'medium' }, { tag: 'slowliving', tier: 'medium' }, { tag: 'intentionalliving', tier: 'low' },
    { tag: 'dailyinspiration', tier: 'medium' }, { tag: 'productivity', tier: 'medium' }, { tag: 'journaling', tier: 'low' },
    { tag: 'wellnessblogger', tier: 'low' }, { tag: 'simpleliving', tier: 'low' }, { tag: 'lifegoals', tier: 'low' },
    { tag: 'aesthetic', tier: 'medium' }, { tag: 'lifestyleinspo', tier: 'low' }, { tag: 'organizedlife', tier: 'low' },
    { tag: 'liveyourbestlife', tier: 'low' }, { tag: 'everydaymoments', tier: 'low' }, { tag: 'mondaymotivation', tier: 'medium' },
    { tag: 'selfimprovement', tier: 'low' }, { tag: 'mindsetshift', tier: 'low' }, { tag: 'consciousliving', tier: 'low' },
    { tag: 'dailymotivation', tier: 'low' }, { tag: 'lifestylecontent', tier: 'low' }, { tag: 'cozyhome', tier: 'low' },
    { tag: 'sundayvibes', tier: 'low' }, { tag: 'peacefullife', tier: 'low' }, { tag: 'choosejoy', tier: 'low' },
    { tag: 'livingmybestlife', tier: 'low' }, { tag: 'simplepleasures', tier: 'low' }, { tag: 'morningcoffee', tier: 'low' },
    { tag: 'nightroutine', tier: 'low' }, { tag: 'planneraddict', tier: 'low' }, { tag: 'goalsetting', tier: 'low' },
    { tag: 'blessed', tier: 'medium' }, { tag: 'thankful', tier: 'low' },
  ],
  beauty: [
    { tag: 'beauty', tier: 'high' }, { tag: 'makeup', tier: 'high' }, { tag: 'skincare', tier: 'high' },
    { tag: 'beautyblogger', tier: 'high' }, { tag: 'makeupartist', tier: 'high' }, { tag: 'cosmetics', tier: 'high' },
    { tag: 'glam', tier: 'high' }, { tag: 'beautycare', tier: 'high' }, { tag: 'haircare', tier: 'high' },
    { tag: 'nails', tier: 'high' }, { tag: 'lipstick', tier: 'high' }, { tag: 'lashes', tier: 'high' },
    { tag: 'skincareRoutine', tier: 'medium' }, { tag: 'naturalbeauty', tier: 'medium' }, { tag: 'crueltyfree', tier: 'medium' },
    { tag: 'makeuptutorial', tier: 'medium' }, { tag: 'eyeshadow', tier: 'medium' }, { tag: 'foundation', tier: 'medium' },
    { tag: 'glowup', tier: 'medium' }, { tag: 'cleanbeauty', tier: 'medium' }, { tag: 'beautytips', tier: 'medium' },
    { tag: 'hairstyle', tier: 'medium' }, { tag: 'nailart', tier: 'medium' }, { tag: 'veganbeauty', tier: 'low' },
    { tag: 'skincaretips', tier: 'medium' }, { tag: 'makeuplover', tier: 'medium' }, { tag: 'beautyproducts', tier: 'medium' },
    { tag: 'facemask', tier: 'low' }, { tag: 'serumreview', tier: 'low' }, { tag: 'skincarecommunity', tier: 'low' },
    { tag: 'motd', tier: 'low' }, { tag: 'makeupjunkie', tier: 'low' }, { tag: 'glassskin', tier: 'low' },
    { tag: 'sunscreen', tier: 'low' }, { tag: 'retinol', tier: 'low' }, { tag: 'hyaluronicacid', tier: 'low' },
    { tag: 'beautycommunity', tier: 'low' }, { tag: 'organicskincare', tier: 'low' }, { tag: 'makeupoftheday', tier: 'low' },
    { tag: 'beautyhacks', tier: 'low' }, { tag: 'hairtutorial', tier: 'low' }, { tag: 'naturalhair', tier: 'low' },
    { tag: 'eyebrows', tier: 'low' }, { tag: 'contour', tier: 'low' }, { tag: 'highlight', tier: 'low' },
    { tag: 'blusher', tier: 'low' }, { tag: 'beautyessentials', tier: 'low' }, { tag: 'skincareaddict', tier: 'low' },
    { tag: 'drugstorebeauty', tier: 'low' }, { tag: 'luxurybeauty', tier: 'low' }, { tag: 'kbeauty', tier: 'low' },
    { tag: 'jbeauty', tier: 'low' },
  ],
  gaming: [
    { tag: 'gaming', tier: 'high' }, { tag: 'gamer', tier: 'high' }, { tag: 'videogames', tier: 'high' },
    { tag: 'ps5', tier: 'high' }, { tag: 'xbox', tier: 'high' }, { tag: 'pcgaming', tier: 'high' },
    { tag: 'twitch', tier: 'high' }, { tag: 'esports', tier: 'high' }, { tag: 'fortnite', tier: 'high' },
    { tag: 'minecraft', tier: 'high' }, { tag: 'callofduty', tier: 'high' }, { tag: 'nintendoswitch', tier: 'high' },
    { tag: 'gamingcommunity', tier: 'medium' }, { tag: 'retrogaming', tier: 'medium' }, { tag: 'gamedev', tier: 'medium' },
    { tag: 'indiegame', tier: 'medium' }, { tag: 'streamer', tier: 'medium' }, { tag: 'valorant', tier: 'medium' },
    { tag: 'apexlegends', tier: 'medium' }, { tag: 'leagueoflegends', tier: 'medium' }, { tag: 'gamingsetup', tier: 'medium' },
    { tag: 'gamingnews', tier: 'medium' }, { tag: 'rpg', tier: 'medium' }, { tag: 'playstation', tier: 'medium' },
    { tag: 'mobilegaming', tier: 'medium' }, { tag: 'steamgames', tier: 'medium' }, { tag: 'gamenight', tier: 'medium' },
    { tag: 'cozygaming', tier: 'low' }, { tag: 'gamingmemes', tier: 'low' }, { tag: 'girlgamer', tier: 'low' },
    { tag: 'gaminglife', tier: 'low' }, { tag: 'speedrun', tier: 'low' }, { tag: 'gamereview', tier: 'low' },
    { tag: 'newgamerelease', tier: 'low' }, { tag: 'gamingpc', tier: 'low' }, { tag: 'competitive', tier: 'low' },
    { tag: 'gamingchair', tier: 'low' }, { tag: 'gameplay', tier: 'low' }, { tag: 'walkthrough', tier: 'low' },
    { tag: 'letsplay', tier: 'low' }, { tag: 'gameart', tier: 'low' }, { tag: 'gamingclips', tier: 'low' },
    { tag: 'consolegaming', tier: 'low' }, { tag: 'boardgames', tier: 'low' }, { tag: 'tabletopgaming', tier: 'low' },
    { tag: 'gamingtips', tier: 'low' }, { tag: 'gamingchannel', tier: 'low' }, { tag: 'streamsetup', tier: 'low' },
    { tag: 'vrgaming', tier: 'low' }, { tag: 'gamedesign', tier: 'low' }, { tag: 'pixelart', tier: 'low' },
    { tag: 'dungeons', tier: 'low' },
  ],
  music: [
    { tag: 'music', tier: 'high' }, { tag: 'musician', tier: 'high' }, { tag: 'hiphop', tier: 'high' },
    { tag: 'rap', tier: 'high' }, { tag: 'singer', tier: 'high' }, { tag: 'dj', tier: 'high' },
    { tag: 'producer', tier: 'high' }, { tag: 'song', tier: 'high' }, { tag: 'guitar', tier: 'high' },
    { tag: 'piano', tier: 'high' }, { tag: 'beats', tier: 'high' }, { tag: 'newmusic', tier: 'high' },
    { tag: 'livemusic', tier: 'medium' }, { tag: 'songwriter', tier: 'medium' }, { tag: 'musicproducer', tier: 'medium' },
    { tag: 'indiemusic', tier: 'medium' }, { tag: 'rock', tier: 'medium' }, { tag: 'rnb', tier: 'medium' },
    { tag: 'electronic', tier: 'medium' }, { tag: 'edm', tier: 'medium' }, { tag: 'spotify', tier: 'medium' },
    { tag: 'soundcloud', tier: 'medium' }, { tag: 'concert', tier: 'medium' }, { tag: 'festival', tier: 'medium' },
    { tag: 'drumming', tier: 'medium' }, { tag: 'vocals', tier: 'medium' }, { tag: 'musicvideo', tier: 'medium' },
    { tag: 'musicislife', tier: 'low' }, { tag: 'undergroundmusic', tier: 'low' }, { tag: 'homerecording', tier: 'low' },
    { tag: 'musicstudio', tier: 'low' }, { tag: 'lyricswriting', tier: 'low' }, { tag: 'singersongwriter', tier: 'low' },
    { tag: 'coverson', tier: 'low' }, { tag: 'acousticcover', tier: 'low' }, { tag: 'beatmaker', tier: 'low' },
    { tag: 'musiccommunity', tier: 'low' }, { tag: 'musiclovers', tier: 'low' }, { tag: 'vinylrecords', tier: 'low' },
    { tag: 'jazzmusic', tier: 'low' }, { tag: 'classicalmusic', tier: 'low' }, { tag: 'popmusic', tier: 'low' },
    { tag: 'countrymusic', tier: 'low' }, { tag: 'musicproduction', tier: 'low' }, { tag: 'ableton', tier: 'low' },
    { tag: 'flstudio', tier: 'low' }, { tag: 'logicpro', tier: 'low' }, { tag: 'musictheory', tier: 'low' },
    { tag: 'bandlife', tier: 'low' }, { tag: 'originalmusic', tier: 'low' }, { tag: 'newartist', tier: 'low' },
    { tag: 'musicrelease', tier: 'low' },
  ],
  education: [
    { tag: 'education', tier: 'high' }, { tag: 'learning', tier: 'high' }, { tag: 'study', tier: 'high' },
    { tag: 'students', tier: 'high' }, { tag: 'teacher', tier: 'high' }, { tag: 'school', tier: 'high' },
    { tag: 'knowledge', tier: 'high' }, { tag: 'university', tier: 'high' }, { tag: 'college', tier: 'high' },
    { tag: 'studygram', tier: 'high' }, { tag: 'onlinelearning', tier: 'high' }, { tag: 'studymotivation', tier: 'high' },
    { tag: 'edtech', tier: 'medium' }, { tag: 'teacherlife', tier: 'medium' }, { tag: 'studytips', tier: 'medium' },
    { tag: 'homeschool', tier: 'medium' }, { tag: 'elearning', tier: 'medium' }, { tag: 'onlinecourse', tier: 'medium' },
    { tag: 'studentlife', tier: 'medium' }, { tag: 'stemlearning', tier: 'medium' }, { tag: 'mathteacher', tier: 'medium' },
    { tag: 'scienceeducation', tier: 'medium' }, { tag: 'reading', tier: 'medium' }, { tag: 'bookstagram', tier: 'medium' },
    { tag: 'teachersofinstagram', tier: 'medium' }, { tag: 'classroom', tier: 'medium' }, { tag: 'pedagogy', tier: 'low' },
    { tag: 'studynotes', tier: 'low' }, { tag: 'learningthroughplay', tier: 'low' }, { tag: 'scholarships', tier: 'low' },
    { tag: 'examprep', tier: 'low' }, { tag: 'growthmindset', tier: 'medium' }, { tag: 'skillbuilding', tier: 'low' },
    { tag: 'languagelearning', tier: 'low' }, { tag: 'digitalliteracy', tier: 'low' }, { tag: 'criticalthinking', tier: 'low' },
    { tag: 'teacherresources', tier: 'low' }, { tag: 'lessonplan', tier: 'low' }, { tag: 'studyhard', tier: 'low' },
    { tag: 'educationfirst', tier: 'low' }, { tag: 'projectbasedlearning', tier: 'low' }, { tag: 'studywithme', tier: 'low' },
    { tag: 'flashcards', tier: 'low' }, { tag: 'onlinetutoring', tier: 'low' }, { tag: 'testprep', tier: 'low' },
    { tag: 'gradschool', tier: 'low' }, { tag: 'phd', tier: 'low' }, { tag: 'researchpaper', tier: 'low' },
    { tag: 'learneveryday', tier: 'low' }, { tag: 'neverStopLearning', tier: 'low' }, { tag: 'curiosity', tier: 'low' },
    { tag: 'tutoring', tier: 'low' }, { tag: 'academiclife', tier: 'low' },
  ],
  pets: [
    { tag: 'pets', tier: 'high' }, { tag: 'dog', tier: 'high' }, { tag: 'cat', tier: 'high' },
    { tag: 'dogsofinstagram', tier: 'high' }, { tag: 'catsofinstagram', tier: 'high' }, { tag: 'puppy', tier: 'high' },
    { tag: 'kitten', tier: 'high' }, { tag: 'petstagram', tier: 'high' }, { tag: 'animals', tier: 'high' },
    { tag: 'doglover', tier: 'high' }, { tag: 'catlover', tier: 'high' }, { tag: 'cute', tier: 'high' },
    { tag: 'petlife', tier: 'medium' }, { tag: 'puppylove', tier: 'medium' }, { tag: 'furbaby', tier: 'medium' },
    { tag: 'dogsofig', tier: 'medium' }, { tag: 'catsofig', tier: 'medium' }, { tag: 'petphotography', tier: 'medium' },
    { tag: 'adoptdontshop', tier: 'medium' }, { tag: 'rescue', tier: 'medium' }, { tag: 'petowner', tier: 'medium' },
    { tag: 'goldenretriever', tier: 'medium' }, { tag: 'germanshepherd', tier: 'medium' }, { tag: 'labrador', tier: 'medium' },
    { tag: 'frenchie', tier: 'medium' }, { tag: 'meow', tier: 'medium' }, { tag: 'woof', tier: 'medium' },
    { tag: 'petcare', tier: 'low' }, { tag: 'catmom', tier: 'low' }, { tag: 'dogmom', tier: 'low' },
    { tag: 'petfood', tier: 'low' }, { tag: 'dogtraining', tier: 'low' }, { tag: 'petgrooming', tier: 'low' },
    { tag: 'vetlife', tier: 'low' }, { tag: 'exoticpets', tier: 'low' }, { tag: 'birdwatching', tier: 'low' },
    { tag: 'aquarium', tier: 'low' }, { tag: 'reptiles', tier: 'low' }, { tag: 'hamster', tier: 'low' },
    { tag: 'bunny', tier: 'low' }, { tag: 'parrot', tier: 'low' }, { tag: 'horsesofinstagram', tier: 'low' },
    { tag: 'petsofinstagram', tier: 'low' }, { tag: 'dailypets', tier: 'low' }, { tag: 'funnypets', tier: 'low' },
    { tag: 'petrescue', tier: 'low' }, { tag: 'shelterdog', tier: 'low' }, { tag: 'rescuecat', tier: 'low' },
    { tag: 'petadoption', tier: 'low' }, { tag: 'happydog', tier: 'low' }, { tag: 'catlife', tier: 'low' },
    { tag: 'doglife', tier: 'low' }, { tag: 'petlovers', tier: 'low' },
  ],
  art: [
    { tag: 'art', tier: 'high' }, { tag: 'artist', tier: 'high' }, { tag: 'artwork', tier: 'high' },
    { tag: 'drawing', tier: 'high' }, { tag: 'painting', tier: 'high' }, { tag: 'illustration', tier: 'high' },
    { tag: 'digitalart', tier: 'high' }, { tag: 'design', tier: 'high' }, { tag: 'creative', tier: 'high' },
    { tag: 'sketch', tier: 'high' }, { tag: 'instaart', tier: 'high' }, { tag: 'artoftheday', tier: 'high' },
    { tag: 'watercolor', tier: 'medium' }, { tag: 'oilpainting', tier: 'medium' }, { tag: 'acrylic', tier: 'medium' },
    { tag: 'graphicdesign', tier: 'medium' }, { tag: 'typography', tier: 'medium' }, { tag: 'calligraphy', tier: 'medium' },
    { tag: 'artgallery', tier: 'medium' }, { tag: 'contemporaryart', tier: 'medium' }, { tag: 'abstractart', tier: 'medium' },
    { tag: 'procreate', tier: 'medium' }, { tag: 'characterdesign', tier: 'medium' }, { tag: 'fanart', tier: 'medium' },
    { tag: 'portraitart', tier: 'medium' }, { tag: 'sketchbook', tier: 'medium' }, { tag: 'artcommission', tier: 'low' },
    { tag: 'artprint', tier: 'low' }, { tag: 'mixedmedia', tier: 'low' }, { tag: 'sculpting', tier: 'low' },
    { tag: 'pottery', tier: 'low' }, { tag: 'ceramics', tier: 'low' }, { tag: 'printmaking', tier: 'low' },
    { tag: 'artcollector', tier: 'low' }, { tag: 'artcommunity', tier: 'low' }, { tag: 'dailyart', tier: 'low' },
    { tag: 'artstudio', tier: 'low' }, { tag: 'artprocess', tier: 'low' }, { tag: 'wipart', tier: 'low' },
    { tag: 'artistsoninstagram', tier: 'low' }, { tag: 'conceptart', tier: 'low' }, { tag: 'artinspiration', tier: 'low' },
    { tag: 'lineart', tier: 'low' }, { tag: 'inkdrawing', tier: 'low' }, { tag: 'realismart', tier: 'low' },
    { tag: 'artjournal', tier: 'low' }, { tag: 'surrealart', tier: 'low' }, { tag: 'lowbrow', tier: 'low' },
    { tag: 'arteducation', tier: 'low' }, { tag: 'artlife', tier: 'low' }, { tag: 'creativecommunity', tier: 'low' },
    { tag: 'artsy', tier: 'low' }, { tag: 'handlettering', tier: 'low' },
  ],
  sports: [
    { tag: 'sports', tier: 'high' }, { tag: 'football', tier: 'high' }, { tag: 'basketball', tier: 'high' },
    { tag: 'soccer', tier: 'high' }, { tag: 'nba', tier: 'high' }, { tag: 'nfl', tier: 'high' },
    { tag: 'cricket', tier: 'high' }, { tag: 'tennis', tier: 'high' }, { tag: 'athlete', tier: 'high' },
    { tag: 'sportsphotography', tier: 'high' }, { tag: 'running', tier: 'high' }, { tag: 'swimming', tier: 'high' },
    { tag: 'boxing', tier: 'medium' }, { tag: 'mma', tier: 'medium' }, { tag: 'ufc', tier: 'medium' },
    { tag: 'baseball', tier: 'medium' }, { tag: 'golf', tier: 'medium' }, { tag: 'cycling', tier: 'medium' },
    { tag: 'volleyball', tier: 'medium' }, { tag: 'rugby', tier: 'medium' }, { tag: 'hockey', tier: 'medium' },
    { tag: 'surfing', tier: 'medium' }, { tag: 'skiing', tier: 'medium' }, { tag: 'snowboarding', tier: 'medium' },
    { tag: 'martialarts', tier: 'medium' }, { tag: 'trackandfield', tier: 'medium' }, { tag: 'gymnastics', tier: 'medium' },
    { tag: 'sportslife', tier: 'low' }, { tag: 'gameday', tier: 'low' }, { tag: 'teamwork', tier: 'low' },
    { tag: 'champion', tier: 'low' }, { tag: 'sportsnews', tier: 'low' }, { tag: 'sportsmotivation', tier: 'low' },
    { tag: 'olympicsports', tier: 'low' }, { tag: 'triathalon', tier: 'low' }, { tag: 'crosscountry', tier: 'low' },
    { tag: 'climbinglife', tier: 'low' }, { tag: 'amateurathlete', tier: 'low' }, { tag: 'youthsports', tier: 'low' },
    { tag: 'sportscoach', tier: 'low' }, { tag: 'personalrecord', tier: 'low' }, { tag: 'raceday', tier: 'low' },
    { tag: 'weightclass', tier: 'low' }, { tag: 'pregame', tier: 'low' }, { tag: 'halftime', tier: 'low' },
    { tag: 'playoffs', tier: 'low' }, { tag: 'championship', tier: 'low' }, { tag: 'mvp', tier: 'low' },
    { tag: 'underdog', tier: 'low' }, { tag: 'draftpick', tier: 'low' }, { tag: 'hometeam', tier: 'low' },
    { tag: 'fanzone', tier: 'low' }, { tag: 'sportsfan', tier: 'low' },
  ],
  motivation: [
    { tag: 'motivation', tier: 'high' }, { tag: 'inspiration', tier: 'high' }, { tag: 'success', tier: 'high' },
    { tag: 'mindset', tier: 'high' }, { tag: 'goals', tier: 'high' }, { tag: 'believe', tier: 'high' },
    { tag: 'motivationalquotes', tier: 'high' }, { tag: 'positivity', tier: 'high' }, { tag: 'hustle', tier: 'high' },
    { tag: 'nevergiveup', tier: 'high' }, { tag: 'grind', tier: 'high' }, { tag: 'ambition', tier: 'high' },
    { tag: 'growthmindset', tier: 'medium' }, { tag: 'selfmade', tier: 'medium' }, { tag: 'dailymotivation', tier: 'medium' },
    { tag: 'successquotes', tier: 'medium' }, { tag: 'discipline', tier: 'medium' }, { tag: 'focused', tier: 'medium' },
    { tag: 'mindfulness', tier: 'medium' }, { tag: 'selfdevelopment', tier: 'medium' }, { tag: 'dreambig', tier: 'medium' },
    { tag: 'personalgrowth', tier: 'medium' }, { tag: 'mentalhealthmatters', tier: 'medium' }, { tag: 'positiveaffirmations', tier: 'medium' },
    { tag: 'keepgoing', tier: 'medium' }, { tag: 'winnermentality', tier: 'medium' }, { tag: 'motivationspeaker', tier: 'low' },
    { tag: 'lifecoach', tier: 'low' }, { tag: 'stayfocused', tier: 'low' }, { tag: 'abundance', tier: 'low' },
    { tag: 'manifestation', tier: 'low' }, { tag: 'lawofattraction', tier: 'low' }, { tag: 'youcandoit', tier: 'low' },
    { tag: 'selfbelief', tier: 'low' }, { tag: 'empowerment', tier: 'low' }, { tag: 'riseandgrind', tier: 'low' },
    { tag: 'successmindset', tier: 'low' }, { tag: 'wakeupandwork', tier: 'low' }, { tag: 'innerstrength', tier: 'low' },
    { tag: 'motivationmonday', tier: 'low' }, { tag: 'transformyourlife', tier: 'low' }, { tag: 'nolimits', tier: 'low' },
    { tag: 'beyourbestself', tier: 'low' }, { tag: 'resilience', tier: 'low' }, { tag: 'bossmentality', tier: 'low' },
    { tag: 'pushyourlimits', tier: 'low' }, { tag: 'dontquit', tier: 'low' }, { tag: 'daydreamer', tier: 'low' },
    { tag: 'confidencebuilding', tier: 'low' }, { tag: 'energyshift', tier: 'low' }, { tag: 'positivemindset', tier: 'low' },
    { tag: 'actiontaker', tier: 'low' }, { tag: 'fearless', tier: 'low' },
  ],
};

// ─── NICHE CONFIG ─────────────────────────────────────────────────────────────

const NICHE_CONFIG: { key: Niche; label: string; emoji: string }[] = [
  { key: 'travel', label: 'Travel', emoji: '✈' },
  { key: 'food', label: 'Food', emoji: '🍕' },
  { key: 'fitness', label: 'Fitness', emoji: '💪' },
  { key: 'fashion', label: 'Fashion', emoji: '👗' },
  { key: 'tech', label: 'Tech', emoji: '💻' },
  { key: 'photography', label: 'Photography', emoji: '📷' },
  { key: 'business', label: 'Business', emoji: '💼' },
  { key: 'lifestyle', label: 'Lifestyle', emoji: '🌿' },
  { key: 'beauty', label: 'Beauty', emoji: '💄' },
  { key: 'gaming', label: 'Gaming', emoji: '🎮' },
  { key: 'music', label: 'Music', emoji: '🎵' },
  { key: 'education', label: 'Education', emoji: '📚' },
  { key: 'pets', label: 'Pets', emoji: '🐾' },
  { key: 'art', label: 'Art', emoji: '🎨' },
  { key: 'sports', label: 'Sports', emoji: '⚽' },
  { key: 'motivation', label: 'Motivation', emoji: '🔥' },
];

// ─── PLATFORM CONFIG ──────────────────────────────────────────────────────────

const PLATFORM_CONFIG: {
  key: Platform;
  label: string;
  maxRecommended: number | null;
  icon: React.ElementType;
}[] = [
  { key: 'instagram', label: 'Instagram', maxRecommended: 30, icon: Instagram },
  { key: 'tiktok', label: 'TikTok', maxRecommended: null, icon: Music },
  { key: 'twitter', label: 'Twitter / X', maxRecommended: 5, icon: Twitter },
  { key: 'linkedin', label: 'LinkedIn', maxRecommended: 5, icon: Linkedin },
];

const TIER_LABELS: Record<Tier, string> = {
  high: 'High Popularity (500K+ posts)',
  medium: 'Medium Popularity (50K-500K)',
  low: 'Niche / Low Competition (<50K)',
};

const TIER_COLORS: Record<Tier, { bg: string; text: string; border: string; ring: string }> = {
  high: {
    bg: 'bg-red-500/20',
    text: 'text-red-400',
    border: 'border-red-500/40',
    ring: 'ring-red-500/50',
  },
  medium: {
    bg: 'bg-amber-500/20',
    text: 'text-amber-400',
    border: 'border-amber-500/40',
    ring: 'ring-amber-500/50',
  },
  low: {
    bg: 'bg-emerald-500/20',
    text: 'text-emerald-400',
    border: 'border-emerald-500/40',
    ring: 'ring-emerald-500/50',
  },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function matchNiches(query: string): Niche[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const keywords: Record<Niche, string[]> = {
    travel: ['travel', 'trip', 'vacation', 'explore', 'wanderlust', 'backpack', 'adventure', 'destination', 'tourist', 'flight', 'hotel', 'beach', 'mountain', 'hiking'],
    food: ['food', 'cook', 'recipe', 'eat', 'meal', 'bake', 'restaurant', 'kitchen', 'chef', 'dinner', 'lunch', 'breakfast', 'dessert', 'vegan', 'pizza', 'sushi'],
    fitness: ['fitness', 'gym', 'workout', 'exercise', 'health', 'muscle', 'weight', 'cardio', 'yoga', 'run', 'training', 'body', 'strength', 'crossfit'],
    fashion: ['fashion', 'style', 'outfit', 'clothing', 'wear', 'dress', 'trend', 'streetwear', 'shoes', 'sneaker', 'accessory', 'wardrobe', 'designer'],
    tech: ['tech', 'technology', 'code', 'coding', 'programming', 'software', 'developer', 'startup', 'ai', 'app', 'gadget', 'computer', 'web', 'data', 'machine learning'],
    photography: ['photography', 'photo', 'camera', 'portrait', 'landscape', 'street', 'lightroom', 'canon', 'nikon', 'sunset', 'lens', 'shoot', 'drone', 'golden hour'],
    business: ['business', 'entrepreneur', 'marketing', 'startup', 'brand', 'money', 'invest', 'finance', 'freelance', 'ecommerce', 'sales', 'leadership', 'ceo', 'network'],
    lifestyle: ['lifestyle', 'life', 'daily', 'routine', 'self care', 'selfcare', 'mindful', 'wellness', 'cozy', 'minimal', 'home', 'journal', 'aesthetic', 'slow living'],
    beauty: ['beauty', 'makeup', 'skincare', 'cosmetic', 'lip', 'nail', 'hair', 'glow', 'skin', 'lash', 'eyeshadow', 'foundation', 'contour'],
    gaming: ['gaming', 'game', 'gamer', 'esport', 'streamer', 'twitch', 'playstation', 'xbox', 'nintendo', 'pc gaming', 'fortnite', 'minecraft', 'valorant', 'console'],
    music: ['music', 'song', 'sing', 'guitar', 'piano', 'dj', 'producer', 'hip hop', 'rap', 'beat', 'concert', 'album', 'spotify', 'band'],
    education: ['education', 'learn', 'study', 'teach', 'school', 'college', 'university', 'student', 'course', 'tutor', 'exam', 'read', 'book', 'knowledge'],
    pets: ['pet', 'dog', 'cat', 'puppy', 'kitten', 'animal', 'bird', 'fish', 'hamster', 'bunny', 'parrot', 'horse', 'rescue', 'adopt'],
    art: ['art', 'draw', 'paint', 'illustration', 'digital art', 'design', 'sketch', 'watercolor', 'calligraphy', 'pottery', 'ceramic', 'sculpture', 'creative', 'procreate'],
    sports: ['sport', 'football', 'basketball', 'soccer', 'cricket', 'tennis', 'boxing', 'swim', 'athlete', 'nba', 'nfl', 'golf', 'rugby', 'cycling', 'surf'],
    motivation: ['motivation', 'inspire', 'success', 'mindset', 'goal', 'discipline', 'hustle', 'grind', 'positive', 'believe', 'dream', 'ambition', 'confident', 'empower'],
  };

  const scored: { niche: Niche; score: number }[] = [];
  for (const [niche, kws] of Object.entries(keywords) as [Niche, string[]][]) {
    let score = 0;
    for (const kw of kws) {
      if (q.includes(kw) || kw.includes(q)) {
        score += q === kw ? 10 : q.includes(kw) ? 5 : 3;
      }
    }
    if (niche.includes(q) || q.includes(niche)) {
      score += 8;
    }
    if (score > 0) scored.push({ niche, score });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.length > 0 ? scored.slice(0, 3).map((s) => s.niche) : ['lifestyle'];
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export function HashtagGeneratorTool() {
  const [query, setQuery] = useState('');
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [selectedNiches, setSelectedNiches] = useState<Niche[]>([]);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);
  const [generated, setGenerated] = useState(false);

  const activeNiches = useMemo(() => {
    if (selectedNiches.length > 0) return selectedNiches;
    if (query.trim()) return matchNiches(query);
    return [];
  }, [selectedNiches, query]);

  const allHashtags = useMemo(() => {
    const seen = new Set<string>();
    const result: HashtagEntry[] = [];
    for (const niche of activeNiches) {
      const entries = HASHTAG_DB[niche] || [];
      for (const entry of entries) {
        if (!seen.has(entry.tag)) {
          seen.add(entry.tag);
          result.push(entry);
        }
      }
    }
    return shuffleArray(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNiches, shuffleSeed]);

  const groupedByTier = useMemo(() => {
    const groups: Record<Tier, HashtagEntry[]> = { high: [], medium: [], low: [] };
    for (const h of allHashtags) {
      groups[h.tier].push(h);
    }
    return groups;
  }, [allHashtags]);

  const bannedInResults = useMemo(() => {
    return allHashtags.filter((h) => BANNED_HASHTAGS.has(h.tag));
  }, [allHashtags]);

  const platformMax = PLATFORM_CONFIG.find((p) => p.key === platform)?.maxRecommended;

  const handleGenerate = useCallback(() => {
    if (!query.trim() && selectedNiches.length === 0) return;
    if (query.trim() && selectedNiches.length === 0) {
      const matched = matchNiches(query);
      setSelectedNiches(matched);
    }
    const niches = selectedNiches.length > 0 ? selectedNiches : matchNiches(query);
    const seen = new Set<string>();
    const tags = new Set<string>();
    for (const niche of niches) {
      for (const entry of HASHTAG_DB[niche] || []) {
        if (!seen.has(entry.tag) && !BANNED_HASHTAGS.has(entry.tag)) {
          seen.add(entry.tag);
          tags.add(entry.tag);
        }
      }
    }
    setSelectedTags(tags);
    setGenerated(true);
    setShuffleSeed((s) => s + 1);
  }, [query, selectedNiches]);

  const handleTryExample = useCallback(() => {
    setQuery('travel photography');
    setSelectedNiches(['travel', 'photography']);
    const seen = new Set<string>();
    const tags = new Set<string>();
    for (const niche of ['travel', 'photography'] as Niche[]) {
      for (const entry of HASHTAG_DB[niche]) {
        if (!seen.has(entry.tag) && !BANNED_HASHTAGS.has(entry.tag)) {
          seen.add(entry.tag);
          tags.add(entry.tag);
        }
      }
    }
    setSelectedTags(tags);
    setGenerated(true);
    setShuffleSeed((s) => s + 1);
  }, []);

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    const all = new Set(allHashtags.filter((h) => !BANNED_HASHTAGS.has(h.tag)).map((h) => h.tag));
    setSelectedTags(all);
  }, [allHashtags]);

  const handleDeselectAll = useCallback(() => {
    setSelectedTags(new Set());
  }, []);

  const handleCopy = useCallback(
    async (text: string, key: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(key);
        setTimeout(() => setCopied(null), 2000);
      } catch {
        /* silent */
      }
    },
    []
  );

  const copyAllSelected = useCallback(() => {
    const tags = allHashtags
      .filter((h) => selectedTags.has(h.tag))
      .map((h) => `#${h.tag}`)
      .join(' ');
    handleCopy(tags, 'all');
  }, [allHashtags, selectedTags, handleCopy]);

  const copySetOf30 = useCallback(() => {
    const high = allHashtags.filter((h) => h.tier === 'high' && selectedTags.has(h.tag));
    const medium = allHashtags.filter((h) => h.tier === 'medium' && selectedTags.has(h.tag));
    const low = allHashtags.filter((h) => h.tier === 'low' && selectedTags.has(h.tag));
    const mix = [...high.slice(0, 10), ...medium.slice(0, 10), ...low.slice(0, 10)];
    const tags = mix.map((h) => `#${h.tag}`).join(' ');
    handleCopy(tags, 'set30');
  }, [allHashtags, selectedTags, handleCopy]);

  const handleShuffle = useCallback(() => {
    setShuffleSeed((s) => s + 1);
  }, []);

  const toggleNiche = useCallback((niche: Niche) => {
    setSelectedNiches((prev) => {
      if (prev.includes(niche)) return prev.filter((n) => n !== niche);
      return [...prev, niche];
    });
  }, []);

  const selectedCount = selectedTags.size;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Hero */}
      <div className="rounded-2xl border border-fuchsia-500/20 bg-gradient-to-br from-fuchsia-500/10 via-pink-500/5 to-transparent p-6 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-fuchsia-500/10 px-4 py-1.5 text-sm font-medium text-fuchsia-400">
          <Hash className="h-4 w-4" />
          Hashtag Generator
        </div>
        <h2 className="mb-2 text-2xl font-bold text-white sm:text-3xl">
          Generate Trending Hashtags
        </h2>
        <p className="mx-auto max-w-2xl text-sm text-slate-400 sm:text-base">
          Find the best hashtags for Instagram, TikTok, Twitter/X, and LinkedIn.
          Grouped by popularity tier for maximum reach.
        </p>
      </div>

      {/* Input Section */}
      <div className="rounded-xl border border-slate-700/60 bg-slate-800/50 p-5">
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Enter a topic or keyword
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setGenerated(false);
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            placeholder='e.g., "fitness", "travel photography", "cooking"'
            className="flex-1 rounded-lg border border-slate-600 bg-slate-900/60 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/30"
          />
          <button
            onClick={handleGenerate}
            disabled={!query.trim() && selectedNiches.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-fuchsia-600 px-6 py-3 font-semibold text-white transition hover:bg-fuchsia-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Sparkles className="h-4 w-4" />
            Generate
          </button>
        </div>
        <button
          onClick={handleTryExample}
          className="mt-2 text-sm text-fuchsia-400 underline-offset-2 transition hover:text-fuchsia-300 hover:underline"
        >
          Try Example: &quot;travel photography&quot;
        </button>
      </div>

      {/* Niche Presets */}
      <div className="rounded-xl border border-slate-700/60 bg-slate-800/50 p-5">
        <h3 className="mb-3 text-sm font-medium text-slate-300">
          Select Niches (or type a keyword above)
        </h3>
        <div className="flex flex-wrap gap-2">
          {NICHE_CONFIG.map((n) => {
            const active = selectedNiches.includes(n.key);
            return (
              <button
                key={n.key}
                onClick={() => toggleNiche(n.key)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  active
                    ? 'bg-fuchsia-600 text-white ring-2 ring-fuchsia-400/40'
                    : 'bg-slate-700/60 text-slate-300 hover:bg-slate-600/80 hover:text-white'
                }`}
              >
                <span>{n.emoji}</span>
                {n.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Platform Tabs */}
      <div className="flex flex-wrap gap-2 rounded-xl border border-slate-700/60 bg-slate-800/50 p-4">
        {PLATFORM_CONFIG.map((p) => {
          const Icon = p.icon;
          const active = platform === p.key;
          return (
            <button
              key={p.key}
              onClick={() => setPlatform(p.key)}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                active
                  ? 'bg-fuchsia-600 text-white'
                  : 'bg-slate-700/40 text-slate-400 hover:bg-slate-600/60 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              {p.label}
              {p.maxRecommended && (
                <span className="ml-1 rounded bg-slate-900/60 px-1.5 py-0.5 text-xs text-slate-400">
                  {p.maxRecommended} max
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Results */}
      {generated && allHashtags.length > 0 && (
        <>
          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-700/60 bg-slate-800/50 p-4">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Hash className="h-4 w-4 text-fuchsia-400" />
              <span className="font-semibold text-white">{selectedCount}</span>
              {platformMax && <span>/ {platformMax}</span>}
              <span>selected</span>
              {platformMax && selectedCount > platformMax && (
                <span className="ml-1 rounded bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-400">
                  Over limit!
                </span>
              )}
            </div>

            <div className="ml-auto flex flex-wrap gap-2">
              <button
                onClick={handleSelectAll}
                className="rounded-lg bg-slate-700/60 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-600"
              >
                Select All
              </button>
              <button
                onClick={handleDeselectAll}
                className="rounded-lg bg-slate-700/60 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-600"
              >
                Deselect All
              </button>
              <button
                onClick={handleShuffle}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-700/60 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-600"
              >
                <Shuffle className="h-3.5 w-3.5" />
                Shuffle
              </button>
              <button
                onClick={copyAllSelected}
                disabled={selectedCount === 0}
                className="inline-flex items-center gap-1.5 rounded-lg bg-fuchsia-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-fuchsia-500 disabled:opacity-40"
              >
                {copied === 'all' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                Copy All
              </button>
              {platform === 'instagram' && (
                <button
                  onClick={copySetOf30}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-pink-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-pink-500"
                >
                  {copied === 'set30' ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  Copy Set of 30
                </button>
              )}
            </div>
          </div>

          {/* Banned Warnings */}
          {bannedInResults.length > 0 && (
            <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
              <div>
                <p className="text-sm font-semibold text-amber-300">
                  Banned / Flagged Hashtags Detected
                </p>
                <p className="mt-1 text-xs text-amber-400/80">
                  The following hashtags are known to be banned or shadowban-flagged on
                  Instagram. They have been auto-deselected. Avoid using them to protect
                  your reach:
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {bannedInResults.map((h) => (
                    <span
                      key={h.tag}
                      className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs text-amber-400"
                    >
                      <X className="h-3 w-3" />#{h.tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tier Groups */}
          {(['high', 'medium', 'low'] as Tier[]).map((tier) => {
            const entries = groupedByTier[tier];
            if (entries.length === 0) return null;
            const colors = TIER_COLORS[tier];

            return (
              <div
                key={tier}
                className="rounded-xl border border-slate-700/60 bg-slate-800/50 p-5"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className={`text-sm font-semibold ${colors.text}`}>
                    {TIER_LABELS[tier]}
                  </h3>
                  <span className="rounded-full bg-slate-700/60 px-2 py-0.5 text-xs text-slate-400">
                    {entries.length} hashtags
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {entries.map((h) => {
                    const isSelected = selectedTags.has(h.tag);
                    const isBanned = BANNED_HASHTAGS.has(h.tag);
                    return (
                      <button
                        key={h.tag}
                        onClick={() => !isBanned && toggleTag(h.tag)}
                        disabled={isBanned}
                        className={`rounded-full border px-3 py-1 text-sm font-medium transition ${
                          isBanned
                            ? 'cursor-not-allowed border-slate-600 bg-slate-700/30 text-slate-500 line-through'
                            : isSelected
                              ? `${colors.bg} ${colors.text} ${colors.border} ring-1 ${colors.ring}`
                              : 'border-slate-600 bg-slate-700/30 text-slate-400 hover:border-slate-500 hover:text-slate-300'
                        }`}
                      >
                        #{h.tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Copy Preview */}
          {selectedCount > 0 && (
            <div className="rounded-xl border border-slate-700/60 bg-slate-800/50 p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-300">
                  Selected Hashtags Preview
                </h3>
                <button
                  onClick={copyAllSelected}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-fuchsia-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-fuchsia-500"
                >
                  {copied === 'all' ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  Copy
                </button>
              </div>
              <p className="break-all rounded-lg bg-slate-900/60 p-3 text-sm leading-relaxed text-slate-300">
                {allHashtags
                  .filter((h) => selectedTags.has(h.tag))
                  .map((h) => `#${h.tag}`)
                  .join(' ')}
              </p>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {generated && allHashtags.length === 0 && (
        <div className="rounded-xl border border-slate-700/60 bg-slate-800/50 p-10 text-center">
          <Hash className="mx-auto mb-3 h-12 w-12 text-slate-600" />
          <p className="text-slate-400">
            No hashtags found. Try a different keyword or select a niche above.
          </p>
        </div>
      )}

      {/* Not Generated Yet */}
      {!generated && (
        <div className="rounded-xl border border-dashed border-slate-600 bg-slate-800/30 p-10 text-center">
          <Hash className="mx-auto mb-3 h-12 w-12 text-slate-600" />
          <p className="text-slate-500">
            Enter a keyword or select niches above, then click{' '}
            <span className="font-semibold text-fuchsia-400">Generate</span> to get
            hashtag suggestions.
          </p>
        </div>
      )}

      {/* Trust Badge */}
      <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-700/40 bg-slate-800/30 py-3 text-center text-sm text-slate-400">
        <Shield className="h-4 w-4 text-emerald-400" />
        <span>
          100% free &middot; No signup &middot; No data stored &middot; Works
          entirely in your browser
        </span>
      </div>
    </div>
  );
}
