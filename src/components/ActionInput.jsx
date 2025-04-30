import { StyleSheet, TextInput, View, TouchableOpacity, Image } from 'react-native';

const borderRadius = 20; // Define a variable for the border radius

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius,
    padding: 5,
  },
  input: {
    flex: 1,
    borderWidth: 0,
    outline: 'none',
    padding: 8,
    borderRadius: borderRadius, // Apply the same border radius to the input
    borderWidth: 2,
    borderColor: '#333', // Fallback color if currentColor is not supported
    color: '#333', // Fallback color if currentColor is not supported
  },
  button: {
    borderRadius: borderRadius,
    marginLeft: 8,
    padding: 8, // Add padding to make the button larger
    width: borderRadius * 2, // Make it a circle
    height: borderRadius * 2, // Make it a circle
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden', // Clip the content to the circle
    borderWidth: 2,
    borderColor: '#333', // Fallback color if currentColor is not supported
    color: '#333', // Fallback color if currentColor is not supported
  },
  buttonIcon: {
    width: 20, // Adjust size as needed
    height: 20, // Adjust size as needed
    tintColor: 'white', // Adjust color as needed
  },
});

const ActionInput = ({ placeholder, onButtonClick, value, onChange }) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput style={styles.input} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}/>
      <TouchableOpacity style={styles.button} onPress={onButtonClick}>
        <Image source={require('../assets/images-icon.png')} style={styles.buttonIcon} />
      </TouchableOpacity>
    </View>
  );
};

export default ActionInput;
