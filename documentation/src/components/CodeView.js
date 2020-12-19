import Prism from 'prismjs';

import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';


function CodeView({ code, language, multiline, plugins }) {
  const codeRef = useRef(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current)
    }
  }, [code]);

  const activePlugins = plugins || [];
  if (multiline && !plugins) {
    activePlugins.push('line-numbers');
  }

  return (
    <pre className={activePlugins.join(" ")}>
      <code ref={codeRef} className={`language-${language}`}>
        {code.trim()}
      </code>
    </pre>
  );
}

CodeView.propTypes = {
  code: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  multiline: PropTypes.bool,
  plugins: PropTypes.array,
};

CodeView.defaultProps = {
  multiline: false,
};

export default CodeView;
