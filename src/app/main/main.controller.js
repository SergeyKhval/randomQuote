export class MainController {
  constructor($http) {
    'ngInject';

    this.$http = $http;
    this.quote = '';

    this.getRandomQuote();
  }

  getRandomQuote() {
    console.log('clicked');
    this.$http({
      method: 'GET',
      url: "http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1&callback="
    }).then(response => {
      console.log(response.data);
      this.quote = response.data[0].content;
    })
  }

}
