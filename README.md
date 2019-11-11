calvium-hooks-web - Reusable Hooks for React JS Web Development
=========

useDimensions
----

For measuring DOM nodes.

Example usage:

```
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
