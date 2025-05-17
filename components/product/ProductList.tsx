import { Product } from "@/types/product";
import { Link } from "expo-router";
import { useState } from "react";
import { FlatList, Text } from "react-native";

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Link href="/(product)/explore">
          <Text>{item.name}</Text>
          <Text>{item.price}</Text>
        </Link>
      )}
    />
  );
};

export default ProductList;
