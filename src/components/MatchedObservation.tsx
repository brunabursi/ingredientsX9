import { useState } from "react";
import type { IngredientLookup } from "../storage/models/ingredientsLookup"
import {Text, StyleSheet, TouchableOpacity} from 'react-native';

function capitalize(str: string) {
    if (str?.length === 0) {
      return str;
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

const MatchedObservation = ({ observation }: { observation: IngredientLookup }) => {
  const [active, setActive] = useState(false);

  return (
    <TouchableOpacity onPress={() => setActive(!active)} style={active ? styles.expanded : null}>
      <Text style={styles.observation}>
        {capitalize(observation.ingredientName)} 
      </Text>
      {active && (
        <Text>
          {observation.description}
        </Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  observation: {
    backgroundColor: '#f0f8ff',
    color: '#4682B4',
    padding: 8,
    borderRadius: 20,
    marginBottom: 8,
    marginRight: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ADD8E6',
    fontSize: 14,
    textAlign: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  expanded: {
    backgroundColor: '#f0f8ff',
    color: '#4682B4',
    padding: 8,
    borderRadius: 20,
    marginBottom: 8,
    marginRight: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ADD8E6',
    fontSize: 14,
    textAlign: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
});

export default MatchedObservation;