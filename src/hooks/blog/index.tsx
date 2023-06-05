import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { BlogAPI } from 'services/api';

type Posts = {
  id: number;
  date: string;
  title: {
    rendered: string;
  };
};

export function useBlogPosts(): UseQueryResult<Posts[]> {
  const fetchBlogPosts = () =>
    BlogAPI.request({
      method: 'GET',
      url: '/wp-json/wp/v2/posts',
    }).then((response: AxiosResponse<Posts[]>) => response.data);

  const query = useQuery(['blog-posts'], fetchBlogPosts, {
    placeholderData: [],
  });

  return query;
}
