import MatchedObservation from "./MatchedObservation"
import { Text, StyleSheet, View } from "react-native";
import { IngredientLookup } from "../storage/models/ingredientsLookup.ts";

type ObservationGroupProps = {
  category: string;
  observations: IngredientLookup[];
}

const ObservationGroup = ({ category, observations }:ObservationGroupProps) => {
  return (
    <>
      <Text style={styles.category}>{category}</Text>
      <View style={styles.observationContainer}>
        {observations.map((observation, index) => (
          <MatchedObservation observation={observation} key={index} />
        ))}
      </View>
    </>
  )
}

export default ObservationGroup;

const styles = StyleSheet.create({
  category: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  observationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  }
})