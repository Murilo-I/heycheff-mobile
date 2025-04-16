import { useEffect, useState } from "react";
import { FlatList, NativeScrollEvent, Text, View } from "react-native";

import { Loading } from "@/components/loading";
import { RecipeCard } from "@/components/recipe/recipeCard";
import { RecipeFeed, recipeServer } from "@/server/recipe";
import { styles } from "@/styles/global";

export default function Feed() {
    const [recipes, setRecipes] = useState<RecipeFeed[]>([]);
    const [totalRecipes, setTotalRecipes] = useState(0);
    const [pageNum, setPageNum] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const pageSize = 4;

    async function loadRecipe() {
        return recipeServer.loadFeed(pageNum, pageSize)
            .then(feedResponse => {
                if (totalRecipes === 0) {
                    setTotalRecipes(feedResponse.data.count);
                } else {
                    setHasMore(recipes.length < totalRecipes);
                }
                setRecipes([...recipes, ...feedResponse.data.items]);
                setPageNum(pageNum + 1);
            }).catch(error => console.log(error));
    }

    function loadMore({
        layoutMeasurement,
        contentOffset,
        contentSize
    }: NativeScrollEvent) {
        const paddingToBottom = 80;
        const hitTheBottom = layoutMeasurement.height + contentOffset.y
            >= contentSize.height - paddingToBottom;

        if (hitTheBottom && hasMore) {
            setLoading(true);
            loadRecipe().then(() => setLoading(false));
        }
    }

    useEffect(() => {
        const fetchRecipe = async () => loadRecipe();
        fetchRecipe();
    }, []);

    return recipes.length ? (
        <View style={{ flex: 1, marginTop: 48 }}>
            <FlatList
                data={recipes}
                renderItem={({ item }) => <RecipeCard recipe={item} />}
                onScroll={({ nativeEvent }) => {
                    if (!loading) loadMore(nativeEvent);
                }}
                windowSize={7}
                scrollEventThrottle={200}
                keyExtractor={recipe => recipe.id.toString()}
                ListFooterComponent={loading ? <Loading /> : null}
            />
            {!hasMore ?
                <Text style={[styles.textCenter, styles.m8, styles.fontRegular, styles.textSmall]}>
                    Sem mais receitas
                </Text> : null}
        </View>
    ) : <Loading />;
}