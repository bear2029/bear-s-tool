(function(){

var Editor = React.createClass({
	mixins: [React.addons.LinkedStateMixin],
	getInitialState:function(){
		return {
			sampleListUrl: '',
			isListUrlValid: false
		};
	},
	onSubmit: function(e)
	{
		e.preventDefault();
	},
	onListUrlMatchChanged: function(e)
	{
		var regexString = $('input[name=list-url-regex]',React.findDOMNode(this)).val()
		var url = $('input[name=list-url]',React.findDOMNode(this)).val()
		var urlDiv = $('input[name=list-url]',React.findDOMNode(this)).parent()
		var isValid = false;
		if(url && regexString){
			var regex = new RegExp(regexString);
			isValid = url.match(regex);
		}
		this.setState({isListUrlValid: isValid});
		if(isValid){
			urlDiv.addClass('valid');
			urlDiv.removeClass('invalid');
		}else{
			urlDiv.removeClass('valid');
			urlDiv.addClass('invalid');
		}
	},
	render: function() {
		return (
		<form class="form-horizontal" onSubmit={this.onSubmit}>
			<div className="form-group list-url">
				<input name="list-url" onKeyUp={this.onListUrlMatchChanged} type="url" className="form-control" placeholder="list URL for test" valueLink={this.linkState('sampleListUrl')}/>
				<div className="validation-icon"><span className="glyphicon glyphicon-ok" aria-hidden="true"></span></div>
			</div>
			<div className="form-group">
				<input type="text" onKeyUp={this.onListUrlMatchChanged} className="form-control" name="list-url-regex" placeholder="list URL regex"/>
			</div>
			<div className="form-group">
				<button type="submit" className="btn btn-default" >Submit</button>
			</div>
		</form>
		);
	}
});
React.render(<Editor />, document.getElementById('crawlerEditor'));

})()
