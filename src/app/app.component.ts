import { Component, OnInit } from '@angular/core';
import { BUILD, DISTINGUISHING_FEATURES, EYE_COLORS, HAIR_COLOR, HAIR_LENGTH, HAIR_TYPE, MAIN_PRONOUN, NAMES, SECONDARY_PRONOUN, SKIN_FEATHERS, SKIN_FUR, SKIN_MARINE, SKIN_OUTSIDER, SKIN_TONE, SKIN_WOOD, SPECIES } from 'src/assets/descrips.constants';
import { RandomNumberService } from './_services/randomNumber.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  nameObj = {
    name: '',
    prevRoll: -1,
  };

  pronounsObj = {
    pronouns_main: '',
    pronouns_secondary: '',
    prevMain: -1,
    prevSecondary: -1,
  };

  speciesObj = {
    prevRoll: -1,
    species: {
      name: '',
    },
  };

  skinObj = {
    skin: '',
    prevRoll: -1
  };

  buildObj = {
    build: '',
    prevRoll: -1
  };

  uniqueSkin: any = {
    outsider: false,
    fur: false,
    wood: false,
    marine: false,
    feathers: false,
  }

  hairObj: any = {
    hairLength: '',
    hairType: '',
    hairColor: '',
    lastLength: -1,
    lastType: -1,
    lastColor: -1,
  };

  eyeColorObj = {
    color: '',
    prevRoll: -1
  };

  distinguishingFeatureObj = {
    name: '',
    prevRoll: -1
  };

  skinAdjective = 'skin';

  speciesStartsWithVowel = false;

  constructor(
    private randNum: RandomNumberService
  ) {};

  ngOnInit(): void {
    this.rollAll();
  }

  rollAll() {
    this.reRollName();
    this.reRollPronouns();
    this.reRollSpecies();
    this.reRollBuild();
    this.reRollHairLength();
    if (this.hairObj.length !== 'bald') {
      this.reRollHairType();
      this.reRollHairColor();
    }
    this.reRollEyeColor();
    this.reRollDistinguishingFeature();
  }

  reRollName() {
    this.nameObj.name = this.getName();
  }

  reRollMainPronoun() {
    const mainLength = MAIN_PRONOUN.length - 1;
    const rolledMain = this.randNum.getRandomNumber(0, mainLength, this.pronounsObj.prevMain);
    this.pronounsObj.prevMain = rolledMain;
    this.pronounsObj.pronouns_main = MAIN_PRONOUN[rolledMain];
  }

  reRollSecondaryPronoun() {
    const secondaryLength = SECONDARY_PRONOUN.length - 1;
    const rolledSecondary = this.randNum.getRandomNumber(0, secondaryLength, this.pronounsObj.prevSecondary);
    this.pronounsObj.prevSecondary = rolledSecondary;
    this.pronounsObj.pronouns_secondary = SECONDARY_PRONOUN[rolledSecondary];
  }

  reRollPronouns() {
    const pronouns = this.getPronouns();
    this.pronounsObj.pronouns_main = pronouns.main;
    this.pronounsObj.pronouns_secondary = pronouns.secondary;
  }

  reRollSpecies() {
    this.speciesObj.species = this.getSpecies();
    this.speciesStartsWithVowel = this.checkForVowel();
    this.reRollSkinTone();
  }

  reRollSkinTone() {
    this.uniqueSkin = {
      outsider: false,
      fur: false,
      wood: false,
      marine: false,
      feathers: false,
    };

    for (const [key, value] of Object.entries(this.uniqueSkin)) {
      if (key in this.speciesObj.species) {
        this.uniqueSkin[key] = true
      }
    }

    let skinTone = '';

    if (this.uniqueSkin.outsider) {
      skinTone = this.getUnusualSkinTone();
      if (['Gorgon', 'Dragonborn', 'Serpentfolk', 'Lizardfolk'].includes(this.speciesObj.species.name)) {
        this.skinAdjective = 'scales';
      } else {
        this.skinAdjective = 'skin';
      }
    } else if (this.uniqueSkin.fur) {
      skinTone = this.getSkinFur();
      this.skinAdjective = 'fur';
    } else if (this.uniqueSkin.feathers) {
      skinTone = this.getSkinFeathers();
      this.skinAdjective = 'feathers';
    } else if (this.uniqueSkin.marine) {
      skinTone = this.getSkinMarine();
      this.skinAdjective = 'hide';
    } else if (this.uniqueSkin.wood) {
      skinTone = this.getWoodSkinTone();
      this.skinAdjective = 'bark';
    } else {
      skinTone = this.getSkinTone();
      this.skinAdjective = 'skin';
    }
    this.skinObj.skin = skinTone;
  }

  reRollBuild() {
    this.buildObj.build = this.getBuild();
  }

  reRollHairLength() {
    this.hairObj.hairLength = this.getHairLength();
  }

  reRollHairType() {
    this.hairObj.hairType = this.getHairType();
  }

  reRollHairColor() {
    this.hairObj.hairColor = this.getHairColor();
  }

  reRollEyeColor() {
    this.eyeColorObj.color = this.getEyeColor();
  }

  reRollDistinguishingFeature() {
    this.distinguishingFeatureObj.name = this.getDistinguishingFeature();
  }

  getName() {
    const namesLength = NAMES.length - 1;
    const rolledName = this.randNum.getRandomNumber(0, namesLength, this.nameObj.prevRoll);
    this.nameObj.prevRoll = rolledName;

    return NAMES[rolledName];
  }

  getPronouns() {
    const mainLength = MAIN_PRONOUN.length - 1;
    const secondaryLength = SECONDARY_PRONOUN.length - 1;
    const rolledMain = this.randNum.getRandomNumber(0, mainLength, this.pronounsObj.prevMain);
    const rolledSecondary = this.randNum.getRandomNumber(0, secondaryLength, this.pronounsObj.prevSecondary);

    this.pronounsObj.prevMain = rolledMain;
    this.pronounsObj.prevSecondary = rolledSecondary;

    return {
      main: MAIN_PRONOUN[rolledMain],
      secondary: SECONDARY_PRONOUN[rolledSecondary]
    };
  }

  getSpecies() {
    const speciesLength = SPECIES.length - 1;
    const rolledSpecies = this.randNum.getRandomNumber(0, speciesLength, this.speciesObj.prevRoll);
    this.speciesObj.prevRoll = rolledSpecies;

    return SPECIES[rolledSpecies];
  }

  getSkinTone() {
    const skinLength = SKIN_TONE.length - 1;
    const rolledSkin = this.randNum.getRandomNumber(0, skinLength, this.skinObj.prevRoll);
    this.skinObj.prevRoll = rolledSkin;

    return SKIN_TONE[rolledSkin];
  }

  getUnusualSkinTone() {
    const skinLength = SKIN_OUTSIDER.length - 1;
    const rolledSkin = this.randNum.getRandomNumber(0, skinLength, this.skinObj.prevRoll);
    this.skinObj.prevRoll = rolledSkin;

    return SKIN_OUTSIDER[rolledSkin];
  }

  getWoodSkinTone() {
    const skinLength = SKIN_WOOD.length - 1;
    const rolledSkin = this.randNum.getRandomNumber(0, skinLength, this.skinObj.prevRoll);
    this.skinObj.prevRoll = rolledSkin;

    return SKIN_WOOD[rolledSkin];
  }

  getSkinFeathers() {
    const skinLength = SKIN_FEATHERS.length - 1;
    const rolledSkin = this.randNum.getRandomNumber(0, skinLength, this.skinObj.prevRoll);
    this.skinObj.prevRoll = rolledSkin;

    return SKIN_FEATHERS[rolledSkin];
  }

  getSkinMarine() {
    const skinLength = SKIN_MARINE.length - 1;
    const rolledSkin = this.randNum.getRandomNumber(0, skinLength, this.skinObj.prevRoll);
    this.skinObj.prevRoll = rolledSkin;

    return SKIN_MARINE[rolledSkin];
  }

  getSkinFur() {
    const skinLength = SKIN_FUR.length - 1;
    const rolledSkin = this.randNum.getRandomNumber(0, skinLength, this.skinObj.prevRoll);
    this.skinObj.prevRoll = rolledSkin;

    return SKIN_FUR[rolledSkin];
  }

  getBuild() {
    const buildLength = BUILD.length - 1;
    const rolledBuild = this.randNum.getRandomNumber(0, buildLength, this.buildObj.prevRoll);
    this.buildObj.prevRoll = rolledBuild;

    return BUILD[rolledBuild];
  }

  getHairLength() {
    const hairLengthLength = HAIR_LENGTH.length - 1;
    const rolledLength = this.randNum.getRandomNumber(0, hairLengthLength, this.hairObj.lastLength);
    this.hairObj.lastLength = rolledLength;

    return HAIR_LENGTH[rolledLength];
  }

  getHairType() {
    const typeLength = HAIR_TYPE.length - 1;
    const rolledType = this.randNum.getRandomNumber(0, typeLength, this.hairObj.lastType);
    this.hairObj.lastType = rolledType;

    return HAIR_TYPE[rolledType];
  }

  getHairColor() {
    const colorLength = HAIR_COLOR.length - 1;
    const rolledColor = this.randNum.getRandomNumber(0, colorLength, this.hairObj.lastColor);
    this.hairObj.lastColor = rolledColor;

    return HAIR_COLOR[rolledColor];
  }

  getEyeColor() {
    const colorLength = EYE_COLORS.length - 1;
    const rolledColor = this.randNum.getRandomNumber(0, colorLength, this.eyeColorObj.prevRoll);
    this.eyeColorObj.prevRoll = rolledColor;

    return EYE_COLORS[rolledColor];
  }

  getDistinguishingFeature() {
    const featureLength = DISTINGUISHING_FEATURES.length - 1;
    const rolledFeature = this.randNum.getRandomNumber(0, featureLength, this.distinguishingFeatureObj.prevRoll);
    this.distinguishingFeatureObj.prevRoll = rolledFeature;

    return DISTINGUISHING_FEATURES[rolledFeature];
  }

  checkForVowel() {
    const vowels = 'AEIOU';
    return this.speciesObj.species.name.indexOf('Unicorn') !== -1 ? false : vowels.indexOf(this.speciesObj.species.name[0]) !== -1;
  }
}
