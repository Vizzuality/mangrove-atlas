import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import type { Tag, Post } from 'hooks/blog/types';

import { BlogAPI } from 'services/api';

export function useBlogPosts(): UseQueryResult<Post[], unknown> {
  const fetchBlogPosts = () =>
    BlogAPI.request({
      method: 'GET',
      url: '/wp-json/wp/v2/posts/wl_topic=53',
    }).then((response: AxiosResponse<Post[]>) => response.data);

  const query = useQuery(['blog-posts'], fetchBlogPosts, {
    placeholderData: [],
  });

  return query;
}

export function usePostTags({ id }: { id: number }): UseQueryResult<Tag[], unknown> {
  const fetchPostTags = () =>
    BlogAPI.request({
      method: 'GET',
      url: `/wp-json/wp/v2/tags?post=${id}`,
    }).then((response: AxiosResponse<Tag[]>) => response.data);

  const query = useQuery(['post-tags', id], fetchPostTags, {
    placeholderData: [],
  });

  return query;
}
