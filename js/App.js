class App extends Component {
    constructor(props){
        super(props);
        this.header = new Header({
            id: 'header',
            parent: this.id,
            template: template.headerTemplate,
            callbacks: {
                showPage: (name) => this.showPage(name)
            }
        });
        
    }

    showPage(name) {

        if (this[name]?.show) {
            this[name].show();
        }
    }
}