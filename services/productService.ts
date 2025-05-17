import { API_URL } from "@/constants/Api";
import { Category, Product } from "@/types/product";

export const fetchCategories = async () => {
  const res = await fetch(`${API_URL}/categories`);
  const categories: Category[] = await res.json();
  return categories;
};

interface FetchProduct {
  limit?: number | string;
  offset?: number | string;
  categoryId?: number | string;
  priceMin?: number | string;
  priceMax?: number | string;
}

export const fetchProducts = async (props: FetchProduct) => {
  const res = await fetch(
    `${API_URL}/products?limit=${props?.limit || ""}&offset=${
      props?.offset || ""
    }&categoryId=${props?.categoryId || ""}&price_min=${
      props?.priceMin || ""
    }&price_max=${props?.priceMax || ""}`
  );
  const products: Product[] = await res.json();
  return products;
};
