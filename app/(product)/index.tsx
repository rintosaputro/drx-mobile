import { FlatList, StyleSheet, Text, View } from "react-native";
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
    console.log("masukkk");
    setIsLoading(true);
    try {
      console.log("Fetching products...");
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
        <Text>Loading... joss</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Link href="/(product)/explore">
            <View>
              <Image
                source={item.images[0]}
                style={{ width: 150, height: 200 }}
              />
              <Text>{item.title} </Text>
              <Text>{item.price}</Text>
            </View>
          </Link>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
