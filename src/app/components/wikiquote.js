export class WikiQuote {
  constructor($http) {
    'ngInject';

    this.$http = $http;
    this.apiHost = "http://en.wikiquote.org/w/api.php";
  }

  queryTitles(titles) {
    return this.$http({
      method: 'JSONP',
      url: this.apiHost,
      data: {
        format: "json",
        action: "query",
        redirects: "",
        titles: titles
      }
    }).then(function (result) {
      var pages = result.query.pages;
      var pageId = -1;
      for (var p in pages) {
        var page = pages[p];
        // api can return invalid recrods, these are marked as "missing"
        if (!("missing" in page)) {
          pageId = page.pageid;
          break;
        }
      }
      if (pageId > 0) {
        return pageId;
      } else {
        return error("No results");
      }
    }).catch(function () {
      error("Error processing your query");
    })
  }

  getSectionsForPage(pageId, success, error) {
    this.$http({
      method: 'JSONP',
      url: this.apiHost,
      data: {
        format: "json",
        action: "parse",
        prop: "sections",
        pageid: pageId
      }
    }).then(function (result) {
      var sectionArray = [];
      var sections = result.parse.sections;
      for (var s in sections) {
        var splitNum = sections[s].number.split('.');
        if (splitNum.length > 1 && splitNum[0] === "1") {
          sectionArray.push(sections[s].index);
        }
      }
      // Use section 1 if there are no "1.x" sections
      if (sectionArray.length === 0) {
        sectionArray.push("1");
      }
      success({
        titles: result.parse.title,
        sections: sectionArray
      });
    }).catch(function () {
      error("Error getting sections");
    });
  }

  getQuotesForSection(pageId, sectionIndex, success, error) {
    this.$http({
      method: 'JSONP',
      url: this.apiHost,
      data: {
        format: "json",
        action: "parse",
        noimages: "",
        pageid: pageId,
        section: sectionIndex
      }
    }).then(function (result) {
      var quotes = result.parse.text["*"];
      var quoteArray = []

      // Find top level <li> only
      var $lis = $(quotes).find('li:not(li li)');
      $lis.each(function () {
        // Remove all children that aren't <b>
        $(this).children().remove(':not(b)');
        var $bolds = $(this).find('b');

        // If the section has bold text, use it.  Otherwise pull the plain text.
        if ($bolds.length > 0) {
          quoteArray.push($bolds.html());
        } else {
          quoteArray.push($(this).html());
        }
      });
      success({
        titles: result.parse.title,
        quotes: quoteArray
      });
    }).catch(function () {
      error("Error getting quotes");
    })
  }

  getRandomQuote(titles) {

    var errorFunction = function (msg) {
      error(msg);
    };

    var chooseQuote = function (quotes) {
      var randomNum = Math.floor(Math.random() * quotes.quotes.length);
      success({
        titles: quotes.titles,
        quote: quotes.quotes[randomNum]
      });
    };

    var getQuotes = function (pageId, sections) {
      var randomNum = Math.floor(Math.random() * sections.sections.length);
      this.getQuotesForSection(pageId, sections.sections[randomNum], chooseQuote, errorFunction);
    };

    var getSections = function (pageId) {
      this.getSectionsForPage(pageId, function (sections) {
        getQuotes(pageId, sections);
      }, errorFunction);
    };

    this.queryTitles(titles, getSections, errorFunction);
  }

  openSearch(titles) {
    return $http({
      url: this.apiHost,
      method: 'JSONP',
      data: {
        format: "json",
        action: "opensearch",
        namespace: 0,
        suggest: "",
        search: titles
      }
    }).then(function (response) {
      return response[1];
    }).catch(function () {
      error("Error with opensearch for " + titles);
    });
  }
}

