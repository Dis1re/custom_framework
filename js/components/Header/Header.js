class Header extends Component {
    addEventListeners() {
        document.getElementById('show2D').addEventListeners(
            'click', () => this.callbacks.showPage('Graph2D')
        );
        document.getElementById('showCalc').addEventListener(
            'click', () => this.callbacks.showPage('calc')
        );
    }
}