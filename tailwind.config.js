module.exports = {
    purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        backgroundColor: theme => ({
            ...theme('colors'),
            body: '#f5f5f5',
            title: '#ead7d7',
            text: '#4d4d4d',
            bor: '#af2f2f33',
            bd: '#cc9a9a'
        }),
        textColor: theme => ({
            ...theme('colors'),
            title: '#ead7d7',
            texta: '#4d4d4d',
            bor: '#af2f2f33',
            bd: '#cc9a9a'
        }),
        borderColor: theme => ({
          ...theme('colors'),
          'border': '#af2f2f33',
          'border-todo': '#e6e6e6',
         }),
         
        
         extend: {
          width: {
            '1/7': '24%',
            '2/7': '23%',
            '3/7': '98%',
            '4/7': '96%',
           
          }}
        
    },
    variants: {
        extend: {
            backgroundColor: ['active','last'],
            textColor: ['hover'],
            margin: ['last'],
            borderRadius: ['hover'],
            borderWidth: ['hover'],
        }
    },
    plugins: []
};
