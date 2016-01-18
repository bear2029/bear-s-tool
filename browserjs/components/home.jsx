import React from 'react';

const BButton = ({label,onClick}) => (<button onClick={onClick}>{label}</button>);
class Home extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		return (
		<div>
			<h1>count: {this.props.value}</h1>
			<BButton label="+" onClick={this.props.onIncrement} />
			<BButton label="-" onClick={this.props.onIncrement} />
		</div>
		);
	}
}
export default Home;
