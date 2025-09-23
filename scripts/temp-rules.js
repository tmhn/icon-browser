// categories.rules.js

import { USER_INTERFACE } from "./categories";

/**
 * Map from your category ID -> rules.
 * - keywords: positive matches (token or phrase)
 * - exclude: negative matches to avoid false positives
 * - alsoTags: optional free-form tags to attach
 */
module.exports = {
  [USER_INTERFACE]: {
    keywords: [
      "button","toggle","switch","checkbox","radio","tab","menu","kebab","dots","ellipsis",
      "grid","layout","cursor","resize","drag","handle","modal","tooltip","sidebar","navbar"
    ],
    exclude: [],
    alsoTags: ["ui","ux","interface"]
  },
  "office": {
    keywords: [
      "briefcase","binder","paperclip","staple","stamp","notebook","calendar","clipboard",
      "printer","fax","envelope","mail","letter","meeting","presentation","whiteboard"
    ],
    exclude: []
  },
  "content": {
    keywords: [
      "text","font","type","bold","italic","underline","align","list","bullet","numbered",
      "quote","blockquote","link","attachment","document","doc","file","folder","copy",
      "paste","cut","edit","pen","pencil","paragraph","heading"
    ],
    exclude: []
  },
  "tech": {
    keywords: [
      "code","terminal","console","bug","git","branch","commit","merge","server","api",
      "cloud","kubernetes","docker","chip","cpu","gpu","database","db","wifi","router",
      "satellite","antenna"
    ],
    exclude: []
  },
  "profile": {
    keywords: [
      "user","person","profile","avatar","id","badge","name","account","settings",
      "team","group","followers","following"
    ],
    exclude: []
  },
  "audio-video": {
    keywords: [
      "play","pause","stop","record","rewind","forward","volume","mute","audio",
      "headphones","music","equalizer","image","gallery","photo","camera","film",
      "video","webcam","mic","microphone","speaker"
    ],
    exclude: []
  },
  "shopping": {
    keywords: [
      "shop","store","cart","basket","bag","credit-card","card","money","cash","coin",
      "coins","bank","receipt","discount","tag","barcode","checkout","pos"
    ],
    exclude: []
  },
  "objects": {
    keywords: [
      "gift","box","cube","dice","key","lightbulb","lamp","magnet","trophy","medal","flag",
      "globe","anchor","scissors","ruler","paint","brush","dropper","bucket","pin","safety-pin"
    ],
    exclude: []
  },
  "nature": {
    keywords: [
      "tree","leaf","flower","plant","paw","dog","cat","bird","fish","bee","butterfly",
      "mountain","wave","sun","moon","cloud","rain","snow","umbrella"
    ],
    exclude: [],
    alsoTags: ["outdoors","wildlife"]
  },
  "image": {
    keywords: [
      "image","gallery","photo","camera","frames","crop","exposure","filter","rotate",
      "panorama"
    ],
    exclude: []
  },
  "design-development": {
    keywords: [
      "palette","color","swatch","ruler","grid","compass","vector","bezier","guides",
      "code","brackets","</>","component","layout","cursor","inspector"
    ],
    exclude: []
  },
  "travel": {
    keywords: [
      "plane","flight","airport","passport","luggage","suitcase","ticket","train","tram",
      "bus","car","taxi","ferry","ship","bike","bicycle","scooter","map","route","gps"
    ],
    exclude: []
  },
  "homegoods": {
    keywords: [
      "sofa","couch","bed","lamp","chair","table","wardrobe","drawer","shelf","toaster",
      "kettle","fridge","oven","microwave","washing-machine","dryer","vacuum"
    ],
    exclude: []
  },
  "food-drink": {
    keywords: [
      "coffee","cup","mug","latte","espresso","tea","teapot","kettle","croissant","baguette",
      "burger","pizza","fries","chips","sushi","noodles","ramen","rice","cookie","cake",
      "wine","beer","cocktail","bar","bottle","fork","knife","spoon"
    ],
    exclude: []
  },
  "buildings-places": {
    keywords: [
      "home","house","building","office","skyscraper","factory","warehouse","bank","store",
      "hospital","school","university","castle","monument","bridge","landmark","map-pin","marker"
    ],
    exclude: []
  },
  "rewards": {
    keywords: [
      "trophy","medal","award","star","ribbon","crown","badge","laurel","achievement","level","rank"
    ],
    exclude: []
  },
  "activities": {
    keywords: [
      "run","walk","hike","swim","cycle","bike","scooter","ski","yoga","game","chess","dice",
      "controller","paint","draw","write","cook","camp","fish"
    ],
    exclude: []
  },
  "health-science": {
    keywords: [
      "heart","pulse","activity","health","hospital","ambulance","bandage","pill","capsule","syringe",
      "stethoscope","medkit","first-aid","dna","flask","beaker","microscope","telescope","magnet","atom"
    ],
    exclude: []
  },
  "business": {
    keywords: [
      "briefcase","chart","graph","analytics","report","presentation","target","bullseye","goal",
      "handshake","contract","invoice","balance","bank","office"
    ],
    exclude: []
  },
  "arrows": {
    keywords: [
      "arrow","chevron","caret","triangle","expand","collapse","sort","swap","shuffle","up","down","left","right"
    ],
    exclude: []
  },
  "symbols": {
    keywords: [
      "plus","minus","check","x","close","cross","alert","warning","info","question","asterisk",
      "hash","at","percent","copyright","trademark","registered","infinity","pi"
    ],
    exclude: []
  }
};
