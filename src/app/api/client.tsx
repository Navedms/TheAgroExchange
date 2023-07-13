// import {create} from 'apisauce';
import {data} from './mocData';

// const apiClient = create({
//   baseURL: 'https://',
// });

const get = (endpoint: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({data});
    }, 500);
  });
};

export default {
  get,
};
