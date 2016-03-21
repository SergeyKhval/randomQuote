export class MainController {
  constructor($log, WikiQuote) {
    'ngInject';

    this.$log = $log;
    this.WikiQuote = WikiQuote;

    this.result = null;
  }

  searchWiki(title){
    this.WikiQuote.openSearch(title).then( response => {
      this.$log.log(response.data);
      this.result = response.data[1];
    })
  }
}
