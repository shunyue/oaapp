import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Image,
    Platform,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    TextInput,
    TouchableWithoutFeedback,
    CheckBox,
    } from 'react-native';
const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
import com from '../../public/css/css-com';
import Modal from 'react-native-modal';
import wds from '../../public/css/css-window-single';

export default class VisitPosition extends Component {
    back() {
        this.props.navigation.goBack(null);
    }
    constructor(props) {
        super(props);
        let {params}=this.props.navigation.state

    }
    goPage_addDailyReport(){
        let {params}=this.props.navigation.state;
        this.props.navigation.navigate('DailyReport',{
            user_id:params.user_id,
            company_id:params.company_id,
            daily_id:params.daily_id,
            title:params.title,
            daily_type:params.daily_type,
            typeName:params.typeName
        });
    }
    render() {
        return (
            <View style={[com.flex,com.bgcf5]}>
                {/*nav*/}
                <View style={[com.row,com.aic,com.jcsb,com.pdt5l15,com.bbwc,com.bgcfff]}>
                    <TouchableHighlight
                        onPress={()=>this.back()}
                        underlayColor="#ffffff"
                        >
                        <View style={[com.row,com.aic]}>
                            <Image
                                style={[com.tcr,com.wh16,]} source={require('../../imgs/jtxz.png')}/>
                            <Text style={[com.cr]}>返回</Text>
                        </View>
                    </TouchableHighlight>
                    <Text>拜访定位页面</Text>
                    <TouchableOpacity onPress={() => {this.goPage_addDailyReport()}}>
                        <Text>拜访报告</Text>
                    </TouchableOpacity>
                </View>
                <View><Text>这是拜访定位中间页</Text></View>
            </View>
        )
    }
}

