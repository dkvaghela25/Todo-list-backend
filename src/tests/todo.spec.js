const jwt = require('jsonwebtoken');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const assert = chai.assert;

chai.use(chaiHttp);

describe('✅ Todo Route', () => {

    let decodedToken, user_id;

    before(() => {
        decodedToken = jwt.verify(global.token, process.env.JWT_SECRET);
        user_id = decodedToken.user_id;
    });

    describe('Create Task', () => {

        it('Task added successfully', (done) => {

            let formData = {
                title: "Todo",
                description: 'Todo desc',
            }

            chai.request(server)
                .post(`/todo/create`)
                .set('Authorization', `Bearer ${global.token}`)
                .send(formData)
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.message, 'Task added successfully');
                    assert.isObject(res.body);
                    done();
                });

        });

    });

    describe('Show Tasks', () => {

        it('it should return User tasks', (done) => {

            chai.request(server)
                .get(`/todo`)
                .set('Authorization', `Bearer ${global.token}`)
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isArray(res.body);
                    done();
                });
        });

        it('it should return No task for user', (done) => {

            chai.request(server)
                .get(`/todo`)
                .set('Authorization', `Bearer ${global.token}`)
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.message, "No task for user")
                    assert.isObject(res.body);
                    done();
                });
        });

    });

    describe('Update Task', () => {

        it('it should return Task updated succesfully', (done) => {

            let formData = {
                title: "Test_todo4",
                description: "Todolist4 updated2"
            }

            chai.request(server)
                .patch(`/todo/update/14`)
                .set('Authorization', `Bearer ${global.token}`)
                .send(formData)
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.message, 'Task updated succesfully');
                    assert.isObject(res.body);
                    done();
                });
        });

        it('it should return Task not found', (done) => {

            let formData = {
                title: "Test_todo4",
                description: "Todolist4 updated2"
            }

            chai.request(server)
                .patch(`/todo/update/9`)
                .set('Authorization', `Bearer ${global.token}`)
                .send(formData)
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.message, 'Task not found');
                    assert.isObject(res.body);
                    done();
                });
        });

        it('it should return Wrong ID', (done) => {

            let formData = {
                title: "Test_todo4",
                description: "Todolist4 updated2"
            }

            chai.request(server)
                .patch(`/todo/update/13`)
                .set('Authorization', `Bearer ${global.token}`)
                .send(formData)
                .end((err, res) => {
                    assert.equal(res.status, 401);
                    assert.equal(res.body.message, 'Wrong ID');
                    assert.isObject(res.body);
                    done();
                });
        });

    });

    describe('Delete Task', () => {

        it('it should return Task deleted succesfully', (done) => {

            chai.request(server)
                .del(`/todo/delete/14`)
                .set('Authorization', `Bearer ${global.token}`)
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.message, 'Task deleted succesfully');
                    assert.isObject(res.body);
                    done();
                });
        });

        it('it should return Task not found', (done) => {

            let formData = {
                title: "Test_todo4",
                description: "Todolist4 updated2"
            }

            chai.request(server)
                .patch(`/todo/update/9`)
                .set('Authorization', `Bearer ${global.token}`)
                .send(formData)
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.message, 'Task not found');
                    assert.isObject(res.body);
                    done();
                });
        });

        it('it should return Wrong ID', (done) => {

            let formData = {
                title: "Test_todo4",
                description: "Todolist4 updated2"
            }

            chai.request(server)
                .patch(`/todo/update/13`)
                .set('Authorization', `Bearer ${global.token}`)
                .send(formData)
                .end((err, res) => {
                    assert.equal(res.status, 401);
                    assert.equal(res.body.message, 'Wrong ID');
                    assert.isObject(res.body);
                    done();
                });
        });

    });

});