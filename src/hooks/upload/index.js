import { useMutation } from 'react-query';

import UPLOAD from 'services/upload';

export function useUploadCustomAreaFile({}) {

  const uploadCustomAreaFile = ({ data }) => {
    return UPLOAD.request({
      method: 'POST',
      url: '',
      data,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  };

  // useWidget({
  //   params: {
  //     drawingValue: data.features,
  //     slug: ["mangrove_extent"],
  //     location_id: "custom-area"},
  //     wId: 'habitat_extent',
  //   })

  return useMutation(uploadCustomAreaFile, {
    onSuccess: (data, variables, context) => {
      console.info('Succces', data, variables, context);
    },
    onError: (error, variables, context) => {
      console.info('Error', error, variables, context);
    },
  });
}

