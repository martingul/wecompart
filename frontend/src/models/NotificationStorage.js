export default class NotificationStorage {
    static notifications = [];
    static fetched = false;

    static create(notification) {
        NotificationStorage.notifications.unshift(notification);
    }

    static delete(notification) {
        NotificationStorage.notifications = NotificationStorage.notifications
            .filter(s => s.uuid !== notification.uuid);
    }

    static get_by_id(id) {
        console.log('get_by_id', id);
        const notifications = NotificationStorage.notifications.filter(s => s.uuid === id);
        if (notifications.length === 0) {
            return null;
        } else {
            return notifications[0];
        }
    }

    static get_unread() {
        return NotificationStorage.notifications.filter(n => !n.read);
    }

    static has_unread() {
        return NotificationStorage.get_unread().length > 0;
    }
}