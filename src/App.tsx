import React, { Component } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import Dot from 'dot-object';
import merge from 'deepmerge';

import { combineMerge } from './helpers';

import { ACTION_TYPE_POSTBACK, ACTION_TYPE_LINK } from './constants';

import { CarouselData, CarouselItem, widgetEvent } from './types';
import styles from './App.module.scss';

const AdaWidgetSDK = require('@ada-support/ada-widget-sdk');
const widgetSDK = new AdaWidgetSDK();
const dot = new Dot('_');
const mapErrorMessagesToIds = {
  noData: 'Error: No data provided',
  initFail: 'Error: Initialization Failed',
  errorGetData: 'Error: Failed to get data',
  postbackError: 'Error: Postback sending error',
};

interface State {
  carouselData: null | CarouselData;
  isInitializing: boolean;
  isLoadingData: boolean;
  isActive: boolean;
  selectedAction: string | undefined;
  errors: string[];
}

class App extends Component<unknown, State> {
  state: State = {
    carouselData: null,
    isInitializing: false,
    isLoadingData: false,
    isActive: false,
    selectedAction: undefined,
    errors: [],
  };

  componentDidMount() {
    this.initWidget();
  }

  componentDidUpdate(prevProps: Readonly<unknown>, prevState: Readonly<State>, snapshot?: any) {
    const { errors } = this.state;

    if (!widgetSDK.widgetIsActive && prevState.isActive) {
      console.error(mapErrorMessagesToIds.initFail);
      this.setState((prevState) => ({
        isActive: false,
        errors: [...prevState.errors, mapErrorMessagesToIds.initFail],
      }));
    }

    if (errors.length !== prevState.errors.length) {
      if (widgetSDK.widgetIsActive) {
        widgetSDK.sendUserData(
          {
            selectedItem: null,
            errorMessage: errors,
          },
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          () => {},
        );
      }
    }
  }

  initWidget = async () => {
    try {
      this.setState({ isInitializing: true });

      await widgetSDK.init((event: widgetEvent) => {
        this.setState({
          isInitializing: false,
          isActive: true,
        });

        switch (event.type) {
          case 'WIDGET_INITIALIZED': {
            this.setState({ isLoadingData: true });
            if (event.metaData.items_url) {
              // API Url
              axios.get(event.metaData.items_url).then((response) => {
                this.setState({
                  isLoadingData: false,
                  carouselData: response.data,
                });
              });
            } else if (event.metaData.items_json) {
              // JSON
              this.setState({
                isLoadingData: false,
                carouselData: JSON.parse(event.metaData.items_json),
              });
            } else if (Object.keys(event.metaData).find((key) => key.includes('items'))) {
              // User Params
              let nextCarouselData: CarouselData = { items: [] };
              Object.keys(event.metaData)
                .filter((key) => key.includes('items'))
                .forEach((key) => {
                  nextCarouselData = merge(nextCarouselData, dot.object({ [key]: event.metaData[key] }), {
                    arrayMerge: combineMerge,
                  });
                });

              this.setState({
                isLoadingData: false,
                carouselData: nextCarouselData,
              });
            } else {
              console.error(mapErrorMessagesToIds.noData);
              this.setState((prevState) => ({
                isActive: false,
                errors: [...prevState.errors, mapErrorMessagesToIds.noData],
              }));
            }
            break;
          }
          case 'WIDGET_INITIALIZATION_FAILED': {
            console.error(mapErrorMessagesToIds.initFail);
            this.setState((prevState) => ({
              isActive: false,
              errors: [...prevState.errors, mapErrorMessagesToIds.initFail],
            }));
          }
        }
      });
    } catch (e) {
      this.setState({ isInitializing: false });
      console.error(mapErrorMessagesToIds.errorGetData, e);
      this.setState((prevState) => ({
        isActive: false,
        errors: [...prevState.errors, mapErrorMessagesToIds.errorGetData],
      }));
    }
  };

  onActionClickHandler = (type: string, payload: string | undefined, url: string | undefined) => {
    const { errors } = this.state;

    switch (type) {
      case ACTION_TYPE_POSTBACK: {
        if (widgetSDK.widgetIsActive) {
          widgetSDK.sendUserData(
            {
              selectedItem: payload,
              errorMessage: errors,
            },
            (event: { type: string }) => {
              if (event.type === 'SEND_USER_DATA_SUCCESS') {
                this.setState({
                  selectedAction: payload,
                  isActive: false,
                });
              } else {
                console.error(mapErrorMessagesToIds.postbackError);
                this.setState((prevState) => ({
                  isActive: false,
                  errors: [...prevState.errors, mapErrorMessagesToIds.postbackError],
                }));
              }
            },
          );
        }
        break;
      }
      case ACTION_TYPE_LINK: {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer');

        if (newWindow) newWindow.opener = null;

        break;
      }
    }
  };

  render() {
    const { carouselData, isInitializing, isLoadingData, isActive, selectedAction } = this.state;
    const sliderSettings = {
      accessibility: true,
      infinite: false,
      slidesToShow: carouselData?.items && (carouselData?.items as CarouselItem[]).length > 1 ? 1.1 : 1,
    };

    return (
      <div className={styles.wrapper}>
        {(isInitializing || isLoadingData) && (
          <div className={styles.loader}>
            <div className={styles.loadingSpinner} />
          </div>
        )}
        {!isActive && <div className={styles.inactive} />}
        <Slider {...sliderSettings}>
          {carouselData?.items.map((slide) => {
            return (
              <div key={slide.id || slide.title}>
                <div className={styles.slide}>
                  <div className={styles.media}>
                    <img className={styles.img} src={slide.mediaurl} alt={slide.title} />
                  </div>
                  <div className={styles.info}>
                    <h3 className={styles.title}>{slide.title}</h3>
                    <p className={styles.description}>{slide.description}</p>
                  </div>
                  <div className={styles.actions}>
                    {slide.actions.map((action) => (
                      <button
                        key={action.text}
                        className={`${styles.action} ${
                          selectedAction && selectedAction === action.payload && styles.activeBtn
                        }`}
                        onClick={() => this.onActionClickHandler(action.type, action.payload, action.uri)}
                      >
                        {action.text}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
    );
  }
}

export default App;
