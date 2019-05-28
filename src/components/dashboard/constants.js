const widgets = {
  widget_1: {
    id: 'widget_1',
    title: 'Widget 1'
  },
  widget_2: {
    id: 'widget_2',
    title: 'Widget 2'
  },
  widget_3: {
    id: 'widget_3',
    title: 'Widget 3'
  },
  widget_4: {
    id: 'widget_4',
    title: 'Widget 4'
  },
  widget_5: {
    id: 'widget_5',
    title: 'Widget 5'
  }
};

export const TITLES = {
  global: 'Global',
  country: (id) => {
    // todo: complex country validation, probably async
    const allowed = ['portugal', 'spain', 'senegal', 'tanzania'];
    const titles = {
      portugal: 'Portugal',
      spain: 'Spain',
      senegal: 'Senegal',
      tanzania: 'Tanzania'
    };

    return (allowed.includes(id)) ? titles[id] : null;
  },
  protected_area: (id) => {
    // todo: complex country validation, probably async
    const allowed = [];
    const titles = {};

    return (allowed.includes(id)) ? titles[id] : null;
  },
  aoi: (id) => {
    // todo: complex country validation, probably async
    const allowed = ['rufiki', 'saloum'];
    const titles = {
      rufiki: 'Rufiki',
      saloum: 'Saloum'
    };

    return (allowed.includes(id)) ? titles[id] : null;
  }
};

export const WIDGETS = {
  global: [
    widgets.widget_1,
    widgets.widget_2,
    widgets.widget_5
  ],
  country: [
    widgets.widget_1,
    widgets.widget_2,
    widgets.widget_3,
    widgets.widget_4,
    widgets.widget_5
  ],
  protected_area: [
    widgets.widget_1
  ],
  aoi: [
    widgets.widget_4,
    widgets.widget_3,
    widgets.widget_1
  ]
};

export default { TITLES, WIDGETS };
