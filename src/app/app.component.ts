import { Component, OnInit, ViewChild, } from '@angular/core';
import { AIR_DESCRIP, AUTUMN_DESCRIP, BUILD, CANID_DESCRIP, CAT_DESCRIP, CENTAUR_DESCRIP, DISTINGUISHING_FEATURES, DIVINE_DESCRIP, DRAGON_DESCRIP, EARTH_DESCRIP, EYE_COLORS, FEATHERS_DESCRIP, FIRE_DESCRIP, FISH_DESCRIP, GOBLIN_DESCRIP, HAIR_COLOR, HAIR_LENGTH, HAIR_TYPE, HEXBLOOD_DESCRIP, INFERNAL_DESCRIP, KOBOLD_DESCRIP, LAMIA_DESCRIP, LIZARD_DESCRIP, MAIN_PRONOUN, MEDUSA_DESCRIP, NAMES, PLANT_DESCRIP, RABBIT_DESCRIP, SECONDARY_PRONOUN, SKIN_FUR, SKIN_MARINE, SKIN_OUTSIDER, SKIN_TONE, SKIN_WOOD, SNAKE_DESCRIP, SPECIES, SPHINX_DESCRIP, SPRING_DESCRIP, SUMMER_DESCRIP, UNICORN_DESCRIP, WATER_DESCRIP, WINTER_DESCRIP } from 'src/assets/descrips.constants';
import { RandomNumberService } from './_services/randomNumber.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  nameObj = {
    descrip: '',
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
    descrip: '',
    prevRoll: -1,
  };

  buildObj = {
    descrip: '',
    prevRoll: -1
  };

  uniqueSkin: any = {
    outsider: false,
    fur: false,
    bark: false,
    hide: false,
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
    descrip: '',
    prevRoll: -1
  };

  distinguishingFeatureObj = {
    descrip: '',
    prevRoll: -1
  };

  specialSpeciesDescripObj = {
    descrip: '',
    prevRoll: -1
  };

  skinAdjective = 'skin';

  speciesStartsWithVowel = false;
  specialSpeicesDescrips: any;

  noHairSpecies = [
    'Lizardfolk',
    'Dragonborn',
    'Serpentfolk',
    'Dryad',
    'Ent',
    'Tabaxi',
    'Canid',
    'Gnoll',
    'Triton',
    'Leonin',
    'Kobold',
    'Lapine'
  ];

  noHair = false;

  previousSpeciesHairless: boolean = false;

  clipBoard = '';

  @ViewChild('introduction') introduction: any;
  @ViewChild('mainDescription') mainDescription: any;
  @ViewChild('distinguishingFeatures') distinguishingFeatures: any;

  constructor(
    private randNum: RandomNumberService,
  ) {};

  ngOnInit(): void {
    this.rollAll();
  }

  copyToClipboard() {
      this.clipBoard =
        this.introduction.nativeElement.innerText +
        this.mainDescription.nativeElement.innerText +
        this.distinguishingFeatures.nativeElement.innerText;

        navigator.clipboard.writeText(this.clipBoard);
  }

  rollAll() {
    this.reRollName();
    this.reRollPronouns();
    this.getInitialSpecies();
    this.reRollSkinTone();
    this.reRollBuild();
    if (!this.noHair) {
      this.reRollHairLength();
      if (this.hairObj.length !== 'bald') {
        this.reRollHairColor();
        this.reRollHairType();
      }
    }
    this.reRollEyeColor();
    this.reRollDistinguishingFeature();
  }

  reRollName() {
    this.nameObj.descrip = this.getDescripFromArray(NAMES, this.nameObj);
  }

  reRollMainPronoun() {
    const mainLength = MAIN_PRONOUN.length - 1;
    const rolledMain = this.randNum.getRandomNumber(0, mainLength, this.pronounsObj.prevMain);
    this.pronounsObj.prevMain = rolledMain;
    this.pronounsObj.pronouns_main = MAIN_PRONOUN[rolledMain];

    this.fixPronouns();
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
    this.getInitialSpecies();

    // need to check if our current species is incompatible with the previous skintone
    this.reRollSkinTone();

    // if our current species can have hair...
    // and if we are coming from a species without hair
    if (!this.noHair && this.previousSpeciesHairless) {
      this.reRollHairLength();
      if (this.hairObj.length !== 'bald') {
        this.reRollHairColor();
        this.reRollHairType();
      }
    }
  }

  getInitialSpecies() {
    this.speciesObj.species = this.getSpecies();
    this.speciesStartsWithVowel = this.checkForVowel();

    this.noHair = this.noHairSpecies.includes(this.speciesObj.species.name);
    this.getSpecialSpeciesDescription();
  }

  private getSpecialSpeciesDescription() {
    this.specialSpeciesDescripObj.descrip = '';
    this.specialSpeciesDescripObj.prevRoll = -1;

     this.specialSpeicesDescrips = {
      spring: false,
      summer: false,
      autumn: false,
      winter: false,
      infernal: false,
      divine: false,
      lizard: false,
      snake: false,
      dragon: false,
      hexblood: false,
      cat: false,
      fire: false,
      water: false,
      air: false,
      earth: false,
      fish: false,
      lamia: false,
      horse: false,
      plant: false,
      unicorn: false,
      sphinx: false,
      medusa: false,
      dog: false,
      goblin: false,
      kobold: false,
      rabbit: false,
      feathers: false,
    };

    for (const [key, value] of Object.entries(this.specialSpeicesDescrips)) {
      if (key in this.speciesObj.species) {
        this.specialSpeicesDescrips[key] = true;
      }
    }

    this.assignSpecialDescrip();
  }

  public assignSpecialDescrip() {
    switch(true) {
      case this.specialSpeicesDescrips.spring: {
        this.specialSpeciesDescripObj.descrip = this.getDescripFromArray(SPRING_DESCRIP, this.specialSpeciesDescripObj);
        break;
      }
      case this.specialSpeicesDescrips.summer: {
        this.specialSpeciesDescripObj.descrip = this.getDescripFromArray(SUMMER_DESCRIP, this.specialSpeciesDescripObj);
        break;
      }
      case this.specialSpeicesDescrips.autumn: {
        this.specialSpeciesDescripObj.descrip = this.getDescripFromArray(AUTUMN_DESCRIP, this.specialSpeciesDescripObj);
        break;
      }
      case this.specialSpeicesDescrips.winter: {
        this.specialSpeciesDescripObj.descrip = this.getDescripFromArray(WINTER_DESCRIP, this.specialSpeciesDescripObj);
        break;
      }
      case this.specialSpeicesDescrips.infernal: {
        this.specialSpeciesDescripObj.descrip = this.getDescripFromArray(INFERNAL_DESCRIP, this.specialSpeciesDescripObj);
        break;
      }
      case this.specialSpeicesDescrips.divine: {
        this.specialSpeciesDescripObj.descrip = this.getDescripFromArray(DIVINE_DESCRIP, this.specialSpeciesDescripObj);
        break;
      }
      case this.specialSpeicesDescrips.lizard: {
        this.specialSpeciesDescripObj.descrip = this.getDescripFromArray(LIZARD_DESCRIP, this.specialSpeciesDescripObj);
        break;
      }
      case this.specialSpeicesDescrips.snake: {
        this.specialSpeciesDescripObj.descrip = this.getDescripFromArray(SNAKE_DESCRIP, this.specialSpeciesDescripObj);
        break;
      }
      case this.specialSpeicesDescrips.dragon: {
        this.specialSpeciesDescripObj.descrip = this.getDescripFromArray(DRAGON_DESCRIP, this.specialSpeciesDescripObj);
        break;
      }
      case this.specialSpeicesDescrips.hexblood: {
        this.specialSpeciesDescripObj.descrip = this.getDescripFromArray(HEXBLOOD_DESCRIP, this.specialSpeciesDescripObj);
        break;
      }
      case this.specialSpeicesDescrips.cat: {
        this.specialSpeciesDescripObj.descrip = this.getDescripFromArray(CAT_DESCRIP, this.specialSpeciesDescripObj);
        break;
      }
      case this.specialSpeicesDescrips.fire: {
        this.specialSpeciesDescripObj.descrip = this.getDescripFromArray(FIRE_DESCRIP, this.specialSpeciesDescripObj);
        break;
      }
      case this.specialSpeicesDescrips.water: {
        this.specialSpeciesDescripObj.descrip = this.getDescripFromArray(WATER_DESCRIP, this.specialSpeciesDescripObj);
        break;
      }
      case this.specialSpeicesDescrips.air: {
        this.specialSpeciesDescripObj.descrip = this.getDescripFromArray(AIR_DESCRIP, this.specialSpeciesDescripObj);
        break;
      }
      case this.specialSpeicesDescrips.earth: {
        this.specialSpeciesDescripObj.descrip = this.getDescripFromArray(EARTH_DESCRIP, this.specialSpeciesDescripObj);
        break;
      }
      case this.specialSpeicesDescrips.fish: {
        this.specialSpeciesDescripObj.descrip = this.getDescripFromArray(FISH_DESCRIP, this.specialSpeciesDescripObj);
        break;
      }
      case this.specialSpeicesDescrips.lamia: {
        this.specialSpeciesDescripObj.descrip = this.getDescripFromArray(LAMIA_DESCRIP, this.specialSpeciesDescripObj);
        break;
      }
      case this.specialSpeicesDescrips.horse: {
        this.specialSpeciesDescripObj.descrip = this.getDescripFromArray(CENTAUR_DESCRIP, this.specialSpeciesDescripObj);
        break;
      }
      case this.specialSpeicesDescrips.plant: {
        this.specialSpeciesDescripObj.descrip = this.getDescripFromArray(PLANT_DESCRIP, this.specialSpeciesDescripObj);
        break;
      }
      case this.specialSpeicesDescrips.unicorn: {
        this.specialSpeciesDescripObj.descrip = this.getDescripFromArray(UNICORN_DESCRIP, this.specialSpeciesDescripObj);
        break;
      }
      case this.specialSpeicesDescrips.sphinx: {
        this.specialSpeciesDescripObj.descrip = this.getDescripFromArray(SPHINX_DESCRIP, this.specialSpeciesDescripObj);
        break;
      }
      case this.specialSpeicesDescrips.medusa: {
        this.specialSpeciesDescripObj.descrip = this.getDescripFromArray(MEDUSA_DESCRIP, this.specialSpeciesDescripObj);
        break;
      }
      case this.specialSpeicesDescrips.dog: {
        this.specialSpeciesDescripObj.descrip = this.getDescripFromArray(CANID_DESCRIP, this.specialSpeciesDescripObj);
        break;
      }
      case this.specialSpeicesDescrips.goblin: {
        this.specialSpeciesDescripObj.descrip = this.getDescripFromArray(GOBLIN_DESCRIP, this.specialSpeciesDescripObj);
        break;
      }
      case this.specialSpeicesDescrips.kobold: {
        this.specialSpeciesDescripObj.descrip = this.getDescripFromArray(KOBOLD_DESCRIP, this.specialSpeciesDescripObj);
        break;
      }
      case this.specialSpeicesDescrips.rabbit: {
        this.specialSpeciesDescripObj.descrip = this.getDescripFromArray(RABBIT_DESCRIP, this.specialSpeciesDescripObj);
        break;
      }
      case this.specialSpeicesDescrips.feathers: {
        this.specialSpeciesDescripObj.descrip = this.getDescripFromArray(FEATHERS_DESCRIP, this.specialSpeciesDescripObj);
        break;
      }
      default: {
        this.specialSpeciesDescripObj.descrip = '';
        this.specialSpeciesDescripObj.prevRoll = -1;
      }
    }

    this.fixPronouns();
  }

  private fixPronouns() {
    if (this.pronounsObj.pronouns_main === 'He') {
      this.specialSpeciesDescripObj.descrip = this.specialSpeciesDescripObj.descrip
      .replace(/(^|\b)they are\b/g, 'he is')
        .replace(/(^|\b)they\b/g, 'he')
        .replace(/(^|\b)them\b/g, 'him')
        .replace(/(^|\b)their\b/g, 'his')
        .replace(/(^|\b)she\b/g, 'he')
        .replace(/(^|\b)her\b/g, 'his');

      this.distinguishingFeatureObj.descrip = this.distinguishingFeatureObj.descrip
      .replace(/(^|\b)they are\b/g, 'he is')
        .replace(/(^|\b)they\b/g, 'he')
        .replace(/(^|\b)them\b/g, 'him')
        .replace(/(^|\b)their\b/g, 'his')
        .replace(/(^|\b)she\b/g, 'he')
        .replace(/(^|\b)her\b/g, 'his')
        .replace(/(^|\b)her\b/g, 'his');

      this.hairObj.hairLength = this.hairObj.hairLength
      .replace(/(^|\b)they\b/g, 'he')
      .replace(/(^|\b)them\b/g, 'him')
      .replace(/(^|\b)their\b/g, 'his')
      .replace(/(^|\b)she\b/g, 'he')
      .replace(/(^|\b)her\b/g, 'his')
      .replace(/(^|\b)her\b/g, 'his');

    } else if (this.pronounsObj.pronouns_main === 'They') {
      this.specialSpeciesDescripObj.descrip = this.specialSpeciesDescripObj.descrip
      .replace(/(^|\b)he is\b/g, 'they are')
        .replace(/(^|\b)he\b/g, 'they')
        .replace(/(^|\b)him\b/g, 'them')
        .replace(/(^|\b)his\b/g, 'their')
        .replace(/(^|\b)she is\b/g, 'they are')
        .replace(/(^|\b)she\b/g, 'they')
        .replace(/(^|\b)her\b/g, 'their');

      this.distinguishingFeatureObj.descrip = this.distinguishingFeatureObj.descrip
      .replace(/(^|\b)he is\b/g, 'they are')
        .replace(/(^|\b)he\b/g, 'they')
        .replace(/(^|\b)him\b/g, 'them')
        .replace(/(^|\b)his\b/g, 'their')
        .replace(/(^|\b)she is\b/g, 'they are')
        .replace(/(^|\b)she\b/g, 'they')
        .replace(/(^|\b)her\b/g, 'their');

        this.hairObj.hairLength = this.hairObj.hairLength
        .replace(/(^|\b)his\b/g, 'their')
        .replace(/(^|\b)her\b/g, 'their')

    } else if (this.pronounsObj.pronouns_main === 'She') {
      this.specialSpeciesDescripObj.descrip = this.specialSpeciesDescripObj.descrip
      .replace(/(^|\b)they are\b/g, 'she is')
        .replace(/(^|\b)they\b/g, 'she')
        .replace(/(^|\b)them\b/g, 'her')
        .replace(/(^|\b)their\b/g, 'her')
        .replace(/(^|\b)he\b/g, 'she')
        .replace(/(^|\b)him\b/g, 'her')
        .replace(/(^|\b)his\b/g, 'her');

      this.distinguishingFeatureObj.descrip = this.distinguishingFeatureObj.descrip
        .replace(/(^|\b)they are\b/g, 'she is')  
        .replace(/(^|\b)they\b/g, 'she')
        .replace(/(^|\b)them\b/g, 'her')
        .replace(/(^|\b)their\b/g, 'her')
        .replace(/(^|\b)he\b/g, 'she')
        .replace(/(^|\b)him\b/g, 'her')
        .replace(/(^|\b)his\b/g, 'her');

        this.hairObj.hairLength = this.hairObj.hairLength
        .replace(/(^|\b)they\b/g, 'she')
        .replace(/(^|\b)them\b/g, 'her')
        .replace(/(^|\b)their\b/g, 'her')
        .replace(/(^|\b)he\b/g, 'she')
        .replace(/(^|\b)him\b/g, 'her')
        .replace(/(^|\b)his\b/g, 'her');
    }
  }

  reRollSkinTone() {
    this.uniqueSkin = {
      outsider: false,
      fur: false,
      bark: false,
      hide: false,
    };

    for (const [key, value] of Object.entries(this.uniqueSkin)) {
      if (key in this.speciesObj.species) {
        this.uniqueSkin[key] = true
      }
    }

    let skinTone = '';

    if (this.uniqueSkin.outsider) {
      skinTone = this.getDescripFromArray(SKIN_OUTSIDER, this.skinObj);
      if (['Dragonborn', 'Serpentfolk', 'Lizardfolk', 'Kobold'].includes(this.speciesObj.species.name)) {
        this.skinAdjective = 'scales';
      } else {
        this.skinAdjective = 'skin';
      }
    } else if (this.uniqueSkin.fur) {
      skinTone = this.getDescripFromArray(SKIN_FUR, this.skinObj);
      this.skinAdjective = 'fur';
    } else if (this.uniqueSkin.hide) {
      skinTone = this.getDescripFromArray(SKIN_MARINE, this.skinObj);
      this.skinAdjective = 'hide';
    } else if (this.uniqueSkin.bark) {
      skinTone = this.getDescripFromArray(SKIN_WOOD, this.skinObj);
      this.skinAdjective = 'bark';
    } else {
      skinTone = this.getDescripFromArray(SKIN_TONE, this.skinObj);
      this.skinAdjective = 'skin';
    }
    this.skinObj.descrip = skinTone;
  }

  reRollBuild() {
    this.buildObj.descrip = this.getDescripFromArray(BUILD, this.buildObj);
  }

  reRollHairLength() {
    this.hairObj.hairLength = this.getHairLength();
    this.fixPronouns();
  }

  reRollHairType() {
    this.hairObj.hairType = this.getHairType();
  }

  reRollHairColor() {
    this.hairObj.hairColor = this.getHairColor();
  }

  reRollEyeColor() {
    this.eyeColorObj.descrip = this.getDescripFromArray(EYE_COLORS, this.eyeColorObj);
  }

  reRollDistinguishingFeature() {
    this.distinguishingFeatureObj.descrip = this.getDescripFromArray(DISTINGUISHING_FEATURES, this.distinguishingFeatureObj);
    this.fixPronouns();
  }

  getPronouns() { // cant use generic
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

  getSpecies() { // cant use generic
    const speciesLength = SPECIES.length - 1;
    const rolledSpecies = this.randNum.getRandomNumber(0, speciesLength, this.speciesObj.prevRoll);
    this.speciesObj.prevRoll = rolledSpecies;

    return SPECIES[rolledSpecies];
  }

  getHairLength() {
    const hairLengthLength = HAIR_LENGTH.length - 1;
    const startingIndex = this.speciesObj.species.name !== 'Gorgon' ? 0 : 1;
    const rolledLength = this.randNum.getRandomNumber(startingIndex, hairLengthLength, this.hairObj.lastLength);
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

  getDescripFromArray(specialDescrips: Array<any>, obj: {descrip: string, prevRoll: number}): string {
    const arrayLength = specialDescrips.length - 1;
    const rolledValue = this.randNum.getRandomNumber(0, arrayLength, obj.prevRoll);
    obj.prevRoll = rolledValue;

    return specialDescrips[rolledValue];
  }

  checkForVowel() {
    const vowels = 'AEIOU';
    return this.speciesObj.species.name.indexOf('Unicorn') !== -1 ? false : vowels.indexOf(this.speciesObj.species.name[0]) !== -1;
  }
}
