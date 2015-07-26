var Images = new FS.Collection("images", {
  stores: [new FS.Store.FileSystem("images", { path: "~/uploads" })]
});

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

  Template.uploadImage.events({
    'change .myFileInput': function (event, template) {
      FS.Utility.eachFile(event, function (file) {
        Images.insert(file, function (err, fileObj) {
          //console.log(fileObj.path);
          // console.log(fileObj.;
          console.log("uploading");
        });
      });
    }
  });

  Template.imageView.helpers({
    images: function () {
      return Images.find(); // Where Images is an FS.Collection instance
    }
  });


}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
