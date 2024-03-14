class Graphic3D extends Component {
    constructor(props) {
        super(props);
        const WIN = {
            LEFT: -5,
            BOTTOM: -5,
            WIDTH: 10,
            HEIGHT: 10,
            CENTER: new Point(0, 0, -40),
            CAMERA: new Point(0, 0, -50),
        };
        this.graph = new Graph({
            id:'graphic3D',
            WIN,
            width: 600,
            height: 600,
            callbacks:{
                wheel: (event) => this.wheel(event),
                mousemove: (event) => this.mousemove(event),
                mouseup: () => this.mouseup(),
                mousedown: () => this.mousedown()
            }
        });
        this.canMove = false;

        this.math3D = new Math3D({WIN});
        this.scene = this.cube();
        this.renderScene();
    }

    mouseup() {
        this.canMove = false;
    }

    mousedown() {
        this.canMove = true;
    }

    wheel(event) {
        event.preventDefault(); //устанавливает обработку по умолчанию
        const delta = (event.wheelDelta < 0)? 0.9: 1.1;
        this.scene.points.forEach( point => this.math3D.zoom(point, delta));
        this.renderScene();
    }

    mousemove(event) {
        if (this.canMove) {
            const gradus = Math.PI / 180/ 4;
            this.scene.points.forEach( point => {
                this.math3D.rotateOx(point, (this.dy-event.offsetY)*gradus );
                this.math3D.rotateOy(point, (this.dx-event.offsetX)*gradus );
            });
            this.renderScene();
        }
        this.dy = event.offsetY;
        this.dx = event.offsetX;
    }

    cube(
        color= '#888888'
    ) {
    const points = [
        new Point(-5, -5, 5), //0
        new Point(5, -5, 5), //1
        new Point(-5, 5, 5), //2
        new Point(5, 5, 5), //3
        new Point(-5, -5, -5), //4
        new Point(5, -5, -5), //5
        new Point(-5, 5, -5), //6
        new Point(5, 5, -5) //7
    ];
    //       2------3
    //      /|     /|
    //     6------7 |
    //     | 0----|-1
    //     |/     |/
    //     4------5
    const edges = [
        new Edge(0, 1),
        new Edge(0, 2),
        new Edge(0, 4),
        new Edge(3, 1),
        new Edge(3, 2),
        new Edge(3, 7),
        new Edge(6, 2),
        new Edge(6, 4),
        new Edge(6, 7),
        new Edge(5, 4),
        new Edge(5, 1),
        new Edge(5, 7)
    ];

    return new Surface(
        points,
        edges
    );
}

    renderScene() {
        this.graph.clear();
        this.scene.points.forEach(
            point => this.graph.point(this.math3D.xs(point), this.math3D.ys(point))
        );
        this.scene.edges.forEach(edge => {
            const point1 = this.scene.points[edge.p1];
            const point2 = this.scene.points[edge.p2];
            this.graph.line(
                this.math3D.xs(point1), this.math3D.ys(point1),
                this.math3D.xs(point2), this.math3D.ys(point2),
            );
        });
    }

    //куда то добавить метод clear
}