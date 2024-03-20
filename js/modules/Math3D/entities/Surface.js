class Surface {
    constructor(points=[], edges=[], polygons=[], center=new Point()) {
        this.points = points;
        this.edges = edges;
        this.polygons = polygons;
        this.center = center;
        this.animations = [];
    }

    //метод, который сбрасывает любую анимацию
    dropAnimation() {
        this.animations = [];
    }

    //метод, который добавляет анимацию
    //method - способ которым мы будем делать анимацию (zoom, move rotate)
    //value - какие то значения для анимации
    //center - точка относительно которой будет проиходить анимация
    addAnimation(method, value, center=this.center) {
        this.animations.push({method, value, center});
    }

    //метод, который производит эти анимации
    doAnimation(math3D) {
        this.animations.forEach(animation => {
            const T1 = math3D.move(-animation.center.x, -animation.center.y, -animation.center.z);
            const T2 = math3D[animation.method](animation.value);
            const T3 = math3D.move(animation.center.x, animation.center.y, animation.center.z)
            const matrix = math3D.getTransform(T1, T2, T3);
            this.points.forEach(point => math3D.transform(matrix, point));
            math3D.transform(matrix, this.center);
        });
    }

}