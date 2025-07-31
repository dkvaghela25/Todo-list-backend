const jwt = require('jsonwebtoken');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const assert = chai.assert;

chai.use(chaiHttp);

describe('👤 User Route', () => {

  let decodedToken, user_id;

  before(() => {
    decodedToken = jwt.verify(global.token, process.env.JWT_SECRET);
    user_id = decodedToken.user_id;
  });

  describe('Get user details', () => {

    it('it should return User details', (done) => {

      chai.request(server)
        .get(`/user/${user_id}`)
        .set('Authorization', `Bearer ${global.token}`)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          done();
        });
    });

    it('it should return Wrong User ID', (done) => {

      chai.request(server)
        .get(`/user/40`)
        .set('Authorization', `Bearer ${global.token}`)
        .end((err, res) => {
          assert.equal(res.status, 401);
          assert.isObject(res.body);
          assert.equal(res.body.message, 'Wrong User ID');
          done();
        });
    });

  });

  describe('Update user details', () => {

    it('it should return User updated successfully', (done) => {

      let formData = {
        username: "Test123",
        email: 'hello111@gmail.com',
      }

      chai.request(server)
        .patch(`/user/update/${user_id}`)
        .set('Authorization', `Bearer ${global.token}`)
        .send(formData)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.message, "User updated successfully");
          assert.isObject(res.body);
          done();
        });
    });

    it('it should return Token has expired', (done) => {

      let formData = {
        username: "ravi",
        email: 'hello111@gmail.com',
      }

      let expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo2MCwiaWF0IjoxNzQyMjMyNjAxLCJleHAiOjE3NDIyMzYyMDF9.icDyWTRQqDlAuTVn0Yg9REHF_MePw0zLztQ7W2SJnfQ'

      chai.request(server)
        .patch(`/user/update/${user_id}`)
        .set('Authorization', `Bearer ${expiredToken}`)
        .send(formData)
        .end((err, res) => {
          assert.equal(res.status, 401);
          assert.equal(res.body.message, 'Token has expired');
          assert.isObject(res.body);
          done();
        });

    });

    it('it should return Invalid token', (done) => {

      let formData = {
        username: "ravi",
        email: 'hello111@gmail.com',
      }

      let invalidToken = 'eyJhbGciOiJIUzI1NR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo2MCwiaWF0IjoxNzQyMjMyNjAxLCJleHAiOjE3NDIyMzYyMDF9.icDyWTRQqDlAuTVn0Yg9REHF_MePw0zLztQ7W2SJnfQ'

      chai.request(server)
        .patch(`/user/update/${user_id}`)
        .set('Authorization', `Bearer ${invalidToken}`)
        .send(formData)
        .end((err, res) => {
          assert.equal(res.status, 401);
          assert.equal(res.body.message, 'Invalid token');
          assert.isObject(res.body);
          done();
        });

    });

    it('it should return Username is already taken', (done) => {

      let formData = {
        username: "ravi",
        email: 'hello111@gmail.com',
      }

      chai.request(server)
        .patch(`/user/update/${user_id}`)
        .set('Authorization', `Bearer ${global.token}`)
        .send(formData)
        .end((err, res) => {
          assert.equal(res.status, 409);
          assert.equal(res.body.message, 'Username is already taken');
          assert.isObject(res.body);
          done();
        });

    });

    it('it should return Wrong User ID', (done) => {

      let formData = {
        username: "ravi",
        email: 'hello111@gmail.com',
      }

      chai.request(server)
        .patch(`/user/update/40`)
        .set('Authorization', `Bearer ${global.token}`)
        .send(formData)
        .end((err, res) => {
          assert.equal(res.status, 401);
          assert.equal(res.body.message, 'Wrong User ID');
          assert.isObject(res.body);
          done();
        });

    });

    it('it should return Invalid Email ID', (done) => {

      let formData = {
        email: 'hello111@gma',
      }

      chai.request(server)
        .patch(`/user/update/${user_id}`)
        .set('Authorization', `Bearer ${global.token}`)
        .send(formData)
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.equal(res.body.message, 'Invalid Email ID');
          assert.isObject(res.body);
          done();
        });

    });

    it('it should return Invalid Phone No', (done) => {

      let formData = {
        phone_no: '12345',
      }

      chai.request(server)
        .patch(`/user/update/${user_id}`)
        .set('Authorization', `Bearer ${global.token}`)
        .send(formData)
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.equal(res.body.message, 'Invalid Phone No');
          assert.isObject(res.body);
          done();
        });

    });

  });

  describe('Delete user details', () => {

    it('it should User removed successfully', (done) => {

      chai.request(server)
        .del(`/user/delete/${user_id}`)
        .set('Authorization', `Bearer ${global.token}`)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.message, 'User removed successfully')
          assert.isObject(res.body);
          done();
        });
    });

    it('it should return Wrong User ID', (done) => {

      chai.request(server)
        .del(`/user/delete/40`)
        .set('Authorization', `Bearer ${global.token}`)
        .end((err, res) => {
          assert.equal(res.status, 401);
          assert.isObject(res.body);
          assert.equal(res.body.message, 'Wrong User ID');
          done();
        });
    });

  });
  
});

