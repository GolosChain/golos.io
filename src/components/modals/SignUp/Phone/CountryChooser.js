import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import LazyLoad from 'react-lazyload';
import CountryFlag from 'cyber-country-flag';
import tt from 'counterpart';

import { overflowEllipsis } from 'utils/styles';
import { setRegistrationData } from 'utils/localStorage';

import countriesCodes from './codesList.json';

const COUNTIES_DROPDOWN_HEIGHT = 253;
const COUNTRY_ITEM_HEIGHT = 46;

const LocationDataButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 40px;
  line-height: 20px;
  font-size: 17px;
  letter-spacing: -0.41px;
  border: solid 1px #e1e1e1;
  text-align: left;
  transition: background-color 150ms, box-shadow 150ms;
  cursor: pointer;

  &:hover,
  &:focus {
    background-color: ${({ theme }) => theme.colors.contextLightGrey};
  }

  ${({ filled, error, theme }) => `
    color: ${filled ? theme.colors.contextBlack : '#cacaca'};
    ${error ? `box-shadow: 0 0 0 1px ${theme.colors.errorTextRed}` : ``};
  `};
`;

const CountryFlagWrapped = styled(CountryFlag)`
  height: 20px;
  margin-left: auto;
`;

const LocationDataChooser = styled.ul`
  position: absolute;
  z-index: 2;
  top: 98px;
  width: 100%;
  height: ${COUNTIES_DROPDOWN_HEIGHT}px;
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  background-color: #fff;
  overflow: auto;
`;

const LocationDataWrapper = styled.li`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  font-size: 17px;
  letter-spacing: -0.41px;
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

export default class CountryChooser extends Component {
  static propTypes = {
    locationData: PropTypes.shape({
      code: PropTypes.string.isRequired,
      country: PropTypes.string.isRequired,
      countryCode: PropTypes.string.isRequired,
    }).isRequired,
    locationDataError: PropTypes.string,
    setLocationData: PropTypes.func.isRequired,
  };

  static defaultProps = {
    locationDataError: '',
  };

  state = {
    isChooserOpen: false,
  };

  locationDataChooserRef = createRef();

  buttonChooserRef = createRef();

  chooseLocationData = (code, country, countryCode) => () => {
    const { setLocationData, locationData } = this.props;

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
    this.setState({ isChooserOpen: false });
    window.removeEventListener('click', this.checkOutOfChooserClick, true);
  };

  checkOutOfChooserClick = e => {
    if (this.buttonChooserRef.current.contains(e.target)) {
      return;
    }
    if (!this.locationDataChooserRef.current.contains(e.target)) {
      this.closeChooser();
    }
  };

  toggleChooser = e => {
    const { isChooserOpen } = this.state;

    e.target.blur();
    if (isChooserOpen) {
      this.closeChooser();
    } else {
      this.openChooser();
    }
  };

  openChooser() {
    this.setState({ isChooserOpen: true });
    window.addEventListener('click', this.checkOutOfChooserClick, true);
  }

  closeChooser() {
    this.setState({ isChooserOpen: false });
    window.removeEventListener('click', this.checkOutOfChooserClick, true);
  }

  renderCountriesCodes() {
    const { locationData } = this.props;

    return countriesCodes.list.map(({ code, country, countryCode }) => (
      <LazyLoad key={country} scroll overflow once height={COUNTRY_ITEM_HEIGHT} offset={50}>
        <LocationDataWrapper
          choosed={locationData.country === country}
          onClick={this.chooseLocationData(code, country, countryCode)}
        >
          <Code>+{code}</Code>
          <Country>{country}</Country>
          <CountryFlagWrapped code={countryCode} />
        </LocationDataWrapper>
      </LazyLoad>
    ));
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
      tt('registration.choose_country')
    );

    return (
      <>
        <LocationDataButton
          ref={this.buttonChooserRef}
          filled={code ? 1 : 0}
          error={locationDataError}
          className="js-LocDataWrapper"
          onClick={this.toggleChooser}
        >
          {codeCountryButtonText}
        </LocationDataButton>
        {isChooserOpen && (
          <LocationDataChooser ref={this.locationDataChooserRef} className="js-LocDataChooser">
            {this.renderCountriesCodes()}
          </LocationDataChooser>
        )}
      </>
    );
  }
}
