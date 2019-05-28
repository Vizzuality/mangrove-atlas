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
  protectedArea: (id) => {
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

export default TITLES;
