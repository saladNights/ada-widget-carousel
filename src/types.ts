export type CarouselItemAction = {
  text: string;
  type: string;
  payload?: string;
  uri?: string;
};

export type CarouselItem = {
  id?: string;
  title: string;
  description: string;
  mediaurl: string;
  actions: CarouselItemAction[];
};

export type CarouselData = {
  role?: string;
  type?: string;
  items: CarouselItem[];
};

export type widgetEvent = {
  type: string;
  metaData: {
    [key: string]: string | undefined;
    items_url?: string;
    items_json?: string;
  };
};
