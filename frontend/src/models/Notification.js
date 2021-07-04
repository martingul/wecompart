export default class Notification {
    constructor({
        uuid = '',
        user_uuid = '',
        type = '',
        content = '',
        read = true,
        created_at = '',
        updated_at = '',
    }) {
        this.uuid = uuid;
        this.user_uuid = user_uuid;
        this.type = type;
        this.content = content;
        this.read = read;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}