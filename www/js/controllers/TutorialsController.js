controllers.controller('TutorialsController@startup', function(LocalDb,Brightness,$scope, $state,$ionicHistory,$ionicSideMenuDelegate) {
  'use strict';

  if(LocalDb.getObject('firstLoad')===undefined)
  {
    LocalDb.set('firstLoad',true);
  }
  else
  {
    if(LocalDb.getObject('firstLoad')!==true)
      {
        LocalDb.set('firstLoad',true);
      }
    else
      {
        $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
        $state.go('welcome');
      }
  }
  Brightness.set(1);
});
controllers.controller('TutorialsController@how-it-work1', function(LocalDb,Brightness,$scope, $state,$ionicSideMenuDelegate) {
  'use strict';
  LocalDb.set('firstLoad',false);
 Brightness.set(1);
});
controllers.controller('TutorialsController@how-it-work2', function(LocalDb,Brightness,$scope, $state,$ionicSideMenuDelegate) {
  'use strict';
  LocalDb.set('firstLoad',false);
Brightness.set(1);
});
controllers.controller('TutorialsController@important-page', function(LocalDb,Brightness,$scope, $state,$ionicSideMenuDelegate) {
  'use strict';
  LocalDb.set('firstLoad',false);
Brightness.set(1);
});