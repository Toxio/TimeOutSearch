import { App } from './app';

var app = new App();

$('#add').on('click', (e) => {
  let visitor = $('#search');
  if (visitor.val()) app.addVisitor(visitor.val());
  visitor.val('');
});

$('#clearAll').on('click', (e) => {
  app.clearAll();
});
