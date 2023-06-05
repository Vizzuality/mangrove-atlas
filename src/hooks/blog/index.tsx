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

type Tags = {
  id: number;
  name: string;
};

export function useBlogPosts(): UseQueryResult<Posts[], unknown> {
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

export function usePostTags({ id }: { id: number }): UseQueryResult<Tags[], unknown> {
  const fetchPostTags = () =>
    BlogAPI.request({
      method: 'GET',
      url: `/wp-json/wp/v2/tags?post=${id}`,
    }).then((response: AxiosResponse<Tags[]>) => response.data);

  const query = useQuery(['post-tags', id], fetchPostTags, {
    placeholderData: [],
  });

  return query;
}
