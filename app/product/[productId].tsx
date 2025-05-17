import { API_URL } from "@/constants/Api";
import { Product } from "@/types/product";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ProductDetail = () => {
  const { productId } = useLocalSearchParams();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProduct = async () => {
    setIsLoading(true);
    const res = await fetch(`${API_URL}/products/${productId}`);
    const resJson = await res.json();
    console.log("okeee", resJson);
    setProduct(resJson);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView>
        <Text style={{ marginTop: 300, textAlign: "center" }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ padding: 16 }}>
      <FlatList
        data={product?.images as string[]}
        horizontal
        keyExtractor={(_item, index) => index.toString()}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={{ width: 300, height: 300, marginRight: 10 }}
            alt={product?.slug}
          />
        )}
      />
      <View style={{ marginTop: 30 }}>
        <Text style={{ fontWeight: "700", fontSize: 18 }}>
          {product?.title}
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ fontWeight: "600" }}>${product?.price}</Text>
          <Text>{" > "} </Text>
          <Text>{product?.category.name}</Text>
        </View>
        <Text style={{ marginTop: 20 }}>{product?.description}</Text>
      </View>
    </SafeAreaView>
  );
};

export default ProductDetail;
