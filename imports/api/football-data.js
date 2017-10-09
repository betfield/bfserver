import { HTTP } from 'meteor/http';

function getFixtures (competition) {
    try {
        var response = HTTP.get('http://api.football-data.org/v1/competitions/' + competition + '/fixtures');

        _.each(response.data.fixtures, function(item) {

            console.log(item.matchday);
            
        });
        return;
    } catch (error) {
        console.log(error);
        return;
    }
}

export {getFixtures};