class Utils
{
    static dateFormatter(date)
    {
        return date.toLocaleDateString([], {
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric'
        }) + ' ' + date.toLocaleTimeString([], {
            hours: '2-digit',
            minutes: '2-digit',
            timeStyle: 'short'
        });
    }
}