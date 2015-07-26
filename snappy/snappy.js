
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
      }

    });
  });
}
