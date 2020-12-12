import React, { Component } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import Dot from 'dot-object';
import merge from 'deepmerge';

import { combineMerge } from './helpers';

import { ACTION_TYPE_POSTBACK, ACTION_TYPE_LINK } from './constants';

import { CarouselData, widgetEvent } from './types';

import noImg from './no-img.png';
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
  slideImgError: number | undefined;
  centerMode: boolean;
}

class App extends Component<unknown, State> {
  state: State = {
    carouselData: null,
    isInitializing: false,
    isLoadingData: false,
    isActive: false,
    selectedAction: undefined,
    errors: [],
    slideImgError: undefined,
    centerMode: false,
  };

  componentDidMount() {
    this.initWidget();
  }

  componentDidUpdate(prevProps: Readonly<unknown>, prevState: Readonly<State>) {
    const { carouselData, errors } = this.state;

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

    if (!prevState.carouselData?.items.length && carouselData?.items.length) {
      const readOnly = carouselData.items.some((item) => {
        return !item.actions.some((action) => action.type === 'postback');
      });

      if (readOnly) {
        widgetSDK.sendUserData(
          {},
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
            } else if (event.metaData.items_base64) {
              // base 64
              this.setState({
                isLoadingData: false,
                carouselData: JSON.parse(atob(event.metaData.items_base64)),
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
              errors: [...prevState.errors, mapErrorMessagesToIds.initFail],
            }));
          }
        }
      });
    } catch (e) {
      console.error(mapErrorMessagesToIds.errorGetData, e);

      this.setState((prevState) => ({
        isInitializing: false,
        errors: [...prevState.errors, mapErrorMessagesToIds.errorGetData],
      }));

      this.loadFromUrl();
    }
  };

  loadFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const base64data = urlParams.get('base64data');

    if (base64data) {
      const data: CarouselData = JSON.parse(window.atob(base64data));

      if (data.items.length) {
        this.setState({
          isLoadingData: false,
          isActive: true,
          carouselData: data,
        });
      } else {
        console.error('invalid data');

        this.setState({
          isLoadingData: false,
          isActive: false,
        });
      }
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

  onImgError = (index: number) => {
    this.setState({
      slideImgError: index,
    });
  };

  beforeChangeHandle = (oldIndex: number, newIndex: number) => {
    setTimeout(() => {
      if (newIndex === 0) {
        this.setState({ centerMode: false });
      } else {
        this.setState({ centerMode: true });
      }
    }, 200);
  };

  render() {
    const {
      carouselData,
      isInitializing,
      isLoadingData,
      isActive,
      selectedAction,
      slideImgError,
      centerMode,
    } = this.state;

    return (
      <div className={`${styles.wrapper} ${carouselData?.items.length === 1 && styles.wrapperSingleItem}`}>
        {(isInitializing || isLoadingData) && (
          <div className={styles.loader}>
            <div className={styles.loadingSpinner} />
          </div>
        )}
        {!isActive && <div className={styles.inactive} />}
        <Slider
          accessibility={true}
          infinite={false}
          slidesToShow={1}
          slidesToScroll={1}
          centerMode={centerMode}
          variableWidth={true}
          beforeChange={this.beforeChangeHandle}
        >
          {carouselData?.items.map((slide, index) => {
            return (
              <div key={slide.id || slide.title} className={styles.slideWrapper} style={{ width: 254 }}>
                <div className={styles.slide}>
                  {slide.mediaurl && (
                    <div className={styles.media}>
                      {slideImgError === index ? (
                        <img className={styles.img} src={noImg} alt="broken url" />
                      ) : (
                        <img
                          className={styles.img}
                          src={slide.mediaurl}
                          alt={slide.title}
                          onError={() => this.onImgError(index)}
                        />
                      )}
                    </div>
                  )}
                  <div className={styles.info}>
                    <h3 className={styles.title}>{slide.title}</h3>
                    <p className={styles.description}>{slide.description}</p>
                  </div>
                  <div className={styles.actions}>
                    {slide.actions.map((action) => {
                      return (
                        action && (
                          <button
                            key={action.text}
                            className={`${styles.action} ${
                              selectedAction && selectedAction === action.payload && styles.activeBtn
                            }`}
                            onClick={() => this.onActionClickHandler(action.type, action.payload, action.uri)}
                          >
                            {action.text}
                          </button>
                        )
                      );
                    })}
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
