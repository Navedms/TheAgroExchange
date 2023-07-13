import Sound from 'react-native-sound';

Sound.setCategory('Alarm');

const itemSelected = new Sound(
  'item_selected.mp3',
  Sound.MAIN_BUNDLE,
  error => {
    if (error) {
      console.log('failed to load the sound', error);
      return;
    }
  },
);

export default {
  itemSelected,
};
