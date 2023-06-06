const THEME = {
  default: {
    container: 'text-sm',
    button: {
      base: 'flex justify-between items-center w-full text-left transition duration-150 ease-in-out cursor-pointer border pl-4 pr-2 space-x-4 border border-brand-400 rounded-2xl font-semibold',
      states: {
        none: 'border-white',
        error: 'border-red-500',
        valid: 'border-green-500',
        disabled: 'opacity-50',
      },
    },
    selected: 'bg-white text-navy-500 px-2 rounded-full not-italic font-semibold',
    menu: 'bg-white border border-navy-400/50 rounded-lg shadow',
    menuHeader: 'bg-white',
    item: {
      base: 'text-xs text-navy-500',
      active: 'bg-white font-semibold',
      selected: 'bg-white font-semibold',
      disabled: 'opacity-50',
    },
    loading: 'relative flex items-center w-full h-full',
  },

  // light: {
  //   container: 'text-gray-600 text-sm',
  //   button: {
  //     base: 'flex justify-between items-center w-full text-left transition duration-150 ease-in-out cursor-pointer border-b border-dashed bg-white space-x-4',
  //     states: {
  //       none: 'border-gray-800',
  //       error: 'border-red-500',
  //       valid: 'border-green-500',
  //       disabled: 'opacity-40',
  //     },
  //   },
  //   selected: 'bg-navy-500 text-white px-2 rounded-full not-italic font-semibold',
  //   menu: 'bg-white border border-gray-800',
  //   menuHeader: 'bg-white',
  //   item: {
  //     base: 'text-xs',
  //     active: 'bg-gray-400/5 text-black',
  //     selected: 'bg-gray-400/10 text-black',
  //     disabled: 'opacity-40 text-black',
  //   },
  //   loading: 'relative flex items-center w-full h-full',
  // },

  // none: {
  //   container: 'w-auto inline-flex',
  //   button: {
  //     base: '',
  //     states: {
  //       none: '',
  //       error: 'text-red-500',
  //       valid: 'text-green-500',
  //       disabled: 'opacity-50',
  //     },
  //   },
  //   selected: '',
  //   menu: 'bg-white text-gray-700',
  //   menuHeader: 'bg-white',
  //   item: {
  //     base: 'text-xs',
  //     active: 'bg-gray-100 text-black',
  //     selected: 'bg-black/10 text-black',
  //     disabled: 'opacity-40 text-black',
  //   },
  //   loading: 'relative flex items-center w-full h-full',
  // },

  sizes: {
    base: 'px-0 py-3 text-sm',
    s: 'px-0 py-1.5 text-sm',
    none: 'pr-10',
  },
};

export default THEME;
