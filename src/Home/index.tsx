import React from 'react';
import {View, Pressable, Text, StyleSheet} from 'react-native';

type ButtonProps = {
  label: string;
  onPress: () => void;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: 200,
    marginVertical: 20,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'purple',
  },
  buttonLabel: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 18,
  },
});

const Button = ({label, onPress}: ButtonProps) => {
  return (
    <Pressable onPress={onPress} style={styles.buttonContainer}>
      <Text style={styles.buttonLabel}>{label}</Text>
    </Pressable>
  );
};

export function HomeScreen({navigation}) {
  return (
    <View style={styles.container}>
      <Button
        label="ImageFromGallery"
        onPress={() => navigation.navigate('ImageForGallery')}
      />
      <Button
        label="ImageFromCamera"
        onPress={() => navigation.navigate('VisionCamera')}
      />
    </View>
  );
}

HomeScreen.displayName = 'HomeScreen';
