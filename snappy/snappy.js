
ImageCollection = new Mongo.Collection("imageCollection");

ChatCollection = new Mongo.Collection("Messages");

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    getCounterSessionValue: function () {
      return Session.get('counter');
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
      console.log("you clicked!");
	  
	  var playerNameVar = document.getElementById("myText").value;
	  var catVar = document.getElementById("myText2").value;
	  
	  Meteor.call('getJson', playerNameVar, catVar, function(err, data) {
		  if (err)
			console.log(err);
		console.log(data);
		
		document.getElementById("header").innerHTML = "";
		
		for (i = 0; i < 1; i++) { 
			var img = document.createElement("img");
			img.src = data.SearchResults.Products[i].Description.ImageURL;
      var imgStr = "<img src=" + img.src + " />";
			img.width = 200;
			img.height = 200;
			
			// var h = document.createElement("H1")                // Create a <h1> element
			var t = "Name: " + data.SearchResults.Products[i].Description.Name;     // Create a text node
			// h.appendChild(t);

			// var h2 = document.createElement("H1")                // Create a <h1> element
			var t2 = "Sale Price: " + data.SearchResults.Products[i].Price.DisplayPrice;     // Create a text node
			// h2.appendChild(t2);
			
			// var h4 = document.createElement("H3")                // Create a <h1> element
			var t4 = "Original Price: " + data.SearchResults.Products[i].Price.CutPrice;     // Create a text node
			// h4.appendChild(t4);
			
			// var h3 = document.createElement("H1")                // Create a <h1> element
			var t3 = "Rating (/5): " + data.SearchResults.Products[i].Description.ReviewRating.Rating;     // Create a text node
			// h3.appendChild(t3);
			
			// http://www.sears.com/disney-dcm-1-classic-mickey-waffle-maker-brushed/p-SPM1177668414
			
			
			
			// var h5 = document.createElement("H2")                // Create a <h1> element
			var t5 = "Link to buy:" + "http://www.sears.com/" + data.SearchResults.Products[i].Description.Name + "/p-" +data.SearchResults.Products[i].Id.PartNumber;     // Create a text node
			// h5.appendChild(t5);
			
			// var a = document.createElement('a');
			// var linkText = document.createTextNode(data.SearchResults.Products[i].Description.Name);
			// a.appendChild(linkText);
			// a.title = data.SearchResults.Products[i].Description.Name;
			// a.href = "http://www.sears.com/" + data.SearchResults.Products[i].Description.Name + "/p-" +data.SearchResults.Products[i].Id.PartNumber;
			// a.target = "_blank";
			
			// var hr = document.createElement("hr")
			
			// var src = document.getElementById("header");
   //    var src = document.createElement("productDetail");
			// src.appendChild(img);
			// src.appendChild(h);
			// src.appendChild(h2);
			// src.appendChild(h4);
			// src.appendChild(h3);
			// src.appendChild(h5);
			// src.appendChild(a);
			// src.appendChild(hr);

      ChatCollection.insert({
        message: imgStr,
        timestamp: Date.now()
      });
      ChatCollection.insert({
        message: t,
        timestamp: Date.now()
      });
      ChatCollection.insert({
        message: t2,
        timestamp: Date.now()
      });
      ChatCollection.insert({
        message: t4,
        timestamp: Date.now()
      });
      ChatCollection.insert({
        message: t3,
        timestamp: Date.now()
      });
      ChatCollection.insert({
        message: t5,
        timestamp: Date.now()
      });
		}
		
		});
    }
  });

  Template.uploadFileForm.events({
    'change #files': function(event, template){
      console.log("submitting");
      event.preventDefault();
      if (window.File && window.FileReader && window.FileList && window.Blob) {
        _.each(template.find('#files').files, function(file) {
          if(file.size > 1){
            console.log("found file with size: " + file.size);
            var reader = new FileReader();
            reader.onload = function(e) {
              console.log("creating file: " + file.name);
              console.log("url: " + reader.result);
              ImageCollection.insert({
                name: file.name,
                type: file.type,
                dataUrl: reader.result
              });
            }
            reader.readAsDataURL(file);
          }
        });
      }
    },
    'click .clearCollection': function(event, template){
      console.log("deleting collection");
      Meteor.call('removeAllImageCollection');
    }
  });

  Template.uploadFileForm.helpers({
    dataUrl: function () {
      return ImageCollection.findOne().dataUrl;
    },
    name: function () {
      return ImageCollection.findOne().name;
    }
  });

  Template.chat.events({
    'click #send': function(event, template){
      var newM = $('#newMessage').val();
      if (!newM) {
        alert('Fill out both fields yo!');
      }
      ChatCollection.insert({
        message: newM,
        timestamp: Date.now()
      }, function(err, id) {
        if (err) {
          alert('Something definitely went wrong!');
        }
        $('#newMessage').val("");
        $('#newMessage').focus();
      });

    }
    , 'click #clearChat': function(event, template){
      Meteor.call('removeAllChat');
    }

  });

  Template.chat.messages = function() {
    return ChatCollection.find({
    }, {
      sort: {
        timestamp: 1
      },
      limit: 20
    });
  }
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    ImageCollection.remove({});
//You’re also not allowed to call remove({}) from any client side code.
//solution is that you can call methods defined on the Meteor server from the client using the Meteor.call method
    return Meteor.methods(
    {
      removeAllImageCollection: function() 
      {
        return ImageCollection.remove({});
      }
      , removeAllChat: function() 
      {
        return ChatCollection.remove({});
      },
	  
	  getJson: function(keyword, cat) {
		Meteor.absoluteUrl.defaultOptions.rootUrl = "http://api.developer.sears.com";
		
		try{
			myobject = HTTP.get(Meteor.absoluteUrl("/v2.1/products/search/Sears/json/keyword/{" + keyword +"}?apikey=MY5vZlQfgMyRDr4cWzlsgPjRyqUq2ZjQ&category=" + cat)).data;
			return myobject;
		}
		catch(e){
			console.log(e.message)
			return e.message;
		}
		return null;
	  }

    });
  });
}
