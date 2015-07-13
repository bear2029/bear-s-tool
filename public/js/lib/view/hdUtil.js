define([
	'jquery',
	'backbone',
	'underscore',
	'handlebars',
	'lib/view/loginForm'
],function($,Backbone,_,Handlebars,LoginFormView)
{
	return Backbone.View.extend({
		initialize: function()
		{
			this.template = Handlebars.compile($('#header-utils-template').html());
			this.loginModel = new Backbone.Model({});
			_.bindAll(this,'onLogin','render','renderLoginForm')
			this.render();	
			$('.login',this.$el).on('click',this.renderLoginForm);
		},
		renderLoginForm: function(e)
		{
			e.preventDefault();
			if(this.loginFormView){
				this.loginFormView.remove();
			}
			this.loginFormView = new LoginFormView({model: this.loginModel,attributes:{parentEl:this.$el}})
			this.listenTo(this.loginModel,'login',this.onLogin);
			this.$el.append(this.loginFormView);
		},
		render: function()
		{
			this.$el = $(this.id)
			this.$el.append($(this.template({})));
			if(isSignedIn){
				this.$el.addClass('signed-in')
				$('.logout',this.$el).attr('href','/member/signout?forward='+encodeURIComponent(location.pathname+location.search))
			}
		},
		onLogin: function()
		{
			this.$el.addClass('signed-in')
		}
	})
})
