export default class User {
    constructor({uuid, username, name, role, created_at, updated_at}) {
        this.uuid = uuid;
        this.username = username;
        this.name = name;
        this.role = role;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}