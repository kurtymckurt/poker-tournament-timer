import React from 'react';

export default class Places extends React.Component {

    constructor(props) {
        super(props);
        this.getPlaceString = this.getPlaceString.bind(this);
    }

    getOrdinal(n) {
        let s=["th","st","nd","rd"],
        v=n%100;
        return n+(s[(v-20)%10]||s[v]||s[0]);
    }

    getPlaceString(placesString, index) {
        if(placesString === undefined) {
            return this.getOrdinal(index+1);
        } else {
            if(placesString.includes("-")) {
                return placesString;
            } else {
                return this.getOrdinal(parseInt(placesString));
            }
        }
    }

    render() {
        let me = this;
        const {places, total_pot} = me.props;
        let calculated_places = [];
        let listItems;
        
        if(places !== undefined) {
            for(let i = 0; i < places.length; i++) {
                calculated_places.push(Math.floor(((places[i].percentage * .01) * total_pot)));
            }
            listItems = calculated_places.map((number, index) =>
                <div key={index}> {me.getPlaceString(places[index].place, index) + ': ' +
                number.toLocaleString(
                    this.props.locale,
                    {style: 'currency',
                        currency: this.props.currency,
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                    })} </div>
            );
        }
       

        return(
            <div>
                {listItems}
            </div>
        );
    }

}