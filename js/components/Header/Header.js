class Header extends Component {
    addEventListeners() {
        document.getElementById('showGraph2D').addEventListener(
            'click', () => this.callbacks.showPage('graph2D')
        );
        document.getElementById('showCalc').addEventListener(
            'click', () => this.callbacks.showPage('calc')
        );
        document.getElementById('showGraph3D').addEventListener(
            'click', () => this.callbacks.showPage('graph3D')
        );
    }
}