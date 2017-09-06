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
    Dimensions
} from 'react-native';
const screenW = Dimensions.get('window').width;
export default class Chat extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isVisible: this.props.isVisible,
            tipValue: this.props.tipValue,
        }
    }

    static defaultProps = {
        isVisible: false,
        tipValue: '请选择',
        pickerData: {}
    };
    static propTypes = {
        isVisible: React.PropTypes.bool,
        tipValue: React.PropTypes.string,
        pickerData: React.PropTypes.array
    };

    _changeVisible() {
        this.setState({isVisible: !this.state.isVisible})
    }

    _pickData(name,value) {
        this.setState({
            tipValue: name,
        });
        this.props.onClick(value)
        this._changeVisible()
    }


    render() {
        var pickerList = [];
        var pickerData = this.props.pickerData;
        for(var i in pickerData) {
            pickerList.push(
                <TouchableHighlight underlayColor={'#F3F3F3'} onPress={this._pickData.bind(this,pickerData[i].name, pickerData[i].value)} style={{paddingLeft: 6,paddingRight: 6}} key={i}>
                    <View style={styles.listRow}>
                        <Text style={{marginLeft: 8}}>{pickerData[i].name}</Text>
                    </View>
                </TouchableHighlight>
            )
        }
        return (
            <TouchableWithoutFeedback style={{flex: 1}} onPress={()=>this._changeVisible()}>
                <View style={styles.container}>
                    <View style={styles.tipStyle}>
                        <Text style={{textAlign: 'center'}}>{this.state.tipValue}</Text>
                        <Image style={styles.imgStyle} source={require('../imgs/customer/arrowU.png')}/>
                    </View>
                    <Modal animationType={"fade"}
                           transparent={true}
                           visible={this.state.isVisible}
                           onRequestClose={()=>this._changeVisible()}>
                        <TouchableWithoutFeedback style={{flex: 1}} onPress={()=>this._changeVisible()}>
                            <View style={styles.bgModal}>
                                <View style={styles.modalContent}>
                                    {this.props.title &&<View style={styles.titleStyle}>
                                        <Text style={styles.titleText}>{this.props.title}</Text>
                                    </View>}
                                    <View>
                                        {pickerList}
                                    </View>
                                </View>

                            </View>
                        </TouchableWithoutFeedback>
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
        marginLeft: 4,
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