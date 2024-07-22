import { uploadFileAtom } from 'store/upload-file';

import { useQuery } from '@tanstack/react-query';
import type { QueryObserverOptions } from '@tanstack/react-query';
import { useRecoilState } from 'recoil';

import { AnalysisWidgetSlug } from 'types/widget';

import API from 'services/api';

import { toast } from 'react-toastify';

import type { UploadFileResponse } from './types';
export type AnalysisResponse<T> = Record<AnalysisWidgetSlug, T>;

export const fetchUploadFile = (data: File[]) => {
  const formData = new FormData();
  formData.append('file', data[0]);
  return API.request<UploadFileResponse>({
    method: 'post',
    url: '/spatial_file/converter',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then(({ data }) => data)
    .catch((error) => {
      console.error('Error uploading file:', error);
      const errorMessage: string =
        typeof error?.response?.data?.message === 'string'
          ? error.response.data.message
          : 'There was a problem uploading the file. Please try again.';
      throw new Error(errorMessage);
    });
};
