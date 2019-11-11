import * as ReactDOM from 'react-dom';

describe('it', () => {
  it('is a sample test', () => {
    const div = document.createElement('div');
    ReactDOM.unmountComponentAtNode(div);
  });
});
