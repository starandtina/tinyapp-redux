if(!self.__appxInited) {
self.__appxInited = 1;


require('./config$');
require('./importScripts$');

var AFAppX = self.AFAppX;
self.getCurrentPages = AFAppX.getCurrentPages;
self.getApp = AFAppX.getApp;
self.Page = AFAppX.Page;
self.App = AFAppX.App;
self.my = AFAppX.bridge || AFAppX.abridge;
self.abridge = self.my;
self.Component = AFAppX.WorkerComponent || function(){};
self.$global = AFAppX.$global;

function success() {
require('../app');
require('../components/FilterButton/FilterButton');
require('../pages/todos/todos');
require('../pages/add-todo/add-todo');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
}