import Prism from 'prismjs';

import PropTypes from 'prop-types';
import React, { useState } from 'react';


function CodeView({ code, language }) {
  const [html] = useState(() => {
    return {
      __html: Prism.highlight(code, Prism.languages[language], language)
    };
  });

  return (
    <pre className={`language-${language}`}>
      <code
        className={`language-${language}`}
        dangerouslySetInnerHTML={html}
      />
    </pre>
  );
}

CodeView.propTypes = {
  code: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
};

export default CodeView;
