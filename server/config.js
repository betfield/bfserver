Router.route( "/football-data.events", { where: "server" } )
.get( function() {
  // If a GET request is made, return the user's profile.
  console.log("Football data get was submitted");
})
.post( function() {
    console.log("Football data post was submitted");
  // If a POST request is made, create the user's profile.
})
