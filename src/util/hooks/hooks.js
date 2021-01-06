import { useEffect, useRef } from 'react';

import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

/**
 * See: https://reactjs.org/docs/hooks-faq.html
 * @param value
 */
export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}


/**
 *
 * @param {function} initFunc
 * @param {function} disposer
 */
export function useInit(initFunc, disposer) {
  useEffect(() => {
    initFunc();

    return disposer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/**
 * Be careful using this hook. It only works because the number of
 * breakpoints in theme is static. It will break once you change the number of
 * breakpoints.
 * See https://reactjs.org/docs/hooks-rules.html#only-call-hooks-at-the-top-level
 *
 * @attribution
 * https://material-ui.com/components/use-media-query/#migrating-from-withwidth
 */
export function useWidth() {
  const theme = useTheme();
  const keys = [...theme.breakpoints.keys].reverse();
  return (
    keys.reduce((output, key) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const matches = useMediaQuery(theme.breakpoints.up(key));
      return !output && matches ? key : output;
    }, null) || undefined
  );
}


/**
 * Utility hook to help determine why/when a component is re-rendered
 * @param {object} props
 */
export function useTraceUpdate(props) {
  const prev = useRef(props);
  useEffect(() => {
    const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
      if (prev.current[k] !== v) {
        ps[k] = [prev.current[k], v];
      }
      return ps;
    }, {});

    if (Object.keys(changedProps).length > 0) {
      console.log('Changed props:', changedProps);
    }
    prev.current = props;
  });
}
