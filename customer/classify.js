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
import Header from '../common/header';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
const screenW = Dimensions.get('window').width;
export default class Classify extends Component {
    constructor(props) {
        super(props);
        const {params} = this.props.navigation.state;
        this.state = {
            place: params.classify.place?params.classify.place:"全部",
            classify: params.classify.classify?params.classify.classify:[false,false,false,false,false],
            start_time: params.classify.start_time?params.classify.start_time:null,
            stop_time: params.classify.stop_time?params.classify.stop_time:null,
            day: params.classify.day?params.classify.day:null,
            isDateStartPickerVisible: false,
            isDateStopPickerVisible: false,
            selected: params.classify.selected?params.classify.selected: false
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

    _showDateStartPicker = () => this.setState({ isDateStartPickerVisible: true });

    _hideDateStartPicker = () => this.setState({ isDateStartPickerVisible: false });

    _handleDateStartPicked = (date) => {
        this.setState({
            start_time: moment(date).format('YYYY-MM-DD'),
            isDateStartPickerVisible: false,
            day: null,
            selected: true
        });
    };

    _showDateStopPicker = () =>this.setState({ isDateStopPickerVisible: true });

    _hideDateStopPicker = () => this.setState({ isDateStopPickerVisible: false });

    _handleDateStopPicked = (date) => {
        this.setState({
            stop_time: moment(date).format('YYYY-MM-DD'),
            isDateStopPickerVisible: false,
            day: null,
            selected: true
        });
    };

    _classify(position) {
        var list = []
        for(var i in this.state.classify) {
            if(i == position) {
                list.push(!this.state.classify[i])
            }else{
                list.push(this.state.classify[i])
            }
        }
        this.setState({
            classify: list,
            selected: true
        })
    }
    _chooseDay(id) {
        if(this.state.day == id) {
            this.setState({
                day: null
            })
        }else{
            this.setState({
                start_time: null,
                stop_time: null,
                day: id,
                selected: true
            })
        }
    }
    _resetPress() {
        this.setState({
            place: "全部",
            classify: [false,false,false,false,false],
            start_time: null,
            stop_time: null,
            day: null,
            selected: false
        })
    }
    _completePress() {
        const {params} = this.props.navigation.state;
        if(params.type == 'normal') {
            DeviceEventEmitter.emit('Classify',{place: this.state.place,classify: this.state.classify,start_time: this.state.start_time,stop_time: this.state.stop_time,day: this.state.day,selected: this.state.selected});

        }else if(params.type == 'common') {
            DeviceEventEmitter.emit('CommonClassify',{place: this.state.place,classify: this.state.classify,start_time: this.state.start_time,stop_time: this.state.stop_time,day: this.state.day,selected: this.state.selected});

        }

        this.props.navigation.goBack(null)
    }
    render() {
        return (
            <View style={styles.container}>
                <Header navigation={this.props.navigation}
                        title="筛选客户"/>
                <ScrollView style={{flex: 1}}>
                    <Text style={{marginLeft:12,marginTop:20}}>客户分类</Text>
                    <View style={styles.customer_fenlei}>
                        <View style={{height:35,flexDirection:'row',marginLeft:5,flexWrap: 'wrap'}}>
                            <TouchableOpacity activeOpacity={1} style={this.state.classify[0]?styles.checkedClassify:styles.classifyStyle}
                                              onPress={()=>this._classify(0)}>
                                <Text style={this.state.classify[0]?{color: '#e4393c'}: null}>A级</Text>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={1} style={this.state.classify[1]?styles.checkedClassify:styles.classifyStyle}
                                              onPress={()=>this._classify(1)}>
                                <Text style={this.state.classify[1]?{color: '#e4393c'}: null}>B级</Text>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={1} style={this.state.classify[2]?styles.checkedClassify:styles.classifyStyle}
                                              onPress={()=>this._classify(2)}>
                                <Text style={this.state.classify[2]?{color: '#e4393c'}: null}>C级</Text>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={1} style={this.state.classify[3]?styles.checkedClassify:styles.classifyStyle}
                                              onPress={()=>this._classify(3)}>
                                <Text style={this.state.classify[3]?{color: '#e4393c'}: null}>D级</Text>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={1} style={this.state.classify[4]?styles.checkedClassify:styles.classifyStyle}
                                              onPress={()=>this._classify(4)}>
                                <Text style={this.state.classify[4]?{color: '#e4393c'}: null}>未分级</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableHighlight underlayColor={'#F3F3F3'}
                                        onPress={() => this.props.navigation.navigate('ChoseAddress',{})}>
                        <View style={styles.textIput}>
                            <Text style={styles.input_title}>客户位置</Text>
                            <View style={styles.touch_a}>
                                <Text numberOfLines={1} style={styles.input_content}>{this.state.place}</Text>
                                <Image style={styles.textINput_arrow}
                                       source={require('../imgs/customer/arrow_r.png')}/>
                            </View>
                        </View>
                    </TouchableHighlight>
                    <View>
                        <Text style={{marginLeft:12,marginTop:10}}>创建时间</Text>
                        <View style={styles.customer_fenlei}>
                            <View style={{height:35,flexDirection:'row',marginLeft:5}}>
                                <TouchableWithoutFeedback onPress={this._showDateStartPicker}>
                                    <View style={[styles.classifyStyle,{width:screenW*0.356}]}>
                                        <Text>{this.state.start_time?this.state.start_time: "起始时间"}</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <DateTimePicker
                                    cancelTextIOS="取消"
                                    confirmTextIOS="确定"
                                    datePickerModeAndroid="spinner"
                                    isVisible={this.state.isDateStartPickerVisible}
                                    mode={"date"}
                                    onConfirm={this._handleDateStartPicked}
                                    onCancel={this._hideDateStartPicker}
                                />
                                <View style={{width:screenW*0.08,height:1, borderBottomWidth:1,borderBottomColor:'#ccc',marginLeft:screenW*0.006,marginRight:screenW*0.006,marginTop: 18}}></View>
                                <TouchableWithoutFeedback onPress={this._showDateStopPicker}>
                                    <View style={[styles.classifyStyle,{width:screenW*0.356}]}>
                                        <Text>{this.state.stop_time?this.state.stop_time: "最后时间"}</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <DateTimePicker
                                    cancelTextIOS="取消"
                                    confirmTextIOS="确定"
                                    datePickerModeAndroid="spinner"
                                    isVisible={this.state.isDateStopPickerVisible}
                                    mode={"date"}
                                    onConfirm={this._handleDateStopPicked}
                                    onCancel={this._hideDateStopPicker}
                                />
                            </View>
                            <View style={{height:35,flexDirection:'row',marginLeft:5}}>
                                <TouchableOpacity activeOpacity={1} style={(this.state.day == 1)?styles.checkedClassify:styles.classifyStyle}
                                                  onPress={()=>this._chooseDay(1)}>
                                    <Text style={(this.state.day == 1)?{color: '#e4393c'}: null}>今日</Text>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={1} style={(this.state.day == 2)?styles.checkedClassify:styles.classifyStyle}
                                                  onPress={()=>this._chooseDay(2)}>
                                    <Text style={(this.state.day == 2)?{color: '#e4393c'}: null}>本周</Text>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={1} style={(this.state.day == 3)?styles.checkedClassify:styles.classifyStyle}
                                                  onPress={()=>this._chooseDay(3)}>
                                    <Text style={(this.state.day == 3)?{color: '#e4393c'}: null}>本月</Text>
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

