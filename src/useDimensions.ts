import {useState, useCallback, useLayoutEffect} from 'react';

// source https://github.com/Swizec/useDimensions/blob/master/src/index.ts
// Altered to pass TS strict checks

export interface DimensionObject {
  width: number;
  height: number;
  top: number;
  left: number;
  x: number;
  y: number;
  right: number;
  bottom: number;
}

export type UseDimensionsHook = {
  /**
   * put on the 'ref' prop of the component to measure
   */
  measureRef: (node: any /* HTMLElement is not right */) => void;
  /**
   * the dimensions appear here when ready
   */
  dimensions: null | DimensionObject;
  /**
   * returns the DOM node
   */
  node: HTMLElement | null; // BC added null here and converted to an object
};

export interface UseDimensionsArgs {
  liveMeasure?: boolean;
}

function getDimensionObject(node: HTMLElement): DimensionObject {
  const rect = node.getBoundingClientRect();

  return {
    width: rect.width,
    height: rect.height,
    top: rect.x ?? rect.top,
    left: rect.y ?? rect.left,
    x: rect.x ?? rect.left,
    y: rect.y ?? rect.top,
    right: rect.right,
    bottom: rect.bottom,
  };
}

/**
 * For measuring dom nodes
 *
 * See https://github.com/Swizec/useDimensions
 *
 * BC: didn't use the npm package are there are no TS types - and there are TS errors
 *
 * Usage: assign the returned 'ref' object to the ref prop of the component to measure
 */
function useDimensions({liveMeasure = true}: UseDimensionsArgs = {}): UseDimensionsHook {
  const [dimensions, setDimensions] = useState<DimensionObject | null>(null);
  const [node, setNode] = useState<null | HTMLElement>(null);

  const ref = useCallback(node => {
    setNode(node);
  }, []);

  useLayoutEffect(() => {
    if (node) {
      const measure = () =>
        window.requestAnimationFrame(() => {
          return setDimensions(getDimensionObject(node));
        });
      measure();

      if (liveMeasure) {
        window.addEventListener('resize', measure);
        window.addEventListener('scroll', measure);

        return () => {
          window.removeEventListener('resize', measure);
          window.removeEventListener('scroll', measure);
        };
      }

    }
    return undefined;
  }, [node, liveMeasure]);

  return {measureRef: ref, dimensions, node};
}

export {useDimensions};
