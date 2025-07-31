const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const assert = chai.assert;

chai.use(chaiHttp);

global.token = null;

describe('🔒 Authentication Route', () => {

  describe('Registration', () => {


    it('it should return User registered successfully', (done) => {
      let formData = {
        username: "Test",
        password: "Test@1234",
        email: 'hello@gmail.com',
        phone_no: '9724498295'
      }

      chai.request(server)
        .post('/auth/register')
        .send(formData)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.message, 'User registered successfully')
          assert.isObject(res.body);
          done();
        });
    });

    it('it should return Username is required', (done) => {
      let formData = {
        username: "",
        password: "Test@1234",
        email: 'hello@gmail.com',
        phone_no: '9724498295'
      }

      chai.request(server)
        .post('/auth/register')
        .send(formData)
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.equal(res.body.message, 'Username is required')
          assert.isObject(res.body);
          done();
        });
    });

    it('it should return Password is required', (done) => {
      let formData = {
        username: "Test1",
        password: "",
        email: 'hello@gmail.com',
        phone_no: '9724498295'
      }

      chai.request(server)
        .post('/auth/register')
        .send(formData)
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.equal(res.body.message, 'Password is required')
          assert.isObject(res.body);
          done();
        });
    });

    it('it should return Email ID is required', (done) => {
      let formData = {
        username: "Test1",
        password: "Test@1234",
        email: '',
        phone_no: '9724498295'
      }

      chai.request(server)
        .post('/auth/register')
        .send(formData)
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.equal(res.body.message, 'Email ID is required')
          assert.isObject(res.body);
          done();
        });
    });

    it('it should return Phone No is required', (done) => {
      let formData = {
        username: "Test1",
        password: "Test@1234",
        email: 'hello@gmail.com',
        phone_no: ''
      }

      chai.request(server)
        .post('/auth/register')
        .send(formData)
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.equal(res.body.message, 'Phone No is required')
          assert.isObject(res.body);
          done();
        });
    });

    it('it should return Invalid Email ID', (done) => {
      let formData = {
        username: "Test1",
        password: "Test@1234",
        email: 'hello@gmai',
        phone_no: '9123456789'
      }

      chai.request(server)
        .post('/auth/register')
        .send(formData)
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.equal(res.body.message, 'Invalid Email ID')
          assert.isObject(res.body);
          done();
        });
    });

    it('it should return Invalid Phone No', (done) => {
      let formData = {
        username: "Test1",
        password: "Test@1234",
        email: 'hello@gmail.com',
        phone_no: '12345'
      }

      chai.request(server)
        .post('/auth/register')
        .send(formData)
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.equal(res.body.message, 'Invalid Phone No')
          assert.isObject(res.body);
          done();
        });
    });

    it('it should return Username is already taken', (done) => {
      let formData = {
        username: "Test",
        password: "Test@1234",
        email: 'hello@gmail.com',
        phone_no: '9724498295'
      }

      chai.request(server)
        .post('/auth/register')
        .send(formData)
        .end((err, res) => {
          assert.equal(res.status, 409);
          assert.equal(res.body.message, 'Username is already taken')
          assert.isObject(res.body);
          done();
        });
    });

  });

  describe('Login', () => {

    it('it should return User loggedin successfully', (done) => {

      let formData = {
        username: "Test",
        password: "Test@1234",
      }

      chai.request(server)
        .post('/auth/login')
        .send(formData)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.message, 'User loggedin successfully')
          assert.isObject(res.body);

          global.token = res.body.Token;
          done();
        });

    });

    it('it should return Username is required', (done) => {
      let formData = {
        username: "",
        password: "Test@1234",
      }

      chai.request(server)
        .post('/auth/register')
        .send(formData)
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.equal(res.body.message, 'Username is required')
          assert.isObject(res.body);
          done();
        });
    });

    it('it should return Password is required', (done) => {
      let formData = {
        username: "Test1",
        password: "",
      }

      chai.request(server)
        .post('/auth/register')
        .send(formData)
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.equal(res.body.message, 'Password is required')
          assert.isObject(res.body);
          done();
        });
    });

    it('it should return Username is not available please register', (done) => {

      let formData = {
        username: "abc",
        password: "Test@1234",
      }

      chai.request(server)
        .post('/auth/login')
        .send(formData)
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.equal(res.body.message, 'Username is not available please register')
          assert.isObject(res.body);
          done();
        });
    });

    it('it should return Wrong Password', (done) => {

      let formData = {
        username: "Test",
        password: "Test@123",
      }

      chai.request(server)
        .post('/auth/login')
        .send(formData)
        .end((err, res) => {
          assert.equal(res.status, 401);
          assert.equal(res.body.message, 'Wrong Password');
          assert.isObject(res.body);
          done();
        });
    });

  });

  // describe('Logout', () => {
  //   it('it should return User Logged out successfully', (done) => {

  //     chai.request(server)
  //       .post('/auth/logout')
  //       .set('Authorization', `Bearer ${token}`)
  //       .end((err, res) => {
  //         assert.equal(res.status, 200);
  //         assert.equal(res.body.message, 'User Logged out successfully')
  //         assert.isObject(res.body);
  //         done();
  //       });
  //   });
  // })

});


module.exports = { token };