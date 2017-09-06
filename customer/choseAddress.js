/**
 * Created by Administrator on 2017/6/20.
 * 地区选择
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    Dimensions,
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    TouchableHighlight,
    Modal,
    TextInput,
    DeviceEventEmitter
} from 'react-native';
import CheckBox from 'react-native-check-box'
import Header from '../common/header';
import area from '../common/area.json';
const screenW = Dimensions.get('window').width;
export default class app extends Component {

    constructor(props) {
        super(props);
        const {params} = this.props.navigation.state;
        this.state = {
            area: params.area? params.area: area,
            checkBoxData: [],
            checkedData: []
        }
    }


    initCheckBoxData(checkbox){
        if(checkbox!=null){
            this.state.checkBoxData.push(checkbox);
        }
    }

    _confirm() {
        for (var i = 0; i < this.state.checkBoxData.length; i++) {
            if(this.state.checkBoxData[i]!=null && this.state.checkBoxData[i].state.isChecked == true){
                this.state.checkedData.push(this.state.checkBoxData[i].props.value);
            }
        }

        DeviceEventEmitter.emit('choosePeople',{checkedData: this.state.checkedData,type: this.props.navigation.state.params.type});
        this.props.navigation.goBack(null);


    }
    _selectAll() {
        if (this.selectAll.state.isChecked == false) {
            for (var i = 0; i < this.state.checkBoxData.length; i++) {
                if (this.state.checkBoxData[i] != null && this.state.checkBoxData[i].state.isChecked == false) {
                    this.state.checkBoxData[i].onClick();
                }
            }
        } else {
            for (var i = 0; i < this.state.checkBoxData.length; i++) {
                if (this.state.checkBoxData[i] != null && this.state.checkBoxData[i].state.isChecked == true) {
                    this.state.checkBoxData[i].onClick();
                }
            }
        }
    }

    _confirm() {
        for (var i = 0; i < this.state.checkBoxData.length; i++) {
            if (this.state.checkBoxData[i] != null && this.state.checkBoxData[i].state.isChecked == true) {
                this.state.checkedData.push(this.state.checkBoxData[i].props.value);
            }
        }
        DeviceEventEmitter.emit('choseAddress',this.state.checkedData);
        this.props.navigation.goBack('ChoseAddress');

    }




    _chooseCity(area) {
        if(area) {
            this.props.navigation.navigate('ChoseAddress',{area:area});
        }

    }
    render() {
        var areaData = this.state.area
        var list = [];
        for(var i in areaData){
            list.push(
                <TouchableHighlight key={i}
                                    onPress={this._chooseCity.bind(this,areaData[i].city)}
                                    underlayColor={'#F3F3F3'}>
                    <View style={styles.check_box}>
                        <View style={styles.leftContext}>
                            <CheckBox
                                ref={(c)=>this.initCheckBoxData(c)}
                                style={styles.checkBoxStyle}
                                onClick={()=>{}}
                                value={areaData[i].name}
                                checkedImage={<Image source={require('../imgs/selectnone.png')}/>}
                                unCheckedImage={<Image source={require('../imgs/select.png')}/>}
                            />
                            <Text>{areaData[i].name}</Text>
                        </View>
                        {areaData[i].city &&<Image style={styles.imgStyle}
                            source={require('../imgs/jtxr.png')}/>}
                    </View>
                </TouchableHighlight>
            )
        }
        return (
            <View style={styles.ancestorCon}>
                <Header navigation={this.props.navigation}
                        title="地区选择"/>
                <View style={styles.search_bj}>
                    <View style={styles.search_border}>
                        <Image style={styles.subNav_img} source={require('../imgs/customer/search.png')}/>
                        <TextInput
                            style={styles.input_text}
                            onChangeText={(text) => this.setState({text})}
                            placeholder ={"搜索商机"}
                            placeholderTextColor={"#aaaaaa"}
                            underlineColorAndroid="transparent"
                            />
                    </View>
                    <View style={{marginLeft:10,marginTop:15,flexDirection:'row',alignItems:'center'}}>
                        <Text style={{marginRight: 5}}>全国</Text>
                        <Text></Text>
                    </View>
                </View>
                <View style={{flex: 1}}>
                    <ScrollView style={{width:screenW,backgroundColor: '#fff',flex: 1}}>
                        <View style={styles.check_box}>
                            <View style={styles.leftContext}>
                                <CheckBox
                                    ref={(c)=>this.selectAll = c}
                                    style={styles.checkBoxStyle}
                                    onClick={()=>{this._selectAll()}}
                                    checkedImage={<Image source={require('../imgs/selectnone.png')}/>}
                                    unCheckedImage={<Image source={require('../imgs/select.png')}/>}
                                />
                                <Text>全选</Text>
                            </View>
                        </View>
                        {list}

                    </ScrollView>
                    <View style={styles.btnStyle}>
                        <TouchableOpacity onPress={()=>this._confirm()}>
                            <View style={styles.btnContainer}>
                                <Text style={styles.btnText}>确定</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    ancestorCon:{
        flex: 1,
        backgroundColor: '#F8F8F8',
    },

    go:{
        position:'absolute',
        top:8
    },
    add:{
        width:24,
        height:24,
    },
    backwz:{
        position:'absolute',
        top:5,
        left:25,
        color:'red',
    },
    search_bj:{
        backgroundColor:'#eee',
        height:80,
        width:screenW,
    },
    search_border:{
        width:screenW*0.95,
        height:28,
        backgroundColor:'#fff',
        marginLeft:9,
        marginTop:8,
        borderRadius:5,
        flexDirection:'row',
        alignContent:'center',
    },
    subNav_img:{
        width:15,
        height:15,
        marginTop:7,
        marginLeft:6,
        marginRight:4
    },
    subNav_img2:{
        width:25,
        height:25,
        marginTop:7,
        marginLeft:6,
        marginRight:4
    },
    input_text:{
        width:screenW*0.95,
        height:30,
        padding:0,
    },
    leftContext: {
        flexDirection:'row',
        alignItems:'center',
    },
    check_box:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 40,
        paddingRight: 10,
        borderColor:'#e3e3e3',
        borderBottomWidth:1,
    },

    input_content:{
        width:screenW*0.74,
    },
    imgStyle: {
        height: 16,
        width: 16,

    },
    checkBoxStyle: {
        width:40,
        padding: 10,
        marginLeft: 10,
        marginRight: 10
    },
    btnContainer: {
        width: 60,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e4393c',
        borderRadius: 2
    },
    btnStyle: {
        borderColor:'#e3e3e3',
        borderTopWidth: 1,
        paddingRight: 10,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-end',
        backgroundColor: '#fff'
    },
    btnText: {
        color: '#fff'
    }

});