import m from 'mithril';
import Utils from '../Utils';

export default class Timer {
    constructor(vnode) {
        this.end = new Date(vnode.attrs.end);
        this.remaining = Utils.remaining_time(this.end);
        this.interval = null;
    }

    oncreate(vnode) {
        if (this.remaining.days == 0) {
            this.interval = setInterval(() => {
                this.remaining = Utils.remaining_time(this.end);
                m.redraw();
            }, 1000);
        }
    }

    get_timer_text() {
        let str = '';
        if (this.remaining.days > 0) {
            str += `${this.remaining.days}d `
        } else {
            if (this.remaining.hours > 0) {
                str += `${this.remaining.hours}h `
            }
            if (this.remaining.minutes > 0) {
                str += `${this.remaining.minutes}m `
            }
            str += `${this.remaining.seconds}s `;
        }

        if (this.remaining.total < 1000) {
            if (this.interval) {
                clearInterval(this.interval);
            }
            str += 'Time is up!';
        } else {
            str += `left`;
        }
        return str;
    }

    onremove(vnode) {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    view(vnode) {
        return <span>{this.get_timer_text()}</span>;
    }
}