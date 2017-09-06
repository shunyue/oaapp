import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    AsyncStorage
} from 'react-native';
import Orientation from 'react-native-orientation';
export default class Launch extends Component {

    componentDidMount() {
        //锁定竖屏
        Orientation.lockToPortrait();
        AsyncStorage.getItem('user')
            .then((data) => {
                if(data) {
                    this.props.navigation.navigate('Main');
                }else{
                    this.props.navigation.navigate('Login');
                }
            })
    }
    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator
                    animating={true}
                    style={{height: 80}}
                    size="small"
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
        justifyContent: 'center',
        alignItems: 'center'
    },
});