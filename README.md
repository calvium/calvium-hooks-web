calvium-hooks-web - Reusable Hooks for React JS Web Development
=========

useDimensions
----

For measuring DOM nodes.

Example usage:

```typescript
const Item = props => {
  const {dimensions, measureRef} = useDimensions({liveMeasure:true});
  //     ^ null or sizes  ^ pass into the ref prop of the item to measure

  // Measure size of window, and pass into the child component explicitly:
  return <Placeholder ref={measureRef}>
    {dimensions ? <ChildThatNeedsSize
      width={dimensions.width}
      height={dimensions.height}
    /> : null}
  </Placeholder>
};
```

useLocalStorage
---

For saving and retrieving items from local storage

```typescript

type MyData = {
  foo:string,
  bar:number[],
}

const initialData = {
  foo: 'hello',
  bar: [1,2,3],
}

const Component = () => {
 const [data, setData] = useLocalStorage<MyData>('my-data-key', initialData);
 // data and setData now work just like useState.

 return <div></div>
} 
```

useMousePosition
---

For tracking the X and Y of the mouse cursor

```typescript
const Component = () => {
 const {x, y} = useMousePosition();
 // x and y in pixel screen coordinates

 return null
} 
```

useEventListener
---

This hook runs a handler function on the given DOM event.
It handles checking if addEventListener is supported, adding the event listener, and removal on cleanup.

Source: https://usehooks.com/useEventListener/

```typescript
// Usage
function App() {
  // State for storing mouse coordinates
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  // Event handler utilizing useCallback ...
  // ... so that reference never changes.
  const handler = useCallback(
    ({ clientX, clientY }) => {
      // Update coordinates
      setCoords({ x: clientX, y: clientY });
    },
    [setCoords]
  );
  // Add event listener using our hook
  useEventListener("mousemove", handler);
  return (
    <h1>
      The mouse position is ({coords.x}, {coords.y})
    </h1>
  );
}
```
