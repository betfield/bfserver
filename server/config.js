Router.route('/football-data.events', function() {
    this.response.setHeader( 'Access-Control-Allow-Origin', '*' );

        if ( this.request.method === "OPTIONS" ) {
            this.response.setHeader( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept' );
            this.response.setHeader( 'Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE, OPTIONS' );
            this.response.end( 'Set OPTIONS.' );
        } else {
			console.log("yippikayee");
            console.log(this.request.body);
            this.response.statusCode=200;
            this.response.end();
            //API.handleRequest( this, 'pizza', this.request.method );
        }
    });
    