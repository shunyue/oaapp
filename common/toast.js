var toast = {};
import Toast from 'react-native-root-toast';
toast.center = function( msg ) {
  return Toast.show(msg, {
    duration: Toast.durations.SHORT,
    position: Toast.positions.CENTER,
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: 0
  });
};
toast.bottom = function( msg ) {
    return Toast.show(msg, {
      duration: Toast.durations.SHORT,
      position: Toast.positions.BOTTOM,
      shadow: false,
      animation: true,
      hideOnPress: true,
      delay: 0
    });
};
module.exports = toast;