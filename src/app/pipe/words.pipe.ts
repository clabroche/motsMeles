import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'words'
})
export class WordsPipe implements PipeTransform {

  transform(words: any, args?: any): any {
    const categoriesObject = {};
    words.map(word => {
      if (!categoriesObject[word.word.length]) categoriesObject[word.word.length] = [];
      categoriesObject[word.word.length].push(word);
    });
    return Object.keys(categoriesObject).map(key => {
      return { nbLetters: key, letters: categoriesObject[key] };
    });
  }

}
