import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Platform,
    TouchableHighlight,
    TouchableOpacity,
    Image
} from 'react-native';

export default class Chat extends Component {
    _goBack() {
        this.props.navigation.goBack(null);
    }

    _rightContent() {
        if(this.props.source) {
            return <TouchableOpacity {...this.props}>
                        <View style={styles.navContent}>
                            <Image
                                {...this.props}
                                style={styles.rightImg}
                                />
                        </View>
                    </TouchableOpacity>
        }else if(this.props.rightText) {
            return <TouchableOpacity {...this.props}>
                        <View style={styles.navContent}>
                            <Text style={styles.navText}>{this.props.rightText}</Text>
                        </View>
                    </TouchableOpacity>
        }else{
            return <View style={styles.blackView}></View>
        }
    }

    render() {
        return (
            <View style={styles.nav}>
                <TouchableOpacity
                    onPress={()=>this._goBack()}>
                    <View style={styles.navContent}>
                        <Image style={{marginRight: 6}} source={require('../imgs/navxy.png')}/>
                        <Text style={styles.navText}>返回</Text>
                    </View>

                </TouchableOpacity>
                <View style={styles.navTitle}>
                    <Text style={styles.titleStyle}>{this.props.title}</Text>
                </View>
                {this._rightContent()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    nav: {//头部导航
        height:  (Platform.OS === 'ios') ? 60:40 ,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#bbb',

    },
    navContent: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        width: 80,
    },
    navText: {
        fontSize: 16,
        lineHeight: 18,
        fontWeight: 'normal',
        color: '#e4393c',
    },

    titleStyle: {//导航字体相关
        color: '#000',
        fontSize: 16,
        height: 20
    },
    navTitle: {
        height: 40,
        justifyContent: 'center'
    },
    blackView: {
        width: 80
    },
    rightImg: {
        width: 22,
        height: 22
    }
});