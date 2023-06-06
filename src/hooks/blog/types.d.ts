export type Post = {
  id: number;
  date: string;
  title: {
    rendered: string;
  };
};

export type Tag = {
  id: number;
  name: string;
};
