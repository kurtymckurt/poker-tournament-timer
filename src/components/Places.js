import React from 'react';
import { Text, StyleSheet, View } from 'react-native'
import AutoScrolling from 'react-native-auto-scrolling';

export default class Places extends React.Component {

    constructor(props) {
        super(props);
    }

    getOrdinal(n) {
        var s=["th","st","nd","rd"],
        v=n%100;
        return n+(s[(v-20)%10]||s[v]||s[0]);
    }

    render() {
        var me = this;
        const {places, total_pot} = me.props;
        var calculated_places = [];
        var listItems;
        
        if(places !== undefined) {
            for(var i = 0; i < places.length; i++) {
                calculated_places.push((places[i] * .01) * total_pot);
            }
            listItems = calculated_places.map((number, index) =>
                <div key={index}> {me.getOrdinal(index+1) + ' Place: $' + number} </div>
            );
        }
       
        const styles = StyleSheet.create({
            container: {
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#0b5187"
            },
            scrolling: {
                padding: 10,
                marginBottom: 10,
                "overflow-x": "visible"
            }
          });

        return(
            <div>
                  <View style={styles.container}> 
                    <AutoScrolling style={styles.scrolling} duration="10000" endPadding={50}>
                        <Text>{listItems}</Text>
                    </AutoScrolling>
                 </View> 
                
            </div>
        );
    }

}