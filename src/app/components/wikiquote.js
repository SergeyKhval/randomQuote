export class WikiQuote {
  constructor($http, $log) {
    'ngInject';

    this.$http = $http;
    this.$log = $log;
    this.apiHost = "http://en.wikiquote.org/w/api.php";
  }

  openSearch(title) {
    var config = {
      params: {
        action: "opensearch",
        format: "json",
        search: title,
        callback: "JSON_CALLBACK"
      }
    };

    return this.$http.jsonp(this.apiHost, config).then(response => {
      return response;
    }).catch(() => {
      this.$log.log('Request to wikiquote api with opensearch action failed');
    })
  }
}
