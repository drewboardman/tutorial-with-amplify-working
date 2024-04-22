import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Platform } from 'react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

import ImageViewer from './components/ImageViewer';
import Button from './components/Button';
import CircleButton from './components/CircleButton';
import IconButton from './components/IconButton';

import * as ImagePicker from 'expo-image-picker';
import EmojiPicker from './components/EmojiPicker';
import EmojiList from './components/EmojiList';
import EmojiSticker from './components/EmojiSticker';
import { useState, useRef } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';
import domtoimage from 'dom-to-image';
import { withAuthenticator } from '@aws-amplify/ui-react-native';
import { Amplify } from 'aws-amplify';
import { config } from './amplifyconfigs/main';

Amplify.configure(config)

function App() {
  const PlaceholderImage = require('./assets/images/background-image.png');
  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  const [showAppOptions, setShowAppOptions] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [pickedEmoji, setPickedEmoji] = useState<any | null>(null);
  const [permissionStatus, requestPermission] = MediaLibrary.usePermissions();
  const imageRef = useRef(null);

  const onReset = () => {
    setShowAppOptions(false)
  };
  const onAddSticker = () => {
    setIsModalVisible(true);
  };
  const onModalClose = () => {
    setIsModalVisible(false);
  };
  const onSaveImageAsync = async () => {
    if (Platform.OS !== 'web') {
      try {
        const localUri = await captureRef(imageRef, {
          height: 440,
          quality: 1,
        })
        await MediaLibrary.saveToLibraryAsync(localUri);
        if (localUri) {
          alert('Image saved successfully');
        }
      } catch (error) {
        console.log('An error occurred while saving the image', error);
      }
    } else {
      try {
        if (imageRef.current) {
          const dataUrl = await domtoimage.toJpeg(imageRef.current, {
            quality: 1,
            width: 440,
            height: 440
          });

          const link = document.createElement('a');
          link.download = 'sticker-smash.jpeg';
          link.href = dataUrl;
          link.click();
        } else {
          console.log('Image reference is null.');
        }
      } catch (error) {
        console.log('An error occurred while saving the image', error);
      }
    }
  };

  const pickImageAsync = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
    } else {
      console.log('You canceled the action.');
    }
  }

  const renderAppOptions = () => {
    if (showAppOptions) {
      return (
        <View style={styles.optionsContainer}>
          <View style={styles.optionsRow}>
            <IconButton icon="refresh" label="Reset" onPress={onReset} />
            <CircleButton onPress={onAddSticker} />
            <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
          </View>
        </View>
      )
    } else {
      return (
        <View style={styles.footerContainer}>
          <Button label="Choose a photo" theme='primary' onPress={() => pickImageAsync()} />
          <Button label="Use this photo" onPress={() => setShowAppOptions(true)} />
        </View>
      );
    }
  };

  if (permissionStatus == null) {
    requestPermission();
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.imageContainer}>
        <View ref={imageRef} collapsable={false}>
          <ImageViewer placeholderImageSource={PlaceholderImage} selectedImage={selectedImage} />
          {pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />}
        </View>
      </View>
      {renderAppOptions()}
      <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
        <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
      </EmojiPicker>
      <StatusBar style="light" />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    color: '#fff' // this is white color
  },
  imageContainer: {
    flex: 1,
    paddingTop: 58,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center'
  }
});

export default withAuthenticator(App);