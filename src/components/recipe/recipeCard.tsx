import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

import { Card } from "@/components/card";
import Tag from "@/components/tag";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setRecipeId } from "@/redux/recipe/redirect";
import { RecipeFeed } from "@/server/recipe";
import { styles } from "@/styles/global";
import { RecipeDetails } from "./recipeDetails";

export const RecipeCard = ({ recipe }: { recipe: RecipeFeed }) => {
    const [showModal, setShowModal] = useState(false);
    const { isSignedIn } = useAuth();

    const redirectRecipe = useAppSelector(state => state.redirectRecipe);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (redirectRecipe.recipeId === recipe.id) {
            setShowModal(true);
        }
    }, []);

    return (
        <>
            <Pressable onPress={() => {
                if (!isSignedIn)
                    dispatch(setRecipeId(recipe.id));
                setShowModal(true);
            }}>
                <Card>
                    <Card.Img src={recipe.thumb} />
                    <Card.Content>
                        <Card.Title>{recipe.titulo}</Card.Title>
                        <View style={[styles.flexRow, styles.contentBetween]}>
                            <View style={[styles.flexInitial, styles.flexRow, { flex: .2 }]}>
                                <Ionicons name="timer" size={20} color="#AAA" />
                                <Text style={[styles.fontRegular, styles.textGray]}>
                                    {recipe.estimatedTime}
                                </Text>
                                <Text style={[styles.fontRegular, styles.textGray]}>
                                    min.
                                </Text>
                            </View>
                            <View style={[styles.flexRow, styles.flexWrap, styles.justifyEnd, { flex: .8 }]}>
                                {recipe.tags.map((category) =>
                                    <Tag key={category.id} text={category.tag} />)}
                            </View>
                        </View>
                    </Card.Content>
                </Card>
            </Pressable>
            {showModal &&
                <RecipeDetails recipe={recipe} showModal={showModal} onClose={setShowModal} />
            }
        </>
    );
}