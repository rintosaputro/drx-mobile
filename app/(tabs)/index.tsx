import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { fetchProducts } from "@/services/productService";
import { Product } from "@/types/product";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useEffect, useState } from "react";

const LIMIT = 6;

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchInitialProducts = async () => {
    setIsLoading(true);
    try {
      const data = await fetchProducts({
        limit: LIMIT,
        offset: 0,
      });

      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchInitialProducts();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, padding: 16 }}>
        <Text style={{ marginTop: 400, textAlign: "center" }}>
          Loading... joss
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <Link href={`/product/${item.id}`}>
            <View
              style={{
                flex: 1,
                paddingLeft: index % 2 !== 0 ? 5 : 0,
                paddingRight: index % 2 === 0 ? 5 : 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Image
                source={item.images[0]}
                style={{ width: 150, height: 200 }}
              />
              <Text style={{ fontWeight: "600" }}>{item.title} </Text>
              <Text style={{ alignSelf: "flex-start" }}>${item.price}</Text>
            </View>
          </Link>
        )}
      />
    </SafeAreaView>
  );
}
