'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { CopyButton } from '@/components/common/CopyButton';
import { Search, Copy, Check, RotateCcw, Clock, SmilePlus } from 'lucide-react';

/* ── Emoji Data ────────────────────────────────────────────────────── */

interface EmojiCategory {
  id: string;
  name: string;
  icon: string;
  emojis: { emoji: string; name: string }[];
}

const EMOJI_DATA: EmojiCategory[] = [
  {
    id: 'smileys',
    name: 'Smileys & Emotion',
    icon: '😀',
    emojis: [
      { emoji: '😀', name: 'grinning face' }, { emoji: '😃', name: 'grinning face big eyes' }, { emoji: '😄', name: 'grinning squinting' },
      { emoji: '😁', name: 'beaming face' }, { emoji: '😆', name: 'grinning squinting face' }, { emoji: '😅', name: 'grinning sweat' },
      { emoji: '🤣', name: 'rolling laughing' }, { emoji: '😂', name: 'joy tears' }, { emoji: '🙂', name: 'slightly smiling' },
      { emoji: '🙃', name: 'upside down' }, { emoji: '😉', name: 'winking face' }, { emoji: '😊', name: 'smiling blush' },
      { emoji: '😇', name: 'smiling halo angel' }, { emoji: '🥰', name: 'smiling hearts love' }, { emoji: '😍', name: 'heart eyes' },
      { emoji: '🤩', name: 'star struck' }, { emoji: '😘', name: 'face blowing kiss' }, { emoji: '😗', name: 'kissing face' },
      { emoji: '☺', name: 'smiling face' }, { emoji: '😚', name: 'kissing closed eyes' }, { emoji: '😙', name: 'kissing smiling eyes' },
      { emoji: '🥲', name: 'smiling tear' }, { emoji: '😋', name: 'yummy savoring' }, { emoji: '😛', name: 'tongue out' },
      { emoji: '😜', name: 'winking tongue' }, { emoji: '🤪', name: 'zany face crazy' }, { emoji: '😝', name: 'squinting tongue' },
      { emoji: '🤑', name: 'money mouth' }, { emoji: '🤗', name: 'hugging face hug' }, { emoji: '🤭', name: 'hand over mouth' },
      { emoji: '🤫', name: 'shushing quiet' }, { emoji: '🤔', name: 'thinking face' }, { emoji: '🤐', name: 'zipper mouth' },
      { emoji: '🤨', name: 'raised eyebrow' }, { emoji: '😐', name: 'neutral face' }, { emoji: '😑', name: 'expressionless' },
      { emoji: '😶', name: 'no mouth' }, { emoji: '😏', name: 'smirking face' }, { emoji: '😒', name: 'unamused face' },
      { emoji: '🙄', name: 'eye roll' }, { emoji: '😬', name: 'grimacing face' }, { emoji: '🤥', name: 'lying pinocchio' },
      { emoji: '😌', name: 'relieved face' }, { emoji: '😔', name: 'pensive face sad' }, { emoji: '😪', name: 'sleepy face' },
      { emoji: '🤤', name: 'drooling face' }, { emoji: '😴', name: 'sleeping zzz' }, { emoji: '😷', name: 'face with mask' },
      { emoji: '🤒', name: 'face thermometer sick' }, { emoji: '🤕', name: 'head bandage hurt' }, { emoji: '🤢', name: 'nauseated face' },
      { emoji: '🤮', name: 'vomiting face' }, { emoji: '🤧', name: 'sneezing face' }, { emoji: '🥵', name: 'hot face' },
      { emoji: '🥶', name: 'cold face freezing' }, { emoji: '🥴', name: 'woozy face drunk' }, { emoji: '😵', name: 'dizzy face' },
      { emoji: '🤯', name: 'exploding head mind blown' }, { emoji: '🤠', name: 'cowboy hat face' }, { emoji: '🥳', name: 'party face celebrate' },
      { emoji: '🥸', name: 'disguised face' }, { emoji: '😎', name: 'sunglasses cool' }, { emoji: '🤓', name: 'nerd face glasses' },
      { emoji: '🧐', name: 'monocle face' }, { emoji: '😕', name: 'confused face' }, { emoji: '😟', name: 'worried face' },
      { emoji: '🙁', name: 'slightly frowning' }, { emoji: '😮', name: 'open mouth surprised' }, { emoji: '😯', name: 'hushed face' },
      { emoji: '😲', name: 'astonished face' }, { emoji: '😳', name: 'flushed face' }, { emoji: '🥺', name: 'pleading face puppy eyes' },
      { emoji: '🥹', name: 'holding back tears' }, { emoji: '😦', name: 'frowning open mouth' }, { emoji: '😧', name: 'anguished face' },
      { emoji: '😨', name: 'fearful face scared' }, { emoji: '😰', name: 'anxious sweat' }, { emoji: '😥', name: 'sad relieved' },
      { emoji: '😢', name: 'crying face' }, { emoji: '😭', name: 'loudly crying' }, { emoji: '😱', name: 'face screaming fear' },
      { emoji: '😖', name: 'confounded face' }, { emoji: '😣', name: 'persevering face' }, { emoji: '😞', name: 'disappointed face' },
      { emoji: '😓', name: 'downcast sweat' }, { emoji: '😩', name: 'weary face tired' }, { emoji: '😫', name: 'tired face' },
      { emoji: '🥱', name: 'yawning face' }, { emoji: '😤', name: 'huffing angry steam' }, { emoji: '😡', name: 'pouting face angry' },
      { emoji: '😠', name: 'angry face' }, { emoji: '🤬', name: 'swearing cursing' }, { emoji: '😈', name: 'smiling devil horns' },
      { emoji: '👿', name: 'angry devil imp' }, { emoji: '💀', name: 'skull dead' }, { emoji: '☠', name: 'skull crossbones' },
      { emoji: '💩', name: 'pile poo poop' }, { emoji: '🤡', name: 'clown face' }, { emoji: '👹', name: 'ogre monster' },
      { emoji: '👺', name: 'goblin' }, { emoji: '👻', name: 'ghost boo' }, { emoji: '👽', name: 'alien extraterrestrial' },
      { emoji: '👾', name: 'alien monster game' }, { emoji: '🤖', name: 'robot face' }, { emoji: '😺', name: 'smiling cat' },
      { emoji: '😸', name: 'grinning cat' }, { emoji: '😹', name: 'cat joy tears' }, { emoji: '😻', name: 'cat heart eyes' },
      { emoji: '😼', name: 'cat smirk' }, { emoji: '😽', name: 'kissing cat' }, { emoji: '🙀', name: 'weary cat' },
      { emoji: '😿', name: 'crying cat' }, { emoji: '😾', name: 'pouting cat' },
    ],
  },
  {
    id: 'gestures',
    name: 'Gestures & People',
    icon: '👋',
    emojis: [
      { emoji: '👋', name: 'waving hand hello' }, { emoji: '🤚', name: 'raised back hand' }, { emoji: '🖐', name: 'hand splayed' },
      { emoji: '✋', name: 'raised hand stop' }, { emoji: '🖖', name: 'vulcan salute spock' }, { emoji: '👌', name: 'ok hand' },
      { emoji: '🤌', name: 'pinched fingers italian' }, { emoji: '🤏', name: 'pinching hand' }, { emoji: '✌', name: 'victory peace sign' },
      { emoji: '🤞', name: 'crossed fingers luck' }, { emoji: '🤟', name: 'love you gesture' }, { emoji: '🤘', name: 'sign of horns rock' },
      { emoji: '🤙', name: 'call me hand' }, { emoji: '👈', name: 'pointing left' }, { emoji: '👉', name: 'pointing right' },
      { emoji: '👆', name: 'pointing up' }, { emoji: '🖕', name: 'middle finger' }, { emoji: '👇', name: 'pointing down' },
      { emoji: '☝', name: 'index pointing up' }, { emoji: '👍', name: 'thumbs up like' }, { emoji: '👎', name: 'thumbs down dislike' },
      { emoji: '✊', name: 'raised fist' }, { emoji: '👊', name: 'oncoming fist bump' }, { emoji: '🤛', name: 'left fist' },
      { emoji: '🤜', name: 'right fist' }, { emoji: '👏', name: 'clapping hands clap' }, { emoji: '🙌', name: 'raising hands celebrate' },
      { emoji: '🫶', name: 'heart hands love' }, { emoji: '👐', name: 'open hands' }, { emoji: '🤲', name: 'palms up together' },
      { emoji: '🤝', name: 'handshake deal' }, { emoji: '🙏', name: 'folded hands pray please' }, { emoji: '✍', name: 'writing hand' },
      { emoji: '💅', name: 'nail polish' }, { emoji: '🤳', name: 'selfie' }, { emoji: '💪', name: 'flexed bicep strong muscle' },
      { emoji: '🦾', name: 'mechanical arm prosthetic' }, { emoji: '🦿', name: 'mechanical leg' }, { emoji: '🦵', name: 'leg' },
      { emoji: '🦶', name: 'foot' }, { emoji: '👂', name: 'ear' }, { emoji: '👃', name: 'nose' },
      { emoji: '🧠', name: 'brain smart' }, { emoji: '👀', name: 'eyes looking' }, { emoji: '👁', name: 'eye' },
      { emoji: '👅', name: 'tongue' }, { emoji: '👄', name: 'mouth lips' }, { emoji: '👶', name: 'baby' },
      { emoji: '🧒', name: 'child kid' }, { emoji: '👦', name: 'boy' }, { emoji: '👧', name: 'girl' },
      { emoji: '🧑', name: 'person adult' }, { emoji: '👱', name: 'person blond hair' }, { emoji: '👨', name: 'man' },
      { emoji: '🧔', name: 'person beard' }, { emoji: '👩', name: 'woman' }, { emoji: '🧓', name: 'older person elderly' },
      { emoji: '👴', name: 'old man grandfather' }, { emoji: '👵', name: 'old woman grandmother' },
    ],
  },
  {
    id: 'hearts',
    name: 'Hearts & Love',
    icon: '❤️',
    emojis: [
      { emoji: '❤️', name: 'red heart love' }, { emoji: '🧡', name: 'orange heart' }, { emoji: '💛', name: 'yellow heart' },
      { emoji: '💚', name: 'green heart' }, { emoji: '💙', name: 'blue heart' }, { emoji: '💜', name: 'purple heart' },
      { emoji: '🖤', name: 'black heart' }, { emoji: '🤍', name: 'white heart' }, { emoji: '🤎', name: 'brown heart' },
      { emoji: '💔', name: 'broken heart' }, { emoji: '❤️‍🔥', name: 'heart on fire' }, { emoji: '❤️‍🩹', name: 'mending heart' },
      { emoji: '💕', name: 'two hearts' }, { emoji: '💞', name: 'revolving hearts' }, { emoji: '💓', name: 'beating heart' },
      { emoji: '💗', name: 'growing heart' }, { emoji: '💖', name: 'sparkling heart' }, { emoji: '💘', name: 'heart arrow cupid' },
      { emoji: '💝', name: 'heart ribbon gift' }, { emoji: '💟', name: 'heart decoration' }, { emoji: '💌', name: 'love letter' },
      { emoji: '💍', name: 'ring wedding' }, { emoji: '💐', name: 'bouquet flowers' }, { emoji: '🌹', name: 'rose flower' },
      { emoji: '😍', name: 'heart eyes love' }, { emoji: '😘', name: 'blowing kiss' }, { emoji: '💋', name: 'kiss mark lips' },
      { emoji: '💑', name: 'couple heart' }, { emoji: '👫', name: 'man woman holding hands' }, { emoji: '💏', name: 'couple kiss' },
    ],
  },
  {
    id: 'animals',
    name: 'Animals & Nature',
    icon: '🐶',
    emojis: [
      { emoji: '🐶', name: 'dog face puppy' }, { emoji: '🐱', name: 'cat face kitty' }, { emoji: '🐭', name: 'mouse face' },
      { emoji: '🐹', name: 'hamster face' }, { emoji: '🐰', name: 'rabbit face bunny' }, { emoji: '🦊', name: 'fox face' },
      { emoji: '🐻', name: 'bear face' }, { emoji: '🐼', name: 'panda face' }, { emoji: '🐨', name: 'koala face' },
      { emoji: '🐯', name: 'tiger face' }, { emoji: '🦁', name: 'lion face' }, { emoji: '🐮', name: 'cow face' },
      { emoji: '🐷', name: 'pig face' }, { emoji: '🐸', name: 'frog face' }, { emoji: '🐵', name: 'monkey face' },
      { emoji: '🙈', name: 'see no evil monkey' }, { emoji: '🙉', name: 'hear no evil monkey' }, { emoji: '🙊', name: 'speak no evil monkey' },
      { emoji: '🐔', name: 'chicken' }, { emoji: '🐧', name: 'penguin' }, { emoji: '🐦', name: 'bird' },
      { emoji: '🐤', name: 'baby chick' }, { emoji: '🦆', name: 'duck' }, { emoji: '🦅', name: 'eagle' },
      { emoji: '🦉', name: 'owl' }, { emoji: '🦇', name: 'bat' }, { emoji: '🐺', name: 'wolf' },
      { emoji: '🐗', name: 'boar' }, { emoji: '🐴', name: 'horse face' }, { emoji: '🦄', name: 'unicorn' },
      { emoji: '🐝', name: 'bee honeybee' }, { emoji: '🐛', name: 'bug caterpillar' }, { emoji: '🦋', name: 'butterfly' },
      { emoji: '🐌', name: 'snail' }, { emoji: '🐞', name: 'ladybug' }, { emoji: '🐜', name: 'ant' },
      { emoji: '🕷', name: 'spider' }, { emoji: '🐢', name: 'turtle tortoise' }, { emoji: '🐍', name: 'snake' },
      { emoji: '🦎', name: 'lizard' }, { emoji: '🐙', name: 'octopus' }, { emoji: '🐠', name: 'tropical fish' },
      { emoji: '🐟', name: 'fish' }, { emoji: '🐬', name: 'dolphin' }, { emoji: '🐳', name: 'whale' },
      { emoji: '🦈', name: 'shark' }, { emoji: '🐊', name: 'crocodile' }, { emoji: '🐘', name: 'elephant' },
      { emoji: '🦒', name: 'giraffe' }, { emoji: '🐎', name: 'horse racing' }, { emoji: '🌸', name: 'cherry blossom' },
      { emoji: '🌷', name: 'tulip flower' }, { emoji: '🌻', name: 'sunflower' }, { emoji: '🌺', name: 'hibiscus' },
      { emoji: '🌲', name: 'evergreen tree' }, { emoji: '🌴', name: 'palm tree' }, { emoji: '🌵', name: 'cactus' },
      { emoji: '🍀', name: 'four leaf clover luck' }, { emoji: '🍁', name: 'maple leaf fall autumn' }, { emoji: '🍂', name: 'fallen leaf' },
      { emoji: '🍃', name: 'leaf wind' }, { emoji: '🌿', name: 'herb' }, { emoji: '☘', name: 'shamrock' },
    ],
  },
  {
    id: 'food',
    name: 'Food & Drink',
    icon: '🍔',
    emojis: [
      { emoji: '🍎', name: 'red apple' }, { emoji: '🍐', name: 'pear' }, { emoji: '🍊', name: 'orange tangerine' },
      { emoji: '🍋', name: 'lemon' }, { emoji: '🍌', name: 'banana' }, { emoji: '🍉', name: 'watermelon' },
      { emoji: '🍇', name: 'grapes' }, { emoji: '🍓', name: 'strawberry' }, { emoji: '🫐', name: 'blueberry' },
      { emoji: '🍒', name: 'cherry' }, { emoji: '🍑', name: 'peach' }, { emoji: '🥭', name: 'mango' },
      { emoji: '🍍', name: 'pineapple' }, { emoji: '🥥', name: 'coconut' }, { emoji: '🥝', name: 'kiwi fruit' },
      { emoji: '🍅', name: 'tomato' }, { emoji: '🍆', name: 'eggplant aubergine' }, { emoji: '🥑', name: 'avocado' },
      { emoji: '🥦', name: 'broccoli' }, { emoji: '🥒', name: 'cucumber' }, { emoji: '🌶', name: 'hot pepper chili' },
      { emoji: '🌽', name: 'corn ear' }, { emoji: '🥕', name: 'carrot' }, { emoji: '🥔', name: 'potato' },
      { emoji: '🍞', name: 'bread loaf' }, { emoji: '🥐', name: 'croissant' }, { emoji: '🥯', name: 'bagel' },
      { emoji: '🧀', name: 'cheese wedge' }, { emoji: '🍖', name: 'meat bone' }, { emoji: '🍗', name: 'poultry leg chicken' },
      { emoji: '🥩', name: 'cut of meat steak' }, { emoji: '🥓', name: 'bacon' }, { emoji: '🍔', name: 'hamburger burger' },
      { emoji: '🍟', name: 'french fries' }, { emoji: '🍕', name: 'pizza slice' }, { emoji: '🌭', name: 'hot dog' },
      { emoji: '🥪', name: 'sandwich' }, { emoji: '🌮', name: 'taco' }, { emoji: '🌯', name: 'burrito' },
      { emoji: '🥙', name: 'pita stuffed' }, { emoji: '🥚', name: 'egg' }, { emoji: '🍳', name: 'cooking fried egg' },
      { emoji: '🍲', name: 'pot of food stew' }, { emoji: '🍜', name: 'steaming bowl noodle ramen' }, { emoji: '🍝', name: 'spaghetti pasta' },
      { emoji: '🍣', name: 'sushi' }, { emoji: '🍱', name: 'bento box' }, { emoji: '🍛', name: 'curry rice' },
      { emoji: '🍦', name: 'ice cream soft serve' }, { emoji: '🍧', name: 'shaved ice' }, { emoji: '🍨', name: 'ice cream' },
      { emoji: '🍩', name: 'donut doughnut' }, { emoji: '🍪', name: 'cookie biscuit' }, { emoji: '🎂', name: 'birthday cake' },
      { emoji: '🍰', name: 'cake slice shortcake' }, { emoji: '🧁', name: 'cupcake muffin' }, { emoji: '🍫', name: 'chocolate bar' },
      { emoji: '🍬', name: 'candy sweet' }, { emoji: '🍭', name: 'lollipop' }, { emoji: '🍯', name: 'honey pot' },
      { emoji: '☕', name: 'coffee hot beverage' }, { emoji: '🍵', name: 'tea cup' }, { emoji: '🍺', name: 'beer mug' },
      { emoji: '🍻', name: 'clinking beer cheers' }, { emoji: '🥂', name: 'clinking glasses champagne' }, { emoji: '🍷', name: 'wine glass' },
      { emoji: '🍸', name: 'cocktail glass martini' }, { emoji: '🥤', name: 'cup straw drink' }, { emoji: '🧋', name: 'bubble tea boba' },
    ],
  },
  {
    id: 'travel',
    name: 'Travel & Places',
    icon: '✈️',
    emojis: [
      { emoji: '🚗', name: 'car automobile' }, { emoji: '🚕', name: 'taxi cab' }, { emoji: '🚌', name: 'bus' },
      { emoji: '🚎', name: 'trolleybus' }, { emoji: '🏎', name: 'racing car' }, { emoji: '🚓', name: 'police car' },
      { emoji: '🚑', name: 'ambulance' }, { emoji: '🚒', name: 'fire engine' }, { emoji: '✈️', name: 'airplane plane flight' },
      { emoji: '🚀', name: 'rocket launch' }, { emoji: '🛸', name: 'flying saucer ufo' }, { emoji: '🚁', name: 'helicopter' },
      { emoji: '⛵', name: 'sailboat' }, { emoji: '🚢', name: 'ship boat' }, { emoji: '🏠', name: 'house home' },
      { emoji: '🏢', name: 'office building' }, { emoji: '🏥', name: 'hospital' }, { emoji: '🏫', name: 'school' },
      { emoji: '⛪', name: 'church' }, { emoji: '🕌', name: 'mosque' }, { emoji: '🕍', name: 'synagogue' },
      { emoji: '🏰', name: 'castle' }, { emoji: '🗼', name: 'tokyo tower' }, { emoji: '🗽', name: 'statue liberty' },
      { emoji: '⛲', name: 'fountain' }, { emoji: '🎡', name: 'ferris wheel' }, { emoji: '🎢', name: 'roller coaster' },
      { emoji: '🌋', name: 'volcano' }, { emoji: '🗻', name: 'mount fuji mountain' }, { emoji: '🏝', name: 'desert island' },
      { emoji: '🌅', name: 'sunrise' }, { emoji: '🌄', name: 'sunrise mountains' }, { emoji: '🌠', name: 'shooting star' },
      { emoji: '🎇', name: 'sparkler firework' }, { emoji: '🎆', name: 'fireworks' }, { emoji: '🌃', name: 'night city stars' },
      { emoji: '🌉', name: 'bridge night' }, { emoji: '🌌', name: 'milky way galaxy' }, { emoji: '🏖', name: 'beach umbrella' },
      { emoji: '🏕', name: 'camping tent' }, { emoji: '⛰', name: 'mountain' }, { emoji: '🗺', name: 'world map' },
      { emoji: '🧭', name: 'compass' }, { emoji: '🌍', name: 'earth globe africa europe' }, { emoji: '🌎', name: 'earth globe americas' },
      { emoji: '🌏', name: 'earth globe asia australia' },
    ],
  },
  {
    id: 'objects',
    name: 'Objects',
    icon: '💡',
    emojis: [
      { emoji: '⌚', name: 'watch time' }, { emoji: '📱', name: 'mobile phone smartphone' }, { emoji: '💻', name: 'laptop computer' },
      { emoji: '⌨', name: 'keyboard' }, { emoji: '🖥', name: 'desktop computer' }, { emoji: '🖨', name: 'printer' },
      { emoji: '🖱', name: 'computer mouse' }, { emoji: '💾', name: 'floppy disk save' }, { emoji: '💿', name: 'cd optical disk' },
      { emoji: '📷', name: 'camera photo' }, { emoji: '📹', name: 'video camera' }, { emoji: '🎥', name: 'movie camera film' },
      { emoji: '📺', name: 'television tv' }, { emoji: '📻', name: 'radio' }, { emoji: '🎙', name: 'studio microphone' },
      { emoji: '🎧', name: 'headphone headphones music' }, { emoji: '🔊', name: 'speaker loud sound' }, { emoji: '🔔', name: 'bell notification' },
      { emoji: '📣', name: 'megaphone' }, { emoji: '💡', name: 'light bulb idea' }, { emoji: '🔦', name: 'flashlight' },
      { emoji: '🕯', name: 'candle' }, { emoji: '📖', name: 'open book read' }, { emoji: '📚', name: 'books stack' },
      { emoji: '📝', name: 'memo note pencil write' }, { emoji: '✏', name: 'pencil' }, { emoji: '🖊', name: 'pen' },
      { emoji: '📌', name: 'pushpin pin' }, { emoji: '📎', name: 'paperclip' }, { emoji: '✂', name: 'scissors cut' },
      { emoji: '🔑', name: 'key' }, { emoji: '🔒', name: 'locked padlock' }, { emoji: '🔓', name: 'unlocked' },
      { emoji: '🛠', name: 'hammer wrench tools' }, { emoji: '⚙', name: 'gear settings' }, { emoji: '💎', name: 'gem diamond' },
      { emoji: '💰', name: 'money bag' }, { emoji: '💵', name: 'dollar banknote money' }, { emoji: '💳', name: 'credit card' },
      { emoji: '🎁', name: 'gift wrapped present' }, { emoji: '🎈', name: 'balloon party' }, { emoji: '🎉', name: 'party popper tada' },
      { emoji: '🎊', name: 'confetti ball celebrate' }, { emoji: '🏆', name: 'trophy winner cup' }, { emoji: '🥇', name: 'gold medal first' },
      { emoji: '🥈', name: 'silver medal second' }, { emoji: '🥉', name: 'bronze medal third' }, { emoji: '⚽', name: 'soccer football' },
      { emoji: '🏀', name: 'basketball' }, { emoji: '🏈', name: 'american football' }, { emoji: '⚾', name: 'baseball' },
      { emoji: '🎾', name: 'tennis' }, { emoji: '🏐', name: 'volleyball' }, { emoji: '🎮', name: 'video game controller' },
      { emoji: '🎯', name: 'direct hit bullseye target' }, { emoji: '🎲', name: 'game die dice' }, { emoji: '🧩', name: 'puzzle piece jigsaw' },
    ],
  },
  {
    id: 'symbols',
    name: 'Symbols',
    icon: '✅',
    emojis: [
      { emoji: '✅', name: 'check mark done' }, { emoji: '❌', name: 'cross mark wrong' }, { emoji: '❗', name: 'exclamation mark' },
      { emoji: '❓', name: 'question mark' }, { emoji: '⭐', name: 'star' }, { emoji: '🌟', name: 'glowing star' },
      { emoji: '💯', name: 'hundred points perfect' }, { emoji: '🔥', name: 'fire hot lit' }, { emoji: '💥', name: 'collision boom explosion' },
      { emoji: '✨', name: 'sparkles shine' }, { emoji: '💫', name: 'dizzy star' }, { emoji: '💢', name: 'anger symbol' },
      { emoji: '💬', name: 'speech balloon message' }, { emoji: '💭', name: 'thought balloon thinking' }, { emoji: '🗯', name: 'angry speech' },
      { emoji: '♻', name: 'recycling recycle' }, { emoji: '⚠', name: 'warning sign caution' }, { emoji: '🚫', name: 'prohibited no' },
      { emoji: '⛔', name: 'no entry stop' }, { emoji: '📵', name: 'no mobile phones' }, { emoji: '🔞', name: 'no minors eighteen' },
      { emoji: '➡️', name: 'right arrow' }, { emoji: '⬅️', name: 'left arrow' }, { emoji: '⬆️', name: 'up arrow' },
      { emoji: '⬇️', name: 'down arrow' }, { emoji: '↩️', name: 'right arrow curving left reply' }, { emoji: '↪️', name: 'left arrow curving right' },
      { emoji: '🔄', name: 'counterclockwise arrows refresh' }, { emoji: '🔃', name: 'clockwise arrows' }, { emoji: '🔀', name: 'shuffle tracks' },
      { emoji: '🔁', name: 'repeat' }, { emoji: '🔂', name: 'repeat single' }, { emoji: '⏩', name: 'fast forward' },
      { emoji: '⏪', name: 'fast reverse rewind' }, { emoji: '▶️', name: 'play button' }, { emoji: '⏸', name: 'pause button' },
      { emoji: '⏹', name: 'stop button' }, { emoji: '⏺', name: 'record button' }, { emoji: '⏏', name: 'eject button' },
      { emoji: '🔴', name: 'red circle' }, { emoji: '🟠', name: 'orange circle' }, { emoji: '🟡', name: 'yellow circle' },
      { emoji: '🟢', name: 'green circle' }, { emoji: '🔵', name: 'blue circle' }, { emoji: '🟣', name: 'purple circle' },
      { emoji: '⚫', name: 'black circle' }, { emoji: '⚪', name: 'white circle' }, { emoji: '🟤', name: 'brown circle' },
      { emoji: '🔲', name: 'black square button' }, { emoji: '🔳', name: 'white square button' }, { emoji: '▪️', name: 'small black square' },
      { emoji: '▫️', name: 'small white square' },
    ],
  },
  {
    id: 'flags',
    name: 'Flags',
    icon: '🏳️',
    emojis: [
      { emoji: '🏁', name: 'chequered flag race finish' }, { emoji: '🚩', name: 'triangular flag red flag' }, { emoji: '🎌', name: 'crossed flags' },
      { emoji: '🏴', name: 'black flag' }, { emoji: '🏳️', name: 'white flag surrender' }, { emoji: '🏳️‍🌈', name: 'rainbow flag pride' },
      { emoji: '🇮🇳', name: 'flag india' }, { emoji: '🇺🇸', name: 'flag united states usa' }, { emoji: '🇬🇧', name: 'flag united kingdom uk' },
      { emoji: '🇨🇦', name: 'flag canada' }, { emoji: '🇦🇺', name: 'flag australia' }, { emoji: '🇩🇪', name: 'flag germany' },
      { emoji: '🇫🇷', name: 'flag france' }, { emoji: '🇯🇵', name: 'flag japan' }, { emoji: '🇰🇷', name: 'flag south korea' },
      { emoji: '🇨🇳', name: 'flag china' }, { emoji: '🇧🇷', name: 'flag brazil' }, { emoji: '🇮🇹', name: 'flag italy' },
      { emoji: '🇪🇸', name: 'flag spain' }, { emoji: '🇲🇽', name: 'flag mexico' }, { emoji: '🇷🇺', name: 'flag russia' },
      { emoji: '🇳🇵', name: 'flag nepal' }, { emoji: '🇵🇰', name: 'flag pakistan' }, { emoji: '🇧🇩', name: 'flag bangladesh' },
      { emoji: '🇱🇰', name: 'flag sri lanka' }, { emoji: '🇹🇭', name: 'flag thailand' }, { emoji: '🇻🇳', name: 'flag vietnam' },
      { emoji: '🇮🇩', name: 'flag indonesia' }, { emoji: '🇵🇭', name: 'flag philippines' }, { emoji: '🇸🇬', name: 'flag singapore' },
      { emoji: '🇲🇾', name: 'flag malaysia' }, { emoji: '🇦🇪', name: 'flag uae emirates' }, { emoji: '🇸🇦', name: 'flag saudi arabia' },
      { emoji: '🇳🇬', name: 'flag nigeria' }, { emoji: '🇿🇦', name: 'flag south africa' }, { emoji: '🇰🇪', name: 'flag kenya' },
    ],
  },
];

/* ── Helpers ───────────────────────────────────────────────────────── */

const STORAGE_KEY = 'emoji-picker-recent';
const MAX_RECENT = 30;

function getRecent(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch { return []; }
}

function addRecent(emoji: string) {
  const recent = getRecent().filter(e => e !== emoji);
  recent.unshift(emoji);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)));
}

/* ── Component ─────────────────────────────────────────────────────── */

type EmojiSize = 'sm' | 'md' | 'lg';

const SKIN_TONES = [
  { label: 'Default', modifier: '', color: '#ffcc4d' },
  { label: 'Light', modifier: '\u{1F3FB}', color: '#fadcbc' },
  { label: 'Medium-Light', modifier: '\u{1F3FC}', color: '#e0bb95' },
  { label: 'Medium', modifier: '\u{1F3FD}', color: '#bf8f68' },
  { label: 'Medium-Dark', modifier: '\u{1F3FE}', color: '#9b643d' },
  { label: 'Dark', modifier: '\u{1F3FF}', color: '#594539' },
];

// Emojis that support skin tone modifiers
const SKIN_TONE_CAPABLE = new Set([
  '👋','🤚','🖐','✋','🖖','👌','🤌','🤏','✌','🤞','🤟','🤘','🤙','👈','👉','👆','🖕','👇','☝',
  '👍','👎','✊','👊','🤛','🤜','👏','🙌','🫶','👐','🤲','🤝','🙏','✍','💅','🤳','💪',
  '🦵','🦶','👂','👃','👶','🧒','👦','👧','🧑','👱','👨','🧔','👩','🧓','👴','👵',
]);

export function EmojiPickerTool() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('smileys');
  const [recentEmojis, setRecentEmojis] = useState<string[]>([]);
  const [compose, setCompose] = useState('');
  const [copiedEmoji, setCopiedEmoji] = useState<string | null>(null);
  const [emojiSize, setEmojiSize] = useState<EmojiSize>('md');
  const [skinTone, setSkinTone] = useState(0);
  const [showSkinTones, setShowSkinTones] = useState(false);
  const [hoveredEmoji, setHoveredEmoji] = useState<{ emoji: string; name: string } | null>(null);

  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRecentEmojis(getRecent());
  }, []);

  const totalEmojis = useMemo(() => EMOJI_DATA.reduce((sum, cat) => sum + cat.emojis.length, 0), []);

  const filteredData = useMemo(() => {
    if (!search.trim()) return EMOJI_DATA;
    const q = search.toLowerCase();
    return EMOJI_DATA.map(cat => ({
      ...cat,
      emojis: cat.emojis.filter(e => e.name.includes(q) || e.emoji.includes(q)),
    })).filter(cat => cat.emojis.length > 0);
  }, [search]);

  const applySkintone = useCallback((emoji: string): string => {
    if (skinTone === 0 || !SKIN_TONE_CAPABLE.has(emoji)) return emoji;
    return emoji + SKIN_TONES[skinTone].modifier;
  }, [skinTone]);

  const copyEmoji = useCallback(async (emoji: string) => {
    const finalEmoji = applySkintone(emoji);
    try {
      await navigator.clipboard.writeText(finalEmoji);
      setCopiedEmoji(finalEmoji);
      setTimeout(() => setCopiedEmoji(null), 1500);
      addRecent(finalEmoji);
      setRecentEmojis(getRecent());
      setCompose(prev => prev + finalEmoji);
    } catch {
      // Fallback
      setCompose(prev => prev + finalEmoji);
    }
  }, [applySkintone]);

  const scrollToCategory = (id: string) => {
    setActiveCategory(id);
    categoryRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const sizeClasses: Record<EmojiSize, string> = {
    sm: 'text-xl w-8 h-8',
    md: 'text-2xl w-10 h-10',
    lg: 'text-3xl w-12 h-12',
  };

  const gridClasses: Record<EmojiSize, string> = {
    sm: 'grid-cols-10 sm:grid-cols-12 md:grid-cols-14 lg:grid-cols-16',
    md: 'grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-14',
    lg: 'grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12',
  };

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <SmilePlus className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <span className="text-sm text-slate-500 dark:text-slate-400">{totalEmojis} emojis</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Skin tone selector */}
          <div className="relative">
            <button
              onClick={() => setShowSkinTones(!showSkinTones)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Select skin tone"
            >
              <span className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600" style={{ backgroundColor: SKIN_TONES[skinTone].color }} />
              <span className="hidden sm:inline">Skin tone</span>
            </button>
            {showSkinTones && (
              <div className="absolute top-full mt-1 right-0 z-20 flex gap-1 p-2 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                {SKIN_TONES.map((tone, i) => (
                  <button
                    key={i}
                    onClick={() => { setSkinTone(i); setShowSkinTones(false); }}
                    className={`w-7 h-7 rounded-full border-2 transition-all hover:scale-110 ${
                      skinTone === i ? 'border-primary-500 scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: tone.color }}
                    title={tone.label}
                  />
                ))}
              </div>
            )}
          </div>
          {/* Size toggle */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
            {(['sm', 'md', 'lg'] as EmojiSize[]).map(size => (
              <button
                key={size}
                onClick={() => setEmojiSize(size)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  emojiSize === size
                    ? 'bg-white dark:bg-slate-700 shadow text-primary-700 dark:text-primary-400'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {size === 'sm' ? 'S' : size === 'md' ? 'M' : 'L'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search emojis... (e.g. happy, fire, heart)"
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100"
        />
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
        {recentEmojis.length > 0 && (
          <button
            onClick={() => scrollToCategory('recent')}
            className={`shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              activeCategory === 'recent'
                ? 'bg-primary-800 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Clock className="w-4 h-4 inline mr-1" />Recent
          </button>
        )}
        {EMOJI_DATA.map(cat => (
          <button
            key={cat.id}
            onClick={() => scrollToCategory(cat.id)}
            className={`shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              activeCategory === cat.id
                ? 'bg-primary-800 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <span className="mr-1">{cat.icon}</span>
            <span className="hidden sm:inline">{cat.name.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* Emoji grid container */}
      <div ref={scrollContainerRef} className="max-h-[480px] overflow-y-auto space-y-5 pr-1">
        {/* Recent */}
        {recentEmojis.length > 0 && !search && (
          <div ref={el => { categoryRefs.current['recent'] = el; }}>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2 sticky top-0 bg-white dark:bg-slate-900 py-1 z-10">
              <Clock className="w-3.5 h-3.5 inline mr-1.5" />Recently Used
            </h3>
            <div className={`grid ${gridClasses[emojiSize]} gap-1`}>
              {recentEmojis.map((emoji, i) => (
                <button
                  key={`recent-${i}`}
                  onClick={() => copyEmoji(emoji)}
                  className={`${sizeClasses[emojiSize]} flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative`}
                  title="Click to copy"
                >
                  {emoji}
                  {copiedEmoji === emoji && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        {filteredData.map(cat => (
          <div key={cat.id} ref={el => { categoryRefs.current[cat.id] = el; }}>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2 sticky top-0 bg-white dark:bg-slate-900 py-1 z-10">
              <span className="mr-1.5">{cat.icon}</span>{cat.name}
              <span className="text-xs font-normal text-slate-400 ml-2">({cat.emojis.length})</span>
            </h3>
            <div className={`grid ${gridClasses[emojiSize]} gap-1`}>
              {cat.emojis.map((e, i) => (
                <button
                  key={`${cat.id}-${i}`}
                  onClick={() => copyEmoji(e.emoji)}
                  onMouseEnter={() => setHoveredEmoji(e)}
                  onMouseLeave={() => setHoveredEmoji(null)}
                  className={`${sizeClasses[emojiSize]} flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-125 transition-all relative group`}
                  title={e.name}
                >
                  {SKIN_TONE_CAPABLE.has(e.emoji) && skinTone > 0 ? e.emoji + SKIN_TONES[skinTone].modifier : e.emoji}
                  {copiedEmoji === applySkintone(e.emoji) && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}

        {filteredData.length === 0 && (
          <div className="text-center py-10 text-slate-400 dark:text-slate-500">
            <p className="text-4xl mb-2">🤷</p>
            <p className="text-sm">No emojis found for &ldquo;{search}&rdquo;</p>
          </div>
        )}
      </div>

      {/* Hovered emoji info bar */}
      {hoveredEmoji && (
        <div className="flex items-center gap-3 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <span className="text-2xl">{SKIN_TONE_CAPABLE.has(hoveredEmoji.emoji) && skinTone > 0 ? hoveredEmoji.emoji + SKIN_TONES[skinTone].modifier : hoveredEmoji.emoji}</span>
          <span className="text-sm text-slate-600 dark:text-slate-300 capitalize">{hoveredEmoji.name}</span>
          <span className="text-xs text-slate-400 ml-auto">Click to copy</span>
        </div>
      )}

      {/* Compose area */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Compose</label>
          <div className="flex items-center gap-2">
            {compose && <CopyButton text={compose} size="sm" />}
            {compose && (
              <button onClick={() => setCompose('')}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
        <textarea
          value={compose}
          onChange={e => setCompose(e.target.value)}
          placeholder="Click emojis above to add them here, then copy all at once..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100 resize-none"
        />
        {compose && (
          <p className="text-xs text-slate-400 mt-1 text-right">{compose.length} characters</p>
        )}
      </div>

      {/* Copied toast */}
      {copiedEmoji && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-full shadow-lg flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" /> Copied {copiedEmoji}
        </div>
      )}
    </div>
  );
}
