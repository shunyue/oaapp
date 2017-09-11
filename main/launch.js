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
import { NavigationActions } from 'react-navigation'
export default class Launch extends Component {

    componentDidMount() {
        //锁定竖屏
        Orientation.lockToPortrait();
        AsyncStorage.getItem('user')
            .then((data) => {
                if(data) {
                    const resetAction = NavigationActions.reset({
                        index: 0,
                        actions: [
                            NavigationActions.navigate({ routeName: 'Main'})
                        ]
                    });
                    this.props.navigation.dispatch(resetAction);
                }else{
                    const resetAction = NavigationActions.reset({
                        index: 0,
                        actions: [
                            NavigationActions.navigate({ routeName: 'Login',params: {type: 'login'}})
                        ]
                    });
                    this.props.navigation.dispatch(resetAction);
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