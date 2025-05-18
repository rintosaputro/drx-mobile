import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { fetchCategories, fetchProducts } from "@/services/productService";
import { Category, Product } from "@/types/product";
import { Picker } from "@react-native-picker/picker";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useEffect, useState } from "react";

const LIMIT = 6;

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(0);
  const [range, setRange] = useState({ min: 0, max: 0 });
  const [errorRange, setErrorRange] = useState("");
  const [isOpenRange, setIsOpenRange] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchCategoryList = async () => {
    const ctg = await fetchCategories();
    setCategories(ctg);
  };

  const fetchInitialProducts = async () => {
    setIsLoading(true);
    try {
      const data = await fetchProducts({
        limit: LIMIT,
        offset: 0,
        categoryId,
        priceMax,
        priceMin,
      });

      setProducts(data);
      if (data.length < LIMIT) setHasMore(false);
    } catch (error) {
      console.error("Error fetching products:", error);
    }

    setIsLoading(false);
  };

  const loadMoreProducts = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    const data = await fetchProducts({
      limit: LIMIT,
      offset: offset + LIMIT,
      categoryId: categoryId ? +categoryId : undefined,
      priceMin: priceMin ? +priceMin : undefined,
      priceMax: priceMax ? +priceMax : undefined,
    });

    setProducts((prev) => [...prev, ...data]);
    setOffset((prev) => prev + LIMIT);
    if (data.length < LIMIT) setHasMore(false);

    setIsLoading(false);
  };

  useEffect(() => {
    fetchInitialProducts();
  }, [categoryId, range]);

  useEffect(() => {
    fetchCategoryList();
  }, []);

  const onChangeMin = (value: number) => {
    if (!priceMax || (priceMax && value < priceMax)) {
      setPriceMin(Number(value));
    }
  };

  const onChangeMax = (value: number) => {
    if (value <= priceMin && value) {
      setErrorRange("Maximum price cannot be less than minimum price");
    } else {
      setErrorRange("");
    }
    setPriceMax(value);
  };

  const onSaveRange = () => {
    if (errorRange) {
      return;
    }

    if (!priceMax) {
      return setErrorRange("Maximum price must be filled");
    }

    setRange({ min: priceMin, max: priceMax });
    setIsOpenRange(false);
  };

  const onCancelRange = () => {
    setIsOpenRange(false);
    setErrorRange("");
    setRange({ min: 0, max: 0 });
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      {products.length > 0 && (
        <FlatList
          data={products}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={
            <View style={{ marginBottom: 20 }}>
              <Picker
                enabled={!isOpenRange}
                selectedValue={categoryId}
                onValueChange={(value) => setCategoryId(value)}
                style={{ height: 40 }}
              >
                <Picker.Item label="Select Category" value="" enabled={false} />
                {categories?.length > 0 &&
                  categories?.map((item) => (
                    <Picker.Item
                      key={item.id}
                      label={item.name}
                      value={item.id}
                    />
                  ))}
                <Picker.Item label="celana" value="2" />
              </Picker>
              <View style={{ marginTop: 15 }}>
                <TouchableOpacity
                  style={styles.buttonRange}
                  onPress={() => setIsOpenRange(!isOpenRange)}
                >
                  <Text>Price Range</Text>
                </TouchableOpacity>
                {isOpenRange && (
                  <>
                    <TextInput
                      keyboardType="numeric"
                      style={styles.input}
                      placeholder="minimal price"
                      onChangeText={(val) => onChangeMin(+val)}
                    />
                    <TextInput
                      keyboardType="numeric"
                      style={styles.input}
                      placeholder="maximal price"
                      onChangeText={(val) => onChangeMax(+val)}
                    />
                    <Text style={{ color: "red" }}>{errorRange}</Text>
                    <View style={{ display: "flex", flexDirection: "row" }}>
                      <TouchableOpacity
                        style={styles.buttonConfirm}
                        onPress={onSaveRange}
                      >
                        Save
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.buttonConfirm}
                        onPress={onCancelRange}
                      >
                        Cancel
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            </View>
          }
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
          ListFooterComponent={
            <>
              {hasMore && (
                <TouchableOpacity
                  onPress={loadMoreProducts}
                  style={styles.buttonLoadMore}
                >
                  Next
                </TouchableOpacity>
              )}
            </>
          }
        />
      )}
      {isLoading && (
        <Text style={{ marginTop: 400, textAlign: "center" }}>Loading...</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  buttonRange: {
    color: "black",
    fontFamily: "",
    padding: 10,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 4,
  },
  buttonConfirm: {
    backgroundColor: "gray",
    borderWidth: 1,
    borderRadius: 4,
    width: "auto",
    flex: 1,
    textAlign: "center",
  },
  buttonLoadMore: {
    borderColor: "#04a4a4",
    borderWidth: 1,
    borderRadius: 4,
    color: "#04a4a4",
    textAlign: "center",
    padding: 10,
  },
});
