export type ItemType = {
  name: string;
  url: string;
  image: string;
  size: [number, number];
};

export type PartnerProps = {
  title: string;
  list: ItemType[];
  classname?: string;
};
