Router.route( "/football-data.events", function() {
    this.response.statusCode = 200;
  
  }, { where: "server" } )
.get( function() {
  // If a GET request is made, return the user's profile.
  console.log("Football data get was submitted");
  return response;
})
.post( function() {
    console.log("Football data post was submitted");
  // If a POST request is made, create the user's profile.
})
.put( function() {
  // If a PUT request is made, either update the user's profile or
 // create it if it doesn't already exist.
})
.delete( function() {
 // If a DELETE request is made, delete the user's profile.
});