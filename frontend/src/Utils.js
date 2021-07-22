export default class Utils {
    static relative_date(date) {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
    
        const minute = 60
        const hour = 60*minute;
        const day = 24*hour;
        const month = 30*day;
        const year = 12*month;
        const delta = Math.round((+new Date - date) / 1000);
        let date_str;
    
        if (delta < 30)             date_str = 'just then';
        else if (delta < minute)    date_str = `${delta} seconds ago`;
        else if (delta < 2*minute)  date_str = '1 minute ago';
        else if (delta < hour)      date_str = `${Math.floor(delta / minute)} minutes ago`;
        else if (delta < 2*hour)    date_str = '1 hour ago';
        else if (delta < day)       date_str = `${Math.floor(delta / hour)} hours ago`;
        else if (delta < 2*day)     date_str = '1 day ago';
        else if (delta < month)     date_str = `${Math.floor(delta / day)} days ago`;
        else if (delta < 2*month)   date_str = '1 month ago';
        else if (delta < year)      date_str = `${Math.floor(delta / month)} months ago`;
        else if (delta < 2*year)    date_str = '1 year ago';
        else if (delta >= 2*year)   date_str = `${Math.floor(delta / year)} years ago`;
    
        return date_str;
    }
    
    static absolute_date(date, full = false) {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
        
        const months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];
        const days = [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
        ];
        
        const month = months[date.getMonth()].slice(0, 3);
        const day = date.getDate().toString().padStart(2, '0');
        // const hour = date.getUTCHours().toString().padStart(2, '0');
        // const min = date.getMinutes().toString().padStart(2, '0');
    
        if (full) {
            const day_of_week = days[date.getDay()];
            return `${day_of_week}, ${month} ${day}`
        }

        return `${month} ${day}`;
    }

    static remaining_time(end) {
        if (!end instanceof Date) {
            end = new Date(end);
        }

        const second = 1000;
        const minute = 60*second;
        const hour = 60*minute;
        const day = 24*hour;

        let now = new Date();
        let total = end - now;
        if (total < 0) {
            total = 0;
        }
        const days = Math.floor(total / day);
        const hours = Math.floor((total % day) / hour);
        const minutes = Math.floor((total % hour) / minute);
        const seconds = Math.floor((total % minute) / second);

        return {total, days, hours, minutes, seconds};
    }
    
    static currency_symbol(currency) {
        const symbols = {
            'usd': '$',
            'eur': '€',
            'gbp': '£',
        };
        return symbols[currency];
    }
    
    static truncate(str, n_words) {
        return str.split(' ').splice(0, n_words).join(' ');
    }
    
    static generate_key() {
        return Math.random().toString(36).substr(2, 5);
    }

    static format_money(value, currency) {
        const fmt = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,          
        });
        return fmt.format(value);
    }

    static capitalize(s) {
        return s[0].toUpperCase() + s.slice(1);
    }

    static format_address(address) {
        const components = address.split(', ');
        let line1 = '';
        if (components.length >= 0 && components.length < 3) {
            line1 = components.join(', ');
            return { line1, line2: null };
        }
        const mid = Math.floor(components.length / 2)
        line1 = components.slice(0, mid);
        const line2 = components.slice(mid, components.length);
        return {
            line1: line1.join(', '),
            line2: line2.join(', ')
        };
    }
}