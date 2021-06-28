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
    
    static absolute_date(date) {
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
            'Sun',
            'Mon',
            'Tue',
            'Wed',
            'Thu',
            'Fri',
            'Sat'
        ];
    
        const month = months[date.getMonth()].slice(0, 3);
        // const day_of_week = days[this._filled_at.getDay()];
        const day = date.getDate().toString().padStart(2, '0');
        // const hour = date.getUTCHours().toString().padStart(2, '0');
        // const min = date.getMinutes().toString().padStart(2, '0');
    
        return `${month} ${day}`;
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
}