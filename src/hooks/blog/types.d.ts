export type Post = {
  id: number;
  date: string;
  title: {
    rendered: string;
  };
  yoast_head_json: {
    og_image: {
      url: string;
    }[];
  };
  content: {
    rendered: string;
  };
};

export type Tag = {
  id: number;
  name: string;
};
