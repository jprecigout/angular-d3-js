import { AngularD3JsPage } from './app.po';

describe('angular-d3-js App', function() {
  let page: AngularD3JsPage;

  beforeEach(() => {
    page = new AngularD3JsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
