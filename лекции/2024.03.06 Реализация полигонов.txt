// реализация полигонов

/*
добавим полигоны в проект
полигоны будут в виде четырёхугольников
*/

//добавим новый класс для полигонов
//entities/Polygon.js
class Polygon {
    constructor(points=[], color = '#000000') {
        this.points = points;
        this.color = color;
        this.distance = 0;
    }
}

//добавим полигоны в Surface
//entities/Surface.js
class Surface {
    constructor(points= [], edges = [], polygons = []) {
        this.points = points;
        this.edges = edges;
        this.polygons = polygons;
    }

}

// сложность в отрисовке полигонов в том, что надо соблюдать правильный порядок их рисования
// т.е. сначала задние, а потом передние
// проблема оптимизации: примерно половина полигонов сцены перекрыта другими полигонами
// т.е. их пользователь их не видит и эти полигоны можно не рисовать
// т.е. нужно сделать алгоритм, который может правильно убрать перекрытые полигоны и не рисовать их

// алгоритм рисования полигонов: для каждого полигона сцены расчитывается расстояние от камеры до самого него,
// потом все полигоны сортируются, в зависимости от этого расстояния, от меньшего к большему и полученный массив
// полигоновы мы рисуем.

//Graph3D.js
class Graph3D extends Component{
    //...
    renderScene() {
        //...
        this.math3D.calcDistance(
            this.scene,
            this.WIN.CAMERA,
            'distance'
            );
        this.math3D.sortByArtistAlgorithm(this.scene);
        this.scene.polygons.forEach(polygon => {
            const points = polygon.points.map(index => new Point(
                this.math3D.xs(this.scene.points[index]),
                this.math3D.ys(this.scene.points[index])
                ));
            this.graph.polygon(points, polygon.color);
        });
    }
}

//Math3D.js
class Math3D{
    //...
    calcDistance(surface, endPoint, name) {
        surface.polygons.forEach(polygon => {
           let x=0, y=0, z=0;
           polygon.points.forEach(index => {
               x+= surface.points[index].x;
               y+= surface.points[index].y;
               z+= surface.points[index].z;
           });
            x /= polygon.points.length;
            y /= polygon.points.length;
            z /= polygon.points.length;
            polygon[name] = Math.sqrt(
                (endPoint.x-x)**2 +
                (endPoint.y-y)**2 +
                (endPoint.z-z)**2
            );//квадратный корень - это очень тяжёлая операция, как синус, косинус и подобные.
        });
    }

    sortByArtistAlgorithm(surface) {
        surface.polygons.sort((a, b) => (a.distance < b.distance)? 1: -1);
    }
}

/*
дезешечка:
-посмотреть "от заката до рассвета", "догма" и "достучаться до небес"
-для каждой добавленной поверерхности реализовать полигоны
-сделать чекбоксы, в которых можно выбирать отрисовывать или нет грани, рёбра, точки
-сделать селектбокс, котором пользователь может выбирать отрисовываемою поверхность(сфера, тор, куб, бутыка клейна)
-* не рисовать невидимые полигоны
-** рисовать на сцене одновременно две и больше фигур
*/