App.Views.Search = Backbone.View.extend({
	el:'#page',
	initialize: function(){
		console.log('search view loaded');
    this.template = HandlebarsTemplates['search_box'];
    this.render();
	},
	render: function(){
		this.$el.html(this.template);
		
	},
	events: {
		'click .search': 'goSearch',
		'click .sign-up': 'loadSignup'
	},
	goSearch: function(){

	},
	loadSignup: function(){
        $('#search-bar').empty();
        App.signup = new App.Views.Signups();
    }
});