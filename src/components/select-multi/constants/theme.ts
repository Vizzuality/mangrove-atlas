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
    selected: 'bg-white text-black/85 px-2 rounded-full not-italic font-semibold text-red-500',
    menu: 'bg-white border border-black/15 rounded-lg shadow mt-2 py-3',
    menuHeader: 'bg-white',
    item: {
      base: 'text-xs text-black/85',
      active: 'bg-white font-semibold',
      selected: 'bg-white font-semibold',
      disabled: 'opacity-50',
    },
    loading: 'relative flex items-center w-full h-full',
  },

  sizes: {
    base: 'px-0 py-3 text-sm',
    s: 'px-0 py-1.5 text-sm',
    none: 'pr-10',
  },
};

export default THEME;
