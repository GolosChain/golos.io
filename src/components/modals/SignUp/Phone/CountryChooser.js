import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import LazyLoad, { forceCheck } from 'react-lazyload';
import debounce from 'lodash.debounce';
import CountryFlag from 'cyber-country-flag';

import { setRegistrationData } from 'utils/localStorage';
import { checkPressedKey } from 'utils/keyPress';
import { overflowEllipsis } from 'utils/styles';
import keyCodes from 'utils/keyCodes';

import countriesCodes from './codesList.json';

import { Input } from '../commonStyled';

const COUNTIES_DROPDOWN_HEIGHT = 253;
const COUNTRY_ITEM_HEIGHT = 46;
const NO_CODE_MATCHES_OBJECT = {
  code: null,
  countryCode: 'No code',
  country: 'No country',
};

const CountryFlagWrapped = styled(CountryFlag)`
  height: 20px;
  margin-left: auto;
`;

const LocationDataChooser = styled.ul`
  position: absolute;
  z-index: 2;
  top: 104px;
  width: 100%;
  max-height: ${COUNTIES_DROPDOWN_HEIGHT}px;
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  background-color: #fff;
  overflow: auto;
`;

const LocationDataWrapper = styled.li`
  display: flex;
  align-items: center;
  padding: 13px 16px;
  cursor: pointer;
  font-size: 17px;
  letter-spacing: -0.41px;
  outline: none;
  transition: background-color 150ms;

  &:hover,
  &:focus {
    background-color: ${({ theme }) => theme.colors.contextLightGrey};
  }

  ${is('choosed')`
    background-color: ${({ theme }) => theme.colors.contextLightGrey};
  `};
`;

const Code = styled.p`
  flex-shrink: 0;
  width: 55px;
  line-height: 20px;
  font-weight: 400;
`;

const CodeInButton = styled(Code)`
  width: auto;
`;

const Country = styled.p`
  margin: 0 12px;
  line-height: 20px;
`;

const CountryInButton = styled(Country)`
  ${overflowEllipsis};
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  margin-top: 40px;
  border-radius: 8px;
  border: solid 1px ${({ theme }) => theme.colors.contextLightGrey};
  transition: box-shadow 150ms;

  ${({ error, theme }) => `
    ${error ? `box-shadow: 0 0 0 1px ${theme.colors.errorTextRed}` : ``};
  `};
`;

const InputPlaceholder = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0 16px;
  font-size: 17px;
  pointer-events: none;
`;

const ChooseCountryText = styled.p`
  margin-left: 1px;
  color: #c8c8c8;
`;

const NoSearchResults = styled.p`
  padding: 13px 16px;
  font-size: 17px;
  color: ${({ theme }) => theme.colors.contextGrey};
`;

export default class CountryChooser extends Component {
  static propTypes = {
    locationData: PropTypes.shape({
      code: PropTypes.string.isRequired,
      country: PropTypes.string.isRequired,
      countryCode: PropTypes.string.isRequired,
    }).isRequired,
    locationDataError: PropTypes.string,
    setLocationData: PropTypes.func.isRequired,
    resetLocDataError: PropTypes.func.isRequired,
    phoneInputRef: PropTypes.shape({}),
  };

  static defaultProps = {
    locationDataError: '',
    phoneInputRef: {},
  };

  state = {
    isChooserOpen: false,
    filteredCountriesCodes: [],
  };

  locationDataChooserRef = createRef();

  inputChooserRef = createRef();

  inputRef = createRef();

  filterCountries = debounce(value => {
    const { resetLocDataError } = this.props;

    const searchParam = value.toLowerCase();
    const filteredCountries = countriesCodes.list.filter(item =>
      item.country.toLowerCase().includes(searchParam)
    );
    if (searchParam.length && !filteredCountries.length) {
      filteredCountries.push(NO_CODE_MATCHES_OBJECT);
    }
    resetLocDataError();
    this.setState({ filteredCountriesCodes: filteredCountries }, forceCheck);
  }, 500);

  checkOutOfChooserClick = e => {
    if (this.inputChooserRef.current.contains(e.target)) {
      return;
    }
    if (!this.locationDataChooserRef.current.contains(e.target)) {
      this.closeChooser();
    }
  };

  openChooser = () => {
    const { isChooserOpen } = this.state;

    if (!isChooserOpen) {
      this.setState({ isChooserOpen: true });
      window.addEventListener('click', this.checkOutOfChooserClick, true);
    }
  };

  countryKeyDown = (e, code, country, countryCode) => {
    if (checkPressedKey(e) === keyCodes.ENTER) {
      this.chooseLocationData(code, country, countryCode);
    } else {
      this.escKeyDown(e);
    }
  };

  escKeyDown = e => {
    if (checkPressedKey(e) === keyCodes.ESC) {
      this.setState({ isChooserOpen: false }, () => this.inputRef.current.blur());
      window.removeEventListener('click', this.checkOutOfChooserClick, true);
    }
  };

  chooseLocationData = (code, country, countryCode) => {
    const { setLocationData, locationData, phoneInputRef } = this.props;

    phoneInputRef.current.focus();
    if (locationData.country !== country) {
      setLocationData({
        code,
        country,
        countryCode,
      });
      setRegistrationData({
        locationData: {
          code,
          country,
          countryCode,
        },
      });
    }
    this.closeChooser();
  };

  closeChooser() {
    this.setState({ isChooserOpen: false, filteredCountriesCodes: [] });
    this.inputRef.current.value = '';
    window.removeEventListener('click', this.checkOutOfChooserClick, true);
  }

  renderCountriesCodes() {
    const { locationData } = this.props;
    const { filteredCountriesCodes } = this.state;

    let codes = countriesCodes.list;
    if (filteredCountriesCodes.length) {
      codes = filteredCountriesCodes;
    }

    return codes.map(({ code, country, countryCode }) =>
      code ? (
        <LazyLoad key={country} overflow once height={COUNTRY_ITEM_HEIGHT} offset={50}>
          <LocationDataWrapper
            key={country}
            tabIndex="0"
            choosed={locationData.country === country}
            onKeyDown={e => this.countryKeyDown(e, code, country, countryCode)}
            onClick={() => this.chooseLocationData(code, country, countryCode)}
          >
            <Code>+{code}</Code>
            <Country>{country}</Country>
            <CountryFlagWrapped code={countryCode} />
          </LocationDataWrapper>
        </LazyLoad>
      ) : (
        <NoSearchResults key={country}>There&apos;s no matches found</NoSearchResults>
      )
    );
  }

  render() {
    const { locationData, locationDataError } = this.props;
    const { isChooserOpen } = this.state;
    const { code, country, countryCode } = locationData;

    const codeCountryButtonText = code ? (
      <>
        <CodeInButton>+{code}</CodeInButton>
        <CountryInButton>{country}</CountryInButton>
        <CountryFlagWrapped code={countryCode} />
      </>
    ) : (
      <ChooseCountryText>Choose country</ChooseCountryText>
    );

    return (
      <>
        <InputWrapper
          ref={this.inputChooserRef}
          name="country-chooser__input"
          error={locationDataError}
          onFocus={this.openChooser}
        >
          <Input
            ref={this.inputRef}
            maxLength="40"
            tabIndex="0"
            onKeyDown={this.escKeyDown}
            onChange={e => this.filterCountries(e.target.value)}
          />
          {!isChooserOpen && <InputPlaceholder>{codeCountryButtonText}</InputPlaceholder>}
        </InputWrapper>
        {isChooserOpen && (
          <LocationDataChooser ref={this.locationDataChooserRef} className="js-LocDataChooser">
            {this.renderCountriesCodes()}
          </LocationDataChooser>
        )}
      </>
    );
  }
}
