/*
* 流程 表单 单选  弹出层组件
* */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    TouchableWithoutFeedback,
    Modal,
    Image,
    Dimensions,
    TouchableOpacity
} from 'react-native';
const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
export default class Chat extends Component {

    constructor(props) {
        super(props);
        this.state = {
            processModal: this.props.processModal,
        }
    }

    static defaultProps = {
        processModal: false,
        radio_data: {}
    };
    static propTypes = {
        processModal: React.PropTypes.bool,
        radio_data: React.PropTypes.array
    };

    _changeVisible() {
        this.setState({processModal: !this.state.processModal})
    }





    _pickData(value) {
        this.props.onPress(value);//单选选中会 将选中的值 传递调用组件的地方
        this._changeVisible();
    }


    render() {

        var radio_data=this.props.radio_data;
        //var radio_attr_name=this.props.radio_attr_name;


        return (
            <TouchableWithoutFeedback style={{flex: 1}} onPress={()=>this._changeVisible()}>
        <View >
            <View style={styles.tipStyle}>
                <Text style={{textAlign: 'center'}}>{this.state.tipValue}</Text>
                <Image style={styles.imgStyle} source={require('../imgs/customer/arrow_r.png')}/>
            </View>

            <Modal
                animationType={'fade '}
                transparent={true}
                visible={this.state.processModal}
                onRequestClose={() => { this._changeVisible(false) } }

            >
                <TouchableOpacity  style={{width:screenW,height:screenH,backgroundColor:'#000',opacity:0.6,}}  onPress={() => {this._changeVisible(!this.state.processModal)}}>

                </TouchableOpacity >
                <View style={{backgroundColor:'#fff',width:screenW*0.7,height:screenH*0.8,position:'absolute',top:screenH*0.1,left:screenW*0.15}}>

                    <Text style={{fontSize:16,marginTop:20,marginLeft:10}}>请选择</Text>



                    <RadioForm style={{marginLeft:40,flexWrap:'wrap',}}
                               radio_props={radio_data}
                               buttonSize={10}
                               formHorizontal={false}
                               onPress={(value) => {this.setState({value:value});this._pickData(value)}}
                    />


                    <Text onPress={() => {this._changeVisible(!this.state.processModal)}} style={{fontSize:16,marginLeft:200,marginTop:20,color:'#387FFF'}}>取消</Text>




                </View>
            </Modal>
            </View>
            </TouchableWithoutFeedback>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    imgStyle: {
        height: 16,
        width: 16,
        marginRight: 10,
        tintColor: '#A8A8A8'
    },
    tipStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContent: {
        backgroundColor: '#fff',
        width: screenW*0.8
    },
    bgModal: {
        flex: 1,
        backgroundColor:'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    listRow: {
        height: 50,
        justifyContent: 'center',
        borderColor: '#F7F7F7',
        borderBottomWidth: 1
    },
    titleStyle: {
        height: 50,
        justifyContent: 'center',
        borderColor: '#F7F7F7',
        borderBottomWidth: 1
    },
    titleText: {
        fontSize: 18,
        color: '#e4393c',
        marginLeft: 8
    }
});