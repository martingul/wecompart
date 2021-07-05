import m from 'mithril';
import Utils from '../Utils';

export default class Timer {
    constructor(vnode) {
        this.end = new Date(new Date() + 1);
        this.remaining = Utils.remaining_time(this.end);
    }

    oncreate(vnode) {
        this.interval = setInterval(() => {
            this.remaining = Utils.remaining_time(this.end);
            console.log(this.remaining);
            m.redraw();
        }, 1000);
    }

    get_timer_text() {
        let str = '';
        if (this.remaining.days > 0) {
            str += `${this.remaining.days}d `
        }
        if (this.remaining.hours > 0) {
            str += `${this.remaining.hours}h `
        }
        if (this.remaining.minutes > 0) {
            str += `${this.remaining.minutes}m `
        }
        if (this.remaining.seconds > 0) {
            str += `${this.remaining.seconds}s `
        }
        if (this.remaining.total < 1000) {
            clearInterval(this.interval);
            str += 'Time is up!';
        } else {
            str += 'left';
        }
        return str;
    }

    view(vnode) {
        return <span>{this.get_timer_text()}</span>;
    }
}