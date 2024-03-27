class Graphic3D extends Component {
    constructor(props) {
        super(props);
        this.WIN = {
            LEFT: -5,
            BOTTOM: -5,
            WIDTH: 10,
            HEIGHT: 10,
            CENTER: new Point(0, 0, -30),
            CAMERA: new Point(0, 0, -50),
        };
        this.graph = new Graph({
            id: 'graphic3D',
            WIN: this.WIN,
            width: 600,
            height: 600,
            callbacks: {
                wheel: (event) => this.wheel(event),
                mousemove: (event) => this.mousemove(event),
                mouseup: () => this.mouseup(),
                mousedown: () => this.mousedown()
            }
        });
        this.canMove = false;
        this.LIGHT = new Light(-20, 0, -20, 1000)
        this.surfaces = new Surfaces();
        this.math3D = new Math3D(this.WIN);
        this.scene = [];
        this.scene.push(this.surfaces.sphere(new Point(10, -1, 0), 3));
        this.scene.push(this.surfaces.sphere(new Point(0, -3, 0), 3));
        this.scene[0].addAnimation('rotateOy', 0.1);
        setInterval(() => {
            this.scene.forEach(surface => surface.doAnimation(this.math3D));
            this.renderScene();
        }, 50);
        this.renderScene();
    }

    mouseup() {
        this.canMove = false;
    }

    mousedown() {
        this.canMove = true;
    }

    wheel(event) {
        const delta = (event.wheelDelta < 0) ? 0.9 : 1.1;
        const matrix = this.math3D.zoom(delta);
        // теперь нужно пройтись по каждой поверхности в массиве сцены
        // и для каждой поверхности делать трансформацию для точки
        this.scene.forEach(surface => surface.points.forEach(point => this.math3D.transform(matrix, point))
        );
        this.renderScene();
    }

    mousemove(event) {
        if (this.canMove) {
            const gradus = Math.PI / 180 / 4;
            const T1 = this.math3D.rotateOx((this.dy - event.offsetY) * gradus);
            const T2 = this.math3D.rotateOy((this.dx - event.offsetX) * gradus);
            this.scene.forEach(surface => surface.points.forEach(point => {
                this.math3D.transform(T1, point);
                this.math3D.transform(T2, point);
            }));
            this.renderScene();
        }
        this.dy = event.offsetY;
        this.dx = event.offsetX;
    }

    solarSystem() {
        const Earth = this.surfaces.sphere(/*сюда задать параметры*/);
        Earth.addAnimation('rotateOy', 0.01);
        const Moon = this.surfaces.cube(/*тоже задать параметры*/);
        Moon.addAnimation('rotateOx', 0.1);
        Moon.addAnimation('rotateOz', 0.1, Earth.center);
        return [Earth, Moon];
    }

    renderScene() {
        this.graph.clear();

        const polygons = [];

        this.scene.forEach((surface, index) => {

            this.math3D.calcCenter(surface);
            this.math3D.calcRadius(surface);
            this.math3D.calcDistance(surface, this.WIN.CAMERA, 'distance');
            this.math3D.calcDistance(surface, this.LIGHT, 'lumen');
            surface.polygons.forEach(polygon => {
                polygon.index = index;
                polygons.push(polygon);
            } );

            surface.edges.forEach(edge => {
                const point1 = surface.points[edge.p1];
                const point2 = surface.points[edge.p2];
                this.graph.line(
                    this.math3D.xs(point1), this.math3D.ys(point1),
                    this.math3D.xs(point2), this.math3D.ys(point2),
                );
            });

            surface.points.forEach(point => this.graph.point(this.math3D.xs(point), this.math3D.ys(point))
            );
        });

        this.math3D.sortByArtistAlgorithm(polygons);

        polygons.forEach(polygon => {
            const points = polygon.points.map(index => new Point(
                this.math3D.xs(this.scene[polygon.index].points[index]),
                this.math3D.ys(this.scene[polygon.index].points[index])
            ));
            let {r, g, b} = polygon.color;
            const {isShadow, dark}  = this.math3D.calcShadow(polygon, this.scene, this.LIGHT);
            const lumen = this.math3D.calcIllumination(polygon.lumen,
                this.LIGHT.lumen)*(isShadow?dark: 1);
            if (polygon.index === 1) {
                console.log(dark, isShadow, lumen);
            }
            r = Math.round(r * lumen);
            g = Math.round(g * lumen);
            b = Math.round(b * lumen);
            this.graph.polygon(points, polygon.rgbToHex(r, g, b));
        });
    }

}

/*
вся дезешечка за все лекции:
    первая лекция:
        - Переписать код всех ранее сделанных проектов в этот фреймворк

    вторая лекция:
        - Куда нибудь написать метод clear, который чистит сцену
        - Дописать некоторые вещи: ys, рёбра и точки для куба
        -* Нарисовать на сцене тор или шар

    третья лекция:
        - нарисовать сферу и тор к кубу
        - по нажатой правой кнопки мыши двигать сцену параллельно оси х
        - по зажатии средней кнопки мыши двигать сцену параллельно осям у и х
        - сделать все основные поверхности второго порядка

    четвёртая лекция:
        -посмотреть "от заката до рассвета", "догма", "достучаться до небес" и "криминальное чтиво"
        -для каждой добавленной поверхности реализовать полигоны
        -сделать чекбоксы, которые отвечают за то, отрисовывать ли грани, рёбра и точки
        -сделать селектбокс, котором пользователь может выбирать отрисовываемою
                                    поверхность(сфера, тор, куб, бутылка клейна)
        -* не рисовать невидимые полигоны
        -** рисовать на сцене одновременно две и больше фигур

    пятая лекция:
        -чекбокс, для включения или отключения изменения координат источника цвета с изменением сцены
        -*добавить несколько источников света
        -**сделать цветной источник света

    Note: на зачёт нужны будут фигуры второго порядка:
        - гиперболический цилиндр
        - параболический цилиндр
        - эллиптический цилиндр
        - однополостный гиперболоид
        - двухполостный гиперболоид
        - эллипсоид
        - конус
        - сфера
        - эллиптический парабалоид
        - гиперболический параболоид
        - тор
        - бутылка клейна
    шестая лекция:
        - реализовать Землю
        - запуск и остановку сделать в отдельный чекбокс
        -* в центр сцены добавить солнце, вокруг которого крутится земля, вокруг которой крутится луна
        -** из программ-компоненты вынести функционал на интерфейс,
                        то есть добавить кнопочки или чекбоксы для создания анимации и тд
        -*** со всех анимаций собрать одну матрицу преобразования

    седьмая лекция:
        - не рисовать невидимые полигоны
        -* сделать так, чтобы фигура могла отбрасывать тень на себя же
*/