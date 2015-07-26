
ImageCollection = new Mongo.Collection("imageCollection");

ChatCollection = new Mongo.Collection("Messages");

var arrOptions = new Array();

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);



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
		
		for (i = 0; i < 10; i++) { 
			
			arrOptions[i] = data.SearchResults.Products[i].Description.ImageURL;
			var img = document.createElement("img");
			img.src = data.SearchResults.Products[i].Description.ImageURL;
			img.width = 200;
			img.height = 200;
			
			var h = document.createElement("H1")                // Create a <h1> element
			var t = "Name: " + data.SearchResults.Products[i].Description.Name;     // Create a text node
			var t1 = document.createTextNode("Name: " + data.SearchResults.Products[i].Description.Name);     // Create a text node
			h.appendChild(t1);

			var h2 = document.createElement("H1")                // Create a <h1> element
			var t2 = "Sale Price: " + data.SearchResults.Products[i].Price.DisplayPrice;     // Create a text node
			var t22 = document.createTextNode("Sale Price: " + data.SearchResults.Products[i].Price.DisplayPrice);     // Create a text node
			h2.appendChild(t22);
			
			var h4 = document.createElement("H3")                // Create a <h1> element
			var t4 = "Original Price: " + data.SearchResults.Products[i].Price.CutPrice;     // Create a text node
			var t44 = document.createTextNode("Original Price: " + data.SearchResults.Products[i].Price.CutPrice);     // Create a text node
			h4.appendChild(t44);
			
			var h3 = document.createElement("H1")                // Create a <h1> element
			var t3 = "Rating (/5): " + data.SearchResults.Products[i].Description.ReviewRating.Rating;     // Create a text node
			var t33 = document.createTextNode("Rating (/5): " + data.SearchResults.Products[i].Description.ReviewRating.Rating);     // Create a text node
			h3.appendChild(t33);
			
			http://www.sears.com/disney-dcm-1-classic-mickey-waffle-maker-brushed/p-SPM1177668414
			
			
			
			var h5 = document.createElement("H2")                // Create a <h1> element
			var t5 = "http://www.sears.com/" + data.SearchResults.Products[i].Description.Name + "/p-" +data.SearchResults.Products[i].Id.PartNumber;     // Create a text node
			var t55 = document.createTextNode("http://www.sears.com/" + data.SearchResults.Products[i].Description.Name + "/p-" +data.SearchResults.Products[i].Id.PartNumber);     // Create a text node
			h5.appendChild(t55);
			
			// var a = document.createElement('a');
			// var linkText = document.createTextNode(data.SearchResults.Products[i].Description.Name);
			// a.appendChild(linkText);
			// a.title = data.SearchResults.Products[i].Description.Name;
			// a.href = "http://www.sears.com/" + data.SearchResults.Products[i].Description.Name + "/p-" +data.SearchResults.Products[i].Id.PartNumber;
			// a.target = "_blank";
			
			var hr = document.createElement("hr")
			
			button = document.createElement("input");
			button.id = i;
			button.type = "button";
			button.value = i;
			button.onclick = (function(opt, price, name, buy, original) {
    return function() {
       showParam(opt, price, name, buy, original);
    };
})(data.SearchResults.Products[i].Description.ImageURL, "Sale Price: " + data.SearchResults.Products[i].Price.DisplayPrice, "Name: " + data.SearchResults.Products[i].Description.Name, "http://www.sears.com/" + data.SearchResults.Products[i].Description.Name + "/p-" +data.SearchResults.Products[i].Id.PartNumber, "Original Price: " + data.SearchResults.Products[i].Price.CutPrice);
			
			var src = document.getElementById("header");
      //var src = document.createElement("productDetail");
			src.appendChild(img);
			 src.appendChild(h);
			 src.appendChild(h2);
			 src.appendChild(h4);
			 src.appendChild(h3);
			 src.appendChild(h5);
			 src.appendChild(button);
			// //src.appendChild(a);
			 src.appendChild(hr);
			 
			 

      // ChatCollection.insert({
        // imageUrl: img.src,
        // timestamp: Date.now()
      // });
      // ChatCollection.insert({
        // message: t,
        // timestamp: Date.now()
      // });
      // ChatCollection.insert({
        // message: t2,
        // timestamp: Date.now()
      // });
      // ChatCollection.insert({
        // message: t4,
        // timestamp: Date.now()
      // });
      // ChatCollection.insert({
        // message: t3,
        // timestamp: Date.now()
      // });
      // ChatCollection.insert({
        // linkUrl: t5,
        // timestamp: Date.now()
      // });
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

function showParam(opt, price, name, buy, original) {
    ChatCollection.insert({
					imageUrl: opt,
					timestamp: Date.now()
				  });

      ChatCollection.insert({
        message: price,
        timestamp: Date.now()
      });
	        ChatCollection.insert({
        message: original,
        timestamp: Date.now()
      });
      ChatCollection.insert({
        message: name,
        timestamp: Date.now()
      });
	        ChatCollection.insert({
        linkUrl: buy,
        timestamp: Date.now()
      });
}
