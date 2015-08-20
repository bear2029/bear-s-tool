var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var bear = require('../../lib/bear');
var Handlebars = require('handlebars');

function getReferralFromQuery() {
	var matches = location.search.match(/[?&]referral=([^&]+)/);
	if (matches) {
		return decodeURIComponent(matches[1]);
	}
}
module.exports = Backbone.View.extend({
	initialize: function() {
		this.template = Handlebars.compile($('#login-form-template').html());
		this.attributes.errors = [];
		this.attributes.onSignin = true;
		if (location.port.match(/808\d/)) {
			this.attributes.host = 'https://' + location.hostname + ':8081';
		} else {
			this.attributes.host = 'https://' + location.hostname;
		}
		_.bindAll(this, 'wrappedRemove', 'render', 'onSubmit', 'onClose', 'onSwitchNav')
		this.render();
		this.remove = _.wrap(this.remove, this.wrappedRemove);
	},
	render: function() {
		this.$el.remove();
		this.$el = $(this.template(this.attributes));
		this.attributes.parentEl.append(this.$el);
		$('.nav-tabs>li>a', this.$el).on('click', this.onSwitchNav);
		this.$el.on('submit', this.onSubmit)
		this.$el.on('reset', this.onClose)
		setTimeout(function() {
			this.$el.addClass('appear')
		}.bind(this), 0)
	},
	wrappedRemove: function(func) {
		this.$el.removeClass('appear');
		bear.observe(this.$el, 'transitionend').then(func.bind(this))
	},
	onSwitchNav: function(e) {
		$('.nav-tabs>li').removeClass('active');
		var a = $(e.target);
		$(a.parents()[0]).addClass('active')
		this.$el.removeClass('on-signin')
		this.$el.removeClass('on-signup')
		this.attributes.onSignin = a.text() == 'Log in';
		this.$el.addClass(this.attributes.onSignin ? 'on-signin' : 'on-signup')
	},
	onSubmit: function(e) {
		e.preventDefault(e);
		var params = _.reduce($(e.target).serializeArray(), function(list, item) {
			list[item.name] = item.value;
			return list
		}, {})
		if (params['re-pwd']) {
			if (params['re-pwd'] != params['pwd']) {
				this.attributes.errors = ['password does not match']
				this.render()
				return
			}
			delete(params['re-pwd']);
		}
		$.ajax({
			url: $(e.target).attr('action'),
			data: JSON.stringify(params),
			type: 'POST',
			accepts: "application/json; charset=utf-8",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			context: this,
			success: function(result) {
				if (bear.isLoginPage()) {
					location.href = getReferralFromQuery();
				} else {
					this.model.trigger('login')
					this.remove();
				}
			},
			error: function(req, code, message) {
				this.attributes.errors = [message]
				this.render()
			}
		});
	},
	onClose: function(e) {
		e.preventDefault();
		this.remove();
	}
})
