import { searchGiphyGif } from "../actions";
import { useState, useEffect } from "react";

import lowImg from '../assets/imgs/lowOptionImg.png'
import midImg from '../assets/imgs/midOptionImg.png'
import luxuryImg from '../assets/imgs/luxuryOptionImg.png'
import adventureImg from '../assets/imgs/adventureOptionImg.png'
import relaxationImg from '../assets/imgs/relaxationOptionImg.png'
import cultureImg from '../assets/imgs/culturalEOptionImg.png'
import soloImg from '../assets/imgs/soloOptionImg.png'
import familyImg from '../assets/imgs/familyOptionImg.png'
import groupImg from '../assets/imgs/groupOptionImg.jpg'
import safeImg from '../assets/imgs/safeOptionImg.png'
import affordableImg from '../assets/imgs/affordableOptionImg.jpg'
import attractionsImg from '../assets/imgs/attractionsOptionImg.jpg'


// ANCHOR !!! ---- IMPORTANT ---- !!!

// 1. DO NOT CHANGE THE IDS!
//  - WHY? BECAUSE THE ID'S ARE TIED TO QUESTIONS.THE USER WILL NEED TO UPDATE THESE QUESTIONS SO YOU CANT JUST MESS WITH  --- (CONTND)
// (CONTND) --- ...MESS WITH THE ID AND THE QUESTION ITSELF.

const quizQuestions = [

  // ANCHOR THIS IS A1 IN THE SUPABSE DB
  {
    id: 1,
    question: "Where are you currently living?",
    answerOptions: [],
    additionalStringPlaceholder: "America",
    defaultValue: "not available",
    selectionType: "text",
    infoText: "",
    gif: "",
  },
  // ANCHOR THIS IS A2 IN THE SUPABSE DB
  {
    id: 2,
    question: "What is your travel budget?",
    answerOptions: ["low", "moderate", "luxury"],
    answerOptionImages: [lowImg.src, midImg.src, luxuryImg.src],
    additionalStringPlaceholder: "other / additional information",
    defaultValue: "any budget level",
    selectionType: "multiple",
    infoText: "skip for any budget",
    gif: "",
  },
  // ANCHOR THIS IS A3 IN THE SUPABSE DB
  {
    id: 3,
    question: "What type of experiences are you seeking? (e.g., adventure, relaxation, cultural immersion)",
    answerOptions: ["adventure", "relaxation", "cultural immersion"],
    answerOptionImages: [adventureImg.src, relaxationImg.src, cultureImg.src],
    additionalStringPlaceholder: "other / additional information",
    defaultValue: "any experience",
    selectionType: "multiple",
    infoText: "skip for any experience",
    gif: "",
  },
  // ANCHOR THIS IS A4 IN THE SUPABSE DB
  {
    id: 4,
    question: "What is your preferred mode of travel? (e.g., solo, family, group)",
    answerOptions: ["solo", "family", "group"],
    answerOptionImages: [soloImg.src, familyImg.src, groupImg.src],
    additionalStringPlaceholder: "other / additional information",
    defaultValue: "any mode",
    selectionType: "multiple",
    infoText: "skip for any mode",
    gif: "",
  },
  // ANCHOR THIS IS A5 IN THE SUPABSE DB
  {
    id: 5,
    question: "What is your top priority when choosing a destination? (e.g., safety, affordability, attractions)",
    answerOptions: ["safety", "affordability", "attractions"],
    answerOptionImages: [safeImg.src, affordableImg.src, attractionsImg.src],
    additionalStringPlaceholder: "other / additional information",
    defaultValue: "any priority",
    selectionType: "multiple",
    infoText: "skip for any priority",
    gif: "",
  },
];

export default quizQuestions;