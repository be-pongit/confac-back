import Router from 'koa-router';
import jwt from '../jwt';

export default function register(app) {
    const router = new Router({
      prefix: '/api/users'
    });

    router.get('/', function *() {
        this.body = yield this.mongo.collection('users').find().toArray();
    });

    router.post('/', function *() {
        const {_id, ...params} = this.request.body;
        if(_id) {
            yield this.mongo.collection('users').update(_id.toObjectId(), params);
            this.body = Object.assign(params, _id.toObjectId());
        } else {
            const insertedUser = yield this.mongo.collection('users').insert(params);
            const insertedUserId = insertedUser.insertedIds[1];
            this.body = Object.assign(params, insertedUserId.toString().toObjectId());
        }
    });

    router.delete('/', function *() {
        const id = this.request.body.id;
        yield this.mongo.collection('users').remove(id.toObjectId());
        this.body = id;
    });

    router.post('/auth', function *() {
        const token = this.request.body.jwt;

        if (true) { //somehow validate google token & return our own signed token, eventually with role
        this.body = {
            token: jwt.issue({
                //role: "admin" for rbac later
            })
        }
            } else {
                this.status = 401;
                this.body = { error: "Invalid login"};
            }

    });

    app.use(router.routes());
    app.use(router.allowedMethods());

}