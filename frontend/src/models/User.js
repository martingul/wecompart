import Api from '../Api';

// export default class User {
//     constructor({uuid, username, name, role, created_at, updated_at}) {
//         this.uuid = uuid;
//         this.username = username;
//         this.name = name;
//         this.role = role;
//         this.created_at = created_at;
//         this.updated_at = updated_at;
//     }
// }

export default class User {
    constructor({
        uuid = '',
        username = '',
        name = '',
        role = '',
    }) {
        this.uuid = uuid;
        this.username = username;
        this.name = name;
        this.role = role;
    }

    serialize() {
        return {
            uuid: this.uuid,
            username: this.username,
            name: this.name,
            role: this.role,
        }
    }

    save() {
        // TODO encode in base64
        localStorage.setItem('user', JSON.stringify(this.serialize()));
    }

    static load() {
        const user_json = localStorage.getItem('user');
        if (user_json) {
            return new User(JSON.parse(user_json));
        } else {
            return null;
        }
    }
}