import Prism from 'prismjs';

import PropTypes from 'prop-types';
import React, { useState } from 'react';


function CodeView({ code, language, multiline, plugins }) {
  const [env] = useState(() => {
    return {
      __html: Prism.highlight(code, Prism.languages[language], language)
    };
  });


  const activePlugins = plugins || [];
  if (multiline && !plugins) {
    activePlugins.push('line-numbers');
  }

  return (
    <pre className={`language-${language}`}>
      <code
        className={`language-${language}`}
        dangerouslySetInnerHTML={env}
      />
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
