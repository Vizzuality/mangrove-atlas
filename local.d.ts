declare module '*.png';
declare module '*.jpg';
declare module '*.svg' {
  const content: {
    id: string;
    viewBox?: string;
  };
  export default content;
}
declare module '*.svg?sprite' {
  const content: {
    id: string;
    viewBox?: string;
  };
  export default content;
}
