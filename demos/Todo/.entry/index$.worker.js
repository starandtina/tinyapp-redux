
require('./config$');
require('./importScripts$');
function success() {
require('../app');
require('../components/FilterButton/FilterButton');
require('../pages/todos/todos');
require('../pages/add-todo/add-todo');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
