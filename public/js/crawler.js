(function(){

var Editor = React.createClass({
	mixins: [React.addons.LinkedStateMixin],
	getInitialState:function(){
		return {
			sampleListUrl: 'http://www.piaotian.net/html/6/6788/'
		};
	},
	onReset: function(){
		this.state.sampleListUrl = "http://www.piaotian.net/html/6/6788/"
		console.log(this.state)
	},
	onSubmit: function(e)
	{
		e.preventDefault();
	},
	onAnyElementChanged: function(e)
	{
		console.log('change',e.target,this.state);
	},
	render: function() {
		return (
		<form class="form-horizontal" onSubmit={this.onSubmit}>
			<div className="form-group">
				<input  onKeyUp={this.onAnyElementChanged} type="url" className="form-control" placeholder="list URL for test" valueLink={this.linkState('sampleListUrl')}/>
			</div>
			<div className="form-group">
				<input type="text" onKeyUp={this.onRegexChange} className="form-control" name="list-url-regex" placeholder="list URL regex"/>
			</div>
			<div className="form-group">
				<button type="submit" className="btn btn-default" >Submit</button>
				<button type="reset2" className="btn btn-default" onClick={this.onReset}>Reset</button>
			</div>
		</form>
		);
	}
});
React.render(<Editor />, document.getElementById('crawlerEditor'));

})()
