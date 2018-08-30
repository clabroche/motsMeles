import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
const dico = require('./liste_francais.json');

@Injectable({
  providedIn: 'root'
})
export class GridService {
  width = 0;
  height = 0;
  nbWordToPlaceInGrid = 0;
  allWords = [];
  possibilities = [];
  grid = [];
  gridError = new Subject();
  end = false;

  constructor() {}

  generateGrid(width, height, hidden = true) {
    if (width < 1 || height < 1) return this.gridError.next('La hauteur et la largeur sont supérieurs à 0');
    this.end = false;
    this.width = width;
    this.height = height;
    this.grid = Array(this.height).fill('').map(y => Array(this.width).fill('°'));
    this.allWords = [];
    this.possibilities = [];
    this.grid.map((line, y) => {
      line.map((_, x) => {
        this.possibilities.push({ x, y });
        this.grid[y][x] = { x, y, letter: '°', selected: false, foundY: false, foundX: false};
      });
    });
    this.nbWordToPlaceInGrid = (this.width * this.height) / 10;
    this.placeWords();
    if (hidden) this.shufflingEmptySlot();
  }

  shufflingEmptySlot() {
    const letters = 'abcdefghijklmnopqrstuvwyàéèçeê';
    for (let y = 0; y < this.grid.length; y++) {
        for (let x = 0; x < this.grid[y].length; x++) {
          if (this.grid[y][x].letter === '°') {
            this.grid[y][x].letter = letters.charAt(Math.floor(Math.random() * letters.length));
          }
        }
    }
  }
  getWord() {
    return dico[Math.floor(Math.random() * dico.length)];
  }

  placeWords() {
    for (let i = 0; i < this.nbWordToPlaceInGrid; i++) {
        const randomPosibilityIndex = Math.floor(Math.random() * this.possibilities.length);
        const randomPosibility = this.possibilities.splice(randomPosibilityIndex, 1).pop();
        this.placeWord(randomPosibility.x, randomPosibility.y);
    }
  }

  placeWord(x, y, retry = 5000) {
    let placed = false;
    const word = this.getWord();
    if (Math.floor(Math.random() * 2)) {
      placed = this.placeToRight(word, x, y, Math.floor(Math.random() * 2) ? 1 : -1);
    } else {
      placed = this.placeToBottom(word, x, y, Math.floor(Math.random() * 2) ? 1 : -1);
    }
    if (!retry) { return false; }
    if (!placed) {
        return this.placeWord(x, y, retry - 1);
    }
  }

  placeToRight(word, x, y, direction) {
    let placed = true;
    const wordLocations = [];
    for (let i = 0; i < word.length; i++) {
        const letter = word[i];
        const toX = x + i * direction;
        if (this.grid[y][toX] && (this.grid[y][toX].letter === '°' || this.grid[y][toX].letter === letter)) {
            wordLocations.push({letter, x: toX, y});
        } else { placed = false; }
    }

    if (placed) {
        this.allWords.push({word, found: false});
        return this.integrateChanges(wordLocations);
    }
  }

  placeToBottom(word, x, y, direction) {
    let placed = true;
    const wordLocations = [];
    for (let i = 0; i < word.length; i ++) {
        const letter = word[i];
        const toY = y + i * direction;
        if (this.grid[toY] && (this.grid[toY][x].letter === '°' || this.grid[toY][x].letter === letter)) {
            wordLocations.push({letter, x, y: toY});
        } else { placed = false; }
    }
    if (placed) {
        this.allWords.push({word, found: false});
        return this.integrateChanges(wordLocations);
    }
  }
  integrateChanges(wordLocations) {
    wordLocations.map(location => {
        this.grid[location.y][location.x].letter = location.letter;
    });
    return true;
  }

  selectWord(letter1, letter2) {
    if (!(letter1.x === letter2.x || letter1.y === letter2.y))
      this.gridError.next('La ligne n`est pas valide');

    const letters = [];
    let direction = '';
    // vertical bottom
    if (letter1.x === letter2.x && letter1.y < letter2.y) {
      for (let y = letter1.y; y < letter2.y; y++) {
        letters.push(this.grid[y][letter1.x]);
      }
      direction = 'Y';
    }
    // vertical top
    if (letter1.x === letter2.x && letter1.y > letter2.y) {
      for (let y = letter1.y; y > letter2.y; y--) {
        letters.push(this.grid[y][letter1.x]);
      }
      direction = 'Y';
    }
    // horizontal right
    if (letter1.x < letter2.x && letter1.y === letter2.y) {
      for (let x = letter1.x; x < letter2.x; x++) {
        letters.push(this.grid[letter1.y][x]);
      }
      direction = 'X';
    }
    // horizontal left
    if (letter1.x > letter2.x && letter1.y === letter2.y) {
      for (let x = letter1.x; x > letter2.x; x--) {
        letters.push(this.grid[letter1.y][x]);
      }
      direction = 'X';
    }
    letters.push(letter2);
    const word = letters.map(letter => letter.letter).join('');
    let found = false;
    this.allWords.forEach(_word => {
      if (_word.word === word) {
        found = true;
        _word.found = true;
      }
    });
    if (found) {
      if (direction === 'X') letters.map(_letters => _letters.foundX = true);
      if (direction === 'Y') letters.map(_letters => _letters.foundY = true);
      const end = this.allWords.map(_word => _word.found).filter(_word => _word);
      if (end.length === this.allWords.length) this.end = true;
    }

  }
}
