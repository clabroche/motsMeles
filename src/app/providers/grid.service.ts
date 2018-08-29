import { Injectable, OnInit } from '@angular/core';
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

  constructor() {
    this.generateGrid(10, 10);
  }

  generateGrid(width, height) {
    this.width = width;
    this.height = height;
    this.grid = Array(this.height).fill('').map(y => Array(this.width).fill('°'));
    this.allWords = [];
    this.possibilities = [];
    this.grid.map((line, y) => {
      line.map((_, x) => {
        this.possibilities.push({ x, y });
      });
    });
    this.nbWordToPlaceInGrid = (this.width * this.height) / 10;
    this.placeWords();
    this.shufflingEmptySlot();
  }

  shufflingEmptySlot() {
    const letters = 'abcdefghijklmnopqrstuvwyàéèçeê';
    for (let y = 0; y < this.grid.length; y++) {
        for (let x = 0; x < this.grid[y].length; x++) {
            if (this.grid[x][y] === '°') { this.grid[x][y] = letters.charAt(Math.floor(Math.random() * letters.length)); }
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
        if (this.grid[y][toX] === '°' || this.grid[y][toX] === letter) {
            wordLocations.push({letter, x: toX, y});
        } else { placed = false; }
    }

    if (placed) {
        this.allWords.push(word);
        return this.integrateChanges(wordLocations);
    }
  }

  placeToBottom(word, x, y, direction) {
    let placed = true;
    const wordLocations = [];
    for (let i = 0; i < word.length; i ++) {
        const letter = word[i];
        const toY = y + i * direction;
        if (this.grid[toY] && (this.grid[toY][x] === '°' || this.grid[toY][x] === letter)) {
            wordLocations.push({letter, x, y: toY});
        } else { placed = false; }
    }
    if (placed) {
        this.allWords.push(word);
        return this.integrateChanges(wordLocations);
    }
  }
  integrateChanges(wordLocations) {
    wordLocations.map(location => {
        this.grid[location.y][location.x] = location.letter;
    });
    return true;
  }
}
