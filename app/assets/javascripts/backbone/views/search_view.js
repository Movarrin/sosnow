App.Views.Search = Backbone.View.extend({
    //sets id of div where main rendering will take place
    el: '#page',
    initialize: function() {
        //sets template
        this.template = HandlebarsTemplates['search_box'];
        this.listenTo(this.collection, 'add', this.triggeredNew());
        this.render();
        this.renderAllItems();

    },
    renderAllItems: function() {
        console.log('rendering triggered');
        //Empties div, inserts table template and then sends each model in the collection to the render function, from newest to oldest
        $('#victim-box').empty();
        $('#victim-box').html(HandlebarsTemplates['search_table']);
        $('.victim-list').prepend('<div><b>Recently Added</b></div>');
        this.collection.reversed().each(this.renderItem, this);
        var data = this.collection.reversed().toJSON();
        $('#recent-map').html(HandlebarsTemplates['map_view'](data));
    },
    triggeredNew: function(){
        // alert('A NEW USER WAS ADDED');
    },
    renderItem: function(model) {
        //Sends each model into the View to be rendered
        var newVictimView = new App.Views.Victim({
            model: model
        });
    },
    render: function() {
        //renders search page
        this.$el.html(this.template);

    },
    events: {
        //click event for search button
        'keyup [name=location]': 'goSearch',
        'keyup [name=name]': 'goSearch',
        'click [type="radio"]': 'goSearch',
        //click event for sign up button
        'click .sign-up': 'loadSignup',
        //click event for log in button  
        'click .log-in': 'loadLogin',
        'click .see-victim': 'showModal',
        'click .see-victim-on-map': 'showModalForMarkerOnMap',
        'change #datepicker': 'goSearch'

    },
    goSearch: function() {
        //extracts values from search fields
        var data = {
            name: $('[name=name]').val(),
            location: $('[name=location]').val(),
            date: $('#datepicker').val(),
            need_Rescue: $('input[name="safe"]:checked').val(),
            injured: $('input[name="injured"]:checked').val()
        };
        //Empties div and mounts table for results
        $('#victim-box').empty();
        $('#victim-box').html(HandlebarsTemplates['search_table']);


        //Loops through collection, adding results to new collections. Cascades need_rescue->name->location->date
        var nameFilter = new Backbone.Collection();
        var locationFilter = new Backbone.Collection();
        var dateFilter = new Backbone.Collection();
        var safeFilter = new Backbone.Collection();
        // var injuredFilter = new Backbone.Collection();

        // for (var m = 0; m<this.collection.length; m++){
        //     var searchInjured = this.collection.models[m].attributes.injured;
        //     if (searchInjured.toString() == data.injured) {
        //         injuredFilter.add(this.collection.models[m]);
        //     }
        // }
        for (var l = 0; l < this.collection.length; l++) {
            var searchSafe = this.collection.models[l].attributes.need_rescue;
            if (searchSafe.toString() == data.need_Rescue) {
                safeFilter.add(this.collection.models[l]);
            }
        }
        for (var i = 0; i < safeFilter.length; i++) {
            var searchName = safeFilter.models[i].attributes.name.toLowerCase();
            if (searchName.match(data.name.toLowerCase())) {
                nameFilter.add(safeFilter.models[i]);
            }
        }
        for (var k = 0; k < nameFilter.length; k++) {
            var searchLoc = nameFilter.models[k].attributes.location.toLowerCase();
            if (searchLoc.match(data.location.toLowerCase())) {
                locationFilter.add(nameFilter.models[k]);
            }
        }
        for (var j = 0; j < locationFilter.length; j++) {
            var searchDate = locationFilter.models[j].attributes.convcreateddate;
                console.log((searchDate == data.date));
                console.log("searchdate "+ searchDate+".");
                console.log("data.date " + data.date+".");
            if ((searchDate == data.date) || (data.date === "")) {
                dateFilter.add(locationFilter.models[j]);
                var newResultView = new App.Views.Results({
                    model: dateFilter.models[j]
                });
            }
            else{
                var newResultView = new App.Views.Results({
                    model: dateFilter.models[j]
                }); 
            }
        }


    },
    loadSignup: function() {
        $('#search-bar').empty();
        App.seekers = new App.Collections.Seekers();
        App.signup = new App.Views.Signups({
            collection: App.seekers
        });
    },
    loadLogin: function() {
        $('#search-bar').empty();
        App.seekers = new App.Collections.Seekers();
        App.login = new App.Views.Logins({
            collection: App.seekers
        });
    },
    showModal: function(e) {
        console.log('hello modal');
        var id = $(e.target).closest('td').data('value');
        var result = this.collection.fetchById(id);
    },
    showModalForMarkerOnMap: function(e){
        var id = $(e.target).data('value')
        var result = this.collection.fetchById(id);
        console.log(e);
        console.log(id);
    }
});


