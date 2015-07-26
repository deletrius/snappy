
ImageCollection = new Mongo.Collection("imageCollection");

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
    'submit': function(event, template){
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
      // ImageCollection.remove();
      Meteor.call('removeAllImageCollection')
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
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    ImageCollection.remove({});

    return Meteor.methods({

      removeAllImageCollection: function() {

        return ImageCollection.remove({});

      }

    });
  });
}
