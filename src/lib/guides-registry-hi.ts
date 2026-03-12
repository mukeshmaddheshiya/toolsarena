import type { Guide } from '@/types/guides';

export const guidesHi: Guide[] = [

  // ── 1. WORD COUNTER ──────────────────────────────────────────────
  {
    slug: 'word-counter-guide',
    toolSlug: 'word-counter',
    category: 'text-tools',
    title: 'शब्द गिनती गाइड: ऑनलाइन Word Counter से निबंध, ब्लॉग और Social Media के लिए सही शब्द गिनें',
    subtitle: 'छात्रों, ब्लॉगर्स और कंटेंट राइटर्स के लिए शब्द गिनती की पूरी जानकारी — exam limits, social media character limits और pro tips के साथ।',
    metaTitle: 'शब्द गिनती - फ्री ऑनलाइन Word Counter टूल',
    metaDescription: 'शब्द गिनती करें आसानी से — निबंध, ब्लॉग, सोशल मीडिया के लिए। SSC, UPSC exam limits और WhatsApp, Instagram character limits की पूरी जानकारी यहाँ पाएं।',
    targetKeyword: 'शब्द गिनती',
    secondaryKeywords: [
      'word counter online', 'शब्द गिनती करें', 'hindi word counter',
      'शब्द और अक्षर गिनती', 'निबंध के लिए शब्द गिनती', 'ऑनलाइन शब्द काउंटर',
      'content word count कैसे करें', 'social media character limit hindi',
      'word count for essays hindi', 'शब्दों की संख्या',
    ],
    lastUpdated: '2026-03-12',
    readingTime: '8 मिनट पढ़ें',
    tags: ['Writing', 'निबंध', 'Social Media', 'Blogging'],
    intro: `<p><strong>शब्द गिनती</strong> एक ऐसी ज़रूरत है जो छात्रों से लेकर पेशेवर लेखकों तक सभी को पड़ती है। चाहे आप UPSC का निबंध लिख रहे हों, Instagram के लिए caption बना रहे हों, या अपने ब्लॉग का SEO सुधारना चाहते हों — सही शब्द संख्या जानना बेहद ज़रूरी है।</p>
<p>इस गाइड में हम जानेंगे कि शब्द गिनती क्यों मायने रखती है, भारतीय परीक्षाओं में क्या सीमाएं हैं, social media के character limits क्या हैं, और ToolsArena का फ्री Word Counter टूल आपकी कैसे मदद कर सकता है।</p>`,
    sections: [
      {
        id: 'shabd-ginti-kya-hai',
        title: 'शब्द गिनती क्यों ज़रूरी है?',
        content: `<p>शब्द गिनती सिर्फ एक संख्या नहीं — यह आपकी लेखन की गुणवत्ता और उद्देश्य को दर्शाती है। अलग-अलग context में इसकी ज़रूरत अलग कारणों से होती है।</p>
<h3>छात्रों के लिए</h3>
<p>परीक्षाओं में निर्धारित शब्द सीमा का पालन करना अनिवार्य है। सीमा से बहुत कम लिखने पर अंक कटते हैं, और बहुत ज़्यादा लिखने से परीक्षक का समय बर्बाद होता है। अधिकांश परीक्षाओं में ±10% की छूट मिलती है।</p>
<h3>ब्लॉगर्स और कंटेंट राइटर्स के लिए</h3>
<p>Google के algorithms लंबे और गहराई से लिखे गए content को तरजीह देते हैं। लेकिन सिर्फ शब्द बढ़ाना काफी नहीं — content helpful और original होना चाहिए। एक अच्छे ब्लॉग पोस्ट में आमतौर पर 1,500–2,500 शब्द होते हैं।</p>
<h3>Social Media Managers के लिए</h3>
<p>हर platform का अपना character limit है। Twitter/X पर 280, Instagram caption पर 2,200, और Google Ads headline पर सिर्फ 30 characters। इन्हें नज़रअंदाज करने पर content कट जाता है।</p>
<h3>Word Counter क्या-क्या track करता है?</h3>
<ul>
  <li><strong>शब्द (Words)</strong> — मुख्य metric</li>
  <li><strong>अक्षर (Characters)</strong> — space के साथ और बिना space दोनों</li>
  <li><strong>वाक्य (Sentences)</strong> — readability के लिए उपयोगी</li>
  <li><strong>पैराग्राफ (Paragraphs)</strong> — content structure के लिए</li>
  <li><strong>पढ़ने का समय</strong> — 200–250 wpm की औसत speed पर</li>
</ul>
<p>ToolsArena का Word Counter Hindi और English दोनों में real-time में results दिखाता है।</p>`,
      },
      {
        id: 'nibandh-shabd-seema',
        title: 'निबंध और असाइनमेंट के लिए शब्द सीमा',
        content: `<p>भारतीय परीक्षाओं में निबंध की शब्द सीमा बहुत महत्वपूर्ण होती है। नीचे प्रमुख परीक्षाओं की सीमाएं दी गई हैं:</p>
<table>
  <thead>
    <tr><th>परीक्षा / असाइनमेंट</th><th>शब्द सीमा</th><th>विशेष नोट</th></tr>
  </thead>
  <tbody>
    <tr><td>SSC CGL (निबंध)</td><td>200–250 शब्द</td><td>Tier-III descriptive paper</td></tr>
    <tr><td>UPSC Mains (निबंध)</td><td>1,000–1,200 शब्द</td><td>Paper-I में 2 निबंध</td></tr>
    <tr><td>UPSC GS Answer</td><td>150–200 शब्द</td><td>10-mark question</td></tr>
    <tr><td>Class 10 निबंध</td><td>300–500 शब्द</td><td>Board exam standard</td></tr>
    <tr><td>Class 12 निबंध</td><td>500–800 शब्द</td><td>Hindi/English दोनों</td></tr>
    <tr><td>BA/BSc Assignment</td><td>1,000–2,000 शब्द</td><td>College level</td></tr>
    <tr><td>Bank PO (Essay)</td><td>150–200 शब्द</td><td>IBPS/SBI descriptive test</td></tr>
    <tr><td>स्कूल गृहकार्य</td><td>200–400 शब्द</td><td>Class 6–9 के लिए</td></tr>
  </tbody>
</table>
<blockquote><strong>सलाह:</strong> निबंध लिखते समय पहले rough draft लिखें, फिर Word Counter से जाँचें और ज़रूरत के हिसाब से edit करें।</blockquote>`,
      },
      {
        id: 'social-media-character-limit',
        title: 'Social Media Character Limits (2026)',
        content: `<p>Social media पर हर platform का अपना character और word limit होता है। नीचे 2026 के updated limits दिए गए हैं:</p>
<table>
  <thead>
    <tr><th>Platform</th><th>Content Type</th><th>Character Limit</th><th>Tips</th></tr>
  </thead>
  <tbody>
    <tr><td>WhatsApp</td><td>Message</td><td>65,536 characters</td><td>Status: 700 characters</td></tr>
    <tr><td>Instagram</td><td>Caption</td><td>2,200 characters</td><td>पहले 125 chars ही दिखते हैं</td></tr>
    <tr><td>Instagram</td><td>Bio</td><td>150 characters</td><td>Keywords ज़रूर डालें</td></tr>
    <tr><td>Twitter / X</td><td>Tweet</td><td>280 characters</td><td>Hindi में ज़्यादा space लगती है</td></tr>
    <tr><td>Facebook</td><td>Post</td><td>63,206 characters</td><td>Optimal: 40–80 words</td></tr>
    <tr><td>YouTube</td><td>Title</td><td>100 characters</td><td>पहले 60 search में दिखते हैं</td></tr>
    <tr><td>YouTube</td><td>Description</td><td>5,000 characters</td><td>पहले 200 सबसे ज़रूरी</td></tr>
    <tr><td>LinkedIn</td><td>Post</td><td>3,000 characters</td><td>Optimal: 150–300 words</td></tr>
    <tr><td>Google Ads</td><td>Headline</td><td>30 characters</td><td>Description: 90 characters</td></tr>
  </tbody>
</table>
<h3>Hindi में Character Count क्यों अलग होती है?</h3>
<p>Devanagari script में मात्राएं (ि, ा, ी आदि) भी अलग characters count होती हैं। इसलिए Hindi में एक शब्द English के मुकाबले ज़्यादा characters ले सकता है। Twitter/X पर Hindi tweet लिखते समय इसका खास ध्यान रखें।</p>`,
      },
      {
        id: 'shabd-se-page',
        title: 'शब्द से पेज: कितने शब्द = कितने पेज?',
        content: `<p>यह सवाल बहुत common है — "1000 शब्द का निबंध कितने pages का होगा?" इसका जवाब font size और spacing पर निर्भर है।</p>
<table>
  <thead>
    <tr><th>शब्द संख्या</th><th>Single Space (A4)</th><th>Double Space (A4)</th><th>पढ़ने का समय</th></tr>
  </thead>
  <tbody>
    <tr><td>250 शब्द</td><td>~0.5 पेज</td><td>~1 पेज</td><td>~1 मिनट</td></tr>
    <tr><td>500 शब्द</td><td>~1 पेज</td><td>~2 पेज</td><td>~2 मिनट</td></tr>
    <tr><td>1,000 शब्द</td><td>~2 पेज</td><td>~4 पेज</td><td>~4 मिनट</td></tr>
    <tr><td>1,500 शब्द</td><td>~3 पेज</td><td>~6 पेज</td><td>~6 मिनट</td></tr>
    <tr><td>2,000 शब्द</td><td>~4 पेज</td><td>~8 पेज</td><td>~8 मिनट</td></tr>
    <tr><td>5,000 शब्द</td><td>~10 पेज</td><td>~20 पेज</td><td>~20 मिनट</td></tr>
  </tbody>
</table>
<p><strong>नोट:</strong> यह अनुमान 12pt Times New Roman और standard margins (2.5 cm) पर है। UPSC answer sheet पर एक page में लगभग 250–300 Hindi शब्द लिखे जा सकते हैं।</p>`,
      },
    ],
    howToSteps: [
      {
        title: 'ToolsArena Word Counter खोलें',
        description: 'ToolsArena.in पर जाएं और Word Counter टूल चुनें। बिल्कुल फ्री है, कोई account नहीं बनाना।',
      },
      {
        title: 'Text paste करें या टाइप करें',
        description: 'अपना निबंध, ब्लॉग पोस्ट या कोई भी text box में paste करें। Hindi और English दोनों support हैं।',
      },
      {
        title: 'Real-time stats देखें',
        description: 'टाइप करते ही शब्द संख्या, character count, sentence count और पढ़ने का समय automatically update होता है।',
      },
      {
        title: 'Target से compare करें',
        description: 'अपनी exam या assignment की word limit से compare करें। ज़रूरत हो तो content edit करें।',
      },
      {
        title: 'Social media के लिए character check करें',
        description: 'Instagram caption या Twitter post के लिए character count check करें और platform limit के अंदर रहें।',
      },
    ],
    faqs: [
      {
        question: 'शब्द गिनती कैसे करते हैं?',
        answer: 'ToolsArena के Word Counter टूल में अपना text paste करें — शब्द गिनती तुरंत दिख जाएगी। Microsoft Word में Ctrl+A से सब select करके नीचे status bar में word count दिखता है। Google Docs में भी नीचे left corner में automatically word count दिखता है।',
      },
      {
        question: 'क्या Hindi में word count होता है?',
        answer: 'हाँ, Hindi (Devanagari) में भी word count होता है। ToolsArena का word counter Hindi text को पूरी तरह support करता है। दो शब्दों के बीच space होने पर उन्हें अलग-अलग count किया जाता है।',
      },
      {
        question: '1000 शब्द कितने pages होते हैं?',
        answer: '1000 शब्द single-spaced A4 page पर लगभग 2 pages होते हैं (12pt font के साथ)। Double-spaced होने पर यही content करीब 4 pages में आता है। Hindi में font थोड़ा बड़ा होने से 2.5–3 pages भी हो सकता है।',
      },
      {
        question: 'Character count और word count में क्या फर्क है?',
        answer: 'Word count शब्दों की संख्या है (spaces से अलग), जबकि character count हर letter, number, space और punctuation mark को गिनता है। Social media के लिए character count ज़रूरी है, essays और blog posts के लिए word count use होता है।',
      },
      {
        question: 'Instagram caption की limit क्या है?',
        answer: 'Instagram caption की maximum limit 2,200 characters है। लेकिन feed में सिर्फ पहले 125 characters दिखते हैं, उसके बाद "more" button आता है। इसलिए सबसे important बात पहले 125 characters में लिखें।',
      },
    ],
    relatedGuides: ['bmi-calculator-guide', 'percentage-calculator-guide'],
    toolCTA: {
      heading: 'अभी Word Counter आज़माएं — बिल्कुल Free!',
      description: 'ToolsArena का फ्री Word Counter Hindi और English दोनों में काम करता है। Real-time में शब्द, अक्षर और पढ़ने का समय जानें — कोई signup नहीं, कोई limit नहीं।',
      buttonText: 'टूल खोलें →',
    },
  },

  // ── 2. BMI CALCULATOR ────────────────────────────────────────────
  {
    slug: 'bmi-calculator-guide',
    toolSlug: 'bmi-calculator',
    category: 'calculators',
    title: 'बीएमआई कैलकुलेटर गाइड: भारतीयों के लिए सही वजन और BMI की पूरी जानकारी',
    subtitle: 'WHO और ICMR के BMI मानकों के आधार पर जानें कि आपका वजन सही है या नहीं, और स्वस्थ BMI कैसे पाएं।',
    metaTitle: 'बीएमआई कैलकुलेटर - आपका सही वजन जानें',
    metaDescription: 'बीएमआई कैलकुलेटर से जानें आपका वजन सही है या नहीं। भारतीय ICMR मानक, height-weight chart और मोटापा कम करने के तरीके इस गाइड में पाएं।',
    targetKeyword: 'बीएमआई कैलकुलेटर',
    secondaryKeywords: [
      'BMI calculator online', 'आदर्श वजन', 'महिलाओं के लिए BMI',
      'पुरुषों के लिए BMI', 'मोटापा कम करने के तरीके', 'body mass index hindi',
      'height weight chart india', 'bmi calculator in hindi', 'भारतीय BMI मानक',
      'सही वजन कैलकुलेटर',
    ],
    lastUpdated: '2026-03-12',
    readingTime: '9 मिनट पढ़ें',
    tags: ['Health', 'Weight', 'Fitness', 'BMI'],
    intro: `<p><strong>बीएमआई कैलकुलेटर</strong> (Body Mass Index) एक सरल तरीका है जिससे आप अपनी height के अनुसार सही वजन जाँच सकते हैं। यह tool डॉक्टरों और health experts द्वारा दुनियाभर में उपयोग किया जाता है।</p>
<p>लेकिन एक ज़रूरी बात — भारतीयों के लिए BMI मानक WHO के global standards से थोड़े अलग हैं। ICMR के अनुसार, भारतीयों में 23 BMI से ऊपर भी overweight का खतरा हो सकता है। इस गाइड में हम यह सब विस्तार से समझेंगे।</p>`,
    sections: [
      {
        id: 'bmi-kya-hai',
        title: 'BMI क्या है और कैसे काम करता है?',
        content: `<p>BMI (Body Mass Index) आपके वजन (किलोग्राम में) को आपकी height (मीटर में) के वर्ग से divide करके निकाला जाता है।</p>
<h3>BMI Formula</h3>
<blockquote><strong>BMI = वजन (kg) ÷ [ऊंचाई (m)]²</strong></blockquote>
<p><strong>उदाहरण:</strong> वजन 70 kg और ऊंचाई 1.70 m — BMI = 70 ÷ (1.70 × 1.70) = 70 ÷ 2.89 = <strong>24.2</strong></p>
<h3>BMI के फायदे और सीमाएं</h3>
<ul>
  <li><strong>फायदा:</strong> जल्दी और आसानी से calculate होता है</li>
  <li><strong>फायदा:</strong> डॉक्टर initial health assessment के लिए use करते हैं</li>
  <li><strong>सीमा:</strong> muscle mass और fat mass में फर्क नहीं करता</li>
  <li><strong>सीमा:</strong> athletes में BMI high हो सकता है पर वे healthy होते हैं</li>
  <li><strong>सीमा:</strong> age और gender के हिसाब से अलग interpretation चाहिए</li>
</ul>`,
      },
      {
        id: 'bmi-range-chart',
        title: 'BMI Range Chart: आपका BMI कहाँ है?',
        content: `<p>नीचे WHO और ICMR दोनों के BMI ranges दिए गए हैं। भारतीयों के लिए ICMR का chart ज़्यादा relevant है।</p>
<table>
  <thead>
    <tr><th>BMI Range</th><th>WHO Category</th><th>ICMR Category (भारत)</th><th>क्या करें?</th></tr>
  </thead>
  <tbody>
    <tr><td>18.5 से कम</td><td>Underweight</td><td>Underweight</td><td>पोषण बढ़ाएं, डॉक्टर से मिलें</td></tr>
    <tr><td>18.5 – 22.9</td><td>Normal</td><td>Normal (भारत के लिए ideal)</td><td>स्वस्थ जीवनशैली बनाए रखें</td></tr>
    <tr><td>23.0 – 24.9</td><td>Normal</td><td>Overweight (risk शुरू)</td><td>Diet और exercise पर ध्यान दें</td></tr>
    <tr><td>25.0 – 27.4</td><td>Overweight</td><td>Obese Class I</td><td>Weight management शुरू करें</td></tr>
    <tr><td>27.5 – 32.4</td><td>Obese Class I</td><td>Obese Class II</td><td>डॉक्टर से परामर्श ज़रूरी</td></tr>
    <tr><td>32.5 और ऊपर</td><td>Obese Class II+</td><td>Obese Class III</td><td>तुरंत चिकित्सा सहायता लें</td></tr>
  </tbody>
</table>
<p><strong>महत्वपूर्ण:</strong> ICMR के अनुसार, भारतीयों में 23 BMI पर ही overweight का risk शुरू हो जाता है क्योंकि भारतीयों में समान BMI पर body fat percentage ज़्यादा होती है।</p>`,
      },
      {
        id: 'bhartiya-bmi-manak',
        title: 'भारतीयों के लिए BMI मानक (WHO vs ICMR)',
        content: `<p>भारत में height के अनुसार ideal वजन का practical chart — ICMR guidelines पर आधारित:</p>
<table>
  <thead>
    <tr><th>ऊंचाई</th><th>Ideal वजन (पुरुष)</th><th>Ideal वजन (महिला)</th><th>BMI Range</th></tr>
  </thead>
  <tbody>
    <tr><td>5'0" (152 cm)</td><td>43–55 kg</td><td>41–52 kg</td><td>18.5–23.9</td></tr>
    <tr><td>5'2" (157 cm)</td><td>46–58 kg</td><td>44–55 kg</td><td>18.5–23.9</td></tr>
    <tr><td>5'4" (163 cm)</td><td>49–62 kg</td><td>47–59 kg</td><td>18.5–23.9</td></tr>
    <tr><td>5'5" (165 cm)</td><td>50–63 kg</td><td>48–61 kg</td><td>18.5–23.9</td></tr>
    <tr><td>5'7" (170 cm)</td><td>54–68 kg</td><td>52–65 kg</td><td>18.5–23.9</td></tr>
    <tr><td>5'9" (175 cm)</td><td>57–72 kg</td><td>55–70 kg</td><td>18.5–23.9</td></tr>
    <tr><td>5'11" (180 cm)</td><td>61–77 kg</td><td>58–74 kg</td><td>18.5–23.9</td></tr>
    <tr><td>6'0" (183 cm)</td><td>63–80 kg</td><td>60–77 kg</td><td>18.5–23.9</td></tr>
  </tbody>
</table>
<h3>WHO और ICMR में मुख्य अंतर</h3>
<ul>
  <li>WHO का Overweight cutoff: <strong>25.0</strong> — ICMR का: <strong>23.0</strong></li>
  <li>WHO का Obese cutoff: <strong>30.0</strong> — ICMR का: <strong>27.5</strong></li>
</ul>
<p>भारतीयों में "thin-fat" phenomenon common है — बाहर से पतले दिखने पर भी अंदर से fat percentage अधिक होती है, जिससे diabetes और heart disease का risk बढ़ता है।</p>`,
      },
      {
        id: 'swasth-bmi-kaise-payen',
        title: 'स्वस्थ BMI कैसे पाएं?',
        content: `<p>BMI को normal range में लाने के लिए भारतीय जीवनशैली के लिए practical तरीके:</p>
<h3>खान-पान में बदलाव</h3>
<ul>
  <li>रोज़ाना कम से कम 5 रंग की सब्ज़ियाँ और फल खाएं</li>
  <li>रिफाइंड carbs (मैदा, सफेद चावल) कम करें, साबुत अनाज बढ़ाएं</li>
  <li>पानी दिन में 8–10 गिलास पिएं</li>
  <li>देर रात खाना बंद करें — रात 8 बजे के बाद कुछ न खाएं</li>
</ul>
<h3>व्यायाम की आदत</h3>
<ul>
  <li>हफ्ते में कम से कम 150 मिनट moderate exercise (तेज़ चलना)</li>
  <li>सुबह 30 मिनट की walk से शुरुआत करें</li>
  <li>Yoga और pranayama weight management में भी मददगार हैं</li>
</ul>
<h3>कब डॉक्टर से मिलें?</h3>
<p>अगर BMI 27.5 से ऊपर है, या तेज़ी से weight बढ़ रहा है, या थायरॉइड/PCOD जैसी कोई problem है — तो तुरंत doctor से मिलें।</p>`,
      },
    ],
    howToSteps: [
      {
        title: 'Height और Weight नोट करें',
        description: 'Height को cm में और weight को kg में नोट करें। 1 foot = 30.48 cm और 1 inch = 2.54 cm याद रखें।',
      },
      {
        title: 'BMI Calculator खोलें',
        description: 'ToolsArena के BMI Calculator टूल पर जाएं। Height और weight का unit (cm/kg या feet/lbs) select करें।',
      },
      {
        title: 'Values डालें',
        description: 'अपनी height और weight डालें। Calculator तुरंत BMI calculate करेगा।',
      },
      {
        title: 'BMI Category देखें',
        description: 'अपना BMI number देखें और ICMR chart से compare करें। Normal, Overweight या Underweight category पहचानें।',
      },
      {
        title: 'Action Plan बनाएं',
        description: 'BMI result के आधार पर diet और exercise plan बनाएं। ज़रूरत हो तो nutritionist या doctor से सलाह लें।',
      },
    ],
    faqs: [
      {
        question: '5.5 फुट में सही वजन क्या है?',
        answer: '5 फुट 5 इंच (165 cm) height के लिए ICMR के अनुसार ideal वजन पुरुषों के लिए 50–63 kg और महिलाओं के लिए 48–61 kg है। यह BMI 18.5–23.9 के बीच रखता है जो भारतीयों के लिए सबसे healthy माना जाता है।',
      },
      {
        question: 'महिलाओं के लिए ideal BMI क्या है?',
        answer: 'महिलाओं के लिए भी BMI की normal range 18.5–22.9 है (ICMR के अनुसार)। गर्भावस्था में BMI calculation अलग होती है। PCOD या थायरॉइड जैसी conditions में doctor से BMI interpret करवाएं।',
      },
      {
        question: 'BMI formula क्या है?',
        answer: 'BMI = वजन (kg) ÷ [ऊंचाई (m)]² — उदाहरण: 65 kg वजन और 1.65 m height पर BMI = 65 ÷ (1.65×1.65) = 65 ÷ 2.72 = 23.9, जो ICMR के अनुसार normal range की upper limit है।',
      },
      {
        question: 'क्या BMI सभी के लिए एक जैसा है?',
        answer: 'नहीं। BMI एक general indicator है। Athletes में muscle की वजह से BMI high हो सकता है पर वे healthy होते हैं। बच्चों और बुज़ुर्गों के लिए अलग BMI charts होते हैं। भारतीयों के लिए cutoff values global standards से अलग हैं।',
      },
      {
        question: 'मोटापे से क्या बीमारियाँ होती हैं?',
        answer: 'High BMI (मोटापा) से Type 2 Diabetes, High Blood Pressure, Heart Disease, Sleep Apnea, Joint Pain, Fatty Liver और कुछ types of cancer का risk बढ़ता है। भारत में diabetes और heart disease के बढ़ते मामलों का प्रमुख कारण बढ़ता हुआ BMI है।',
      },
    ],
    relatedGuides: ['age-calculator-guide', 'emi-calculator-guide'],
    toolCTA: {
      heading: 'अभी BMI Calculator आज़माएं — बिल्कुल Free!',
      description: 'ToolsArena का फ्री BMI Calculator सेकंडों में आपका BMI calculate करता है। Indian ICMR standards के अनुसार जानें आपका वजन सही है या नहीं।',
      buttonText: 'टूल खोलें →',
    },
  },

  // ── 3. IMAGE COMPRESSOR ──────────────────────────────────────────
  {
    slug: 'image-compressor-guide',
    toolSlug: 'image-compressor',
    category: 'image-tools',
    title: 'इमेज कंप्रेसर गाइड: WhatsApp, Instagram और Website के लिए Photo Compress करें',
    subtitle: 'बिना quality खोए photos की size कम करें — WhatsApp, Instagram, website और government forms के लिए पूरी जानकारी।',
    metaTitle: 'इमेज कंप्रेसर - Photo Compress करें फ्री में',
    metaDescription: 'इमेज कंप्रेसर से फोटो की size घटाएं बिना quality खोए। WhatsApp, Instagram, website और government form upload के लिए JPG, PNG compress करने की पूरी guide यहाँ पाएं।',
    targetKeyword: 'इमेज कंप्रेसर',
    secondaryKeywords: [
      'photo compress karna', 'image size kam karna', 'WhatsApp ke liye image compress',
      'jpg compress online', 'png compress free', 'photo optimize karna',
      'mobile mein image compress', 'image quality maintain karte hue compress',
      'bulk image compress', 'free image compressor hindi',
    ],
    lastUpdated: '2026-03-12',
    readingTime: '7 मिनट पढ़ें',
    tags: ['Image', 'Photo', 'Compression', 'WhatsApp'],
    intro: `<p><strong>इमेज कंप्रेसर</strong> एक ऐसा टूल है जो आपकी photo की file size कम करता है — बिना image की quality को बहुत ज़्यादा खराब किए। आज के समय में storage और internet bandwidth दोनों precious हैं, इसलिए image compression बेहद ज़रूरी है।</p>
<p>चाहे आप WhatsApp पर photo share करना चाहते हों, Instagram के लिए fast-loading images चाहते हों, या government form पर photo upload करनी हो — इस गाइड में सब कुछ step-by-step समझाया गया है।</p>`,
    sections: [
      {
        id: 'image-compress-kya-hai',
        title: 'Image Compression क्या है?',
        content: `<p>Image compression एक process है जिसमें image की file size कम की जाती है। यह दो तरीकों से होता है:</p>
<h3>Lossy Compression (Quality थोड़ी कम होती है)</h3>
<p>इसमें image के कुछ data को permanently हटा दिया जाता है। आँखों से यह अंतर बहुत कम दिखता है, लेकिन file size काफी कम हो जाती है। JPG/JPEG format इसी तरह काम करता है।</p>
<h3>Lossless Compression (Quality बिल्कुल same)</h3>
<p>इसमें data reorganize होता है लेकिन कुछ delete नहीं होता। PNG format mostly lossless है।</p>
<h3>Compression से पहले और बाद में</h3>
<table>
  <thead>
    <tr><th>Image Type</th><th>Original Size</th><th>Compressed (80%)</th><th>Size Reduction</th></tr>
  </thead>
  <tbody>
    <tr><td>Smartphone Photo (JPG)</td><td>5 MB</td><td>800 KB</td><td>84% कम</td></tr>
    <tr><td>Screenshot (PNG)</td><td>2 MB</td><td>600 KB</td><td>70% कम</td></tr>
    <tr><td>Logo (PNG Transparent)</td><td>500 KB</td><td>150 KB</td><td>70% कम</td></tr>
    <tr><td>Product Photo (JPG)</td><td>3 MB</td><td>400 KB</td><td>87% कम</td></tr>
    <tr><td>WebP (Modern Format)</td><td>1 MB</td><td>200 KB</td><td>80% कम</td></tr>
  </tbody>
</table>`,
      },
      {
        id: 'whatsapp-instagram-ke-liye',
        title: 'WhatsApp और Instagram के लिए Photo Compress',
        content: `<p>Social media platforms पर photos share करते समय size limit और quality दोनों का ध्यान रखना पड़ता है।</p>
<h3>WhatsApp के लिए</h3>
<ul>
  <li>WhatsApp automatically images को compress करता है — जिससे quality कम हो जाती है</li>
  <li>Original quality चाहिए तो image को <strong>Document के रूप में</strong> share करें</li>
  <li>WhatsApp की image limit 16 MB है, लेकिन 1 MB से कम रखना बेहतर है</li>
  <li>Best practice: 85% quality पर compress करके share करें</li>
</ul>
<h3>Instagram के लिए</h3>
<ul>
  <li>Feed post: recommended size <strong>1080 × 1080 px</strong> (square)</li>
  <li>Story: <strong>1080 × 1920 px</strong></li>
  <li>File size limit: 8 MB (JPG), 30 MB (PNG)</li>
  <li>अच्छी quality के लिए 85–90% compression use करें</li>
</ul>
<h3>Government Form Upload के लिए</h3>
<p>अधिकांश सरकारी websites पर photo upload की limit 50 KB या 100 KB होती है। इसके लिए JPG format use करें और ToolsArena Image Compressor में target size set करें।</p>`,
      },
      {
        id: 'image-format-comparison',
        title: 'JPG vs PNG vs WebP: कौन सा बेहतर?',
        content: `<p>हर image format का अपना use case है। सही format चुनने से file size automatically कम होती है।</p>
<table>
  <thead>
    <tr><th>Format</th><th>Best For</th><th>Typical Size</th><th>Transparency</th><th>Quality</th></tr>
  </thead>
  <tbody>
    <tr><td>JPG/JPEG</td><td>Photos, realistic images</td><td>सबसे छोटा</td><td>नहीं</td><td>Lossy</td></tr>
    <tr><td>PNG</td><td>Logos, screenshots, graphics</td><td>बड़ा</td><td>हाँ</td><td>Lossless</td></tr>
    <tr><td>WebP</td><td>Web images, modern sites</td><td>JPG से 30% छोटा</td><td>हाँ</td><td>दोनों</td></tr>
    <tr><td>GIF</td><td>Simple animations</td><td>मध्यम</td><td>Limited</td><td>Lossy</td></tr>
    <tr><td>AVIF</td><td>Next-gen web images</td><td>WebP से भी छोटा</td><td>हाँ</td><td>दोनों</td></tr>
  </tbody>
</table>
<h3>कौन सा format कब use करें?</h3>
<ul>
  <li><strong>Photo/selfie:</strong> JPG — सबसे छोटी size</li>
  <li><strong>Logo/icon:</strong> PNG — transparency support</li>
  <li><strong>Website:</strong> WebP — best quality + size combination</li>
  <li><strong>Government form:</strong> JPG — best compatibility</li>
</ul>`,
      },
      {
        id: 'website-image-optimization',
        title: 'Website और Blog के लिए Image Optimization',
        content: `<p>Website पर heavy images से page loading slow होती है जो Google ranking को directly affect करती है।</p>
<h3>Blog के लिए image guidelines</h3>
<ul>
  <li>Hero image: 1200×630 px, 100–150 KB से कम</li>
  <li>In-content images: 800×600 px, 80–100 KB से कम</li>
  <li>Thumbnail: 300×300 px, 30–50 KB से कम</li>
  <li>हमेशा <strong>alt text</strong> add करें — SEO और accessibility के लिए</li>
</ul>
<h3>Page Speed और SEO</h3>
<p>Google का Core Web Vitals score images की size से directly प्रभावित होता है। अगर website 3 seconds में load नहीं होती, तो 40% visitors चले जाते हैं। ToolsArena का Image Compressor multiple files को एक साथ process कर सकता है।</p>`,
      },
    ],
    howToSteps: [
      {
        title: 'Image Compressor टूल खोलें',
        description: 'ToolsArena.in पर Image Compressor टूल खोलें। Browser में काम करता है — कोई app install नहीं करनी।',
      },
      {
        title: 'Photo upload करें',
        description: 'अपनी JPG, PNG या WebP image को drag & drop करें या "Upload" button से select करें। Multiple files भी एक साथ upload हो सकती हैं।',
      },
      {
        title: 'Quality level set करें',
        description: 'Compression quality चुनें — 80–85% social media के लिए best है। Government forms के लिए 60–70% use करें।',
      },
      {
        title: 'Compress करें',
        description: '"Compress" button click करें। कुछ ही seconds में compressed image तैयार हो जाएगी।',
      },
      {
        title: 'Download करें',
        description: 'Compressed image download करें। Before/after size comparison देखें — आमतौर पर 60–85% size reduction होती है।',
      },
    ],
    faqs: [
      {
        question: 'WhatsApp पर image compress कैसे करें?',
        answer: 'ToolsArena के Image Compressor में photo upload करें, quality 80% set करें, download करें और WhatsApp पर share करें। अगर original quality चाहते हैं तो WhatsApp पर image को Document के रूप में send करें।',
      },
      {
        question: 'Image compression से quality खराब होती है क्या?',
        answer: '80–85% quality पर compression करने पर आँखों से कोई अंतर नहीं दिखता। 60% से नीचे जाने पर थोड़ा blurring दिख सकता है। Lossless PNG compression में बिल्कुल quality loss नहीं होती।',
      },
      {
        question: 'Website के लिए best image size क्या है?',
        answer: 'Blog hero image के लिए 1200×630 px और 150 KB से कम size ideal है। Product images के लिए 800×800 px और 100 KB से कम। इससे page fast load होता है और Google में ranking अच्छी रहती है।',
      },
      {
        question: 'Mobile पर image compress कैसे करें?',
        answer: 'ToolsArena का Image Compressor mobile browser पर काम करता है। Chrome या Safari खोलें, ToolsArena.in पर जाएं, Image Compressor select करें, gallery से photo चुनें और compress करें।',
      },
      {
        question: 'JPG या PNG कौन बेहतर है?',
        answer: 'Photos के लिए JPG बेहतर है — file size छोटी होती है। Logos और transparent background images के लिए PNG ज़रूरी है। Website के लिए WebP सबसे modern और efficient format है।',
      },
    ],
    relatedGuides: ['pdf-compressor-guide', 'qr-code-generator-guide'],
    toolCTA: {
      heading: 'अभी Image Compressor आज़माएं — बिल्कुल Free!',
      description: 'ToolsArena का फ्री Image Compressor JPG, PNG और WebP images को seconds में compress करता है। कोई watermark नहीं, कोई signup नहीं।',
      buttonText: 'टूल खोलें →',
    },
  },

  // ── 4. QR CODE GENERATOR ─────────────────────────────────────────
  {
    slug: 'qr-code-generator-guide',
    toolSlug: 'qr-code-generator',
    category: 'developer-tools',
    title: 'QR कोड जनरेटर गाइड: UPI Payment, WiFi और Business के लिए QR Code बनाएं',
    subtitle: 'PhonePe, Google Pay, Paytm के लिए UPI QR Code से लेकर WiFi और vCard QR Code तक — सब कुछ यहाँ सीखें।',
    metaTitle: 'QR कोड जनरेटर - फ्री में QR Code बनाएं',
    metaDescription: 'QR कोड जनरेटर से UPI payment, WiFi, URL और business card QR code बनाएं फ्री में। PhonePe, GPay, Paytm के लिए QR code कैसे बनाएं — पूरी जानकारी हिंदी में।',
    targetKeyword: 'QR कोड जनरेटर',
    secondaryKeywords: [
      'QR code kaise banate hain', 'QR code generator online free', 'UPI QR code banaye',
      'business ke liye QR code', 'WhatsApp QR code', 'WiFi QR code generator',
      'PhonePe QR code', 'Google Pay QR code', 'QR code scanner',
      'apna QR code banayein',
    ],
    lastUpdated: '2026-03-12',
    readingTime: '8 मिनट पढ़ें',
    tags: ['QR Code', 'UPI', 'Business', 'Digital Payment'],
    intro: `<p><strong>QR कोड जनरेटर</strong> से आप मिनटों में अपना खुद का QR code बना सकते हैं — चाहे UPI payment के लिए हो, अपनी website share करने के लिए, या WiFi password share करने के लिए। भारत में digital payments के बढ़ते चलन के साथ QR code बेहद popular हो गए हैं।</p>
<p>छोटे दुकानदार से लेकर बड़े business तक, restaurants से लेकर freelancers तक — सभी QR codes का उपयोग कर रहे हैं। इस गाइड में जानें कि अपना QR code कैसे बनाएं और इसे effectively कैसे use करें।</p>`,
    sections: [
      {
        id: 'qr-code-kya-hai',
        title: 'QR Code क्या है और कैसे काम करता है?',
        content: `<p>QR Code (Quick Response Code) एक 2D barcode है जिसमें text, URL, contact info या payment details जैसी information encode होती है। Smartphone camera से scan करने पर यह information तुरंत read हो जाती है।</p>
<h3>QR Code के प्रकार और उनके उपयोग</h3>
<table>
  <thead>
    <tr><th>QR Code Type</th><th>उपयोग</th><th>Example</th></tr>
  </thead>
  <tbody>
    <tr><td>URL QR Code</td><td>Website link share करना</td><td>toolsarena.in का QR code</td></tr>
    <tr><td>UPI QR Code</td><td>Payment receive करना</td><td>PhonePe, GPay, Paytm</td></tr>
    <tr><td>WiFi QR Code</td><td>WiFi password share करना</td><td>घर या office का WiFi</td></tr>
    <tr><td>vCard QR Code</td><td>Contact info share करना</td><td>Business card replacement</td></tr>
    <tr><td>SMS QR Code</td><td>Pre-filled SMS भेजना</td><td>Customer support</td></tr>
    <tr><td>Email QR Code</td><td>Email draft open करना</td><td>Feedback form</td></tr>
    <tr><td>Text QR Code</td><td>Plain text show करना</td><td>Instructions, disclaimers</td></tr>
  </tbody>
</table>
<h3>QR Code कैसे काम करता है?</h3>
<ul>
  <li>Information को black और white squares के pattern में encode किया जाता है</li>
  <li>Camera इस pattern को scan करके decode करता है</li>
  <li>Result automatically browser, UPI app, या contact book में open हो जाता है</li>
  <li>QR code को upside down या angle पर भी scan किया जा सकता है</li>
</ul>`,
      },
      {
        id: 'upi-payment-qr-code',
        title: 'UPI Payment QR Code कैसे बनाएं (PhonePe, GPay, Paytm)',
        content: `<p>भारत में UPI QR code सबसे ज़्यादा use होता है — दुकानदार, freelancers और businesses सभी payment receive करने के लिए इसे use करते हैं।</p>
<h3>UPI QR Code बनाने के तरीके</h3>
<ul>
  <li><strong>PhonePe App:</strong> Profile → Payment QR Code → Download</li>
  <li><strong>Google Pay:</strong> Home screen → अपना photo tap करें → Payment QR code</li>
  <li><strong>Paytm:</strong> Profile → QR Code → Share/Download</li>
  <li><strong>ToolsArena QR Generator:</strong> UPI ID डालें → Generate → Download high-quality QR</li>
</ul>
<h3>UPI QR Code format</h3>
<blockquote>upi://pay?pa=yourname@upi&amp;pn=Your+Name&amp;am=100&amp;cu=INR</blockquote>
<p><strong>pa</strong> = UPI ID, <strong>pn</strong> = Name, <strong>am</strong> = Amount (optional), <strong>cu</strong> = Currency</p>
<h3>Business के लिए UPI QR Code tips</h3>
<ul>
  <li>Amount blank रखें ताकि customer खुद amount enter करे</li>
  <li>QR code को print करके counter पर लगाएं</li>
  <li>High-resolution (300 DPI) image download करें print के लिए</li>
  <li>अपना नाम QR code के नीचे print करें verification के लिए</li>
</ul>`,
      },
      {
        id: 'qr-code-ke-prakar',
        title: 'QR Code के प्रकार और उनके उपयोग',
        content: `<p>अलग-अलग ज़रूरतों के लिए अलग-अलग QR codes बनाए जाते हैं। यहाँ सबसे popular use cases हैं:</p>
<h3>WiFi QR Code</h3>
<p>WiFi password share करना अब बेहद आसान है। ToolsArena में Network Name (SSID), Password और Security type (WPA2) डालें — QR code scan करते ही phone automatically connect हो जाएगा।</p>
<h3>Business Card QR Code (vCard)</h3>
<p>अपने business card पर QR code लगाएं — scan करने पर phone में automatically contact save हो जाएगा। इसमें name, phone, email, website और address सब encode होता है।</p>
<h3>WhatsApp QR Code</h3>
<p>WhatsApp number share करने के लिए: <code>https://wa.me/91XXXXXXXXXX</code> का QR code बनाएं। Scan करते ही WhatsApp chat directly open हो जाएगी।</p>
<h3>Restaurant Menu QR Code</h3>
<p>COVID के बाद restaurants में digital menu का चलन बढ़ा है। Menu PDF का link या Google Drive link का QR code बनाकर table पर लगाएं।</p>`,
      },
      {
        id: 'qr-code-scan-kaise-karein',
        title: 'QR Code Scan कैसे करें (iPhone/Android)',
        content: `<p>QR code scan करना बेहद आसान है — ज़्यादातर phones में built-in scanner होता है।</p>
<h3>Android पर QR Code Scan</h3>
<ul>
  <li>Camera app खोलें और QR code पर point करें — automatically scan हो जाएगा</li>
  <li>अगर camera से नहीं हो रहा तो Google Lens use करें</li>
  <li>PhonePe, GPay में scan &amp; pay का option होता है</li>
</ul>
<h3>iPhone पर QR Code Scan</h3>
<ul>
  <li>Default Camera app से directly QR code scan होता है (iOS 11+)</li>
  <li>Control Centre में QR code scanner shortcut add कर सकते हैं</li>
  <li>Wallet app से payment QR codes scan होते हैं</li>
</ul>
<p><strong>नोट:</strong> 2020 के बाद ज़्यादातर Android और iPhone में built-in QR scanner है — अलग app install करने की ज़रूरत नहीं।</p>`,
      },
    ],
    howToSteps: [
      {
        title: 'QR Code Generator खोलें',
        description: 'ToolsArena.in पर जाएं और QR Code Generator टूल select करें।',
      },
      {
        title: 'QR Code का type चुनें',
        description: 'URL, UPI Payment, WiFi, vCard, या Text में से जो चाहिए वो select करें।',
      },
      {
        title: 'Information डालें',
        description: 'URL के लिए website address, UPI के लिए UPI ID, WiFi के लिए network name और password डालें।',
      },
      {
        title: 'QR Code Generate करें',
        description: '"Generate" button click करें। आपका QR code तुरंत तैयार हो जाएगा।',
      },
      {
        title: 'Download और Use करें',
        description: 'High-resolution PNG या SVG में download करें। Print के लिए 300 DPI या ज़्यादा की size चुनें।',
      },
    ],
    faqs: [
      {
        question: 'QR code free में बना सकते हैं?',
        answer: 'हाँ, ToolsArena का QR Code Generator बिल्कुल फ्री है। URL, UPI, WiFi, vCard और text QR codes बिना किसी cost के बनाएं। कोई account नहीं बनाना, कोई watermark नहीं।',
      },
      {
        question: 'QR code कितने समय तक valid रहता है?',
        answer: 'Static QR codes (जिनमें fix information है) हमेशा के लिए valid रहते हैं जब तक वो information valid है। UPI QR code तब तक काम करेगा जब तक आपका UPI ID active है।',
      },
      {
        question: 'UPI QR code कैसे बनाएं?',
        answer: 'ToolsArena QR Generator में "UPI Payment" select करें, अपनी UPI ID (जैसे name@paytm या number@upi) डालें, name add करें, और Generate करें। यह QR code PhonePe, Google Pay, Paytm सभी से scan होगा।',
      },
      {
        question: 'QR code scan करने के लिए app चाहिए?',
        answer: '2020 के बाद ज़्यादातर Android और iPhone में built-in QR scanner है। Android पर Camera app से और iPhone पर भी Camera app से directly scan होता है। अलग app की ज़रूरत नहीं।',
      },
      {
        question: 'Business के लिए कौन सा QR code बनाएं?',
        answer: 'दुकान के लिए UPI Payment QR code और URL QR code menu/website के लिए बनाएं। Visiting card पर vCard QR code लगाएं। Office WiFi के लिए WiFi QR code बनाएं — guests को password टाइप नहीं करना पड़ेगा।',
      },
    ],
    relatedGuides: ['image-compressor-guide', 'pdf-compressor-guide'],
    toolCTA: {
      heading: 'अभी QR Code Generator आज़माएं — बिल्कुल Free!',
      description: 'ToolsArena से UPI, WiFi, URL और vCard QR codes seconds में बनाएं। High-quality PNG download करें — कोई signup नहीं, कोई watermark नहीं।',
      buttonText: 'टूल खोलें →',
    },
  },

  // ── 5. AGE CALCULATOR ────────────────────────────────────────────
  {
    slug: 'age-calculator-guide',
    toolSlug: 'age-calculator',
    category: 'calculators',
    title: 'उम्र कैलकुलेटर गाइड: सरकारी परीक्षाओं की Age Limit और जन्म तिथि से उम्र जानें',
    subtitle: 'SSC, UPSC, Railway, Bank परीक्षाओं की age limit और school admission age — सब कुछ एक जगह।',
    metaTitle: 'उम्र कैलकुलेटर - जन्म तिथि से उम्र जानें',
    metaDescription: 'उम्र कैलकुलेटर से जन्म तिथि से exact उम्र (साल, महीना, दिन) निकालें। SSC, UPSC, Railway, Bank exam age limits और school admission age की पूरी जानकारी पाएं।',
    targetKeyword: 'उम्र कैलकुलेटर',
    secondaryKeywords: [
      'age calculator in hindi', 'janm tithi se umra', 'government exam age check',
      'aayu kalkuletar', 'kitne saal ka hun', 'birthday tak ke din',
      'Aadhaar age verify', 'SSC UPSC age limit', 'school admission age india',
      'age calculator years months days',
    ],
    lastUpdated: '2026-03-12',
    readingTime: '8 मिनट पढ़ें',
    tags: ['Age', 'Government Exam', 'SSC', 'UPSC', 'School Admission'],
    intro: `<p><strong>उम्र कैलकुलेटर</strong> से आप अपनी जन्म तिथि डालकर exact उम्र जान सकते हैं — साल, महीने और दिन में। यह tool सरकारी नौकरी की तैयारी करने वालों के लिए विशेष रूप से उपयोगी है, जहाँ age eligibility check करना बेहद ज़रूरी है।</p>
<p>SSC, UPSC, Railway, Banking — हर परीक्षा में age limit अलग होती है। इस गाइड में 2026 के updated age limits और state-wise school admission age की पूरी जानकारी दी गई है।</p>`,
    sections: [
      {
        id: 'umra-calculator-kaise-use-karein',
        title: 'उम्र कैलकुलेटर कैसे उपयोग करें?',
        content: `<p>उम्र calculate करना बेहद simple है, लेकिन सरकारी परीक्षाओं में exact calculation ज़रूरी होती है।</p>
<h3>Exact Age क्यों ज़रूरी है?</h3>
<ul>
  <li>सरकारी परीक्षाओं में age limit की last date तक exact उम्र चेक होती है</li>
  <li>School admission में cutoff date पर उम्र check होती है</li>
  <li>Passport और Aadhaar में age verification होती है</li>
  <li>Insurance और pension schemes में age eligibility होती है</li>
</ul>
<h3>Age Calculator में क्या-क्या मिलता है?</h3>
<ul>
  <li>साल, महीने और दिन में exact उम्र</li>
  <li>किसी specific date पर उम्र (जैसे exam की last date पर)</li>
  <li>अगले birthday तक कितने दिन बचे</li>
  <li>Total days/weeks/months में उम्र</li>
</ul>`,
      },
      {
        id: 'government-exam-age-limit',
        title: 'सरकारी परीक्षाओं के लिए उम्र सीमा (2026)',
        content: `<p>भारत की प्रमुख सरकारी परीक्षाओं की age limits — SC/ST/OBC/PwD candidates को अतिरिक्त relaxation मिलती है:</p>
<table>
  <thead>
    <tr><th>परीक्षा</th><th>Min Age</th><th>General Max</th><th>OBC (+3)</th><th>SC/ST (+5)</th></tr>
  </thead>
  <tbody>
    <tr><td>SSC CGL</td><td>18</td><td>32</td><td>35</td><td>37</td></tr>
    <tr><td>SSC CHSL</td><td>18</td><td>27</td><td>30</td><td>32</td></tr>
    <tr><td>UPSC IAS/IPS</td><td>21</td><td>32</td><td>35</td><td>37</td></tr>
    <tr><td>Railway Group D</td><td>18</td><td>33</td><td>36</td><td>38</td></tr>
    <tr><td>IBPS PO (Bank)</td><td>20</td><td>30</td><td>33</td><td>35</td></tr>
    <tr><td>SBI PO</td><td>21</td><td>30</td><td>33</td><td>35</td></tr>
    <tr><td>Indian Army (Soldier)</td><td>17.5</td><td>21</td><td>—</td><td>—</td></tr>
    <tr><td>CISF/CRPF Constable</td><td>18</td><td>23</td><td>26</td><td>28</td></tr>
    <tr><td>NDA Exam</td><td>16.5</td><td>19.5</td><td>—</td><td>—</td></tr>
  </tbody>
</table>
<p><strong>महत्वपूर्ण:</strong> Age limit की calculation exam notification में दी गई cutoff date पर होती है, आवेदन की तारीख पर नहीं। हमेशा official notification पढ़ें।</p>`,
      },
      {
        id: 'school-admission-age',
        title: 'स्कूल एडमिशन के लिए उम्र (State-wise)',
        content: `<p>भारत में Class 1 admission के लिए minimum age अलग-अलग states में अलग है:</p>
<table>
  <thead>
    <tr><th>State</th><th>Class 1 Minimum Age</th><th>Cutoff Date</th></tr>
  </thead>
  <tbody>
    <tr><td>Delhi</td><td>6 वर्ष</td><td>31 March</td></tr>
    <tr><td>Maharashtra</td><td>6 वर्ष</td><td>30 June</td></tr>
    <tr><td>Uttar Pradesh</td><td>6 वर्ष</td><td>31 March</td></tr>
    <tr><td>Rajasthan</td><td>6 वर्ष</td><td>31 March</td></tr>
    <tr><td>Gujarat</td><td>6 वर्ष</td><td>31 May</td></tr>
    <tr><td>Karnataka</td><td>6 वर्ष</td><td>31 May</td></tr>
    <tr><td>Tamil Nadu</td><td>5 वर्ष</td><td>31 May</td></tr>
    <tr><td>West Bengal</td><td>5+ वर्ष</td><td>31 December</td></tr>
    <tr><td>Bihar</td><td>6 वर्ष</td><td>31 March</td></tr>
    <tr><td>Madhya Pradesh</td><td>6 वर्ष</td><td>31 March</td></tr>
  </tbody>
</table>
<p>KG/Nursery के लिए minimum age 3–4 साल होती है। Private schools की अपनी policies हो सकती हैं।</p>`,
      },
      {
        id: 'janm-sal-se-umra-table',
        title: 'जन्म वर्ष से उम्र जानें (1960–2005 Table)',
        content: `<p>2026 में इन जन्म वर्षों के लोगों की approximate उम्र (birthday के बाद):</p>
<table>
  <thead>
    <tr><th>जन्म वर्ष</th><th>2026 में उम्र</th><th>जन्म वर्ष</th><th>2026 में उम्र</th></tr>
  </thead>
  <tbody>
    <tr><td>1960</td><td>65–66 वर्ष</td><td>1985</td><td>40–41 वर्ष</td></tr>
    <tr><td>1965</td><td>60–61 वर्ष</td><td>1990</td><td>35–36 वर्ष</td></tr>
    <tr><td>1970</td><td>55–56 वर्ष</td><td>1994</td><td>31–32 वर्ष</td></tr>
    <tr><td>1975</td><td>50–51 वर्ष</td><td>1997</td><td>28–29 वर्ष</td></tr>
    <tr><td>1980</td><td>45–46 वर्ष</td><td>2000</td><td>25–26 वर्ष</td></tr>
    <tr><td>1983</td><td>42–43 वर्ष</td><td>2003</td><td>22–23 वर्ष</td></tr>
    <tr><td>1984</td><td>41–42 वर्ष</td><td>2005</td><td>20–21 वर्ष</td></tr>
  </tbody>
</table>
<p><strong>नोट:</strong> Exact उम्र के लिए ToolsArena Age Calculator में actual date of birth डालें।</p>`,
      },
    ],
    howToSteps: [
      {
        title: 'Age Calculator खोलें',
        description: 'ToolsArena.in पर Age Calculator टूल खोलें।',
      },
      {
        title: 'जन्म तिथि डालें',
        description: 'अपनी date of birth — दिन, महीना और साल — डालें। Aadhaar card या जन्म प्रमाण पत्र से exact date use करें।',
      },
      {
        title: 'Reference Date चुनें',
        description: 'आज की date automatically होगी। Exam eligibility check के लिए exam notification में दी गई cutoff date डालें।',
      },
      {
        title: 'Calculate करें',
        description: '"Calculate" button click करें। साल, महीने और दिन में exact उम्र दिखेगी।',
      },
      {
        title: 'Result note करें',
        description: 'अपनी उम्र note करें और exam की minimum व maximum age limit से compare करें।',
      },
    ],
    faqs: [
      {
        question: 'SSC CGL के लिए उम्र सीमा क्या है?',
        answer: 'SSC CGL के लिए minimum 18 और maximum 32 वर्ष (General category) है। OBC candidates को 3 साल और SC/ST को 5 साल की relaxation मिलती है। Age की calculation notification में दी गई date पर होती है।',
      },
      {
        question: 'उम्र में साल महीना दिन कैसे निकालते हैं?',
        answer: 'ToolsArena Age Calculator में जन्म तिथि डालने पर automatically exact साल, महीने और दिन में उम्र calculate होती है। यह leap years और अलग-अलग महीनों के दिनों को automatically consider करता है।',
      },
      {
        question: 'Aadhaar में उम्र गलत है तो क्या करें?',
        answer: 'अगर Aadhaar में DOB गलत है तो UIDAI की website (uidai.gov.in) या नज़दीकी Aadhaar center पर जाकर correction करा सकते हैं। Birth certificate, 10वीं की marksheet या hospital birth record proof के रूप में submit करें।',
      },
      {
        question: 'कितने साल का हूँ — calculator से कैसे जानें?',
        answer: 'ToolsArena Age Calculator में अपनी date of birth डालें। Calculator तुरंत बताएगा आप कितने साल, महीने और दिन के हैं। साथ ही अगला birthday कितने दिन बाद है यह भी दिखेगा।',
      },
      {
        question: '10वीं कक्षा के लिए minimum age क्या है?',
        answer: 'CBSE Board के अनुसार Class 10 exam देने के लिए minimum 14 वर्ष की उम्र होनी चाहिए। State boards की अलग requirements हो सकती हैं। Class 1 में 6 साल की उम्र से admission शुरू होती है, इसलिए Class 10 में 14–16 वर्ष की उम्र सामान्य है।',
      },
    ],
    relatedGuides: ['bmi-calculator-guide', 'emi-calculator-guide'],
    toolCTA: {
      heading: 'अभी Age Calculator आज़माएं — बिल्कुल Free!',
      description: 'ToolsArena का फ्री Age Calculator साल, महीने और दिन में exact उम्र बताता है। Exam eligibility check करें किसी भी date पर।',
      buttonText: 'टूल खोलें →',
    },
  },


  // ── 6. PERCENTAGE CALCULATOR ─────────────────────────────────────
  {
    slug: 'percentage-calculator-guide',
    toolSlug: 'percentage-calculator',
    category: 'calculators',
    title: 'प्रतिशत कैलकुलेटर गाइड: GST, Discount, Exam Marks और Profit-Loss Percentage निकालें',
    subtitle: 'प्रतिशत के सभी formulas — GST calculation, exam marks percentage, discount और profit-loss — आसान भाषा में।',
    metaTitle: 'प्रतिशत कैलकुलेटर - GST, Discount % निकालें',
    metaDescription: 'प्रतिशत कैलकुलेटर से GST calculate करें, exam marks का percentage निकालें, discount और profit-loss जानें। सभी percentage formulas हिंदी में — फ्री ऑनलाइन टूल।',
    targetKeyword: 'प्रतिशत कैलकुलेटर',
    secondaryKeywords: [
      'percentage kaise nikalte hain', 'GST calculate karna', 'discount percentage calculator',
      'exam marks percentage', 'profit loss percentage', 'percentage formula hindi',
      '18% GST calculate', 'percentage increase decrease', 'percentage ka formula',
      'pratishat calculator',
    ],
    lastUpdated: '2026-03-12',
    readingTime: '8 मिनट पढ़ें',
    tags: ['Calculator', 'GST', 'Discount', 'Exam', 'Finance'],
    intro: `<p><strong>प्रतिशत कैलकुलेटर</strong> एक ऐसा tool है जो रोज़मर्रा की ज़िंदगी में हर जगह काम आता है। Shopping में discount calculate करना हो, GST के साथ price निकालनी हो, exam में percentage check करनी हो, या business में profit-loss — प्रतिशत की समझ सभी को होनी चाहिए।</p>
<p>इस गाइड में हम प्रतिशत के सभी ज़रूरी formulas, GST calculation tables, और practical examples के साथ सब कुछ आसान Hindi में समझेंगे।</p>`,
    sections: [
      {
        id: 'pratishat-formula',
        title: 'प्रतिशत का फॉर्मूला और गणना',
        content: `<p>प्रतिशत (%) का मतलब है "प्रति सौ" — यानी 100 में से कितना। यहाँ सभी काम आने वाले formulas दिए गए हैं:</p>
<table>
  <thead>
    <tr><th>प्रश्न</th><th>Formula</th><th>उदाहरण</th></tr>
  </thead>
  <tbody>
    <tr><td>X का Y% कितना है?</td><td>(Y ÷ 100) × X</td><td>500 का 18% = (18÷100)×500 = 90</td></tr>
    <tr><td>X, Y का कितना % है?</td><td>(X ÷ Y) × 100</td><td>45, 180 का = (45÷180)×100 = 25%</td></tr>
    <tr><td>X से Y तक % वृद्धि</td><td>[(Y-X) ÷ X] × 100</td><td>100 से 120: [(120-100)÷100]×100 = 20%</td></tr>
    <tr><td>X से Y तक % कमी</td><td>[(X-Y) ÷ X] × 100</td><td>200 से 150: [(200-150)÷200]×100 = 25%</td></tr>
    <tr><td>Z% बढ़ने के बाद price</td><td>X × (1 + Z÷100)</td><td>1000 पर 10% वृद्धि = 1000×1.10 = 1100</td></tr>
    <tr><td>Z% discount के बाद price</td><td>X × (1 - Z÷100)</td><td>800 पर 25% off = 800×0.75 = 600</td></tr>
  </tbody>
</table>
<h3>Mental Math Tricks</h3>
<ul>
  <li><strong>10%</strong> निकालने के लिए — number को 10 से divide करें</li>
  <li><strong>5%</strong> निकालने के लिए — 10% का आधा</li>
  <li><strong>1%</strong> निकालने के लिए — number को 100 से divide करें</li>
  <li><strong>20%</strong> = 10% × 2</li>
  <li><strong>15%</strong> = 10% + 5%</li>
</ul>`,
      },
      {
        id: 'gst-calculate-karna',
        title: 'GST Calculate कैसे करें (5%, 12%, 18%, 28%)',
        content: `<p>भारत में GST (Goods and Services Tax) 4 slabs में है। नीचे सभी slabs के examples दिए गए हैं:</p>
<table>
  <thead>
    <tr><th>GST Slab</th><th>किन चीज़ों पर</th><th>₹1,000 पर GST</th><th>Total Price</th></tr>
  </thead>
  <tbody>
    <tr><td>0% (Exempt)</td><td>अनाज, दूध, सब्ज़ियाँ, books</td><td>₹0</td><td>₹1,000</td></tr>
    <tr><td>5%</td><td>Packaged food, transport, medicine</td><td>₹50</td><td>₹1,050</td></tr>
    <tr><td>12%</td><td>Mobile phones, computers, textiles</td><td>₹120</td><td>₹1,120</td></tr>
    <tr><td>18%</td><td>Restaurants, electronics, AC</td><td>₹180</td><td>₹1,180</td></tr>
    <tr><td>28%</td><td>Luxury items, cars, cigarettes</td><td>₹280</td><td>₹1,280</td></tr>
  </tbody>
</table>
<h3>GST Inclusive Price से Original Price निकालना</h3>
<p>अगर price में GST already include है और आप base price निकालना चाहते हैं:</p>
<blockquote>Base Price = Total Price ÷ (1 + GST Rate÷100)</blockquote>
<p><strong>उदाहरण:</strong> ₹1,180 में 18% GST है — Base Price = 1180 ÷ 1.18 = <strong>₹1,000</strong></p>
<h3>Restaurant Bill पर GST</h3>
<ul>
  <li>AC restaurant: 18% GST (CGST 9% + SGST 9%)</li>
  <li>Non-AC restaurant: 5% GST</li>
  <li>Swiggy/Zomato delivery: 5% GST</li>
</ul>`,
      },
      {
        id: 'exam-marks-percentage',
        title: 'परीक्षा में Percentage कैसे निकालें?',
        content: `<p>Exam marks का percentage निकालना बेहद आसान है। Formula है: (प्राप्त अंक ÷ कुल अंक) × 100</p>
<h3>Examples</h3>
<ul>
  <li>500 में से 425 अंक: (425 ÷ 500) × 100 = <strong>85%</strong></li>
  <li>600 में से 492 अंक: (492 ÷ 600) × 100 = <strong>82%</strong></li>
  <li>CGPA 8.5 से percentage: 8.5 × 9.5 = <strong>80.75%</strong> (approx)</li>
</ul>
<h3>Grade और Percentage का संबंध</h3>
<table>
  <thead>
    <tr><th>Percentage</th><th>Grade (CBSE)</th><th>Division</th></tr>
  </thead>
  <tbody>
    <tr><td>90%–100%</td><td>A1</td><td>Distinction</td></tr>
    <tr><td>80%–89%</td><td>A2</td><td>First Division</td></tr>
    <tr><td>70%–79%</td><td>B1</td><td>First Division</td></tr>
    <tr><td>60%–69%</td><td>B2</td><td>Second Division</td></tr>
    <tr><td>50%–59%</td><td>C1</td><td>Second Division</td></tr>
    <tr><td>33%–49%</td><td>C2/D</td><td>Pass</td></tr>
    <tr><td>33% से कम</td><td>E (Fail)</td><td>Fail</td></tr>
  </tbody>
</table>`,
      },
      {
        id: 'discount-profit-loss',
        title: 'Discount, Profit और Loss का Percentage',
        content: `<p>Shopping में discount और business में profit/loss calculate करना रोज़मर्रा की ज़रूरत है।</p>
<h3>Discount Calculation</h3>
<ul>
  <li><strong>Discount Amount</strong> = (Discount% ÷ 100) × MRP</li>
  <li><strong>Selling Price</strong> = MRP − Discount Amount</li>
  <li><strong>उदाहरण:</strong> ₹2,000 MRP पर 30% off: Discount = ₹600, Selling Price = ₹1,400</li>
</ul>
<h3>Profit और Loss Percentage</h3>
<ul>
  <li><strong>Profit%</strong> = [(Selling Price − Cost Price) ÷ Cost Price] × 100</li>
  <li><strong>Loss%</strong> = [(Cost Price − Selling Price) ÷ Cost Price] × 100</li>
  <li><strong>उदाहरण:</strong> ₹500 में खरीदा, ₹650 में बेचा: Profit = ₹150, Profit% = (150÷500)×100 = <strong>30%</strong></li>
</ul>
<h3>Successive Discounts</h3>
<p>अगर दो discounts एक साथ हों जैसे 20% + 10% off, तो total discount 30% नहीं होता। Actual formula:</p>
<blockquote>Total Discount% = A + B − (A×B÷100) = 20 + 10 − (200÷100) = <strong>28%</strong></blockquote>`,
      },
    ],
    howToSteps: [
      {
        title: 'Percentage Calculator खोलें',
        description: 'ToolsArena.in पर Percentage Calculator टूल खोलें।',
      },
      {
        title: 'Calculation type चुनें',
        description: 'Basic percentage, GST calculator, discount calculator, या profit/loss calculator में से चुनें।',
      },
      {
        title: 'Values डालें',
        description: 'Amount और percentage rate डालें। GST के लिए product price और GST slab चुनें।',
      },
      {
        title: 'Calculate करें',
        description: '"Calculate" button click करें। Result तुरंत दिखेगा।',
      },
      {
        title: 'Result use करें',
        description: 'GST amount, discounted price, या exam percentage note करें।',
      },
    ],
    faqs: [
      {
        question: '500 का 18% कितना होता है?',
        answer: '500 का 18% = (18 ÷ 100) × 500 = 90 होता है। यानी 500 रुपए पर 18% GST = ₹90, और total bill = ₹590। ToolsArena के Percentage Calculator में directly calculate करें।',
      },
      {
        question: 'GST के साथ price कैसे calculate करें?',
        answer: 'GST के साथ price = Original Price × (1 + GST%/100)। उदाहरण: ₹1000 पर 18% GST = ₹1000 × 1.18 = ₹1,180। अगर GST inclusive price से original निकालना हो तो: ₹1,180 ÷ 1.18 = ₹1,000।',
      },
      {
        question: 'Discount के बाद price कैसे निकालें?',
        answer: 'Discounted Price = MRP × (1 − Discount%/100)। Example: ₹2,000 पर 25% discount = ₹2,000 × 0.75 = ₹1,500। Discount amount = ₹2,000 − ₹1,500 = ₹500।',
      },
      {
        question: 'Percentage increase formula क्या है?',
        answer: 'Percentage Increase = [(New Value − Old Value) ÷ Old Value] × 100। Example: salary ₹20,000 से ₹25,000 हुई: Increase = [(25,000−20,000)÷20,000]×100 = 25% increase।',
      },
      {
        question: 'School में percentage कैसे निकलता है?',
        answer: 'School percentage = (प्राप्त कुल अंक ÷ अधिकतम कुल अंक) × 100। अगर सभी subjects में 500 में से 425 मिले तो percentage = (425÷500)×100 = 85%। CGPA से percentage के लिए CGPA × 9.5 करें।',
      },
    ],
    relatedGuides: ['emi-calculator-guide', 'age-calculator-guide'],
    toolCTA: {
      heading: 'अभी Percentage Calculator आज़माएं — बिल्कुल Free!',
      description: 'ToolsArena का फ्री Percentage Calculator GST, discount, exam marks और profit-loss सब calculate करता है। कोई signup नहीं।',
      buttonText: 'टूल खोलें →',
    },
  },

  // ── 7. PDF COMPRESSOR ────────────────────────────────────────────
  {
    slug: 'pdf-compressor-guide',
    toolSlug: 'pdf-compressor',
    category: 'pdf-tools',
    title: 'PDF कंप्रेसर गाइड: सरकारी फॉर्म, Email और WhatsApp के लिए PDF Compress करें',
    subtitle: 'बड़ी PDF files को छोटा करें बिना quality खोए — government portals, email और WhatsApp के लिए size limits की पूरी जानकारी।',
    metaTitle: 'PDF कंप्रेसर - PDF Size कम करें फ्री में',
    metaDescription: 'PDF कंप्रेसर से बड़ी PDF files छोटी करें बिना quality खोए। सरकारी form upload, email और WhatsApp के लिए PDF size limits और compress करने की पूरी guide हिंदी में।',
    targetKeyword: 'PDF कंप्रेसर',
    secondaryKeywords: [
      'PDF size kam karna', 'PDF compress kaise karein', 'badi PDF choti karna',
      'PDF compressor online free', 'email ke liye PDF compress', 'PDF quality maintain karna',
      'PDF compress without quality loss', 'government form PDF compress',
      'mobile mein PDF compress', 'PDF file size limit',
    ],
    lastUpdated: '2026-03-12',
    readingTime: '7 मिनट पढ़ें',
    tags: ['PDF', 'Compression', 'Government Forms', 'Email'],
    intro: `<p><strong>PDF कंप्रेसर</strong> एक ऐसा tool है जो बड़ी PDF files की size को कम करता है — बिना content या quality को नुकसान पहुँचाए। आज के digital India में PDF files हर जगह use होती हैं — सरकारी forms, certificates, marksheets, resumes और business documents।</p>
<p>अक्सर government portal पर PDF upload करते समय "File too large" error आता है। इस गाइड में हम जानेंगे कि PDF compress कैसे करें और कहाँ-कहाँ कितनी size limit होती है।</p>`,
    sections: [
      {
        id: 'pdf-compress-kyon',
        title: 'PDF Compress क्यों ज़रूरी है?',
        content: `<p>PDF compress करने की ज़रूरत कई situations में पड़ती है:</p>
<h3>सरकारी Portal पर Upload</h3>
<p>UPSC, SSC, Railway, Income Tax, DigiLocker जैसे government portals पर PDF upload की strict size limit होती है — अक्सर 100 KB से 1 MB तक। बड़ी file को compress करना ज़रूरी होता है।</p>
<h3>Email Attachment</h3>
<p>Gmail की attachment limit 25 MB है, लेकिन office email servers अक्सर 5–10 MB से ज़्यादा accept नहीं करते। Professional documents email करते समय PDF compress करना professional practice है।</p>
<h3>WhatsApp और Cloud Storage</h3>
<p>WhatsApp पर document send करने की limit 100 MB है, पर छोटी files faster transfer होती हैं। Google Drive और OneDrive पर storage बचाने के लिए भी compression useful है।</p>
<h3>Website पर Upload</h3>
<p>Blogs, job portals और e-commerce sites पर PDF menus, catalogs और brochures upload करते समय small file size से loading fast होती है।</p>`,
      },
      {
        id: 'pdf-compress-kaise-karein',
        title: 'PDF Compress कैसे करें (Step by Step)',
        content: `<p>ToolsArena के PDF Compressor से PDF compress करना बेहद आसान है:</p>
<h3>ToolsArena PDF Compressor (Recommended)</h3>
<ol>
  <li>ToolsArena.in पर PDF Compressor खोलें</li>
  <li>PDF file drag &amp; drop करें या upload button से select करें</li>
  <li>Compression level चुनें (Low/Medium/High)</li>
  <li>"Compress PDF" button click करें</li>
  <li>Compressed PDF download करें</li>
</ol>
<h3>Compression Levels</h3>
<ul>
  <li><strong>Low Compression:</strong> Quality लगभग same, size 30–40% कम</li>
  <li><strong>Medium Compression:</strong> Good balance, size 50–60% कम</li>
  <li><strong>High Compression:</strong> Size maximum कम, quality थोड़ी कम</li>
</ul>
<h3>Mobile पर PDF Compress</h3>
<p>Mobile browser में ToolsArena.in खोलें → PDF Compressor → Upload करें → Compress → Download। किसी app की ज़रूरत नहीं।</p>`,
      },
      {
        id: 'document-upload-size-limits',
        title: 'सरकारी फॉर्म और Document Upload Size Limits',
        content: `<p>भारत के प्रमुख government portals और platforms के PDF size limits:</p>
<table>
  <thead>
    <tr><th>Platform / Portal</th><th>PDF Size Limit</th><th>Notes</th></tr>
  </thead>
  <tbody>
    <tr><td>UPSC Online Form</td><td>300 KB</td><td>Photograph: 40 KB, Signature: 20 KB</td></tr>
    <tr><td>SSC Online Form</td><td>100 KB – 1 MB</td><td>Document type पर depend करता है</td></tr>
    <tr><td>Railway IRCTC</td><td>1 MB</td><td>Supporting documents</td></tr>
    <tr><td>DigiLocker</td><td>10 MB</td><td>Per document</td></tr>
    <tr><td>Income Tax Portal</td><td>2 MB</td><td>Attachments for returns</td></tr>
    <tr><td>Gmail</td><td>25 MB</td><td>Large files via Google Drive link</td></tr>
    <tr><td>WhatsApp</td><td>100 MB</td><td>Documents category</td></tr>
    <tr><td>EPFO Portal</td><td>100 KB – 500 KB</td><td>PF related documents</td></tr>
    <tr><td>Passport Seva</td><td>500 KB</td><td>Supporting documents</td></tr>
    <tr><td>Aadhaar UIDAI</td><td>2 MB</td><td>Update documents</td></tr>
  </tbody>
</table>
<blockquote><strong>Pro Tip:</strong> Government form के लिए PDF compress करते समय Medium compression use करें — quality readable रहती है और size limit के अंदर आ जाती है।</blockquote>`,
      },
      {
        id: 'pdf-compress-tips',
        title: 'PDF Compress करते समय इन बातों का ध्यान रखें',
        content: `<p>PDF compression करते समय कुछ ज़रूरी बातें:</p>
<h3>Quality vs Size Balance</h3>
<ul>
  <li>सरकारी forms के लिए: text clearly readable होनी चाहिए — Medium compression use करें</li>
  <li>Resumes के लिए: High quality रखें — Low compression use करें</li>
  <li>Email attachments के लिए: Medium compression ideal है</li>
</ul>
<h3>Original File हमेशा रखें</h3>
<p>Compress करने से पहले original PDF की copy ज़रूर रखें। Compressed version submission के लिए use करें, original अपने पास रखें।</p>
<h3>Scanned Documents</h3>
<p>अगर PDF scanned documents की है (जैसे certificates), तो compression ज़्यादा होती है। High compression पर text blurry हो सकता है — इसलिए final result ज़रूर check करें।</p>
<h3>Password Protected PDF</h3>
<p>Password protected PDFs को compress करने के लिए पहले password remove करना हो सकता है। ToolsArena इसे handle करता है।</p>`,
      },
    ],
    howToSteps: [
      {
        title: 'PDF Compressor टूल खोलें',
        description: 'ToolsArena.in पर PDF Compressor खोलें। Desktop और mobile दोनों पर काम करता है।',
      },
      {
        title: 'PDF file upload करें',
        description: 'अपनी PDF file drag & drop करें या "Upload" button से select करें।',
      },
      {
        title: 'Compression level चुनें',
        description: 'सरकारी forms के लिए Medium, high quality documents के लिए Low, और maximum size reduction के लिए High compression चुनें।',
      },
      {
        title: 'Compress करें',
        description: '"Compress PDF" button click करें। Processing में कुछ seconds लगेंगे।',
      },
      {
        title: 'Download और check करें',
        description: 'Compressed PDF download करें। Before/after size देखें और PDF खोलकर quality verify करें।',
      },
    ],
    faqs: [
      {
        question: 'PDF compress करने से क्या quality खराब होती है?',
        answer: 'Medium compression पर text documents में quality लगभग same रहती है। Images वाली PDFs में थोड़ी quality कम हो सकती है लेकिन readable रहती है। Government forms और certificates के लिए Medium compression safe है।',
      },
      {
        question: 'Email में PDF size limit क्या है?',
        answer: 'Gmail की attachment limit 25 MB है। लेकिन corporate email servers अक्सर 5–10 MB limit रखते हैं। Professional communication के लिए PDF 5 MB से कम रखना बेहतर है। बड़ी files के लिए Google Drive link use करें।',
      },
      {
        question: 'WhatsApp पर PDF कितनी size की होनी चाहिए?',
        answer: 'WhatsApp पर PDF documents की limit 100 MB है। लेकिन faster delivery और कम data usage के लिए PDF को 5 MB से कम रखना बेहतर है। Large PDFs send होने में ज़्यादा समय लगता है।',
      },
      {
        question: 'Government form PDF कितनी size तक accept होती है?',
        answer: 'यह portal पर depend करता है। UPSC में 300 KB, SSC में 100 KB–1 MB, Income Tax में 2 MB। अपने form के instructions ध्यान से पढ़ें और उसी limit में compress करें।',
      },
      {
        question: 'Mobile पर PDF compress कैसे करें?',
        answer: 'Mobile Chrome browser में ToolsArena.in खोलें, PDF Compressor select करें, files से PDF upload करें, compression level चुनें और Download करें। कोई app install नहीं करनी — browser में ही काम होता है।',
      },
    ],
    relatedGuides: ['image-compressor-guide', 'qr-code-generator-guide'],
    toolCTA: {
      heading: 'अभी PDF Compressor आज़माएं — बिल्कुल Free!',
      description: 'ToolsArena का फ्री PDF Compressor बड़ी PDF files को seconds में compress करता है। Government forms, email और WhatsApp के लिए perfect — कोई watermark नहीं।',
      buttonText: 'टूल खोलें →',
    },
  },

  // ── 8. JSON FORMATTER ────────────────────────────────────────────
  {
    slug: 'json-formatter-guide',
    toolSlug: 'json-formatter',
    category: 'developer-tools',
    title: 'JSON फॉर्मेटर गाइड: JSON को Format, Validate और Debug करें आसानी से',
    subtitle: 'JSON क्या है, कैसे format करें, common errors कैसे fix करें — developers और beginners दोनों के लिए।',
    metaTitle: 'JSON फॉर्मेटर - JSON Validate करें फ्री में',
    metaDescription: 'JSON फॉर्मेटर से JSON को beautify, validate और minify करें। JSON क्या होता है, common errors कैसे fix करें और API response कैसे पढ़ें — पूरी जानकारी हिंदी में।',
    targetKeyword: 'JSON फॉर्मेटर',
    secondaryKeywords: [
      'JSON format kaise karein', 'JSON validator online', 'JSON beautify karna',
      'JSON minify', 'API response JSON format', 'JSON syntax check',
      'JSON error find karna', 'JSON to CSV converter', 'online JSON editor hindi',
      'JSON kya hota hai',
    ],
    lastUpdated: '2026-03-12',
    readingTime: '7 मिनट पढ़ें',
    tags: ['Developer', 'JSON', 'API', 'Coding'],
    intro: `<p><strong>JSON फॉर्मेटर</strong> developers के लिए एक ज़रूरी tool है जो JSON data को readable format में दिखाता है, errors को highlight करता है, और JSON को validate करता है। अगर आप web development, app development या API integration काम करते हैं तो JSON आपकी रोज़ की ज़रूरत है।</p>
<p>इस गाइड में हम JSON की basics आसान Hindi में समझेंगे, common errors को fix करना सीखेंगे, और ToolsArena के JSON Formatter को effectively use करना जानेंगे।</p>`,
    sections: [
      {
        id: 'json-kya-hai',
        title: 'JSON क्या है? (आसान भाषा में)',
        content: `<p>JSON (JavaScript Object Notation) एक simple data format है जिसका उपयोग data store करने और share करने के लिए होता है। यह human-readable और machine-readable दोनों है।</p>
<h3>JSON कैसे दिखता है?</h3>
<p>एक simple JSON example:</p>
<pre><code>{
  "name": "Rahul Kumar",
  "age": 25,
  "city": "Delhi",
  "skills": ["HTML", "CSS", "JavaScript"],
  "employed": true
}</code></pre>
<h3>JSON के basic elements</h3>
<ul>
  <li><strong>Object</strong> — curly braces {} में key-value pairs</li>
  <li><strong>Array</strong> — square brackets [] में values की list</li>
  <li><strong>String</strong> — double quotes में text</li>
  <li><strong>Number</strong> — integer या decimal (25, 3.14)</li>
  <li><strong>Boolean</strong> — true या false</li>
  <li><strong>Null</strong> — empty/no value</li>
</ul>
<h3>JSON कहाँ use होता है?</h3>
<ul>
  <li>APIs (server से data receive करना)</li>
  <li>Configuration files (package.json, tsconfig.json)</li>
  <li>Database storage (MongoDB, Firebase)</li>
  <li>Mobile app data exchange</li>
  <li>Government और banking APIs</li>
</ul>`,
      },
      {
        id: 'json-format-kaise-karein',
        title: 'JSON Format और Validate कैसे करें?',
        content: `<p>JSON formatting दो तरीकों से होती है:</p>
<h3>Beautify (Human-readable बनाना)</h3>
<p>Compressed JSON को proper indentation के साथ readable बनाना:</p>
<pre><code>// Before (minified):
{"name":"Amit","age":30,"city":"Mumbai"}

// After (beautified):
{
  "name": "Amit",
  "age": 30,
  "city": "Mumbai"
}</code></pre>
<h3>Minify (Size कम करना)</h3>
<p>Production code में JSON को minify करते हैं ताकि file size कम हो और loading fast हो। Extra spaces और newlines remove हो जाती हैं।</p>
<h3>JSON Validation</h3>
<p>Valid JSON के rules:</p>
<ul>
  <li>Keys हमेशा double quotes में होने चाहिए: <code>"key"</code></li>
  <li>String values भी double quotes में: <code>"value"</code></li>
  <li>Last item के बाद comma नहीं होना चाहिए (trailing comma)</li>
  <li>Comments JSON में allowed नहीं हैं (// या /* */)</li>
  <li>Single quotes (') use नहीं कर सकते — सिर्फ double quotes (")</li>
</ul>`,
      },
      {
        id: 'json-common-errors',
        title: 'JSON में Common Errors और उनके Solutions',
        content: `<p>JSON लिखते समय ये errors सबसे ज़्यादा आती हैं:</p>
<table>
  <thead>
    <tr><th>Error</th><th>Cause</th><th>Solution</th></tr>
  </thead>
  <tbody>
    <tr><td>Unexpected token</td><td>Single quotes या missing quotes</td><td>सभी keys/values में double quotes use करें</td></tr>
    <tr><td>Trailing comma</td><td>Last item के बाद comma</td><td>Last item के बाद comma हटाएं</td></tr>
    <tr><td>Unexpected end</td><td>Closing brace/bracket missing</td><td>{} और [] सही से close करें</td></tr>
    <tr><td>Invalid escape</td><td>Backslash के बाद invalid character</td><td>Special chars को escape करें: \n, \t, \\"</td></tr>
    <tr><td>Comments in JSON</td><td>// या /* */ comments</td><td>JSON में comments नहीं होते — remove करें</td></tr>
  </tbody>
</table>
<h3>ToolsArena JSON Formatter से Error Find करना</h3>
<p>JSON paste करने पर ToolsArena automatically:</p>
<ul>
  <li>Error की exact line और position बताता है</li>
  <li>Error का type explain करता है</li>
  <li>Valid होने पर beautified version show करता है</li>
</ul>`,
      },
      {
        id: 'json-use-cases',
        title: 'JSON का उपयोग कहाँ होता है?',
        content: `<p>JSON आज internet का backbone है। लगभग सभी web APIs JSON में data exchange करते हैं।</p>
<h3>API Response JSON</h3>
<p>जब आप किसी app में weather check करते हैं, online payment करते हैं, या food delivery app use करते हैं — सब जगह behind the scenes JSON data travel करता है।</p>
<h3>भारत में Popular JSON APIs</h3>
<ul>
  <li><strong>UPI Payment APIs</strong> — PhonePe, Paytm, GPay सब JSON use करते हैं</li>
  <li><strong>IRCTC API</strong> — train schedule और booking</li>
  <li><strong>OpenWeatherMap</strong> — मौसम की जानकारी</li>
  <li><strong>Google Maps API</strong> — location data</li>
  <li><strong>Aadhaar e-KYC API</strong> — identity verification</li>
</ul>
<h3>JSON vs XML</h3>
<p>पुराने systems XML use करते थे, अब JSON ज़्यादा popular है क्योंकि: कम verbose है, JavaScript के साथ directly काम करता है, और read करना आसान है।</p>`,
      },
    ],
    howToSteps: [
      {
        title: 'JSON Formatter खोलें',
        description: 'ToolsArena.in पर JSON Formatter टूल खोलें।',
      },
      {
        title: 'JSON paste करें',
        description: 'अपना JSON text box में paste करें। API response, config file, या कोई भी JSON data paste कर सकते हैं।',
      },
      {
        title: 'Validate करें',
        description: '"Validate" button click करें। Valid है तो green checkmark दिखेगा, error है तो exact line और error message दिखेगा।',
      },
      {
        title: 'Format चुनें',
        description: '"Beautify" button से readable format में देखें, या "Minify" button से compressed version पाएं।',
      },
      {
        title: 'Copy या Download करें',
        description: 'Formatted JSON को copy करें या file में download करें।',
      },
    ],
    faqs: [
      {
        question: 'JSON क्या होता है?',
        answer: 'JSON (JavaScript Object Notation) एक lightweight data format है जिसका उपयोग data store और share करने के लिए होता है। यह text-based है और human-readable भी है। Web APIs, mobile apps और databases सब JSON use करते हैं।',
      },
      {
        question: 'JSON valid है या नहीं कैसे check करें?',
        answer: 'ToolsArena के JSON Formatter में JSON paste करें और Validate button click करें। अगर JSON valid है तो formatted version दिखेगा। Error है तो exact line number और error type बताया जाएगा।',
      },
      {
        question: 'JSON error कैसे fix करें?',
        answer: 'सबसे common errors हैं: single quotes की जगह double quotes use करें, last item के बाद trailing comma हटाएं, सभी {} और [] को properly close करें, और JSON में comments (// या /* */) मत लिखें।',
      },
      {
        question: 'JSON को CSV में कैसे convert करें?',
        answer: 'JSON array data को CSV में convert करने के लिए ToolsArena का JSON to CSV converter use करें। Array of objects वाला JSON paste करें और CSV download करें। यह Excel में खोला जा सकता है।',
      },
      {
        question: 'API response JSON कैसे read करें?',
        answer: 'API response को ToolsArena JSON Formatter में paste करें और Beautify करें। Tree view में JSON की structure clearly दिखेगी। Nested objects को expand/collapse कर सकते हैं। Specific key की value खोजने के लिए search feature use करें।',
      },
    ],
    relatedGuides: ['word-counter-guide', 'pdf-compressor-guide'],
    toolCTA: {
      heading: 'अभी JSON Formatter आज़माएं — बिल्कुल Free!',
      description: 'ToolsArena का फ्री JSON Formatter JSON को beautify, validate और minify करता है। Errors instantly highlight होते हैं — कोई signup नहीं।',
      buttonText: 'टूल खोलें →',
    },
  },

  // ── 9. EMI CALCULATOR ────────────────────────────────────────────
  {
    slug: 'emi-calculator-guide',
    toolSlug: 'emi-calculator',
    category: 'calculators',
    title: 'ईएमआई कैलकुलेटर गाइड: Home Loan, Car Loan और Personal Loan की EMI कैसे निकालें',
    subtitle: 'EMI formula, भारतीय बैंकों की interest rates, salary vs loan eligibility — 2026 की पूरी जानकारी।',
    metaTitle: 'ईएमआई कैलकुलेटर - Loan EMI निकालें फ्री में',
    metaDescription: 'ईएमआई कैलकुलेटर से home loan, car loan और personal loan की monthly EMI निकालें। HDFC, SBI, ICICI bank rates, salary eligibility और EMI कम करने के तरीके हिंदी में।',
    targetKeyword: 'ईएमआई कैलकुलेटर',
    secondaryKeywords: [
      'home loan EMI calculator', 'car loan EMI calculate', 'personal loan EMI',
      'EMI kya hota hai', 'masik kist calculator', 'loan EMI formula',
      'HDFC home loan EMI', 'SBI home loan EMI', 'loan tenure aur EMI',
      'EMI calculator India',
    ],
    lastUpdated: '2026-03-12',
    readingTime: '10 मिनट पढ़ें',
    tags: ['Finance', 'Home Loan', 'EMI', 'Banking', 'Car Loan'],
    intro: `<p><strong>ईएमआई कैलकुलेटर</strong> से आप किसी भी loan की monthly EMI (Equated Monthly Instalment) calculate कर सकते हैं — home loan हो, car loan हो, या personal loan। भारत में करोड़ों लोग EMI पर घर, गाड़ी और education loan लेते हैं।</p>
<p>सही EMI जानना financial planning के लिए बेहद ज़रूरी है। इस गाइड में 2026 के updated bank interest rates, salary vs loan eligibility tables, और EMI कम करने के proven तरीके दिए गए हैं।</p>`,
    sections: [
      {
        id: 'emi-kya-hai',
        title: 'EMI क्या है? (Easy Explanation)',
        content: `<p>EMI (Equated Monthly Instalment) वह fixed monthly amount है जो आप loan repay करने के लिए हर महीने bank को देते हैं। हर EMI में दो parts होते हैं:</p>
<ul>
  <li><strong>Principal Component</strong> — जो actual loan amount repay होती है</li>
  <li><strong>Interest Component</strong> — bank का charge</li>
</ul>
<h3>EMI की खास बात</h3>
<p>Loan के शुरुआत में EMI का बड़ा हिस्सा interest होता है और छोटा हिस्सा principal। जैसे-जैसे loan कम होता है, interest component कम होता है और principal component बढ़ता है। इसे <strong>amortization</strong> कहते हैं।</p>
<h3>EMI का उदाहरण</h3>
<p>₹20 लाख का home loan, 8.5% interest, 20 साल tenure पर:</p>
<ul>
  <li>Monthly EMI: <strong>₹17,356</strong></li>
  <li>Total interest paid: <strong>₹21.65 लाख</strong></li>
  <li>Total amount paid: <strong>₹41.65 लाख</strong></li>
</ul>
<p>यानी आप मूल राशि के लगभग बराबर interest pay करते हैं 20 साल में!</p>`,
      },
      {
        id: 'emi-formula-calculation',
        title: 'EMI Formula और Calculation Method',
        content: `<p>EMI calculate करने का mathematical formula:</p>
<blockquote><strong>EMI = P × r × (1+r)ⁿ ÷ [(1+r)ⁿ − 1]</strong></blockquote>
<p>जहाँ: <strong>P</strong> = Principal (loan amount), <strong>r</strong> = Monthly interest rate (annual rate ÷ 12 ÷ 100), <strong>n</strong> = Number of months (tenure)</p>
<h3>Example Calculation</h3>
<p>₹10 लाख loan, 9% annual interest, 5 साल (60 months):</p>
<ul>
  <li>r = 9 ÷ 12 ÷ 100 = 0.0075</li>
  <li>EMI = 10,00,000 × 0.0075 × (1.0075)⁶⁰ ÷ [(1.0075)⁶⁰ − 1]</li>
  <li>EMI = <strong>₹20,758</strong></li>
</ul>
<h3>Loan Amount vs EMI Table (8.5% Rate)</h3>
<table>
  <thead>
    <tr><th>Loan Amount</th><th>10 साल EMI</th><th>15 साल EMI</th><th>20 साल EMI</th></tr>
  </thead>
  <tbody>
    <tr><td>₹10 लाख</td><td>₹12,400</td><td>₹9,847</td><td>₹8,678</td></tr>
    <tr><td>₹20 लाख</td><td>₹24,800</td><td>₹19,694</td><td>₹17,356</td></tr>
    <tr><td>₹30 लाख</td><td>₹37,200</td><td>₹29,541</td><td>₹26,034</td></tr>
    <tr><td>₹50 लाख</td><td>₹62,000</td><td>₹49,235</td><td>₹43,391</td></tr>
    <tr><td>₹75 लाख</td><td>₹93,000</td><td>₹73,852</td><td>₹65,086</td></tr>
    <tr><td>₹1 करोड़</td><td>₹1,24,000</td><td>₹98,470</td><td>₹86,782</td></tr>
  </tbody>
</table>`,
      },
      {
        id: 'home-loan-emi-india',
        title: 'होम लोन EMI: भारतीय बैंकों की तुलना (2026)',
        content: `<p>2026 में भारत के प्रमुख banks के home loan interest rates (approximate — actual rates verify करें):</p>
<table>
  <thead>
    <tr><th>Bank</th><th>Home Loan Rate</th><th>Processing Fee</th><th>Max Tenure</th></tr>
  </thead>
  <tbody>
    <tr><td>SBI (State Bank)</td><td>8.50%–9.65%</td><td>0.35% (max ₹10,000)</td><td>30 साल</td></tr>
    <tr><td>HDFC Bank</td><td>8.75%–9.65%</td><td>0.50% (max ₹3,000)</td><td>30 साल</td></tr>
    <tr><td>ICICI Bank</td><td>8.75%–9.80%</td><td>0.50%</td><td>30 साल</td></tr>
    <tr><td>Axis Bank</td><td>8.75%–9.10%</td><td>1% (min ₹10,000)</td><td>30 साल</td></tr>
    <tr><td>Punjab National Bank</td><td>8.40%–9.50%</td><td>0.35%</td><td>30 साल</td></tr>
    <tr><td>Kotak Mahindra Bank</td><td>8.75%–9.50%</td><td>0.50%</td><td>20 साल</td></tr>
  </tbody>
</table>
<p><strong>नोट:</strong> ये rates RBI policy और आपके credit score पर depend करती हैं। Loan लेने से पहले bank से current rates confirm करें।</p>
<h3>Home Loan Tax Benefits (Section 80C और 24b)</h3>
<ul>
  <li><strong>Section 24(b):</strong> Home loan interest पर ₹2 लाख तक tax deduction (self-occupied property)</li>
  <li><strong>Section 80C:</strong> Principal repayment पर ₹1.5 लाख तक tax deduction</li>
  <li><strong>Section 80EEA:</strong> Affordable housing पर additional ₹1.5 लाख deduction</li>
</ul>`,
      },
      {
        id: 'salary-vs-emi',
        title: 'आपकी Salary के हिसाब से कितनी EMI ले सकते हैं?',
        content: `<p>Banks का general rule है कि आपकी total EMI (सभी loans की) आपकी net monthly salary के 40–50% से ज़्यादा नहीं होनी चाहिए।</p>
<table>
  <thead>
    <tr><th>Net Monthly Salary</th><th>Max Total EMI (40%)</th><th>Eligible Home Loan (20yr, 8.5%)</th></tr>
  </thead>
  <tbody>
    <tr><td>₹25,000</td><td>₹10,000</td><td>~₹11.5 लाख</td></tr>
    <tr><td>₹40,000</td><td>₹16,000</td><td>~₹18.4 लाख</td></tr>
    <tr><td>₹60,000</td><td>₹24,000</td><td>~₹27.6 लाख</td></tr>
    <tr><td>₹80,000</td><td>₹32,000</td><td>~₹36.8 लाख</td></tr>
    <tr><td>₹1,00,000</td><td>₹40,000</td><td>~₹46 लाख</td></tr>
    <tr><td>₹1,50,000</td><td>₹60,000</td><td>~₹69 लाख</td></tr>
  </tbody>
</table>
<p><strong>Note:</strong> यह approximate है। Actual eligibility आपके credit score (CIBIL), existing loans, employment type और bank policies पर depend करती है।</p>`,
      },
      {
        id: 'emi-kam-karne-ke-tarike',
        title: 'EMI कम करने के 5 तरीके',
        content: `<p>अगर EMI बोझ लग रही है, तो इन तरीकों से कम कर सकते हैं:</p>
<h3>1. Tenure बढ़ाएं</h3>
<p>Loan tenure बढ़ाने से EMI कम होती है, लेकिन total interest ज़्यादा देना पड़ता है। ₹20 लाख loan पर 10 साल की EMI ₹24,800 और 20 साल की EMI ₹17,356 है।</p>
<h3>2. Down Payment बढ़ाएं</h3>
<p>ज़्यादा down payment देने से loan amount कम होता है और EMI भी कम होती है। साथ ही कम interest भी देना पड़ता है।</p>
<h3>3. Balance Transfer करें</h3>
<p>अगर current bank की rate ज़्यादा है तो दूसरे bank में balance transfer करें। 0.5–1% rate कम होने पर भी EMI में significant saving होती है।</p>
<h3>4. Part-Prepayment करें</h3>
<p>जब भी extra पैसे हों (bonus, savings) loan का part-prepayment करें। इससे outstanding principal कम होता है और future EMI या tenure कम होती है।</p>
<h3>5. Credit Score सुधारें</h3>
<p>750+ CIBIL score होने पर banks बेहतर interest rates देते हैं। Credit card bills time पर pay करें और existing loans नियमित रूप से repay करें।</p>`,
      },
    ],
    howToSteps: [
      {
        title: 'EMI Calculator खोलें',
        description: 'ToolsArena.in पर EMI Calculator टूल खोलें।',
      },
      {
        title: 'Loan details डालें',
        description: 'Loan amount (₹ में), Interest Rate (% per annum), और Loan Tenure (months या years में) डालें।',
      },
      {
        title: 'Calculate करें',
        description: '"Calculate EMI" button click करें। Monthly EMI, total interest और total payment instantly दिखेगी।',
      },
      {
        title: 'Amortization schedule देखें',
        description: 'Month-by-month breakdown देखें — कितना principal और कितना interest हर महीने जा रहा है।',
      },
      {
        title: 'Different scenarios compare करें',
        description: 'Different tenures और interest rates की EMI compare करें ताकि best option चुन सकें।',
      },
    ],
    faqs: [
      {
        question: 'EMI क्या होती है?',
        answer: 'EMI (Equated Monthly Instalment) वह fixed monthly amount है जो आप bank को loan repay करने के लिए देते हैं। हर EMI में principal (मूल राशि) और interest (ब्याज) दोनों होते हैं। EMI loan की पूरी tenure तक fixed रहती है (floating rate छोड़कर)।',
      },
      {
        question: '25 लाख के loan पर EMI कितनी होगी?',
        answer: '₹25 लाख का home loan 8.5% interest पर: 15 साल tenure पर EMI ≈ ₹24,618, 20 साल पर ≈ ₹21,695, और 25 साल पर ≈ ₹20,157। ToolsArena EMI Calculator में exact calculation करें।',
      },
      {
        question: 'Home loan के लिए कितनी salary चाहिए?',
        answer: 'Banks आमतौर पर net monthly salary का 40–50% तक EMI allow करते हैं। ₹40 लाख के home loan के लिए (20 साल, 8.5%) EMI ≈ ₹34,700 — इसके लिए minimum ₹70,000–80,000 net salary चाहिए। CIBIL score 750+ होने पर better rates मिलती हैं।',
      },
      {
        question: 'EMI कम करने के तरीके क्या हैं?',
        answer: 'EMI कम करने के 5 मुख्य तरीके: (1) Tenure बढ़ाएं, (2) Down payment ज़्यादा दें, (3) कम interest rate वाले bank में balance transfer करें, (4) जब पैसे हों part-prepayment करें, (5) अच्छा CIBIL score maintain करें ताकि कम rate मिले।',
      },
      {
        question: 'Home loan पर tax benefit क्या है?',
        answer: 'Home loan पर दो tax benefits हैं: Section 24(b) के तहत interest payment पर ₹2 लाख तक deduction (self-occupied property), और Section 80C के तहत principal repayment पर ₹1.5 लाख तक deduction। First-time buyers को Section 80EEA में additional ₹1.5 लाख का benefit भी मिल सकता है।',
      },
    ],
    relatedGuides: ['percentage-calculator-guide', 'age-calculator-guide'],
    toolCTA: {
      heading: 'अभी EMI Calculator आज़माएं — बिल्कुल Free!',
      description: 'ToolsArena का फ्री EMI Calculator home loan, car loan और personal loan की exact monthly EMI calculate करता है। Amortization schedule भी देखें।',
      buttonText: 'टूल खोलें →',
    },
  },

  // ── 10. UNIT CONVERTER ───────────────────────────────────────────
  {
    slug: 'unit-converter-guide',
    toolSlug: 'unit-converter',
    category: 'converters',
    title: 'यूनिट कन्वर्टर गाइड: बीघा, तोला, सेर और भारतीय माप-तौल की पूरी जानकारी',
    subtitle: 'बीघा से एकड़, तोला से ग्राम, इंच से सेंटीमीटर — भारतीय और अंतरराष्ट्रीय माप-तौल सब एक जगह।',
    metaTitle: 'यूनिट कन्वर्टर - बीघा, तोला Convert करें',
    metaDescription: 'यूनिट कन्वर्टर से बीघा को एकड़ में, तोला को ग्राम में, और इंच को सेंटीमीटर में convert करें। State-wise बीघा conversion table और पारंपरिक भारतीय माप-तौल की पूरी जानकारी।',
    targetKeyword: 'यूनिट कन्वर्टर',
    secondaryKeywords: [
      '1 bigha kitna hota hai', 'bigha to acre convert', 'tola to gram',
      'unit converter online hindi', 'bhartiya maap taul', 'square meter to bigha',
      'kg to pound converter', 'length unit converter', 'zameen naap converter',
      'inch to cm converter',
    ],
    lastUpdated: '2026-03-12',
    readingTime: '9 मिनट पढ़ें',
    tags: ['Unit Converter', 'Land', 'बीघा', 'तोला', 'Measurement'],
    intro: `<p><strong>यूनिट कन्वर्टर</strong> एक ऐसा tool है जो एक measurement unit को दूसरी में convert करता है। भारत में ज़मीन नापने के लिए बीघा, कट्ठा, गुंठा जैसी traditional units use होती हैं जो हर state में अलग-अलग होती हैं — यह confusion बहुत बड़ी है।</p>
<p>इस गाइड में हम भारतीय ज़मीन नापने की सभी units, पारंपरिक वजन (तोला, माशा, सेर) और common length/weight conversions सब एक जगह cover करेंगे।</p>`,
    sections: [
      {
        id: 'bhartiya-jamin-naap',
        title: 'भारतीय ज़मीन नापने की इकाइयाँ (बीघा, कट्ठा, गुंठा)',
        content: `<p>भारत में ज़मीन नापने के लिए अलग-अलग regions में अलग units use होती हैं। यह ऐतिहासिक रूप से अलग kingdoms और cultures का नतीजा है।</p>
<h3>प्रमुख ज़मीन इकाइयाँ</h3>
<ul>
  <li><strong>बीघा (Bigha)</strong> — UP, Bihar, Rajasthan, MP, Gujarat, Bengal, Assam में use होता है। लेकिन हर state में size अलग है!</li>
  <li><strong>कट्ठा (Kattha)</strong> — Bihar, Bengal, Assam में बीघा का subdivision</li>
  <li><strong>गुंठा (Guntha)</strong> — Maharashtra, Karnataka में use होता है</li>
  <li><strong>एकड़ (Acre)</strong> — पूरे भारत में commonly समझा जाता है</li>
  <li><strong>हेक्टेयर (Hectare)</strong> — International standard, government records में</li>
  <li><strong>वर्ग फुट (Square Feet)</strong> — Urban real estate में सबसे common</li>
</ul>
<h3>Key Conversions</h3>
<ul>
  <li>1 एकड़ = 43,560 वर्ग फुट = 4,047 वर्ग मीटर</li>
  <li>1 हेक्टेयर = 10,000 वर्ग मीटर = 2.47 एकड़</li>
  <li>1 एकड़ = 0.4047 हेक्टेयर</li>
</ul>`,
      },
      {
        id: 'bigha-conversion-table',
        title: '1 बीघा कितना होता है? (State-wise Table)',
        content: `<p>बीघा का size हर state में अलग होता है — यह सबसे ज़्यादा confusion का कारण है। नीचे state-wise exact conversion दी गई है:</p>
<table>
  <thead>
    <tr><th>State</th><th>1 बीघा = वर्ग फुट</th><th>1 बीघा = एकड़</th><th>1 बीघा = वर्ग मीटर</th></tr>
  </thead>
  <tbody>
    <tr><td>Uttar Pradesh</td><td>27,000 sq ft</td><td>0.6198 acres</td><td>2,508 sq m</td></tr>
    <tr><td>Bihar</td><td>27,220 sq ft</td><td>0.625 acres</td><td>2,529 sq m</td></tr>
    <tr><td>Rajasthan</td><td>27,225 sq ft</td><td>0.625 acres</td><td>2,530 sq m</td></tr>
    <tr><td>Madhya Pradesh</td><td>12,000 sq ft</td><td>0.2756 acres</td><td>1,115 sq m</td></tr>
    <tr><td>Gujarat</td><td>17,424 sq ft</td><td>0.4 acres</td><td>1,619 sq m</td></tr>
    <tr><td>West Bengal</td><td>14,400 sq ft</td><td>0.3306 acres</td><td>1,338 sq m</td></tr>
    <tr><td>Assam</td><td>14,400 sq ft</td><td>0.3306 acres</td><td>1,338 sq m</td></tr>
    <tr><td>Himachal Pradesh</td><td>8,712 sq ft</td><td>0.2 acres</td><td>809 sq m</td></tr>
  </tbody>
</table>
<p><strong>महत्वपूर्ण:</strong> ज़मीन खरीदते या बेचते समय हमेशा official registry documents में square meter या hectare में measurement verify करें।</p>`,
      },
      {
        id: 'tola-masha-traditional-weight',
        title: 'तोला, माशा, सेर: पारंपरिक वजन की इकाइयाँ',
        content: `<p>भारत में पारंपरिक वजन की units आज भी सोने-चांदी की खरीद-बिक्री में use होती हैं, खासकर jewelry market में।</p>
<table>
  <thead>
    <tr><th>इकाई</th><th>Gram में</th><th>Notes</th></tr>
  </thead>
  <tbody>
    <tr><td>1 रत्ती (Ratti)</td><td>0.1215 ग्राम</td><td>सबसे छोटी unit, gems में use</td></tr>
    <tr><td>1 माशा (Masha)</td><td>0.972 ग्राम</td><td>8 रत्ती = 1 माशा</td></tr>
    <tr><td>1 तोला (Tola)</td><td>11.664 ग्राम</td><td>12 माशा = 1 तोला; Gold में standard</td></tr>
    <tr><td>1 छटाँक (Chhatak)</td><td>58.32 ग्राम</td><td>5 तोला = 1 छटाँक</td></tr>
    <tr><td>1 पाव (Pao)</td><td>233.28 ग्राम</td><td>4 छटाँक = 1 पाव</td></tr>
    <tr><td>1 सेर (Ser)</td><td>933.1 ग्राम</td><td>4 पाव = 1 सेर; ≈1 kg</td></tr>
    <tr><td>1 मन/मण (Maund)</td><td>37,325 ग्राम</td><td>40 सेर = 1 मन; ≈37.3 kg</td></tr>
  </tbody>
</table>
<h3>Gold के लिए तोला</h3>
<p>सोने की खरीद-बिक्री में 1 तोला = 10 ग्राम माना जाता है (traditionally 11.664 ग्राम, लेकिन modern jewelry market में 10 ग्राम standard है)। हमेशा jeweller से confirm करें।</p>`,
      },
      {
        id: 'common-unit-conversions',
        title: 'आम उपयोग के Unit Conversions',
        content: `<p>रोज़मर्रा में काम आने वाली unit conversions:</p>
<h3>Length Conversions</h3>
<table>
  <thead>
    <tr><th>From</th><th>To</th><th>Multiply by</th><th>Example</th></tr>
  </thead>
  <tbody>
    <tr><td>Inch</td><td>Centimeter</td><td>2.54</td><td>6 inch = 15.24 cm</td></tr>
    <tr><td>Foot</td><td>Meter</td><td>0.3048</td><td>5 ft = 1.524 m</td></tr>
    <tr><td>Meter</td><td>Foot</td><td>3.281</td><td>1.8 m = 5.9 ft</td></tr>
    <tr><td>Kilometer</td><td>Mile</td><td>0.621</td><td>10 km = 6.21 miles</td></tr>
    <tr><td>Mile</td><td>Kilometer</td><td>1.609</td><td>1 mile = 1.609 km</td></tr>
  </tbody>
</table>
<h3>Weight Conversions</h3>
<table>
  <thead>
    <tr><th>From</th><th>To</th><th>Multiply by</th><th>Example</th></tr>
  </thead>
  <tbody>
    <tr><td>Kilogram</td><td>Pound</td><td>2.205</td><td>70 kg = 154.3 lbs</td></tr>
    <tr><td>Pound</td><td>Kilogram</td><td>0.453</td><td>150 lbs = 68 kg</td></tr>
    <tr><td>Gram</td><td>Ounce</td><td>0.0353</td><td>100 g = 3.53 oz</td></tr>
  </tbody>
</table>
<h3>Temperature Conversions</h3>
<ul>
  <li>Celsius to Fahrenheit: (°C × 9/5) + 32</li>
  <li>Fahrenheit to Celsius: (°F − 32) × 5/9</li>
  <li>उदाहरण: 37°C (body temp) = (37×9/5)+32 = 98.6°F</li>
</ul>`,
      },
    ],
    howToSteps: [
      {
        title: 'Unit Converter खोलें',
        description: 'ToolsArena.in पर Unit Converter टूल खोलें।',
      },
      {
        title: 'Conversion category चुनें',
        description: 'Length, Weight, Area (ज़मीन), Temperature, या Volume में से category select करें।',
      },
      {
        title: 'Source unit चुनें',
        description: 'जिस unit से convert करना है वो select करें — जैसे बीघा, तोला, inch, kg आदि।',
      },
      {
        title: 'Value और Target unit डालें',
        description: 'Number डालें और जिसमें convert करना है वो target unit select करें।',
      },
      {
        title: 'Result देखें',
        description: 'Converted value instantly दिखेगी। Multiple units में एक साथ देख सकते हैं।',
      },
    ],
    faqs: [
      {
        question: '1 बीघा में कितनी एकड़ होती है?',
        answer: '1 बीघा में कितनी एकड़ है यह state पर depend करता है। UP और Bihar में 1 बीघा ≈ 0.625 एकड़, MP में ≈ 0.276 एकड़, और Gujarat में ≈ 0.4 एकड़ होती है। ज़मीन के कागज़ात में हमेशा square meter या hectare में verify करें।',
      },
      {
        question: '1 तोला कितने ग्राम का होता है?',
        answer: 'Traditional तौर पर 1 तोला = 11.664 ग्राम होता है। लेकिन modern jewelry market में 1 तोला = 10 ग्राम माना जाता है। सोना खरीदते समय jeweller से confirm करें वे कौन सा standard follow करते हैं।',
      },
      {
        question: '1 एकड़ में कितने वर्ग फुट होते हैं?',
        answer: '1 एकड़ = 43,560 वर्ग फुट (square feet) होते हैं। दूसरे conversions: 1 एकड़ = 4,047 वर्ग मीटर = 0.4047 हेक्टेयर। शहरी real estate में 1 एकड़ = 43,560 sq ft का उपयोग सबसे common है।',
      },
      {
        question: 'बीघा का क्षेत्रफल state wise क्यों अलग होता है?',
        answer: 'बीघा एक पारंपरिक unit है जो अलग-अलग kingdoms और राज्यों में अलग-अलग तरीके से define होती थी। British India में standardization नहीं हुई थी। इसलिए UP का बीघा (27,000 sq ft) और MP का बीघा (12,000 sq ft) बहुत अलग हैं।',
      },
      {
        question: 'किलोग्राम को पाउंड में कैसे बदलें?',
        answer: 'Kilogram को Pound में बदलने के लिए kg × 2.205 करें। Example: 70 kg × 2.205 = 154.35 lbs। Pound को kg में: lbs × 0.453। Example: 150 lbs × 0.453 = 68 kg। ToolsArena का Unit Converter इसे instantly calculate करता है।',
      },
    ],
    relatedGuides: ['percentage-calculator-guide', 'emi-calculator-guide'],
    toolCTA: {
      heading: 'अभी Unit Converter आज़माएं — बिल्कुल Free!',
      description: 'ToolsArena का फ्री Unit Converter बीघा, तोला, inch, kg और सैकड़ों units को instantly convert करता है। भारतीय units included।',
      buttonText: 'टूल खोलें →',
    },
  },

];
