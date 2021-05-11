import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  useMousePosition,
  useEventListener,
  useLocalStorage,
  useDimensions,
} from '../.';
import { useCallback, useState } from 'react';

const App = () => {
  const [value, setValue] = useLocalStorage('my-value', 0);

  const { x, y } = useMousePosition();

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const handleResize = useCallback((e: Event) => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);
  useEventListener('resize', handleResize);

  const { dimensions, measureRef } = useDimensions({ liveMeasure: true });

  return (
    <div>
      <h1>useLocalStorage</h1>

      <button onClick={() => setValue(v => v + 1)}>
        Increment Local Storage Value
      </button>
      <button onClick={() => setValue(0)}>Reset</button>
      <h2>{value}</h2>
      <hr />

      <h1>useMousePosition</h1>

      <h2>
        {x ?? 'N/A'}x{y ?? 'N/A'}
      </h2>

      <hr />

      <h1>useEventListener (resize)</h1>

      <h2>
        {windowSize.width ?? 'N/A'}x{windowSize.height ?? 'N/A'}
      </h2>

      <hr />

      <h1>useDimensions</h1>
      <div
        ref={measureRef}
        style={{
          backgroundColor: 'orange',
          height: '20vh',
          width: '80vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {!!dimensions && (
          <h2>
            {Math.floor(dimensions.width)}x{Math.floor(dimensions.height)}
          </h2>
        )}
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
