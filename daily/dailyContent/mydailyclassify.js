import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    TouchableWithoutFeedback,
    TouchableHighlight,
    DeviceEventEmitter
} from 'react-native';
import Header from '../../common/header';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
const screenW = Dimensions.get('window').width;
export default class MyDailyClassify extends Component {
    constructor(props) {
        super(props);
        const {params} = this.props.navigation.state;
        this.state = {
            classify: params.classify?params.classify:[false,false,false,false],
            status_order: params.status_order?params.status_order:1,//默认为全部状态
            selected: params.selected?params.selected: false
        }
    }
    componentWillUnmount() {
        this._listenter1.remove();
    }

    componentDidMount() {
        this._listenter1 = DeviceEventEmitter.addListener('choseAddress', (e) => {
            this.setState({selected: true,place: e.join(",")})
        });
    }
    //选择日程类型
    _classify(type) {
        var list = [];
            for(var i in this.state.classify) {
                if(i == type) {
                    list.push(!this.state.classify[i])
                }else{
                    list.push(this.state.classify[i])
                }
            }
            this.setState({
                classify: list,
                selected: true,
            })
    }
    //选择日程状态
    _getstatus(id) {
        if(this.state.status_order == id) {
            this.setState({
                status_order: 1
            })
        }else{
            this.setState({
                status_order: id,
                selected: true
            })
        }
    }
    //重置
    _resetPress() {
        this.setState({
            classify: [false,false,false,false],
            status_order: 1,
            selected: false
        })
    }
    //完成
    _completePress() {
        const {params} = this.props.navigation.state;
        DeviceEventEmitter.emit('MyDailyClassify',{
            classify: this.state.classify,
            status_order: this.state.status_order,
            selected: this.state.selected
        })
        this.props.navigation.goBack(null)
    }
    render() {
        return (
            <View style={styles.container}>
                <Header navigation={this.props.navigation}
                        title="筛选日程"/>
                <ScrollView style={{flex: 1}}>
                    <Text style={{marginLeft:12,marginTop:20}}>日程类型</Text>
                    <View style={styles.customer_fenlei}>
                        <View style={{height:40,flexDirection:'row',marginLeft:5,flexWrap: 'wrap'}}>
                            <TouchableOpacity activeOpacity={1} style={this.state.classify[0]?styles.checkedClassify:styles.classifyStyle}
                                              onPress={()=>this._classify(0)}>
                                <Text style={this.state.classify[0]?{color: '#e4393c'}: null}>拜访</Text>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={1} style={this.state.classify[1]?styles.checkedClassify:styles.classifyStyle}
                                              onPress={()=>this._classify(1)}>
                                <Text style={this.state.classify[1]?{color: '#e4393c'}: null}>任务</Text>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={1} style={this.state.classify[2]?styles.checkedClassify:styles.classifyStyle}
                                              onPress={()=>this._classify(2)}>
                                <Text style={this.state.classify[2]?{color: '#e4393c'}: null}>会议</Text>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={1} style={this.state.classify[3]?styles.checkedClassify:styles.classifyStyle}
                                              onPress={()=>this._classify(3)}>
                                <Text style={this.state.classify[3]?{color: '#e4393c'}: null}>培训</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View>
                        <Text style={{marginLeft:12,marginTop:10}}>日程状态</Text>
                        <View style={styles.customer_fenlei}>
                            <View style={{height:40,flexDirection:'row',marginLeft:5,flexWrap: 'wrap'}}>
                                <TouchableOpacity activeOpacity={1} style={(this.state.status_order == 1)?styles.checkedClassify:styles.classifyStyle}
                                                  onPress={()=>this._getstatus(1)}>
                                    <Text style={(this.state.status_order == 1)?{color: '#e4393c'}: null}>全部状态</Text>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={1} style={(this.state.status_order == 2)?styles.checkedClassify:styles.classifyStyle}
                                                  onPress={()=>this._getstatus(2)}>
                                    <Text style={(this.state.status_order == 2)?{color: '#e4393c'}: null}>无进展</Text>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={1} style={(this.state.status_order == 3)?styles.checkedClassify:styles.classifyStyle}
                                                  onPress={()=>this._getstatus(3)}>
                                    <Text style={(this.state.status_order == 3)?{color: '#e4393c'}: null}>有进展</Text>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={1} style={(this.state.status_order == 4)?styles.checkedClassify:styles.classifyStyle}
                                                  onPress={()=>this._getstatus(4)}>
                                    <Text style={(this.state.status_order == 4)?{color: '#e4393c'}: null}>未结束</Text>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={1} style={(this.state.status_order == 5)?styles.checkedClassify:styles.classifyStyle}
                                                  onPress={()=>this._getstatus(5)}>
                                    <Text style={(this.state.status_order ==5)?{color: '#e4393c'}: null}>已结束</Text>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={1} style={(this.state.status_order == 6)?styles.checkedClassify:styles.classifyStyle}
                                                  onPress={()=>this._getstatus(6)}>
                                    <Text style={(this.state.status_order == 6)?{color: '#e4393c'}: null}>已撤销</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <View style={{height:40,backgroundColor:'#f9d2d2',flexDirection:'row',alignItems:'center'}}>
                    <TouchableOpacity activeOpacity={1} style={styles.resetBtn} onPress={()=>this._resetPress()}>
                        <Text  style={{color:'#e15151',}}>重置</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} style={styles.completeBtn} onPress={()=>this._completePress()}>
                        <Text  style={{color:'#fff',}}>完成</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#F8F8F8',
    },
    customer_fenlei: {
        height: 80,
        borderColor: '#e3e3e3',
        borderBottomWidth: 1
    },
    classifyStyle:{
        backgroundColor:'#e3e3e3',
        width:screenW*0.26,
        margin:5,
        height:30,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:4
    },
    checkedClassify:{
        borderColor: '#BF2537',
        borderWidth: 1,
        backgroundColor:'#FFEEED',
        width:screenW*0.26,
        margin:5,
        height:30,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:4
    },

    textIput:{
        flexDirection:'row',
        alignItems:'center',
        width:screenW,
        height:40,
        borderColor:'#e3e3e3',
        borderBottomWidth:1,
    },
    input_title:{
        width:screenW*0.3,
        paddingLeft:12
    },
    input_text:{
        width:screenW*0.48,
        height:40
    },
    input_content:{
        color:'#a5a5a5',
        width:screenW*0.48,

    },
    touch_a:{
        flexDirection:'row',
        alignItems:'center',
        paddingLeft:5,
        height:40

    },
    textINput_arrow:{
        width:16,
        height:16,
        marginLeft:16
    },
    resetBtn: {
        height:40,
        width:screenW*0.2,
        alignItems:'center',
        justifyContent:'center'
    },
    completeBtn: {
        height:40,
        width:screenW*0.8,
        alignItems:'center',
        backgroundColor:'#e15151',
        justifyContent:'center'
    }

});

