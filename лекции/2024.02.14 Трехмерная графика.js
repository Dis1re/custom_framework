
//Трехмерная графика.

/*
В любой трехмерной сцены очень важно знать точку обзора, 
угол обзора и направление обзора. В нашем проекте точка 
обзора лежит на оси OZ и направлена к центру координат. 
Формула перевода координат на экран:
(z0 – z)/(z0-z’)=x/x’
*/

/*
Структуры данных:
/js/modules/Math3D/Math3D.js
/js/modules/Math3D/entities/Point.js
/js/modules/Math3D/entities/Point.js
/js/modules/Math3D/entities/Edge.js
/js/modules/Math3D/entities/Surface.js
/js/components/Graph3D/Graph3D.js
/js/components/Graph3D/graph3DTemplate.js
*/

//js/modules/Math3D/entities/Point.js
class Point {
    constructor(x=0, y=0, z=0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}


//js/modules/Math3D/entities/Edge.js
class Edge {
    constructor(p1=0,p2=0) {
        this.p1 = p1;
        this.p2 = p2;
    }
}

//js/modules/Math3D/entities/Surface.js
class Surface {
    constructor(points=[], edges=[], polygons=[]) {
        this.points = points;
        this.edges = edges;
        this.polygons = polygons;
    }
}


//js/modules/Math3D/Math3D.js
class Math3D {
    constructor({WIN}) {
        this.WIN = WIN;
    }

    xs(point){
        const zs = this.WIN.CENTER.z;
        const z0 = this.WIN.CAMERA.z;
        const x0 = this.WIN.CAMERA.x;
        return (point.x - x0)/(point.z - z0) * (zs - z0) + x0;
    }

    //дописать ys по примеру xs
    ys(point){
        //...
    }
}

//js/components/Graph3D/graph3DTemplate.js
Template.prototype.graph3DTemplate = () => `
<canvas id="graph3D"></canvas>
`;


//js/components/Graph3D/graph3D.js
class Graph3D extends Component {
    constructor(options) {
        super(options);
        const WIN = {
            LEFT: -5,
            BOTTOM: -5,
            WIDTH: 10,
            HEIGHT: 10,
            CENTER: new Point(0, 0, -30),
            CAMERA: new Point(0, 0, -50),
        };
        this.graph = new Graph({
            id:'graph3D',
            width: 600,
            height: 600,
            WIN
        });
        this.math3D = new Math3D({WIN});
        this.scene = this.cube();
        this.renderScene();
    }

    cube() {
        return new Surface(
            [
            new Point(10, 10, 10),
            new Point(10, -10, 10),
            new Point(-10, -10, 10),
            new Point(-10, 10, -10),
            //... дописать
            ],
            [
             new Edge(0, 1),
             //... дописать
            ]
        );
    }

    renderScene() {
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

/*
Дезешечка: 
-переписать код с лекции, чтобы работало
-Куда нибудь написать метод clear, который чистит сцену
-Дописать некоторые ys, рёбра и точки для куба
-*нарисовать на сцене тор или шар
*/