export class MainController {
  constructor(WikiQuote) {
    'ngInject';

    this.WikiQuote = WikiQuote;

    this.WikiQuote.openSearch('Washington').then(function(result){
      console.log(result);
    })
  }
}
