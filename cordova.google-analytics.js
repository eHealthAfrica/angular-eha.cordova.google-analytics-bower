'use strict';
(function() {

  /**
   * @ngdoc directive
   * @name ehaGaClick
   * @module eha.cordova.google-analytics
   */
  var ngModule = angular
                  .module('eha.cordova.google-analytics.directive', [
                    'eha.cordova.google-analytics.provider'
                  ]);

  ngModule.directive('ehaGaClick', ['ehaGoogleAnalytics', function(ehaGoogleAnalytics) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        function trackClick() {
          ehaGoogleAnalytics.trackEvent(
            'Click', element.text().trim(), attrs.ehaGaClick.trim()
          );
        }
        element.on('click', trackClick);
      }
    };
  }]);

  // Check for and export to commonjs environment
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ngModule;
  }
}());

'use strict';
(function() {

  /**
   * @ngdoc provider
   * @name ehaGoogleAnalytics
   * @module eha.cordova.google-analytics
   */
  var ngModule = angular
                  .module('eha.cordova.google-analytics.provider', []);

  function ehaGoogleAnalytics() {
    var self = this;

    this.trackingID = '';
    this.$get = ['$log', '$window', '$rootScope', function($log, $window, $rootScope) {
      function GoogleAnalytics(trackingID) {
        function registerListeners() {
          function trackView(event, state) {
            $window.analytics.trackView(state.name);
          }
          function trackStateNotFound(event, unfoundState, fromState) {
            $window.analytics.trackEvent(
              'stateNotFound', unfoundState.to, fromState
            );
          }
          $rootScope.$on('$stateChangeSuccess', trackView);
          $rootScope.$on('$stateNotFound', trackStateNotFound);
        }

        this.trackEvent = angular.noop;
        this.setUserId = angular.noop;

        if ($window.analytics) {
          $window.analytics.startTrackerWithId(trackingID);
          registerListeners();
          this.trackEvent = $window.analytics.trackEvent;
          this.setUserId = $window.analytics.setUserId;
        }
      }

      return new GoogleAnalytics(self.trackingID);
    }];
  }

  ngModule.provider('ehaGoogleAnalytics', ehaGoogleAnalytics);

  // Check for and export to commonjs environment
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ngModule;
  }
}());

'use strict';
(function() {

  var ngModule = angular.module('eha.cordova.google-analytics', [
    'eha.cordova.google-analytics.provider',
    'eha.cordova.google-analytics.directive'
  ]);

  // Check for and export to commonjs environment
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ngModule;
  }

}());
