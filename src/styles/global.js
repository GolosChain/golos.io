import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  input[type="search"]::-webkit-search-decoration,
  input[type="search"]::-webkit-search-cancel-button,
  input[type="search"]::-webkit-search-results-button,
  input[type="search"]::-webkit-search-results-decoration {
    appearance: none;
  }

  input::-ms-clear {
    display: none;
  }

  ul {
    list-style-type: none;
  }
`;
