// оптимизация и добавление анимаций

// поскольку вращение производится вокруг центра координат,
// то чтобы фигуру вращать вокруг другого центра координат, 
// требуемый центр вращения переносится в центр координат, 
// и осуществляется поворот, после которого перенос фигуры обратно

// методы zoom move rotate и тд, должны возвращать только соответсвующую матрицу преобразования

// в Math3D нужно переназвать метод multMatrix, и назвать multPoint или по другому
// и напишем нормальный multMatrix, который перемножает матрицы


// напишем несколько методов в math3D
// js/modules/Math3D/Math3D.js
class Math3D extends Component{
    ///...

    //метод, который заменяет прошлые четыре преобразования
    // он принимает на вход любую матрицу и точку, преобразует её по принимаемой матрице
    transform(matrix, point) {
        //                  VVVVVVVVV - переназванный метод из multMatrix
        const result = this.multPoint(matrix, [point.x, point.y, point.z, 1]);
        point.x = result[0];
        point.y = result[1];
        point.z = result[2];
    }
    // также так как теперь у нас только один метод для трансформации,
    // то методы zoom, rotate'ы и move нужно переписать так,
    // чтобы они только возвращали новую матрицу по заданному параметру

    //пишем новый метод, который может перемножать несколько матриц преобразования
    getTransform(...args) {
        return args.reduce( (S, t) =>
            this.multMatrix(S, t) // <- новый метод, который должен перемножать две матрицы,
        , [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]]
        );
    }
}

//добавим пару методов для анимации в класс Surface
// js/modules/Math3D/entities/Surface.js
class Surface {
    constructor(points=[], edges=[], polygons=[], center=new Point()) {
        this.points = points;
        this.edges = edges;
        this.polygons = polygons;
        this.center = center; //добавили центр точки, вокруг которой происходит вращение
        this.animations = []; // массив в котором хранится информация обо всех анимациях
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

    //note: анимации меняют всю сцену целиком

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

//добавим солнечную систему в Graph3D
// js/components/Graphic3D/Graphic3D.js
class Graph3D extends Component{
    constructor(props) {
        super(props);
        //...

        this.scene = this.solarSystem();
        setInterval(() => {
            this.scene.forEach(surface => surface.doAnimation(this.math3D));
            this.renderScene();
        }, 50);
        this.renderScene();
    }

    //так как сцена теперь это массив поверхностей, то нужно изменить callbacks
    wheel(event){
        //const delta = ...; // прошлый код
        const matrix = this.math3D.zoom(delta);
        // теперь нужно пройтись по каждой поверхности в массиве сцены
        // и для каждой поверхности делать трансформацию для точки
        this.scene.forEach(surface => surface.points.
            forEach( point => this.math3D.transform(matrix, point))
            );
    }

    //методы для создания солнечной системы
    solarSystem() {
        const Earth = this.surfaces.sphere(/*сюда задать параметры*/);
        Earth.addAnimation('rotateOy', 0.1);
        const Moon = this.surfaces.cube(/*тоже задать параметры*/);
        Moon.addAnimation('rotateOx', 0.2);
        Moon.addAnimation('rotateOz', 0.5, Earth.center);
        return [Earth, Moon];
    }

}

// дезешечка:
// -реализовать анимацию, т.е. код с лекции
// -реализовать землю
// -запуск и остановку в отдельный чекбокс
// -*в центр сцены добавить солнце вокруг, котого крутится земля, вокруг которой
// -**из программы компоненты вынести фукнционал на интерфейс
// -***со всех анимаций собрать одну матрицу преобразования

