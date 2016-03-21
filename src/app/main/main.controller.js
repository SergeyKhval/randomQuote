export class MainController {
  constructor($log, WikiQuote) {
    'ngInject';

    this.$log = $log;
    this.WikiQuote = WikiQuote;

    this.WikiQuote.openSearch('Washington').then(result => {
      this.$log.log(result);
    })
  }
}
