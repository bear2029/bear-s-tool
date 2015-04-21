(function(){
Ajax = {/*{{{*/
	delete:function(url,data)
	{
		return this.post(url,data,'DELETE')
	},
	post:function(url,data)
	{
		var method = arguments[2] || 'POST'
		return new Promise(function(resolve,reject){
			$.ajax({
				method: method,
				url: url,
				data: JSON.stringify(data),
				processData: false,
				contentType: 'application/json'
			}).done(function(msg) {
				resolve(msg);
			}).fail(function(jqXHR, textStatus, errorThrown){
				reject(new Error(jqXHR.responseJSON))
			});
		})
	},
	get:function(url)
	{
		return new Promise(function(resolve,reject){
			$.ajax({
				method: "GET",
				url: url,
				contentType: 'application/json'
			}).done(function(msg) {
				resolve(msg);
			}).fail(function(jqXHR, textStatus, errorThrown){
				reject(new Error(errorThrown))
			});
		})
	}
};/*}}}*/
var Editor = React.createClass(
{/*{{{*/
	mixins: [React.addons.LinkedStateMixin],
	getInitialState:function(){
		this.fieldMap = ['siteName','collectionRule','itemRule','collectionUrlRegex','itemUrlRegex','collectionUrl','itemUrl']
		this.isNew = !this.props.data._source;
		var state = $.extend({
			iscollectionUrlValid: true,
			isItemUrlValid: true
		},this.props.data._source);
		return state;
	},
	onSubmit: function(e)
	{
		e.preventDefault();
		var formBody = {};
		var self = this
		this.fieldMap.map(function(key){
			var val = self.state[key];
			if(val){
				formBody[key] = val
			}
		})
		var url = "//www.tool.bear:9200/crawler/common";
		if(this.props.data && this.props.data._id){
			url += '/' + this.props.data._id
		}
		Ajax.post(url,formBody).then(function(e){
			console.log(e);
		},function(e){
			throw e
		})
		.then(function(e){
			console.log('aaa')
		})
		.catch(function(e){
			console.log('catch');
		})
	},
	urlTestTypeFromEvent: function(e)
	{
		var name = $(e.target).attr('name');
		var matches = name.match(/^([a-z]+)-url/);
		if(!matches){
			new Error('element is illigal')
		}
		return matches[1];
	},
	componentDidMount:function()
	{
		this.parentElement = $(React.findDOMNode(this)).closest('.popup');
		if(this.parentElement){
			this.parentElement.addClass('appear')
		}
	},
	onClose: function(e)
	{
		var that = this
		e.preventDefault();
		if(this.parentElement){
			this.parentElement.removeClass('appear')
			this.parentElement.unbind('transitionend')
			this.parentElement.bind('transitionend',function(e){
				$(React.findDOMNode(that)).remove()
			});
		}
	},
	onTest: function(e)
	{
		e.preventDefault()
		var matches = $(e.target).attr('class').match(/(item|collection)/)
		if(matches){
			var testType = matches[0];
			var consoleArea = $('.console textarea',React.findDOMNode(this))
			var story = {
				testUrl: this.state[testType+'Url'],
				testRule: JSON.parse(this.state[testType+'Rule'])
			};
			console.log('testing',story)
			Ajax.post('/crawler/scriptTester',story).then(function(e){
				console.log('response',e);
				consoleArea.removeClass('error')
				consoleArea.html(JSON.stringify(e))
			},function(e){
				console.log('error',e);
				consoleArea.addClass('error')
				consoleArea.html(e.message)
			})
		}
	},
	onUrlMatchChanged: function(e)
	{
		var testType = this.urlTestTypeFromEvent(e);
		var regexString = $('input[name='+testType+'-url-regex]',React.findDOMNode(this)).val()
		var url = $('input[name='+testType+'-url]',React.findDOMNode(this)).val()
		var urlDiv = $('input[name='+testType+'-url]',React.findDOMNode(this)).parent()
		var isValid = false;
		if(url && regexString){
			var regex = new RegExp(regexString);
			isValid = url.match(regex);
		}
		this.setState({iscollectionUrlValid: isValid});
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
		<form className="crawler-editor" onSubmit={this.onSubmit}>
			<div className="editor">
				<h4>Editor</h4>
				<div className="form-group">
					<input name="site-name" className="form-control" placeholder="site name" valueLink={this.linkState('siteName')}/>
				</div>
				<div className="form-group url">
					<input name="list-url" onKeyUp={this.onUrlMatchChanged} type="url" className="form-control wide" placeholder="list URL for test" valueLink={this.linkState('collectionUrl')}/>
					<div className="validation-icon"><span className="glyphicon glyphicon-ok" aria-hidden="true"></span></div>
					<input type="text" onKeyUp={this.onUrlMatchChanged} className="form-control" name="list-url-regex" placeholder="list URL regex" valueLink={this.linkState('collectionUrlRegex')} />
				</div>
				<div className="form-group url">
					<input name="item-url" onKeyUp={this.onUrlMatchChanged} type="url" className="form-control wide" placeholder="item URL for test" valueLink={this.linkState('itemUrl')}/>
					<div className="validation-icon"><span className="glyphicon glyphicon-ok" aria-hidden="true"></span></div>
					<input type="text" onKeyUp={this.onUrlMatchChanged} className="form-control" name="item-url-regex" placeholder="item URL regex" valueLink={this.linkState('itemUrlRegex')}/>
				</div>
				<div className="form-group url">
					<input type="text" className="form-control wide" name="collection-rule" placeholder="collection rule, e.g. {&#34;title&#34;:&#34;$('h1').html()&#34;}" valueLink={this.linkState('collectionRule')}/>
					<input type="submit" className="btn btn-default collection" onClick={this.onTest} value="test"/>
				</div>
				<div className="form-group url">
					<input type="text" className="form-control wide" name="item-rule" placeholder="item rule" valueLink={this.linkState('itemRule')}/>
					<input type="submit" className="btn btn-default item" onClick={this.onTest} value="test"/>
				</div>
				<div className="form-group">
					<button type="submit" className="btn btn-default" >Submit</button>&nbsp;
					<button type="close" className="btn btn-default" onClick={this.onClose}>Close</button>
				</div>
			</div>
			<div className="console">
				<h4>Console</h4>
				<textarea readonly></textarea>
			</div>
		</form>
		);
	}
});/*}}}*/
var CrawlerList = React.createClass(
{/*{{{*/
	getInitialState: function()
	{
		return {data:this.props.data};
	},
	onAddNew: function()
	{
		var data = {'_source': {}}
		React.render(<Editor data={data} />, $('#crawler-editor')[0]);
	},
	render: function()
	{
		return (
		<table className="table table-striped">
			<tr>
				<th>site name</th>
				<th>list URL</th>
				<th>list URL match</th>
				<th>deletion</th>
			</tr>
			{this.state.data.map(function(item){
				return <CrawlerItem data={item}/>;
			})}
			<tr>
				<td colSpan="4"><button className="btn btn-primary" onClick={this.onAddNew}>Add New &nbsp;<span className="glyphicon glyphicon-plus"></span></button></td>
			</tr>
		</table>
		)
	}
});/*}}}*/
var CrawlerItem = React.createClass(
{
	mixins: [React.addons.LinkedStateMixin],
	getInitialState: function()
	{
		return this.props.data;
	},
	onClick: function()
	{
		React.render(<Editor data={this.state} />, $('#crawler-editor')[0]);
	},
	onDelete: function(e)
	{
		var that = this
		e.preventDefault();
		Ajax.delete('//www.tool.bear:9200/crawler/common/'+this.state._id).then(function(){
			$(React.findDOMNode(that)).remove();
		})
		return false
	},
	render: function()
	{
		return (
		<tr onClick={this.onClick}>
			<td>{this.state._source.siteName}</td>
			<td>{this.state._source.collectionUrl}</td>
			<td>{this.state._source.collectionUrlRegex}</td>
			<td><button className="btn btn-danger btn-xs" onClick={this.onDelete}>delete <span className="glyphicon glyphicon-remove"></span></button></td>
		</tr>
		)
	}
})

Ajax.post('//www.tool.bear:9200/crawler/common/_search',{size:1000})
.then(function(data){
	return data.hits.hits
})
.then(function(data){
	React.render(<CrawlerList data={data} />, document.getElementById('crawler-list'));
}).catch(function(e){
	var data = [];
	React.render(<CrawlerList data={data} />, document.getElementById('crawler-list'));
})

})()
