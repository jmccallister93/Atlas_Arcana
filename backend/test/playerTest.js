const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');  // Import the Express app
const expect = chai.expect;

chai.use(chaiHttp);

describe('Player API Tests', function() {
    // Test for POST request
    it('should add a new player', function(done) {
      chai.request(app)
        .post('/players')
        .send({username: 'newplayer', email: 'newplayer@example.com'})
        .end(function(err, res) {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          // additional assertions...
          done();
        });
    });
  
    // Test for GET request
    it('should get all players', function(done) {
      chai.request(app)
        .get('/players')
        .end(function(err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          // additional assertions...
          done();
        });
    });
  
    // Test for PUT request (update a player)
    // Assuming we have a player ID to work with
    it('should update a player', function(done) {
      const playerId = '654fca15ae876aeddcaccc13'; // Replace with actual ID
      chai.request(app)
        .put(`/players/${playerId}`)
        .send({username: 'updatedplayer', email: 'updatedplayer@example.com'})
        .end(function(err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          // additional assertions...
          done();
        });
    });
  
    // Test for DELETE request
    // Assuming we have a player ID to delete
    it('should delete a player', function(done) {
      const playerId = '654fca15ae876aeddcaccc13'; // Replace with actual ID
      chai.request(app)
        .delete(`/players/${playerId}`)
        .end(function(err, res) {
          expect(res).to.have.status(200); // or 204 if no content is returned
          // additional assertions...
          done();
        });
    });
  
    // More tests can be added here...
  });
