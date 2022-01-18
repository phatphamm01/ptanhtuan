import AxiosService from "common/utils/axios";

const url = "product";

const fetchProduct = {
  async get() {
    const response = await AxiosService.get(url);
    return response;
  },
  async post(data: { name: string; price: string }) {
    const response = await AxiosService.post(url, data);
    return response;
  },
  async patch(id: string, data: { name: string; price: string }) {
    const response = await AxiosService.patch(`${url}/${id}`, data);
    return response;
  },
  async delete(id: string) {
    const response = await AxiosService.delete(`${url}/${id}`);
    return response;
  },
};

export default fetchProduct;
