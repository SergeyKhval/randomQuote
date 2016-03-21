import { config } from './index.config';
import { routerConfig } from './index.route';
import { runBlock } from './index.run';
import { MainController } from './main/main.controller';
import { WikiQuote } from '../app/components/wikiquote';

angular.module('randomquote', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngMessages', 'ngResource', 'ngRoute', 'ui.bootstrap'])
  .config(config)
  .config(routerConfig)
  .run(runBlock)
  .service('WikiQuote', WikiQuote)
  .controller('MainController', MainController);
//as
