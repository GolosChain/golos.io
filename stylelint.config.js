module.exports = {
  processors: ['stylelint-processor-styled-components'],
  extends: ['stylelint-config-recommended', 'stylelint-config-styled-components'],
  rules: {
    'block-no-empty': null,
    'no-descending-specificity': null,
    'selector-type-no-unknown': [
      true,
      {
        ignoreTypes: ['/^-styled-*/'],
      },
    ],
  },
};
