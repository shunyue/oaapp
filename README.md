# oaapp

大家及时更新上传内容

home.js、my和imgs文件夹中的内容
<h3>插件修改</h3>

<p>1、找到../node_modules/react-native-modal/src中的 index.js 去掉 “{ margin: deviceWidth * 0.05 },”</p>
2、找到../node_modules/react-native-pie-chart/src中的 index.js 把  <br/>
  const angle = series.reduce((previous, current, index) => {<br/>
        if (index == (series.length - 1)) {<br/>
          return previous.concat(360);<br/>
        } else {<br/>
          return previous.concat(previous[previous.length - 1] + Math.round(360 * current/sum));<br/>
        }<br/>
      }, [0]);<br/>
   替换为<br/>
   const angle = series.reduce((previous, current, index) => {<br/>
      if (index == (series.length - 1)) {<br/>
        return previous.concat(180);<br/>
      } else {<br/>
        return previous.concat(previous[previous.length - 1] + Math.round(180 * current/sum));<br/>
      }<br/>
    }, [0]);<br/>
README.md